'use server'

import { db } from "@/lib/db"

const REVIEW_PAGE_SIZE = 5

/**
 * Server Action: Fetches additional reviews for pagination
 * Used by client components to load more reviews
 */
export async function getMoreReviews(firmId: string, page: number) {
  try {
    const skip = (page - 1) * REVIEW_PAGE_SIZE
    
    const reviews = await db.review.findMany({
      where: { 
        firmId,
        status: 'APPROVED' 
      },
      skip,
      take: REVIEW_PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
      include: { 
        author: { select: { name: true } },
        response: true
      }
    })

    return reviews
  } catch (error) {
    console.error('Error fetching more reviews:', error)
    return []
  }
}