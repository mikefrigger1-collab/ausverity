'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Share2, Check, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react'

interface ShareButtonProps {
  lawyerName: string
  profileUrl: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function ShareButton({
  lawyerName,
  profileUrl,
  variant = 'outline',
  size = 'default',
  className
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `Check out ${lawyerName}'s profile on AusVerity`
  const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${profileUrl}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(fullUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`,
    }

    if (platform in urls) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'noopener,noreferrer')
    }
  }

  // Use native share API if available (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: fullUrl,
        })
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed')
      }
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          Share Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share via...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-green-600">Link copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 mr-2" />
              Copy link
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="w-4 h-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}