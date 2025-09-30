import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

const REVIEW_PAGE_SIZE = 5

// Type for the detailed firm profile data
export type FirmProfileData = Prisma.PromiseReturnType<typeof getFirmProfile>

/**
 * Fetches the initial data for the firm profile page.
 * Optimized to only fetch the first page of reviews and lawyers.
 */
export async function getFirmProfile(slug: string) {
  try {
    const firm = await db.lawFirm.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED'
      },
      include: {
        locations: { 
          orderBy: { isPrimary: 'desc' } 
        },
        practiceAreas: { 
          include: { specialisation: true } 
        },
        subscriptions: { 
          where: { 
            status: 'ACTIVE',
            planType: { in: ['PROFESSIONAL', 'PREMIUM'] }
          } 
        },
        lawyers: {
          where: { status: 'PUBLISHED' },
          take: 6,
          include: {
            user: {
              select: { name: true }
            },
            specialisations: {
              include: { specialisation: true }
            },
            reviews: {
              where: { status: 'APPROVED' },
              select: { overallRating: true }
            }
          }
        },
        reviews: {
          where: { status: 'APPROVED' },
          take: REVIEW_PAGE_SIZE,
          orderBy: { createdAt: 'desc' },
          include: { 
            author: { select: { name: true } },
            response: true
          }
        },
        _count: {
          select: {
            reviews: { where: { status: 'APPROVED' } },
            lawyers: { where: { status: 'PUBLISHED' } }
          }
        }
      }
    })

    if (!firm) return null

    // Get all reviews for rating calculations
    const allReviews = await db.review.findMany({
      where: { 
        firmId: firm.id,
        status: 'APPROVED' 
      },
      select: { 
        overallRating: true,
        communicationRating: true,
        expertiseRating: true,
        valueRating: true,
        outcomeRating: true 
      }
    })
    
    const totalReviews = allReviews.length
    const avgRating = totalReviews > 0 
      ? allReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews 
      : 0

    // Calculate outcome rating only from reviews that have it
    const reviewsWithOutcome = allReviews.filter(r => r.outcomeRating !== null && r.outcomeRating > 0)
    const outcomeAvg = reviewsWithOutcome.length > 0
      ? reviewsWithOutcome.reduce((sum, r) => sum + (r.outcomeRating || 0), 0) / reviewsWithOutcome.length
      : 0

    const ratingBreakdown = {
      communication: totalReviews > 0 ? allReviews.reduce((sum, r) => sum + r.communicationRating, 0) / totalReviews : 0,
      expertise: totalReviews > 0 ? allReviews.reduce((sum, r) => sum + r.expertiseRating, 0) / totalReviews : 0,
      value: totalReviews > 0 ? allReviews.reduce((sum, r) => sum + r.valueRating, 0) / totalReviews : 0,
      outcome: outcomeAvg
    }
    
    return {
      ...firm,
      avgRating,
      ratingBreakdown,
      totalReviews: firm._count.reviews,
      totalLawyers: firm._count.lawyers,
      isPaidUser: firm.subscriptions.length > 0
    }
  } catch (error) {
    console.error('Error fetching firm profile:', error)
    return null
  }
}