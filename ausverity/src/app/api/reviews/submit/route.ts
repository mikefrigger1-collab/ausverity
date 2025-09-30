// src/app/api/reviews/submit/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const reviewSchema = z.object({
  reviewerName: z.string().min(2, 'Name must be at least 2 characters'),
  reviewerEmail: z.string().email('Invalid email address'),
  targetType: z.enum(['lawyer', 'firm']),
  targetId: z.string().min(1, 'Target ID is required'),
  communicationRating: z.number().min(1).max(5),
  expertiseRating: z.number().min(1).max(5),
  valueRating: z.number().min(1).max(5),
  outcomeRating: z.number().min(0).max(5).nullable(),
  overallRating: z.number().min(1).max(5),
  comment: z.string().min(50, 'Review must be at least 50 characters'),
  caseType: z.string().nullable(),
  serviceDate: z.string().nullable(),
})

type ReviewSubmission = z.infer<typeof reviewSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    let validatedData: ReviewSubmission
    try {
      validatedData = reviewSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid form data', details: error.errors },
          { status: 400 }
        )
      }
      throw error
    }

    // Verify target exists and is published
    if (validatedData.targetType === 'lawyer') {
      const lawyer = await db.lawyer.findUnique({
        where: { 
          id: validatedData.targetId,
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userId: true
        }
      })

      if (!lawyer) {
        return NextResponse.json(
          { error: 'Lawyer not found or not available for reviews' },
          { status: 404 }
        )
      }

      // Store lawyer info for notifications
      validatedData.targetName = `${lawyer.firstName} ${lawyer.lastName}`
      validatedData.targetUserId = lawyer.userId
    } else {
      const firm = await db.lawFirm.findUnique({
        where: { 
          id: validatedData.targetId,
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          name: true,
          ownerId: true
        }
      })

      if (!firm) {
        return NextResponse.json(
          { error: 'Firm not found or not available for reviews' },
          { status: 404 }
        )
      }

      validatedData.targetName = firm.name
      validatedData.targetUserId = firm.ownerId
    }

    // Check for duplicate reviews (same email + target within 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const existingReview = await db.review.findFirst({
      where: {
        author: {
          email: validatedData.reviewerEmail.toLowerCase()
        },
        ...(validatedData.targetType === 'lawyer' 
          ? { lawyerId: validatedData.targetId }
          : { firmId: validatedData.targetId }
        ),
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already submitted a review for this ' + validatedData.targetType + ' recently. Please wait 30 days before submitting another review.' },
        { status: 400 }
      )
    }

    // Create or find the user (client)
    let user = await db.user.findUnique({
      where: { email: validatedData.reviewerEmail.toLowerCase() }
    })

    if (!user) {
      // Create a client user account (no password, email only)
      user = await db.user.create({
        data: {
          email: validatedData.reviewerEmail.toLowerCase(),
          name: validatedData.reviewerName,
          role: 'CLIENT',
        }
      })
    } else {
      // Update name if it's changed
      if (user.name !== validatedData.reviewerName) {
        user = await db.user.update({
          where: { id: user.id },
          data: { name: validatedData.reviewerName }
        })
      }
    }

    // Parse service date if provided (YYYY-MM format to Date)
    let serviceDate: Date | null = null
    if (validatedData.serviceDate) {
      try {
        const [year, month] = validatedData.serviceDate.split('-')
        serviceDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      } catch (error) {
        console.error('Error parsing service date:', error)
        // Continue without service date if parsing fails
      }
    }

    // Create the review with PENDING status (requires admin approval)
    const review = await db.review.create({
      data: {
        authorId: user.id,
        targetType: validatedData.targetType === 'lawyer' ? 'LAWYER' : 'FIRM',
        lawyerId: validatedData.targetType === 'lawyer' ? validatedData.targetId : null,
        firmId: validatedData.targetType === 'firm' ? validatedData.targetId : null,
        communicationRating: validatedData.communicationRating,
        expertiseRating: validatedData.expertiseRating,
        valueRating: validatedData.valueRating,
        outcomeRating: validatedData.outcomeRating,
        overallRating: validatedData.overallRating,
        comment: validatedData.comment,
        caseType: validatedData.caseType,
        serviceDate: serviceDate,
        status: 'PENDING', // All reviews require admin approval
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Create notification for admin about new review
    const adminUsers = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    // Create notifications for all admins
    if (adminUsers.length > 0) {
      await Promise.all(
        adminUsers.map(admin =>
          db.notification.create({
            data: {
              userId: admin.id,
              type: 'NEW_REVIEW',
              title: 'New Review Submitted',
              message: `${validatedData.reviewerName} submitted a review for ${validatedData.targetName}`,
              link: `/admin/reviews`,
              read: false,
            }
          })
        )
      )
    }

    // Note: Notification to lawyer/firm owner will be sent by admin when they APPROVE the review
    // This is handled in /api/admin/reviews/approve route
    // We only notify paid users after admin approval

    // TODO: Send email notifications
    // - To reviewer: "Thank you for your review"
    // - To admin: "New review to moderate"
    // - To lawyer/firm: "You received a new review"

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      reviewId: review.id,
      status: 'pending_approval'
    })

  } catch (error) {
    console.error('Error submitting review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}