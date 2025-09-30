// src/app/submit-review/page.tsx

import { Suspense } from 'react'
import { SiteLayout } from '@/components/site-layout'
import { ReviewSubmissionForm } from '@/components/review-submission-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Star, CheckCircle } from 'lucide-react'

export default function SubmitReviewPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Share Your Experience
              </h1>
              <p className="text-lg text-slate-600">
                Help others find the right legal representation by sharing your honest review
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-slate-200">
                <CardContent className="flex items-center gap-3 p-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Verified Reviews</p>
                    <p className="text-sm text-slate-600">All reviews are moderated</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="flex items-center gap-3 p-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Honest Feedback</p>
                    <p className="text-sm text-slate-600">Your voice matters</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="flex items-center gap-3 p-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-slate-900">No Account Needed</p>
                    <p className="text-sm text-slate-600">Quick and easy</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Review Form */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Submit Your Review</CardTitle>
                <CardDescription>
                  Please provide honest and constructive feedback about your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading form...</div>}>
                  <ReviewSubmissionForm />
                </Suspense>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-slate-200 bg-blue-50 mt-6">
              <CardHeader>
                <CardTitle className="text-blue-900">Review Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be honest and fair in your assessment</li>
                  <li>Focus on your personal experience with the lawyer or firm</li>
                  <li>Avoid profanity, personal attacks, or discriminatory language</li>
                  <li>Do not share confidential case information</li>
                  <li>Reviews are subject to moderation and approval</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}