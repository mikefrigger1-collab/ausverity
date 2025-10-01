import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'FIRM_OWNER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firmId, email } = body

    // Validate input
    if (!firmId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check firm exists and belongs to user
    const firm = await db.lawFirm.findUnique({
      where: { id: firmId }
    })

    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      )
    }

    if (firm.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not own this firm' },
        { status: 403 }
      )
    }

    // Find lawyer by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        lawyer: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No user found with this email address' },
        { status: 404 }
      )
    }

    if (!user.lawyer) {
      return NextResponse.json(
        { error: 'This user is not registered as a lawyer' },
        { status: 400 }
      )
    }

    // Check if lawyer is already in this firm
    if (user.lawyer.firmId === firmId) {
      return NextResponse.json(
        { error: 'This lawyer is already part of your firm' },
        { status: 400 }
      )
    }

    // Check for existing pending invitation
    const existingInvitation = await db.firmInvitation.findFirst({
      where: {
        firmId,
        lawyerId: user.lawyer.id,
        status: 'PENDING'
      }
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation to this lawyer is already pending' },
        { status: 400 }
      )
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    const invitation = await db.firmInvitation.create({
      data: {
        firmId,
        lawyerId: user.lawyer.id,
        invitedBy: session.user.id,
        token,
        expiresAt,
        status: 'PENDING'
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'INVITE_LAWYER_TO_FIRM',
        entityType: 'FIRM',
        entityId: firmId,
        metadata: {
          lawyerId: user.lawyer.id,
          lawyerEmail: email
        }
      }
    })

    // TODO: Send email notification to lawyer

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      invitation
    })

  } catch (error) {
    console.error('Error sending invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}