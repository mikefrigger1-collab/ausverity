"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  Clock,
  User,
  Briefcase
} from "lucide-react"
import { toast } from "sonner"

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
  caseType: z.string().min(1, "Please select a case type"),
  urgency: z.string().min(1, "Please select urgency level"),
  message: z.string().min(20, "Please provide more details (at least 20 characters)"),
  preferredContact: z.string().min(1, "Please select preferred contact method"),
  consent: z.boolean().refine(val => val === true, "You must agree to be contacted"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Case types for the dropdown
const caseTypes = [
  "Family Law - Divorce",
  "Family Law - Custody",
  "Family Law - Property Settlement",
  "Criminal Law - Defence",
  "Criminal Law - Traffic Offences",
  "Property Law - Conveyancing",
  "Property Law - Disputes",
  "Commercial Law - Contracts",
  "Commercial Law - Business Disputes",
  "Personal Injury - Motor Vehicle",
  "Personal Injury - Workplace",
  "Personal Injury - Public Liability",
  "Wills & Estates - Will Preparation",
  "Wills & Estates - Probate",
  "Employment Law",
  "Immigration Law",
  "Other - Please specify in message"
]

interface ContactFormProps {
  recipientType: 'lawyer' | 'firm'
  recipientName: string
  recipientId: string
  firmName?: string
  trigger?: React.ReactNode
}

export function ContactForm({ 
  recipientType, 
  recipientName, 
  recipientId, 
  firmName,
  trigger 
}: ContactFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      consent: false
    }
  })

  const watchedFields = watch()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recipientType,
          recipientId,
          recipientName,
          firmName,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSubmitted(true)
      toast.success('Message sent successfully!')
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false)
        setIsOpen(false)
        reset()
      }, 3000)

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button className="w-full bg-blue-600 hover:bg-blue-700">
      <MessageSquare className="w-4 h-4 mr-2" />
      Contact {recipientType === 'lawyer' ? recipientName.split(' ')[0] : 'Firm'}
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={!!trigger}>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Contact {recipientName}
          </DialogTitle>
          <DialogDescription>
            {recipientType === 'lawyer' && firmName && (
              <span className="text-slate-600">{firmName}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Message Sent Successfully!</h3>
            <p className="text-slate-600 mb-4">
              Your message has been sent to {recipientName}. They will contact you within 24 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <Clock className="w-4 h-4 inline mr-1" />
                Expected response time: Within 1 business day
              </p>
            </div>
          </div>
        ) : (
          // Contact Form
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="Enter your first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="Enter your last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="04XX XXX XXX"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Case Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caseType">Type of Legal Matter *</Label>
                    <Select onValueChange={(value) => setValue("caseType", value)}>
                      <SelectTrigger className={errors.caseType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        {caseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.caseType && (
                      <p className="text-sm text-red-500 mt-1">{errors.caseType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select onValueChange={(value) => setValue("urgency", value)}>
                      <SelectTrigger className={errors.urgency ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - No immediate deadline</SelectItem>
                        <SelectItem value="medium">Medium - Within a few weeks</SelectItem>
                        <SelectItem value="high">High - Within a week</SelectItem>
                        <SelectItem value="urgent">Urgent - Immediate assistance needed</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.urgency && (
                      <p className="text-sm text-red-500 mt-1">{errors.urgency.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Tell us about your legal matter *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Please provide details about your situation, what happened, and what kind of help you're looking for. The more information you provide, the better we can assist you."
                    rows={5}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                      <p className="text-sm text-red-500">{errors.message.message}</p>
                    ) : (
                      <p className="text-sm text-slate-500">
                        {watchedFields.message?.length || 0} characters (minimum 20)
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Preferences */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredContact">Preferred Contact Method *</Label>
                  <Select onValueChange={(value) => setValue("preferredContact", value)}>
                    <SelectTrigger className={errors.preferredContact ? "border-red-500" : ""}>
                      <SelectValue placeholder="How would you like to be contacted?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="either">Either Email or Phone</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferredContact && (
                    <p className="text-sm text-red-500 mt-1">{errors.preferredContact.message}</p>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={watchedFields.consent}
                    onCheckedChange={(checked) => setValue("consent", checked as boolean)}
                    className={errors.consent ? "border-red-500" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="consent"
                      className="text-sm font-normal cursor-pointer"
                    >
                      I consent to being contacted by {recipientName} regarding my legal matter. 
                      I understand that this does not create a lawyer-client relationship. *
                    </Label>
                    {errors.consent && (
                      <p className="text-sm text-red-500">{errors.consent.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}