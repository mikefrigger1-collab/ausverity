"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface FirmReviewResponseFormProps {
  reviewId: string
}

export default function FirmReviewResponseForm({ reviewId }: FirmReviewResponseFormProps) {
  const router = useRouter()
  const [responseText, setResponseText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!responseText.trim()) {
      toast.error('Please enter a response')
      return
    }

    if (responseText.length < 20) {
      toast.error('Response must be at least 20 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/firm/reviews/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          responseText: responseText.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit response')
      }

      toast.success('Response submitted successfully')
      router.push('/firm/reviews')
      router.refresh()
    } catch (error) {
      console.error('Error submitting response:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Response</CardTitle>
        <CardDescription>
          Write a professional response to this review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="responseText">Response</Label>
            <Textarea
              id="responseText"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={6}
              placeholder="Thank you for your review. We appreciate your feedback..."
              className="resize-none mt-2"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-slate-500">
                {responseText.length} characters (minimum 20)
              </p>
              {responseText.length > 500 && (
                <p className="text-xs text-orange-600">
                  Consider keeping your response concise
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || responseText.length < 20}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Response
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}