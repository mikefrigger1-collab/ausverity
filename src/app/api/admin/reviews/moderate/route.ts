import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reviewId, action, notes } = body

    // Validate input
    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject', 'flag'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Fetch the review
    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: {
        author: true,
        lawyer: {
          include: {
            user: true
          }
        },
        firm: {
          include: {
            owner: true
          }
        }
      }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Determine new status based on action
    let newStatus: 'APPROVED' | 'REJECTED' | 'FLAGGED'
    if (action === 'approve') {
      newStatus = 'APPROVED'
    } else if (action === 'reject') {
      newStatus = 'REJECTED'
    } else {
      newStatus = 'FLAGGED'
    }

    // Update the review
    const updatedReview = await db.review.update({
      where: { id: reviewId },
      data: {
        status: newStatus,
        adminNotes: notes || review.adminNotes, // Keep existing notes if no new ones
        updatedAt: new Date(),
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: `REVIEW_${action.toUpperCase()}`,
        entityType: 'REVIEW',
        entityId: reviewId,
        metadata: {
          reviewAuthor: review.author.email,
          targetType: review.targetType,
          targetId: review.lawyerId || review.firmId,
          previousStatus: review.status,
          newStatus: newStatus,
          adminNotes: notes,
        }
      }
    })

    // TODO: Send notification to review author and target (lawyer/firm)

    return NextResponse.json({
      success: true,
      review: updatedReview
    })

  } catch (error) {
    console.error('Error moderating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}