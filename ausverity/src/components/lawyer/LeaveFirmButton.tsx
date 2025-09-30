"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface LeaveFirmButtonProps {
  lawyerId: string
  firmName: string
}

export default function LeaveFirmButton({ lawyerId, firmName }: LeaveFirmButtonProps) {
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)

  const handleLeaveFirm = async () => {
    setIsLeaving(true)

    try {
      const response = await fetch('/api/lawyer/firm/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lawyerId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to leave firm')
      }

      toast.success('Successfully left the firm')
      router.refresh()
    } catch (error) {
      console.error('Error leaving firm:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="mt-3">
          <LogOut className="h-4 w-4 mr-2" />
          Leave Firm
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave {firmName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this firm? This action will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Remove you from the firm's team</li>
              <li>Update your profile to show as independent</li>
              <li>Be recorded in your relationship history</li>
            </ul>
            <p className="mt-2">
              You can rejoin this firm later if they invite you again.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeaveFirm}
            disabled={isLeaving}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLeaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Leaving...
              </>
            ) : (
              'Leave Firm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}