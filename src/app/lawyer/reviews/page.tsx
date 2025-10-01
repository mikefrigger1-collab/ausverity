import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Star,
  MessageSquare,
  TrendingUp,
  Calendar,
  Reply
} from 'lucide-react'
import Link from 'next/link'

export default async function LawyerReviewsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch lawyer profile
  const lawyer = await db.lawyer.findUnique({
    where: {
      userId: session.user.id
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true,
          response: true
        }
      }
    }
  })

  if (!lawyer) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">No Profile Found</CardTitle>
            <CardDescription className="text-orange-700">
              You need to create a lawyer profile first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/lawyer/profile/edit">Create Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate statistics
  const approvedReviews = lawyer.reviews.filter(r => r.status === 'APPROVED')
  const pendingReviews = lawyer.reviews.filter(r => r.status === 'PENDING')
  const reviewsWithResponse = lawyer.reviews.filter(r => r.response)
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.overallRating, 0) / approvedReviews.length
    : 0

  // Calculate category averages
  const avgCommunication = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.communicationRating, 0) / approvedReviews.length
    : 0
  const avgExpertise = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.expertiseRating, 0) / approvedReviews.length
    : 0
  const avgValue = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.valueRating, 0) / approvedReviews.length
    : 0

  const stats = [
    {
      title: "Total Reviews",
      value: approvedReviews.length,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: `${pendingReviews.length} pending approval`
    },
    {
      title: "Average Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : 'N/A',
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Overall rating"
    },
    {
      title: "Response Rate",
      value: approvedReviews.length > 0 
        ? `${Math.round((reviewsWithResponse.length / approvedReviews.length) * 100)}%`
        : 'N/A',
      icon: Reply,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${reviewsWithResponse.length} responses`
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Reviews</h1>
        <p className="text-slate-600 mt-2">
          View and respond to client reviews
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating Breakdown */}
      {approvedReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
            <CardDescription>Average ratings by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium text-slate-700">Communication</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{avgCommunication.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium text-slate-700">Expertise</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{avgExpertise.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium text-slate-700">Value</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{avgValue.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>Your client reviews and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {lawyer.reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Star className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-slate-600">
                Reviews from your clients will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lawyer.reviews.map((review) => (
                <Card key={review.id} className="border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{review.overallRating.toFixed(1)}</span>
                          </div>
                          <Badge variant={
                            review.status === 'APPROVED' ? 'default' :
                            review.status === 'PENDING' ? 'secondary' :
                            'destructive'
                          }>
                            {review.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          By {review.author.name || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString('en-AU', {
                            dateStyle: 'medium'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Rating Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-slate-600">Communication</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{review.communicationRating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-600">Expertise</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{review.expertiseRating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-600">Value</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{review.valueRating}</span>
                        </div>
                      </div>
                      {review.outcomeRating && (
                        <div>
                          <p className="text-slate-600">Outcome</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{review.outcomeRating}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Review Comment */}
                    <div>
                      <p className="text-sm text-slate-900 whitespace-pre-wrap">{review.comment}</p>
                    </div>

                    {/* Response or Response Button */}
                    {review.response ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">Your Response:</p>
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">{review.response.responseText}</p>
                        <p className="text-xs text-blue-600 mt-2">
                          Responded on {new Date(review.response.createdAt).toLocaleDateString('en-AU', {
                            dateStyle: 'medium'
                          })}
                        </p>
                      </div>
                    ) : review.status === 'APPROVED' ? (
                      <div className="flex justify-end">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/lawyer/reviews/${review.id}/respond`}>
                            <Reply className="h-4 w-4 mr-2" />
                            Respond to Review
                          </Link>
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}