import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for general contact form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Create contact message in database
    const contactMessage = await db.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
        status: 'NEW',
      },
    })

    // TODO: Send email notification to admin
    // This can be implemented with services like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    //
    // Example with Resend:
    // const { Resend } = require('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    //
    // await resend.emails.send({
    //   from: 'notifications@ausverity.com.au',
    //   to: 'admin@ausverity.com.au',
    //   subject: `New Contact Form Submission from ${validatedData.name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
    //     ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
    //     <p><strong>Message:</strong></p>
    //     <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
    //     <hr>
    //     <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/messages/${contactMessage.id}">View in Admin Dashboard</a></p>
    //   `
    // })

    console.log('New contact message received:', {
      id: contactMessage.id,
      name: validatedData.name,
      email: validatedData.email,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        id: contactMessage.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact form. Please try again later.',
      },
      { status: 500 }
    )
  }
}
