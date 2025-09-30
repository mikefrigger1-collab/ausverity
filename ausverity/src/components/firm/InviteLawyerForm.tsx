"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface InviteLawyerFormProps {
  firmId: string
}

export default function InviteLawyerForm({ firmId }: InviteLawyerFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/firm/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firmId,
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      toast.success('Invitation sent successfully')
      setEmail('')
      router.refresh()
    } catch (error) {
      console.error('Error sending invitation:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Lawyer's Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="lawyer@example.com"
          disabled={isSubmitting}
          className="mt-2"
        />
        <p className="text-xs text-slate-500 mt-1">
          The lawyer must have an existing AusVerity account with this email
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending Invitation...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Invitation
          </>
        )}
      </Button>
    </form>
  )
}