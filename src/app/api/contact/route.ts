import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

// Validation schema for contact form data
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  caseType: z.string().min(1, "Please select a case type"),
  urgency: z.string().min(1, "Please select urgency level"),
  message: z.string().min(20, "Please provide more details (at least 20 characters)"),
  preferredContact: z.string().min(1, "Please select preferred contact method"),
  consent: z.boolean().refine(val => val === true, "You must agree to be contacted"),
  // Additional fields from the form component
  recipientType: z.enum(['LAWYER', 'FIRM']),
  recipientId: z.string().min(1, "Recipient ID is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  firmName: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = contactFormSchema.parse(body)
    
    // Check if recipient exists and is a paid user
    const recipientCheck = await checkRecipientEligibility(validatedData.recipientType, validatedData.recipientId)
    
    if (!recipientCheck.exists) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }
    
    if (!recipientCheck.isPaidUser) {
      return NextResponse.json(
        { error: 'Contact form is only available for premium members' },
        { status: 403 }
      )
    }
    
    // Create the contact inquiry in the database
    const inquiry = await db.contactInquiry.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        caseType: validatedData.caseType,
        urgency: validatedData.urgency,
        message: validatedData.message,
        preferredContact: validatedData.preferredContact,
        recipientType: validatedData.recipientType,
        recipientId: validatedData.recipientId,
        recipientName: validatedData.recipientName,
        firmName: validatedData.firmName || null,
        status: 'NEW',
        createdAt: new Date(),
      },
    })
    
    // Send email notification to the recipient
    if (recipientCheck.recipientEmail) {
      await sendEmailNotification(validatedData, recipientCheck.recipientEmail)
    }
    
    // Send confirmation email to the client
    await sendClientConfirmation(validatedData)
    
    // Create notification for the recipient (if they have an account)
    if (recipientCheck.userId) {
      await db.notification.create({
        data: {
          userId: recipientCheck.userId,
          type: 'NEW_INQUIRY',
          title: 'New Client Inquiry',
          message: `You have received a new inquiry from ${validatedData.firstName} ${validatedData.lastName} regarding ${validatedData.caseType}`,
          link: `/dashboard/inquiries/${inquiry.id}`,
          read: false,
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: 'Your message has been sent successfully'
    })
    
  } catch (error) {
    console.error('Error processing contact form:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to check if recipient exists and is a paid user
async function checkRecipientEligibility(recipientType: 'LAWYER' | 'FIRM', recipientId: string) {
  try {
    if (recipientType === 'LAWYER') {
      const lawyer = await db.lawyer.findUnique({
        where: { 
          id: recipientId,
          status: 'PUBLISHED' // Only published lawyers can receive inquiries
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          subscriptions: {
            where: {
              status: 'ACTIVE',
              planType: {
                in: ['PROFESSIONAL', 'PREMIUM']
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          firm: {
            select: {
              email: true,
              subscriptions: {
                where: {
                  status: 'ACTIVE',
                  planType: {
                    in: ['PROFESSIONAL', 'PREMIUM']
                  }
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            }
          }
        }
      })
      
      if (!lawyer) {
        return { exists: false, isPaidUser: false, recipientEmail: null, userId: null }
      }
      
      // Check if lawyer has paid subscription OR their firm has paid subscription
      const hasPaidSubscription = lawyer.subscriptions.length > 0 || 
                                 (lawyer.firm && lawyer.firm.subscriptions.length > 0)
      
      // Use firm email if lawyer doesn't have firm association, otherwise use firm email
      const recipientEmail = lawyer.firm?.email || lawyer.user.email
      
      return {
        exists: true,
        isPaidUser: hasPaidSubscription,
        recipientEmail,
        userId: lawyer.user.id
      }
    } else {
      // For firms
      const firm = await db.lawFirm.findUnique({
        where: { 
          id: recipientId,
          status: 'PUBLISHED'
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true
            }
          },
          subscriptions: {
            where: {
              status: 'ACTIVE',
              planType: {
                in: ['PROFESSIONAL', 'PREMIUM']
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      })
      
      if (!firm) {
        return { exists: false, isPaidUser: false, recipientEmail: null, userId: null }
      }
      
      const hasPaidSubscription = firm.subscriptions.length > 0
      
      return {
        exists: true,
        isPaidUser: hasPaidSubscription,
        recipientEmail: firm.email,
        userId: firm.owner.id
      }
    }
  } catch (error) {
    console.error('Error checking recipient eligibility:', error)
    return { exists: false, isPaidUser: false, recipientEmail: null, userId: null }
  }
}

// Helper function to send email notification to recipient
async function sendEmailNotification(data: ContactFormData, recipientEmail: string) {
  try {
    // This would integrate with your email service (Resend, SendGrid, etc.)
    // For now, we'll just log the email content
    
    const emailContent = {
      to: recipientEmail,
      subject: `New Client Inquiry - ${data.caseType}`,
      html: `
        <h2>New Client Inquiry</h2>
        
        <h3>Client Information:</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Preferred Contact:</strong> ${data.preferredContact}</p>
        
        <h3>Case Details:</h3>
        <p><strong>Case Type:</strong> ${data.caseType}</p>
        <p><strong>Urgency:</strong> ${data.urgency}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><em>This inquiry was sent through AusVerity. Please respond directly to the client's email address.</em></p>
      `
    }
    
    console.log('Email notification would be sent:', emailContent)
    
    // TODO: Implement actual email sending
    // await emailService.send(emailContent)
    
  } catch (error) {
    console.error('Error sending email notification:', error)
    // Don't throw error here - we still want the inquiry to be saved
  }
}

// Helper function to send confirmation email to client
async function sendClientConfirmation(data: ContactFormData) {
  try {
    const emailContent = {
      to: data.email,
      subject: `Your inquiry has been sent to ${data.recipientName}`,
      html: `
        <h2>Thank you for your inquiry</h2>
        
        <p>Dear ${data.firstName},</p>
        
        <p>Your inquiry regarding <strong>${data.caseType}</strong> has been successfully sent to ${data.recipientName}.</p>
        
        <h3>What happens next?</h3>
        <ul>
          <li>You should receive a response within 24 hours</li>
          <li>The lawyer will contact you via your preferred method: ${data.preferredContact}</li>
          <li>They will discuss your case and next steps</li>
        </ul>
        
        <p>If you don't receive a response within 48 hours, please contact our support team.</p>
        
        <hr>
        <p><em>Best regards,<br>The AusVerity Team</em></p>
      `
    }
    
    console.log('Client confirmation would be sent:', emailContent)
    
    // TODO: Implement actual email sending
    // await emailService.send(emailContent)
    
  } catch (error) {
    console.error('Error sending client confirmation:', error)
    // Don't throw error here
  }
}