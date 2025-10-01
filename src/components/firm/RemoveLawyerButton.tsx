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
import { Loader2, UserMinus } from 'lucide-react'
import { toast } from 'sonner'

interface RemoveLawyerButtonProps {
  lawyerId: string
  lawyerName: string
}

export default function RemoveLawyerButton({ lawyerId, lawyerName }: RemoveLawyerButtonProps) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)

    try {
      const response = await fetch('/api/firm/team/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lawyerId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove lawyer')
      }

      toast.success('Lawyer removed from firm successfully')
      router.refresh()
    } catch (error) {
      console.error('Error removing lawyer:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <UserMinus className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {lawyerName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this lawyer from your firm? This action will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Update their profile to show as independent</li>
              <li>Remove them from your team list</li>
              <li>Be recorded in their relationship history</li>
            </ul>
            <p className="mt-2">
              They can rejoin the firm if invited again.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700"
          >
            {isRemoving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              'Remove Lawyer'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}