import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const roleFilter = searchParams.get('role')

    // Build where clause
    const where: any = {}

    // Add search query filter (search in name and email)
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Add role filter
    if (roleFilter && roleFilter !== 'all') {
      where.role = roleFilter
    }

    // Fetch users
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50, // Limit results
    })

    return NextResponse.json({
      users,
      count: users.length
    })

  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}