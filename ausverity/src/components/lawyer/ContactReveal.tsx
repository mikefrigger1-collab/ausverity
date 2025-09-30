'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Eye } from 'lucide-react'

interface ContactRevealProps {
  type: 'email' | 'phone'
  value: string
  className?: string
}

export function ContactReveal({ type, value, className = '' }: ContactRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const icon = type === 'email' ? Mail : Phone
  const Icon = icon
  const label = type === 'email' ? 'Email' : 'Phone'

  if (isRevealed) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon className="h-5 w-5 text-slate-400" />
        <a
          href={type === 'email' ? `mailto:${value}` : `tel:${value}`}
          className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          {value}
        </a>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReveal}
      className={`flex items-center gap-2 ${className}`}
    >
      <Eye className="h-4 w-4" />
      Tap to show {label.toLowerCase()}
    </Button>
  )
}