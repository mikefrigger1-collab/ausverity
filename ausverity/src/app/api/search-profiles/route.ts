// src/app/api/search-profiles/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const type = searchParams.get('type') as 'lawyer' | 'firm' | null

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        message: 'Please enter at least 2 characters'
      })
    }

    if (!type || (type !== 'lawyer' && type !== 'firm')) {
      return NextResponse.json(
        { error: 'Invalid search type. Must be "lawyer" or "firm"' },
        { status: 400 }
      )
    }

    let results: any[] = []

    if (type === 'lawyer') {
      // Search for lawyers by first name, last name, or combined name
      const lawyers = await db.lawyer.findMany({
        where: {
          status: 'PUBLISHED', // Only show published profiles
          OR: [
            {
              firstName: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              lastName: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          firm: {
            select: {
              name: true,
              locations: {
                where: { isPrimary: true },
                select: {
                  city: true,
                  state: true
                }
              }
            }
          }
        },
        take: 10,
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' }
        ]
      })

      results = lawyers.map(lawyer => {
        const primaryLocation = lawyer.firm?.locations[0]
        return {
          id: lawyer.id,
          name: `${lawyer.firstName} ${lawyer.lastName}`,
          location: primaryLocation 
            ? `${primaryLocation.city}, ${primaryLocation.state}`
            : lawyer.firm?.name || null,
          firmName: lawyer.firm?.name || 'Independent Practitioner',
          type: 'lawyer'
        }
      })
    } else {
      // Search for firms by name
      const firms = await db.lawFirm.findMany({
        where: {
          status: 'PUBLISHED', // Only show published profiles
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        include: {
          locations: {
            where: { isPrimary: true },
            select: {
              city: true,
              state: true
            }
          }
        },
        take: 10,
        orderBy: {
          name: 'asc'
        }
      })

      results = firms.map(firm => {
        const primaryLocation = firm.locations[0]
        return {
          id: firm.id,
          name: firm.name,
          location: primaryLocation
            ? `${primaryLocation.city}, ${primaryLocation.state}`
            : null,
          type: 'firm'
        }
      })
    }

    return NextResponse.json({
      results,
      count: results.length,
      query,
      type
    })

  } catch (error) {
    console.error('Error searching profiles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}