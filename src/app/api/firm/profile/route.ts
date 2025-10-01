import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateFirmSlug, ensureUniqueSlug } from '@/lib/slug-utils'

// POST - Create new firm profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'FIRM_OWNER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      email,
      phone,
      website,
      logoUrl,
      displayPhone,
      displayEmail,
      galleryImages,
      operatingHours,
      practiceAreas,
      courtAppearances,
      languages
    } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Firm name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existingFirm = await db.lawFirm.findUnique({
      where: { ownerId: session.user.id }
    })

    if (existingFirm) {
      return NextResponse.json(
        { error: 'Firm profile already exists. Use PUT to update.' },
        { status: 400 }
      )
    }

    // Generate unique slug for the new firm
    const baseSlug = generateFirmSlug(name)
    const uniqueSlug = await ensureUniqueSlug(
      baseSlug,
      async (slug: string) => {
        const existing = await db.lawFirm.findUnique({
          where: { slug }
        })
        return !!existing
      }
    )

    // Prepare the profile data (including slug)
    const profileData = {
      name,
      slug: uniqueSlug, // Include slug in pending changes
      description: description || null,
      email,
      phone,
      displayPhone: displayPhone || false,
      displayEmail: displayEmail || false,
      website: website || null,
      logoUrl: logoUrl || null,
      galleryImages: galleryImages || null,
      operatingHours: operatingHours || null,
      practiceAreas: practiceAreas || [],
      courtAppearances: courtAppearances || [],
      languages: languages || [],
    }

    // Create a basic firm record first with temporary slug
    const tempSlug = `pending-firm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const firm = await db.lawFirm.create({
      data: {
        ownerId: session.user.id,
        name: 'Pending Review',
        slug: tempSlug, // Temporary slug until approved
        email: 'pending@review.com',
        phone: 'Pending',
        status: 'DRAFT',
      }
    })

    // Always create a pending change for new firm profiles (including slug)
    await db.pendingChange.create({
      data: {
        entityType: 'FIRM',
        firmId: firm.id,
        changesJson: profileData,
        status: 'PENDING',
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_FIRM_PROFILE',
        entityType: 'FIRM',
        entityId: firm.id,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Firm profile submitted for approval',
      requiresApproval: true,
      firm,
      proposedSlug: uniqueSlug // Return the proposed slug for reference
    })

  } catch (error) {
    console.error('Error creating firm profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update existing firm profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'FIRM_OWNER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      email,
      phone,
      website,
      logoUrl,
      displayPhone,
      displayEmail,
      galleryImages,
      operatingHours,
      practiceAreas,
      courtAppearances,
      languages
    } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Firm name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Check if profile exists
    const existingFirm = await db.lawFirm.findUnique({
      where: { ownerId: session.user.id }
    })

    if (!existingFirm) {
      return NextResponse.json(
        { error: 'Firm profile not found. Use POST to create.' },
        { status: 404 }
      )
    }

    // Check if name changed - if so, generate new slug
    const nameChanged = existingFirm.name !== name
    let newSlug = existingFirm.slug // Keep existing slug by default

    if (nameChanged) {
      const baseSlug = generateFirmSlug(name)
      newSlug = await ensureUniqueSlug(
        baseSlug,
        async (slug: string) => {
          const existing = await db.lawFirm.findUnique({
            where: { 
              slug,
              NOT: { id: existingFirm.id } // Exclude current record
            }
          })
          return !!existing
        }
      )
    }

    // Prepare changes object (include slug if name changed)
    const changes: any = {
      name,
      description: description || null,
      email,
      phone,
      displayPhone: displayPhone !== undefined ? displayPhone : existingFirm.displayPhone,
      displayEmail: displayEmail !== undefined ? displayEmail : existingFirm.displayEmail,
      website: website || null,
      logoUrl: logoUrl || null,
      galleryImages: galleryImages || null,
      operatingHours: operatingHours || null,
      practiceAreas: practiceAreas || [],
      courtAppearances: courtAppearances || [],
      languages: languages || [],
    }

    // Only include slug in changes if name changed
    if (nameChanged) {
      changes.slug = newSlug
    }

    // Check if there's already a pending change for this firm
    const existingPendingChange = await db.pendingChange.findFirst({
      where: {
        firmId: existingFirm.id,
        status: 'PENDING'
      }
    })

    if (existingPendingChange) {
      // Update the existing pending change instead of creating a new one
      await db.pendingChange.update({
        where: { id: existingPendingChange.id },
        data: {
          changesJson: changes,
          createdAt: new Date(), // Update timestamp
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Changes updated and pending approval',
        requiresApproval: true,
        proposedSlug: nameChanged ? newSlug : existingFirm.slug
      })
    }

    // Always create a pending change (regardless of profile status)
    await db.pendingChange.create({
      data: {
        entityType: 'FIRM',
        firmId: existingFirm.id,
        changesJson: changes,
        status: 'PENDING',
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_FIRM_PROFILE',
        entityType: 'FIRM',
        entityId: existingFirm.id,
        metadata: {
          requiresApproval: true,
          nameChanged,
          newSlug: nameChanged ? newSlug : undefined
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Changes submitted for approval',
      requiresApproval: true,
      proposedSlug: nameChanged ? newSlug : existingFirm.slug
    })

  } catch (error) {
    console.error('Error updating firm profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}