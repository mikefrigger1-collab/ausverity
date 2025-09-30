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
        user: true,
        firm: true
      }
    })

    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      )
    }

    // Verify this is the lawyer's own profile
    if (lawyer.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 403 }
      )
    }

    // Check if lawyer is actually in a firm
    if (!lawyer.firmId) {
      return NextResponse.json(
        { error: 'You are not currently associated with a firm' },
        { status: 400 }
      )
    }

    const currentFirmId = lawyer.firmId

    // Create relationship history entry
    await db.relationshipHistory.create({
      data: {
        lawyerId: lawyer.id,
        firmId: currentFirmId,
        startDate: lawyer.updatedAt, // This is approximate
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
        action: 'LEAVE_FIRM',
        entityType: 'LAWYER',
        entityId: lawyerId,
        metadata: {
          firmId: currentFirmId,
          firmName: lawyer.firm?.name,
        }
      }
    })

    // TODO: Send notification to firm owner

    return NextResponse.json({
      success: true,
      message: 'Successfully left the firm'
    })

  } catch (error) {
    console.error('Error leaving firm:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}