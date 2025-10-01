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
    const { reviewId, responseText } = body

    // Validate input
    if (!reviewId || !responseText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (responseText.length < 20) {
      return NextResponse.json(
        { error: 'Response must be at least 20 characters' },
        { status: 400 }
      )
    }

    // Fetch the review
    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: {
        lawyer: {
          include: {
            user: true
          }
        },
        response: true
      }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Verify this review belongs to the logged-in lawyer
    if (review.lawyer?.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorised - this review does not belong to you' },
        { status: 403 }
      )
    }

    // Check if review is approved
    if (review.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Can only respond to approved reviews' },
        { status: 400 }
      )
    }

    // Check if already responded
    if (review.response) {
      return NextResponse.json(
        { error: 'You have already responded to this review' },
        { status: 400 }
      )
    }

    // Create the response
    const response = await db.reviewResponse.create({
      data: {
        reviewId,
        responderId: session.user.id,
        responseText: responseText.trim(),
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_REVIEW_RESPONSE',
        entityType: 'REVIEW',
        entityId: reviewId,
        metadata: {
          responseLength: responseText.length,
        }
      }
    })

    // TODO: Send notification to review author

    return NextResponse.json({
      success: true,
      response
    })

  } catch (error) {
    console.error('Error creating review response:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}