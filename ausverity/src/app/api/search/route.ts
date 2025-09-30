// Advanced search API for lawyers and firms
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Get search parameters
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''
    const state = searchParams.get('state') || ''
    const areas = searchParams.get('areas')?.split(',').filter(Boolean) || []
    const minRating = parseFloat(searchParams.get('rating') || '0')
    const minExperience = parseInt(searchParams.get('experience') || '0')
    const type = searchParams.get('type') || 'all' // 'all', 'lawyer', 'firm'
    const sortBy = searchParams.get('sort') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    console.log('🔍 Search params:', { query, location, state, areas, minRating, minExperience, type, sortBy, page })

    let lawyers: any[] = []
    let firms: any[] = []

    // Search lawyers if type is 'all' or 'lawyer'
    if (type === 'all' || type === 'lawyer') {
      const lawyerWhere: Prisma.LawyerWhereInput = {
        status: 'PUBLISHED',
        AND: []
      }

      // Text search (name)
      if (query) {
        lawyerWhere.OR = [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
          { position: { contains: query, mode: 'insensitive' } }
        ]
      }

      // Location filters
      if (location) {
        lawyerWhere.AND!.push({
          OR: [
            { city: { contains: location, mode: 'insensitive' } },
            { state: { contains: location, mode: 'insensitive' } },
            { postcode: { contains: location, mode: 'insensitive' } }
          ]
        })
      }

      if (state && state !== 'all') {
        lawyerWhere.state = { equals: state, mode: 'insensitive' }
      }

      // Experience filter
      if (minExperience > 0) {
        // Convert string to number for comparison
        lawyerWhere.yearsExperience = {
          not: null
        }
      }

      // Practice areas filter
      if (areas.length > 0) {
        lawyerWhere.specialisations = {
          some: {
            specialisation: {
              name: {
                in: areas
              }
            }
          }
        }
      }

      const lawyersData = await db.lawyer.findMany({
        where: lawyerWhere,
        include: {
          firm: {
            select: {
              id: true,
              name: true
            }
          },
          specialisations: {
            include: {
              specialisation: {
                select: {
                  name: true
                }
              }
            }
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: {
              overallRating: true
            }
          },
          _count: {
            select: {
              reviews: {
                where: { status: 'APPROVED' }
              }
            }
          }
        },
        take: limit,
        skip: skip
      })

      // Process lawyers with ratings
      lawyers = lawyersData
        .map(lawyer => {
          const avgRating = lawyer.reviews.length > 0
            ? lawyer.reviews.reduce((sum, r) => sum + r.overallRating, 0) / lawyer.reviews.length
            : 0

          const yearsExp = lawyer.yearsExperience ? parseInt(lawyer.yearsExperience) : 0

          return {
            id: lawyer.id,
            slug: lawyer.slug,
            type: 'lawyer' as const,
            name: `${lawyer.firstName} ${lawyer.lastName}`,
            firstName: lawyer.firstName,
            lastName: lawyer.lastName,
            firm: lawyer.firm ? {
              id: lawyer.firm.id,
              name: lawyer.firm.name
            } : null,
            location: {
              city: lawyer.city || '',
              state: lawyer.state || ''
            },
            specializations: lawyer.specialisations.map(s => s.specialisation.name),
            avgRating,
            reviewCount: lawyer._count.reviews,
            yearsExperience: yearsExp,
            photoUrl: lawyer.photoUrl,
            verified: true, // All published profiles are verified
            featured: false // TODO: Check subscription/boost status
          }
        })
        .filter(lawyer => {
          // Filter by minimum rating
          if (minRating > 0 && lawyer.avgRating < minRating) return false
          // Filter by minimum experience
          if (minExperience > 0 && lawyer.yearsExperience < minExperience) return false
          return true
        })
    }

    // Search firms if type is 'all' or 'firm'
    if (type === 'all' || type === 'firm') {
      const firmWhere: Prisma.LawFirmWhereInput = {
        status: 'PUBLISHED',
        AND: []
      }

      // Text search (name)
      if (query) {
        firmWhere.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }

      // Location filters
      if (location) {
        firmWhere.locations = {
          some: {
            OR: [
              { city: { contains: location, mode: 'insensitive' } },
              { state: { contains: location, mode: 'insensitive' } },
              { postcode: { contains: location, mode: 'insensitive' } }
            ]
          }
        }
      }

      if (state && state !== 'all') {
        firmWhere.locations = {
          some: {
            state: { equals: state, mode: 'insensitive' }
          }
        }
      }

      // Practice areas filter
      if (areas.length > 0) {
        firmWhere.practiceAreas = {
          some: {
            specialisation: {
              name: {
                in: areas
              }
            }
          }
        }
      }

      const firmsData = await db.lawFirm.findMany({
        where: firmWhere,
        include: {
          locations: {
            where: { isPrimary: true },
            take: 1
          },
          practiceAreas: {
            include: {
              specialisation: {
                select: {
                  name: true
                }
              }
            }
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: {
              overallRating: true
            }
          },
          _count: {
            select: {
              reviews: {
                where: { status: 'APPROVED' }
              }
            }
          }
        },
        take: limit,
        skip: skip
      })

      // Process firms with ratings
      firms = firmsData
        .map(firm => {
          const avgRating = firm.reviews.length > 0
            ? firm.reviews.reduce((sum, r) => sum + r.overallRating, 0) / firm.reviews.length
            : 0

          const primaryLocation = firm.locations[0]

          return {
            id: firm.id,
            slug: firm.slug,
            type: 'firm' as const,
            name: firm.name,
            location: {
              city: primaryLocation?.city || '',
              state: primaryLocation?.state || ''
            },
            specializations: firm.practiceAreas.map(pa => pa.specialisation.name),
            avgRating,
            reviewCount: firm._count.reviews,
            logoUrl: firm.logoUrl,
            verified: true,
            featured: false // TODO: Check subscription/boost status
          }
        })
        .filter(firm => {
          // Filter by minimum rating
          if (minRating > 0 && firm.avgRating < minRating) return false
          return true
        })
    }

    // Combine and sort results
    let results = [...lawyers, ...firms]

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'reviews':
        results.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'experience':
        results.sort((a, b) => {
          const aExp = (a as any).yearsExperience || 0
          const bExp = (b as any).yearsExperience || 0
          return bExp - aExp
        })
        break
      case 'newest':
        // Keep database order (newest first)
        break
      default: // relevance
        // Featured first, then by rating
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.avgRating - a.avgRating
        })
    }

    console.log(`✅ Found ${results.length} results`)

    return NextResponse.json({
      results,
      total: results.length,
      page,
      limit,
      hasMore: results.length === limit
    })

  } catch (error) {
    console.error('❌ Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}