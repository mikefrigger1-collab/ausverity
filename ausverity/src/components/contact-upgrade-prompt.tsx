"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Crown, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Mail,
  Phone
} from "lucide-react"

interface ContactUpgradePromptProps {
  recipientType: 'LAWYER' | 'FIRM'
  recipientName: string
  recipientId: string
  trigger?: React.ReactNode
}

export function ContactUpgradePrompt({ 
  recipientType, 
  recipientName, 
  recipientId,
  trigger 
}: ContactUpgradePromptProps) {
  const defaultTrigger = (
    <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
      <Crown className="w-4 h-4 mr-2" />
      Contact {recipientType === 'LAWYER' ? recipientName.split(' ')[0] : 'Firm'}
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild={!!trigger}>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="w-5 h-5 text-amber-600" />
            Premium Feature
          </DialogTitle>
          <DialogDescription>
            Direct contact forms are available for premium members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feature Highlight */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Direct Client Contact</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {recipientName} is building their online presence and hasn't upgraded to premium contact features yet.
                </p>
                <Badge variant="outline" className="bg-white text-amber-700 border-amber-300">
                  Available with Professional Plan
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Benefits for the Professional */}
          {recipientType === 'LAWYER' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-semibold text-blue-900 mb-2">For Legal Professionals</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Upgrade to Professional to receive direct client inquiries through AusVerity
                  </p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Structured client inquiries</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Lead management dashboard</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Priority search placement</span>
                    </div>
                  </div>
                  <Link href="/pricing" className="inline-block mt-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Pricing
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}