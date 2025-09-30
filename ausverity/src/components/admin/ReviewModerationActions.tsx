"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Flag, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewModerationActionsProps {
  reviewId: string
  currentStatus: string
}

export default function ReviewModerationActions({ 
  reviewId, 
  currentStatus 
}: ReviewModerationActionsProps) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: 'approve' | 'reject' | 'flag') => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/reviews/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          action,
          notes: notes.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process review')
      }

      const actionText = action === 'approve' 
        ? 'approved' 
        : action === 'reject' 
        ? 'rejected' 
        : 'flagged'

      toast.success(`Review ${actionText} successfully`)

      // Redirect back to reviews list
      router.push('/admin/reviews')
      router.refresh()
    } catch (error) {
      console.error('Error processing review:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="notes">Admin Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about your decision..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2"
          rows={3}
        />
        <p className="text-xs text-slate-500 mt-1">
          Notes are internal and won't be shown to the reviewer
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Approve Review
        </Button>

        <Button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          variant="destructive"
          className="flex-1"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4 mr-2" />
          )}
          Reject Review
        </Button>

        {currentStatus !== 'FLAGGED' && (
          <Button
            onClick={() => handleAction('flag')}
            disabled={isProcessing}
            variant="outline"
            className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Flag className="h-4 w-4 mr-2" />
            )}
            Flag for Review
          </Button>
        )}
      </div>
    </div>
  )
}