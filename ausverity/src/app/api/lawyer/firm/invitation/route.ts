import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'LAWYER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { invitationId, action } = body

    // Validate input
    if (!invitationId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Fetch the invitation
    const invitation = await db.firmInvitation.findUnique({
      where: { id: invitationId },
      include: {
        lawyer: true,
        firm: true
      }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    // Verify the invitation belongs to this lawyer
    if (invitation.lawyer.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'This invitation is not for you' },
        { status: 403 }
      )
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This invitation has already been processed' },
        { status: 400 }
      )
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      await db.firmInvitation.update({
        where: { id: invitationId },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      )
    }

    if (action === 'accept') {
      // If lawyer is currently with another firm, create relationship history entry
      if (invitation.lawyer.firmId) {
        await db.relationshipHistory.create({
          data: {
            lawyerId: invitation.lawyerId,
            firmId: invitation.lawyer.firmId,
            startDate: invitation.lawyer.updatedAt,
            endDate: new Date(),
          }
        })
      }

      // Update lawyer's firm association
      await db.lawyer.update({
        where: { id: invitation.lawyerId },
        data: {
          firmId: invitation.firmId
        }
      })

      // Update invitation status
      await db.firmInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'ACCEPT_FIRM_INVITATION',
          entityType: 'LAWYER',
          entityId: invitation.lawyerId,
          metadata: {
            firmId: invitation.firmId,
            firmName: invitation.firm.name,
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Invitation accepted successfully'
      })
    } else {
      // Decline invitation
      await db.firmInvitation.update({
        where: { id: invitationId },
        data: { status: 'DECLINED' }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'DECLINE_FIRM_INVITATION',
          entityType: 'LAWYER',
          entityId: invitation.lawyerId,
          metadata: {
            firmId: invitation.firmId,
            firmName: invitation.firm.name,
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Invitation declined'
      })
    }

  } catch (error) {
    console.error('Error processing invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}