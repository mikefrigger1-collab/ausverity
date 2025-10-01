import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'LAWYER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    // Find the lawyer profile for this user (any status)
    const lawyer = await db.lawyer.findUnique({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        slug: true,
        status: true
      }
    })

    if (!lawyer) {
      return NextResponse.json(
        { profileId: null, profileSlug: null, hasProfile: false },
        { status: 200 }
      )
    }

    return NextResponse.json({
      profileId: lawyer.id,
      profileSlug: lawyer.slug,
      hasProfile: true,
      status: lawyer.status
    })

  } catch (error) {
    console.error('Error fetching lawyer profile ID:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}