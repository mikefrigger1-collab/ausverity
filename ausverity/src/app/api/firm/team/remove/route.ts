import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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
    const { lawyerId } = body

    // Validate input
    if (!lawyerId) {
      return NextResponse.json(
        { error: 'Missing lawyer ID' },
        { status: 400 }
      )
    }

    // Fetch the lawyer
    const lawyer = await db.lawyer.findUnique({
      where: { id: lawyerId },
      include: {
        firm: true,
        user: true
      }
    })

    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      )
    }

    // Check if lawyer is in a firm
    if (!lawyer.firmId) {
      return NextResponse.json(
        { error: 'Lawyer is not part of any firm' },
        { status: 400 }
      )
    }

    // Verify the firm belongs to the user
    if (lawyer.firm && lawyer.firm.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not own this firm' },
        { status: 403 }
      )
    }

    const currentFirmId = lawyer.firmId

    // Create relationship history entry
    await db.relationshipHistory.create({
      data: {
        lawyerId: lawyer.id,
        firmId: currentFirmId,
        startDate: lawyer.updatedAt, // Approximate
        endDate: new Date(),
      }
    })

    // Remove lawyer from firm
    await db.lawyer.update({
      where: { id: lawyerId },
      data: {
        firmId: null
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'REMOVE_LAWYER_FROM_FIRM',
        entityType: 'FIRM',
        entityId: currentFirmId,
        metadata: {
          lawyerId: lawyer.id,
          lawyerName: `${lawyer.firstName} ${lawyer.lastName}`
        }
      }
    })

    // TODO: Send notification to lawyer

    return NextResponse.json({
      success: true,
      message: 'Lawyer removed from firm successfully'
    })

  } catch (error) {
    console.error('Error removing lawyer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}