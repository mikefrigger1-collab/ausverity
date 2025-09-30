// src/app/admin/reviews/[id]/page.tsx

import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Star,
  User,
  Building2,
  Calendar,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Flag
} from 'lucide-react'
import Link from 'next/link'
import ReviewModerationActions from '@/components/admin/ReviewModerationActions'

// ✅ FIXED: Make params a Promise
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewDetailPage({ params }: PageProps) {
  // ✅ FIXED: Await the params
  const { id } = await params
  
  const review = await db.review.findUnique({
    where: {
      id
    },
    include: {
      author: true,
      lawyer: {
        include: {
          user: true,
          firm: true
        }
      },
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

  const targetName = review.targetType === 'LAWYER' && review.lawyer
    ? `${review.lawyer.firstName} ${review.lawyer.lastName}`
    : review.targetType === 'FIRM' && review.firm
    ? review.firm.name
    : 'Unknown'

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      case 'FLAGGED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Flagged</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/reviews">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              review.targetType === 'LAWYER' ? 'bg-green-50' : 'bg-purple-50'
            }`}>
              {review.targetType === 'LAWYER' ? (
                <User className="h-6 w-6 text-green-600" />
              ) : (
                <Building2 className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Review for {targetName}</h1>
              <p className="text-slate-600 mt-1">
                <Badge variant="outline" className="mr-2">
                  {review.targetType}
                </Badge>
                Submitted by {review.author.name || review.author.email}
              </p>
            </div>
          </div>
        </div>
        {getStatusBadge(review.status)}
      </div>

      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="h-12 w-12 fill-yellow-400 text-yellow-400" />
              <span className="text-5xl font-bold">{review.overallRating.toFixed(1)}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Communication</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{review.communicationRating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Expertise</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{review.expertiseRating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Value</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{review.valueRating}</span>
                </div>
              </div>
              {review.outcomeRating && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Outcome</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{review.outcomeRating}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Details */}
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Author</p>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">{review.author.email}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Submitted</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">
                  {new Date(review.createdAt).toLocaleString('en-AU', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            </div>
            {review.caseType && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Case Type</p>
                <Badge variant="outline">{review.caseType}</Badge>
              </div>
            )}
            {review.serviceDate && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Service Date</p>
                <span className="font-medium">
                  {new Date(review.serviceDate).toLocaleDateString('en-AU')}
                </span>
              </div>
            )}
            {review.caseReference && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Case Reference</p>
                <span className="font-mono text-sm">{review.caseReference}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Comment */}
      <Card>
        <CardHeader>
          <CardTitle>Review Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-900 whitespace-pre-wrap">{review.comment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Lawyer/Firm Response */}
      {review.response && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Professional Response</CardTitle>
            <CardDescription className="text-blue-700">
              Response from {targetName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-slate-900 whitespace-pre-wrap">{review.response.responseText}</p>
              <Separator className="my-3" />
              <p className="text-xs text-slate-500">
                Responded on {new Date(review.response.createdAt).toLocaleDateString('en-AU', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Notes */}
      {review.adminNotes && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800">{review.adminNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Target Profile Link */}
      <Card>
        <CardHeader>
          <CardTitle>Review Target</CardTitle>
        </CardHeader>
        <CardContent>
          {review.lawyer && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg">
                    {review.lawyer.firstName} {review.lawyer.lastName}
                  </p>
                  {review.lawyer.firm && (
                    <p className="text-sm text-slate-600">
                      {review.lawyer.firm.name}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${review.lawyer.userId}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>
          )}
          {review.firm && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg">{review.firm.name}</p>
                  <p className="text-sm text-slate-600">{review.firm.email}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${review.firm.ownerId}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Actions */}
      {review.status === 'PENDING' || review.status === 'FLAGGED' ? (
        <Card>
          <CardHeader>
            <CardTitle>Moderation Actions</CardTitle>
            <CardDescription>
              Approve, reject, or flag this review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewModerationActions reviewId={review.id} currentStatus={review.status} />
          </CardContent>
        </Card>
      ) : (
        <Card className={
          review.status === 'APPROVED' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }>
          <CardContent className="flex items-center space-x-3 py-6">
            {review.status === 'APPROVED' ? (
              <>
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    This review has been approved
                  </p>
                  <p className="text-sm text-green-700">
                    The review is now visible to the public
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">
                    This review has been rejected
                  </p>
                  <p className="text-sm text-red-700">
                    The review has been hidden from the public
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}