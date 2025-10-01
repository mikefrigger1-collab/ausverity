"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ApprovalActionsProps {
  changeId: string
}

export default function ApprovalActions({ changeId }: ApprovalActionsProps) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          changeId,
          action,
          notes: notes.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process change')
      }

      toast.success(
        action === 'approve' 
          ? 'Change approved successfully' 
          : 'Change rejected successfully'
      )

      // Redirect back to approvals list
      router.push('/admin/approvals')
      router.refresh()
    } catch (error) {
      console.error('Error processing change:', error)
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
      </div>

      <div className="flex space-x-3">
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
          Approve Changes
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
          Reject Changes
        </Button>
      </div>
    </div>
  )
}