'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Loader2, SlidersHorizontal } from "lucide-react"
import { getMoreReviews } from "@/lib/actions/lawyer-actions"
import type { LawyerProfileData } from "@/lib/data/lawyers"

type Review = LawyerProfileData['reviews'][0]

interface ReviewsSectionProps {
  lawyerId: string
  initialReviews: Review[]
  totalReviews: number
  ratingBreakdown: LawyerProfileData['ratingBreakdown']
  lawyerFirstName: string
}

// Star rating display component
const RatingDisplay = ({ label, value }: { label: string; value: number }) => {
  // Format number to show no decimals if it's a whole number
  const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5">
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        <span className="text-2xl md:text-3xl font-bold text-blue-600">{formattedValue}</span>
      </div>
      <div className="text-sm md:text-base text-slate-600 mt-1">{label}</div>
    </div>
  )
}

export function ReviewsSection({ lawyerId, initialReviews, totalReviews, ratingBreakdown, lawyerFirstName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [page, setPage] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')

  if (totalReviews === 0) {
    return null
  }

  const handleLoadMore = async () => {
    setIsLoading(true)
    const newReviews = await getMoreReviews(lawyerId, page)
    setReviews(prev => [...prev, ...newReviews])
    setPage(prev => prev + 1)
    setIsLoading(false)
  }

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterRating === 'all') return true
      return review.overallRating === parseInt(filterRating)
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'highest') {
        return b.overallRating - a.overallRating
      } else {
        return a.overallRating - b.overallRating
      }
    })

  return (
    <Card id="reviews" className="border-slate-200 shadow-sm scroll-mt-20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
          <Star className="w-6 h-6 text-blue-600" />
          Client Reviews ({totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-5 md:p-6 bg-slate-50 rounded-lg">
          <RatingDisplay label="Communication" value={ratingBreakdown.communication} />
          <RatingDisplay label="Expertise" value={ratingBreakdown.expertise} />
          <RatingDisplay label="Value" value={ratingBreakdown.value} />
          {ratingBreakdown.outcome > 0 && (
            <RatingDisplay label="Outcome" value={ratingBreakdown.outcome} />
          )}
        </div>

        <Separator />

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Sort by
            </label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Filter by rating
            </label>
            <Select value={filterRating} onValueChange={(value: any) => setFilterRating(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No reviews match the selected filters.
          </div>
        )}

        {/* Individual Reviews */}
        <div className="space-y-6">
          {filteredAndSortedReviews.map(review => (
            <div key={review.id} className="border border-slate-200 rounded-lg p-5 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.overallRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-base">{review.overallRating}/5</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-600">
                    {review.author.name} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-slate-700 mb-4 text-base md:text-lg leading-relaxed">{review.comment}</p>

              {review.response && (
                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm md:text-base font-medium text-slate-900 mb-2">
                    Response from {lawyerFirstName}:
                  </p>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">{review.response.responseText}</p>
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