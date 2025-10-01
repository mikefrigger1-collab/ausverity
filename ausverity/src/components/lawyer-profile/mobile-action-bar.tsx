'use client'

import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { Phone, MessageSquare } from "lucide-react"
import type { LawyerProfileData } from "@/lib/data/lawyers"

interface MobileActionBarProps {
  lawyer: NonNullable<LawyerProfileData>
}

export function MobileActionBar({ lawyer }: MobileActionBarProps) {
  const fullName = `${lawyer.firstName} ${lawyer.lastName}`
  const hasPhone = lawyer.displayPhone && lawyer.phone

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg lg:hidden z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-3">
          {hasPhone && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <a href={`tel:${lawyer.phone}`}>
                <Phone className="w-5 h-5 mr-2" />
                Call
              </a>
            </Button>
          )}

          {lawyer.isPaidUser ? (
            <ContactForm
              recipientType="LAWYER"
              recipientName={fullName}
              recipientId={lawyer.id}
              firmName={lawyer.firm?.name}
              trigger={
                <Button
                  size="lg"
                  className={`bg-blue-600 hover:bg-blue-700 ${hasPhone ? 'flex-1' : 'w-full'}`}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Message
                </Button>
              }
            />
          ) : (
            <Button
              size="lg"
              variant="outline"
              className={`border-slate-300 ${hasPhone ? 'flex-1' : 'w-full'}`}
              disabled
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}