"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FirmInvitationActionsProps {
  invitationId: string
}

export default function FirmInvitationActions({ invitationId }: FirmInvitationActionsProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: 'accept' | 'decline') => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/lawyer/firm/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId,
          action,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process invitation')
      }

      toast.success(
        action === 'accept'
          ? 'Invitation accepted! You are now part of the firm.'
          : 'Invitation declined'
      )

      router.refresh()
    } catch (error) {
      console.error('Error processing invitation:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex space-x-3">
      <Button
        onClick={() => handleAction('accept')}
        disabled={isProcessing}
        className="flex-1 bg-green-600 hover:bg-green-700"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        Accept
      </Button>
      <Button
        onClick={() => handleAction('decline')}
        disabled={isProcessing}
        variant="outline"
        className="flex-1"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4 mr-2" />
        )}
        Decline
      </Button>
    </div>
  )
}