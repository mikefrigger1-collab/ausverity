// src/app/api/admin/reviews/approve/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check admin authorization
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reviewId, action, adminNotes } = body

    // Validate input
    if (!reviewId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request. Provide reviewId and action (approve/reject)' },
        { status: 400 }
      )
    }

    // Fetch the review
    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        lawyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userId: true,
            subscriptions: {
              where: {
                status: 'ACTIVE',
                planType: {
                  in: ['PROFESSIONAL', 'PREMIUM']
                }
              },
              take: 1
            },
            firm: {
              select: {
                subscriptions: {
                  where: {
                    status: 'ACTIVE',
                    planType: {
                      in: ['PROFESSIONAL', 'PREMIUM']
                    }
                  },
                  take: 1
                }
              }
            }
          }
        },
        firm: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            subscriptions: {
              where: {
                status: 'ACTIVE',
                planType: {
                  in: ['PROFESSIONAL', 'PREMIUM']
                }
              },
              take: 1
            }
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

    if (review.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Review has already been processed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Approve the review
      await db.review.update({
        where: { id: reviewId },
        data: {
          status: 'APPROVED',
          adminNotes: adminNotes || null,
        }
      })

      // Check if recipient is a paid user
      let isPaidUser = false
      let recipientUserId: string | null = null
      let recipientName = ''

      if (review.targetType === 'LAWYER' && review.lawyer) {
        // Check if lawyer OR their firm has active subscription
        isPaidUser = review.lawyer.subscriptions.length > 0 || 
                    (review.lawyer.firm?.subscriptions.length ?? 0) > 0
        recipientUserId = review.lawyer.userId
        recipientName = `${review.lawyer.firstName} ${review.lawyer.lastName}`
      } else if (review.targetType === 'FIRM' && review.firm) {
        // Check if firm has active subscription
        isPaidUser = review.firm.subscriptions.length > 0
        recipientUserId = review.firm.ownerId
        recipientName = review.firm.name
      }

      // Only notify paid users about approved reviews
      if (isPaidUser && recipientUserId) {
        await db.notification.create({
          data: {
            userId: recipientUserId,
            type: 'REVIEW_APPROVED',
            title: 'New Review Published',
            message: `Your review from ${review.author.name} has been approved and is now public`,
            link: review.targetType === 'LAWYER' ? '/lawyer/reviews' : '/firm/reviews',
            read: false,
          }
        })
      }

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'APPROVE_REVIEW',
          entityType: 'REVIEW',
          entityId: reviewId,
          metadata: {
            reviewerName: review.author.name,
            recipientName,
            rating: review.overallRating,
            isPaidUser,
            notified: isPaidUser,
            adminNotes: adminNotes || null
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Review approved successfully',
        notified: isPaidUser ? 'User notified' : 'User not notified (requires paid subscription)'
      })

    } else {
      // Reject the review
      await db.review.update({
        where: { id: reviewId },
        data: {
          status: 'REJECTED',
          adminNotes: adminNotes || null,
        }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'REJECT_REVIEW',
          entityType: 'REVIEW',
          entityId: reviewId,
          metadata: {
            reviewerName: review.author.name,
            rating: review.overallRating,
            adminNotes: adminNotes || null
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Review rejected successfully'
      })
    }

  } catch (error) {
    console.error('Error processing review approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}