import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateLawyerSlug, ensureUniqueSlug } from '@/lib/slug-utils'

// POST - Create new lawyer profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'LAWYER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      position,
      yearsExperience,
      bio,
      photoUrl,
      phone,
      email,
      displayPhone,
      displayEmail,
      address,
      city,
      state,
      postcode,
      country,
      linkedinUrl,
      twitterUrl,
      facebookUrl,
      websiteUrl,
      operatingHours,
      practiceAreas,
      courtAppearances,
      languages,
      certifications
    } = body

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: session.user.id }
    })

    if (existingLawyer) {
      return NextResponse.json(
        { error: 'Lawyer profile already exists. Use PUT to update.' },
        { status: 400 }
      )
    }

    // Generate unique slug for the new profile
    const baseSlug = generateLawyerSlug(firstName, lastName)
    const uniqueSlug = await ensureUniqueSlug(
      baseSlug,
      async (slug: string) => {
        const existing = await db.lawyer.findUnique({
          where: { slug }
        })
        return !!existing
      }
    )

    // Create lawyer profile with all basic fields (as DRAFT)
    const lawyer = await db.lawyer.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        slug: uniqueSlug,
        position: position || null,
        yearsExperience: yearsExperience || null,
        bio: bio || null,
        photoUrl: photoUrl || null,
        phone: phone || null,
        email: email || null,
        displayPhone: displayPhone || false,
        displayEmail: displayEmail || false,
        address: address || null,
        city: city || null,
        state: state || null,
        postcode: postcode || null,
        country: country || null,
        linkedinUrl: linkedinUrl || null,
        twitterUrl: twitterUrl || null,
        facebookUrl: facebookUrl || null,
        websiteUrl: websiteUrl || null,
        operatingHours: operatingHours || null,
        status: 'DRAFT',
      }
    })

    // Add specialisations (practice areas)
    if (practiceAreas && practiceAreas.length > 0) {
      await db.lawyerSpecialisation.createMany({
        data: practiceAreas.map((area: any) => ({
          lawyerId: lawyer.id,
          specialisationId: area.specialisationId,
          yearsExperience: area.yearsExperience || null,
          description: area.description || null
        }))
      })
    }

    // Add court appearances
    if (courtAppearances && courtAppearances.length > 0) {
      await db.courtAppearance.createMany({
        data: courtAppearances.map((appearance: any) => ({
          lawyerId: lawyer.id,
          courtName: appearance.courtName,
          jurisdiction: appearance.jurisdiction,
          appearanceCount: appearance.appearanceCount || ''
        }))
      })
    }

    // Add languages
    if (languages && languages.length > 0) {
      await db.lawyerLanguage.createMany({
        data: languages.map((lang: any) => ({
          lawyerId: lawyer.id,
          languageName: lang.languageName,
          proficiencyLevel: lang.proficiencyLevel
        }))
      })
    }

    // Add certifications
    if (certifications && certifications.length > 0) {
      await db.certification.createMany({
        data: certifications.map((cert: any) => ({
          lawyerId: lawyer.id,
          name: cert.name,
          issuingBody: cert.issuingBody,
          dateEarned: new Date(cert.dateEarned),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null
        }))
      })
    }

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_LAWYER_PROFILE',
        entityType: 'LAWYER',
        entityId: lawyer.id,
      }
    })

    // Create pending change for admin approval
    await db.pendingChange.create({
      data: {
        entityType: 'LAWYER',
        lawyerId: lawyer.id,
        changesJson: {
          action: 'CREATE',
          firstName,
          lastName,
          slug: uniqueSlug,
          position,
          yearsExperience,
          bio,
          photoUrl,
          phone,
          email,
          displayPhone,
          displayEmail,
          address,
          city,
          state,
          postcode,
          country,
          linkedinUrl,
          twitterUrl,
          facebookUrl,
          websiteUrl,
          operatingHours,
          practiceAreas,
          courtAppearances,
          languages,
          certifications
        },
        status: 'PENDING',
      }
    })

    // Send notification to admins
    const adminUsers = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    if (adminUsers.length > 0) {
      await Promise.all(
        adminUsers.map(admin =>
          db.notification.create({
            data: {
              userId: admin.id,
              type: 'NEW_LAWYER_PROFILE',
              title: 'New Lawyer Profile Created',
              message: `${firstName} ${lastName} created a new profile and is pending approval`,
              link: `/admin/approvals`,
              read: false,
            }
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile saved as draft and submitted for approval',
      lawyer
    })

  } catch (error) {
    console.error('Error creating lawyer profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update existing lawyer profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'LAWYER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      position,
      yearsExperience,
      bio,
      photoUrl,
      phone,
      email,
      displayPhone,
      displayEmail,
      address,
      city,
      state,
      postcode,
      country,
      linkedinUrl,
      twitterUrl,
      facebookUrl,
      websiteUrl,
      operatingHours,
      practiceAreas,
      courtAppearances,
      languages,
      certifications
    } = body

    // Debug logging
    console.log('PUT /api/lawyer/profile - Received data:', {
      firstName,
      lastName,
      practiceAreasCount: practiceAreas?.length || 0,
      courtAppearancesCount: courtAppearances?.length || 0,
      languagesCount: languages?.length || 0,
      certificationsCount: certifications?.length || 0
    })

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Check if profile exists
    const existingLawyer = await db.lawyer.findUnique({
      where: { userId: session.user.id }
    })

    if (!existingLawyer) {
      return NextResponse.json(
        { error: 'Lawyer profile not found. Use POST to create.' },
        { status: 404 }
      )
    }

    // Check if name changed - if so, generate new slug
    const nameChanged = existingLawyer.firstName !== firstName || existingLawyer.lastName !== lastName
    let newSlug = existingLawyer.slug

    if (nameChanged) {
      const baseSlug = generateLawyerSlug(firstName, lastName)
      newSlug = await ensureUniqueSlug(
        baseSlug,
        async (slug: string) => {
          const existing = await db.lawyer.findUnique({
            where: {
              slug,
              NOT: { id: existingLawyer.id }
            }
          })
          return !!existing
        }
      )
    }

    // IMPORTANT: Update the actual lawyer record with the new data
    // This ensures the data persists when the user returns to edit
    await db.lawyer.update({
      where: { id: existingLawyer.id },
      data: {
        firstName,
        lastName,
        slug: newSlug,
        position: position || null,
        yearsExperience: yearsExperience || null,
        bio: bio || null,
        photoUrl: photoUrl || null,
        phone: phone || null,
        email: email || null,
        displayPhone: displayPhone || false,
        displayEmail: displayEmail || false,
        address: address || null,
        city: city || null,
        state: state || null,
        postcode: postcode || null,
        country: country || null,
        linkedinUrl: linkedinUrl || null,
        twitterUrl: twitterUrl || null,
        facebookUrl: facebookUrl || null,
        websiteUrl: websiteUrl || null,
        operatingHours: operatingHours || null,
        status: 'DRAFT', // Keep as DRAFT until admin approves
      }
    })

    // Update all related data - delete and recreate to ensure consistency
    // Specialisations
    await db.lawyerSpecialisation.deleteMany({
      where: { lawyerId: existingLawyer.id }
    })
    if (practiceAreas && practiceAreas.length > 0) {
      await db.lawyerSpecialisation.createMany({
        data: practiceAreas.map((area: any) => ({
          lawyerId: existingLawyer.id,
          specialisationId: area.specialisationId,
          yearsExperience: area.yearsExperience || null,
          description: area.description || null
        }))
      })
    }

    // Court appearances
    await db.courtAppearance.deleteMany({
      where: { lawyerId: existingLawyer.id }
    })
    if (courtAppearances && courtAppearances.length > 0) {
      await db.courtAppearance.createMany({
        data: courtAppearances.map((appearance: any) => ({
          lawyerId: existingLawyer.id,
          courtName: appearance.courtName,
          jurisdiction: appearance.jurisdiction,
          appearanceCount: appearance.appearanceCount || ''
        }))
      })
    }

    // Languages
    await db.lawyerLanguage.deleteMany({
      where: { lawyerId: existingLawyer.id }
    })
    if (languages && languages.length > 0) {
      await db.lawyerLanguage.createMany({
        data: languages.map((lang: any) => ({
          lawyerId: existingLawyer.id,
          languageName: lang.languageName,
          proficiencyLevel: lang.proficiencyLevel
        }))
      })
    }

    // Certifications
    await db.certification.deleteMany({
      where: { lawyerId: existingLawyer.id }
    })
    if (certifications && certifications.length > 0) {
      await db.certification.createMany({
        data: certifications.map((cert: any) => ({
          lawyerId: existingLawyer.id,
          name: cert.name,
          issuingBody: cert.issuingBody,
          dateEarned: new Date(cert.dateEarned),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null
        }))
      })
    }

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_LAWYER_PROFILE',
        entityType: 'LAWYER',
        entityId: existingLawyer.id,
        metadata: {
          nameChanged,
          newSlug: nameChanged ? newSlug : undefined
        }
      }
    })

    // Check if there's already a pending change for this lawyer
    const existingPendingChange = await db.pendingChange.findFirst({
      where: {
        lawyerId: existingLawyer.id,
        status: 'PENDING'
      }
    })

    const changesData = {
      action: 'UPDATE',
      firstName,
      lastName,
      slug: newSlug,
      position,
      yearsExperience,
      bio,
      photoUrl,
      phone,
      email,
      displayPhone,
      displayEmail,
      address,
      city,
      state,
      postcode,
      country,
      linkedinUrl,
      twitterUrl,
      facebookUrl,
      websiteUrl,
      operatingHours,
      practiceAreas,
      courtAppearances,
      languages,
      certifications
    }

    if (existingPendingChange) {
      // Update existing pending change
      await db.pendingChange.update({
        where: { id: existingPendingChange.id },
        data: {
          changesJson: changesData,
          createdAt: new Date(), // Update timestamp
        }
      })

      // Delete old notifications and create new one
      await db.notification.deleteMany({
        where: {
          type: 'LAWYER_PROFILE_UPDATED',
          link: '/admin/approvals',
          read: false,
          user: { role: 'ADMIN' }
        }
      })
    } else {
      // Create new pending change
      await db.pendingChange.create({
        data: {
          entityType: 'LAWYER',
          lawyerId: existingLawyer.id,
          changesJson: changesData,
          status: 'PENDING',
        }
      })
    }

    // Send notification to admins
    const adminUsers = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    if (adminUsers.length > 0) {
      await Promise.all(
        adminUsers.map(admin =>
          db.notification.create({
            data: {
              userId: admin.id,
              type: 'LAWYER_PROFILE_UPDATED',
              title: 'Lawyer Profile Updated',
              message: `${firstName} ${lastName} updated their profile and is pending approval`,
              link: `/admin/approvals`,
              read: false,
            }
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile saved as draft and submitted for approval'
    })

  } catch (error) {
    console.error('Error updating lawyer profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}