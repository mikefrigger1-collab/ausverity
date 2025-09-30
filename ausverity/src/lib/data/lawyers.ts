import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

const REVIEW_PAGE_SIZE = 5

// Type for the detailed lawyer profile data
export type LawyerProfileData = Prisma.PromiseReturnType<typeof getLawyerProfile>

/**
 * Fetches the initial data for the lawyer profile page.
 * Optimized to only fetch the first page of reviews.
 */
export async function getLawyerProfile(slug: string) {
  try {
    const lawyer = await db.lawyer.findUnique({
      where: {
        slug,
        status: 'PUBLISHED'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        firm: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            phone: true,
            locations: {
              where: { isPrimary: true },
              take: 1
            },
            subscriptions: {
              where: {
                status: 'ACTIVE',
                planType: {
                  in: ['PROFESSIONAL', 'PREMIUM']
                }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        },
        specialisations: {
          include: {
            specialisation: true
          }
        },
        courtAppearances: true,
        languages: true,
        certifications: true,
        reviews: {
          where: { status: 'APPROVED' },
          take: REVIEW_PAGE_SIZE,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            author: {
              select: {
                name: true
              }
            },
            response: true
          }
        },
        subscriptions: {
          where: {
            status: 'ACTIVE',
            planType: {
              in: ['PROFESSIONAL', 'PREMIUM']
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            reviews: { where: { status: 'APPROVED' } }
          }
        }
      }
    })

    if (!lawyer) return null

    // Get all reviews for rating calculations
    const allReviews = await db.review.findMany({
      where: {
        lawyerId: lawyer.id,
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

    const isPaidUser = lawyer.subscriptions.length > 0 ||
                      (lawyer.firm && lawyer.firm.subscriptions.length > 0)

    return {
      ...lawyer,
      avgRating,
      totalReviews: lawyer._count.reviews,
      ratingBreakdown,
      isPaidUser
    }
  } catch (error) {
    console.error('Error fetching lawyer profile:', error)
    return null
  }
}