'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Star, Loader2 } from "lucide-react"
import { getMoreReviews } from "@/lib/actions/firm-actions"
import type { FirmProfileData } from "@/lib/data/firms"

type Review = NonNullable<FirmProfileData>['reviews'][0]

interface ReviewsSectionProps {
  firmId: string
  initialReviews: Review[]
  totalReviews: number
  ratingBreakdown: NonNullable<FirmProfileData>['ratingBreakdown']
  firmName: string
}

// Star rating display component
const RatingDisplay = ({ label, value }: { label: string; value: number }) => {
  // Format number to show no decimals if it's a whole number
  const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="text-2xl font-bold text-blue-600">{formattedValue}</span>
      </div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  )
}

export function ReviewsSection({ firmId, initialReviews, totalReviews, ratingBreakdown, firmName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [page, setPage] = useState(2)
  const [isLoading, setIsLoading] = useState(false)

  if (totalReviews === 0) {
    return null
  }

  const handleLoadMore = async () => {
    setIsLoading(true)
    const newReviews = await getMoreReviews(firmId, page)
    setReviews(prev => [...prev, ...newReviews])
    setPage(prev => prev + 1)
    setIsLoading(false)
  }

  return (
    <Card id="reviews" className="border-slate-200 scroll-mt-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-600" />
          Firm Reviews ({totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <RatingDisplay label="Communication" value={ratingBreakdown.communication} />
          <RatingDisplay label="Expertise" value={ratingBreakdown.expertise} />
          <RatingDisplay label="Value" value={ratingBreakdown.value} />
          <RatingDisplay label="Outcome" value={ratingBreakdown.outcome} />
        </div>

        <Separator />

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < review.overallRating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-slate-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.overallRating}/5</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {review.author.name} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-3">{review.comment}</p>
              
              {review.response && (
                <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Response from {firmName}:
                  </p>
                  <p className="text-sm text-slate-700">{review.response.responseText}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {reviews.length < totalReviews && (
          <div className="text-center">
            <Button variant="outline" onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load More Reviews (${totalReviews - reviews.length} remaining)`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}