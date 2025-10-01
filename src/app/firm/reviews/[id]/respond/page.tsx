import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Star,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import FirmReviewResponseForm from '@/components/firm/FirmReviewResponseForm'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FirmReviewRespondPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const { id } = await params

  // Fetch the review
  const review = await db.review.findUnique({
    where: {
      id
    },
    include: {
      author: true,
      firm: {
        include: {
          owner: true
        }
      },
      response: true
    }
  })

  if (!review) {
    notFound()
  }

  // Verify this review belongs to the logged-in firm owner's firm
  if (review.firm?.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/firm/reviews')
  }

  // Check if already responded
  if (review.response) {
    redirect('/firm/reviews')
  }

  // Check if review is approved
  if (review.status !== 'APPROVED') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/firm/reviews">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reviews
          </Link>
        </Button>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Cannot Respond</CardTitle>
            <CardDescription className="text-orange-700">
              You can only respond to approved reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              This review has a status of <Badge variant="outline">{review.status}</Badge> and is not yet visible to the public.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/firm/reviews">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Respond to Review</h1>
        <p className="text-slate-600 mt-2">
          Write a professional response to this client review
        </p>
      </div>

      {/* Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Response Guidelines</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Be professional and courteous</li>
            <li>Thank the client for their feedback</li>
            <li>Address specific concerns if mentioned</li>
            <li>Keep responses concise and focused</li>
            <li>Do not share confidential client information</li>
          </ul>
        </CardContent>
      </Card>

      {/* Review Display */}
      <Card>
        <CardHeader>
          <CardTitle>Original Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              <span className="text-3xl font-bold">{review.overallRating.toFixed(1)}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-slate-600">Communication</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{review.communicationRating}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600">Expertise</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{review.expertiseRating}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600">Value</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{review.valueRating}</span>
                </div>
              </div>
              {review.outcomeRating && (
                <div>
                  <p className="text-xs text-slate-600">Outcome</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{review.outcomeRating}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Review Details */}
          <div>
            <p className="text-sm text-slate-600 mb-1">
              By {review.author.name || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString('en-AU', {
                dateStyle: 'long'
              })}
            </p>
          </div>

          {/* Comment */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-900 whitespace-pre-wrap">{review.comment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Response Form */}
      <FirmReviewResponseForm reviewId={review.id} />
    </div>
  )
}