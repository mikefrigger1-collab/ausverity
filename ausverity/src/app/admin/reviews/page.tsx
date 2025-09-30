import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReviewsTable } from '@/components/admin/reviews-table'
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Flag
} from 'lucide-react'

export default async function ReviewsModerationPage() {
  // Fetch review statistics and all reviews
  const [
    totalReviews,
    pendingReviews,
    approvedReviews,
    flaggedReviews,
    allReviews,
  ] = await Promise.all([
    db.review.count(),
    db.review.count({ where: { status: 'PENDING' } }),
    db.review.count({ where: { status: 'APPROVED' } }),
    db.review.count({ where: { status: 'FLAGGED' } }),
    db.review.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        lawyer: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        firm: {
          select: {
            name: true
          }
        }
      }
    })
  ])

  // Format reviews for the table component
  const formattedReviews = allReviews.map(review => ({
    ...review,
    communicationRating: review.communicationRating || 0,
    expertiseRating: review.expertiseRating || 0,
    valueRating: review.valueRating || 0,
    outcomeRating: review.outcomeRating || null
  }))

  const stats = [
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Review",
      value: pendingReviews,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Approved",
      value: approvedReviews,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Flagged",
      value: flaggedReviews,
      icon: Flag,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Review Moderation</h1>
        <p className="text-slate-600 mt-2">
          Review and moderate user-submitted reviews
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reviews Table */}
      <ReviewsTable reviews={formattedReviews} />
    </div>
  )
}