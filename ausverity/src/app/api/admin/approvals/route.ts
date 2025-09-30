import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ensureUniqueSlug } from '@/lib/slug-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { changeId, action, notes } = body

    // Validate input
    if (!changeId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Fetch the pending change
    const pendingChange = await db.pendingChange.findUnique({
      where: { id: changeId },
      include: {
        lawyer: true,
        firm: true
      }
    })

    if (!pendingChange) {
      return NextResponse.json(
        { error: 'Pending change not found' },
        { status: 404 }
      )
    }

    if (pendingChange.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This change has already been processed' },
        { status: 400 }
      )
    }

    const changes = pendingChange.changesJson as Record<string, any>

    if (action === 'approve') {
      // Apply the changes to the actual profile
      if (pendingChange.entityType === 'LAWYER' && pendingChange.lawyerId) {
        
        // Handle slug validation for lawyers
        let finalSlug = changes.slug
        if (changes.slug) {
          // Ensure the slug is still unique at approval time (in case of conflicts)
          const isSlugAvailable = await db.lawyer.findUnique({
            where: {
              slug: changes.slug,
              NOT: { id: pendingChange.lawyerId }
            }
          })

          if (isSlugAvailable) {
            // Slug conflict - generate a new unique one
            finalSlug = await ensureUniqueSlug(
              changes.slug,
              async (slug: string) => {
                const existing = await db.lawyer.findUnique({
                  where: {
                    slug,
                    NOT: { id: pendingChange.lawyerId }
                  }
                })
                return !!existing
              }
            )
          }
        }

        // Extract only the fields that belong to the Lawyer model
        const lawyerUpdateData: any = {
          status: 'PUBLISHED'
        }

        // Add valid Lawyer fields from changes
        if (changes.firstName) lawyerUpdateData.firstName = changes.firstName
        if (changes.lastName) lawyerUpdateData.lastName = changes.lastName
        if (changes.position !== undefined) lawyerUpdateData.position = changes.position
        if (changes.yearsExperience !== undefined) lawyerUpdateData.yearsExperience = changes.yearsExperience
        if (changes.bio !== undefined) lawyerUpdateData.bio = changes.bio
        if (changes.photoUrl !== undefined) lawyerUpdateData.photoUrl = changes.photoUrl
        if (changes.phone !== undefined) lawyerUpdateData.phone = changes.phone
        if (changes.email !== undefined) lawyerUpdateData.email = changes.email
        if (changes.displayPhone !== undefined) lawyerUpdateData.displayPhone = changes.displayPhone
        if (changes.displayEmail !== undefined) lawyerUpdateData.displayEmail = changes.displayEmail
        if (changes.linkedinUrl !== undefined) lawyerUpdateData.linkedinUrl = changes.linkedinUrl
        if (changes.twitterUrl !== undefined) lawyerUpdateData.twitterUrl = changes.twitterUrl
        if (changes.facebookUrl !== undefined) lawyerUpdateData.facebookUrl = changes.facebookUrl
        if (changes.websiteUrl !== undefined) lawyerUpdateData.websiteUrl = changes.websiteUrl
        if (changes.operatingHours !== undefined) lawyerUpdateData.operatingHours = changes.operatingHours
        if (finalSlug) lawyerUpdateData.slug = finalSlug

        await db.lawyer.update({
          where: { id: pendingChange.lawyerId },
          data: lawyerUpdateData
        })

        // Update related data (practice areas, court appearances, languages, certifications)
        // Delete existing and recreate to match the approved changes

        // Practice Areas
        if (changes.practiceAreas) {
          await db.lawyerSpecialisation.deleteMany({
            where: { lawyerId: pendingChange.lawyerId }
          })
          if (changes.practiceAreas.length > 0) {
            await db.lawyerSpecialisation.createMany({
              data: changes.practiceAreas.map((area: any) => ({
                lawyerId: pendingChange.lawyerId!,
                specialisationId: area.specialisationId,
                yearsExperience: area.yearsExperience || null,
                description: area.description || null
              }))
            })
          }
        }

        // Court Appearances
        if (changes.courtAppearances) {
          await db.courtAppearance.deleteMany({
            where: { lawyerId: pendingChange.lawyerId }
          })
          if (changes.courtAppearances.length > 0) {
            await db.courtAppearance.createMany({
              data: changes.courtAppearances.map((app: any) => ({
                lawyerId: pendingChange.lawyerId!,
                courtName: app.courtName,
                jurisdiction: app.jurisdiction,
                appearanceCount: app.appearanceCount || 0
              }))
            })
          }
        }

        // Languages
        if (changes.languages) {
          await db.lawyerLanguage.deleteMany({
            where: { lawyerId: pendingChange.lawyerId }
          })
          if (changes.languages.length > 0) {
            await db.lawyerLanguage.createMany({
              data: changes.languages.map((lang: any) => ({
                lawyerId: pendingChange.lawyerId!,
                languageName: lang.languageName,
                proficiencyLevel: lang.proficiencyLevel
              }))
            })
          }
        }

        // Certifications
        if (changes.certifications) {
          await db.certification.deleteMany({
            where: { lawyerId: pendingChange.lawyerId }
          })
          if (changes.certifications.length > 0) {
            await db.certification.createMany({
              data: changes.certifications.map((cert: any) => ({
                lawyerId: pendingChange.lawyerId!,
                name: cert.name,
                issuingBody: cert.issuingBody,
                dateEarned: new Date(cert.dateEarned),
                expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null
              }))
            })
          }
        }

        // Create audit log for lawyer approval
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'APPROVE_LAWYER_CHANGES',
            entityType: 'LAWYER',
            entityId: pendingChange.lawyerId,
            metadata: {
              changeId: pendingChange.id,
              adminNotes: notes,
              changes: lawyerUpdateData,
              originalSlug: changes.slug,
              finalSlug: finalSlug
            }
          }
        })

      } else if (pendingChange.entityType === 'FIRM' && pendingChange.firmId) {

        // Handle slug validation for firms
        let finalSlug = changes.slug
        if (changes.slug) {
          // Ensure the slug is still unique at approval time (in case of conflicts)
          const isSlugAvailable = await db.lawFirm.findUnique({
            where: {
              slug: changes.slug,
              NOT: { id: pendingChange.firmId }
            }
          })

          if (isSlugAvailable) {
            // Slug conflict - generate a new unique one
            finalSlug = await ensureUniqueSlug(
              changes.slug,
              async (slug: string) => {
                const existing = await db.lawFirm.findUnique({
                  where: {
                    slug,
                    NOT: { id: pendingChange.firmId }
                  }
                })
                return !!existing
              }
            )
          }
        }

        // Extract only the fields that belong to the LawFirm model
        const firmUpdateData: any = {
          status: 'PUBLISHED'
        }

        // Add valid LawFirm fields from changes
        if (changes.name) firmUpdateData.name = changes.name
        if (changes.description !== undefined) firmUpdateData.description = changes.description
        if (changes.email) firmUpdateData.email = changes.email
        if (changes.phone) firmUpdateData.phone = changes.phone
        if (changes.displayPhone !== undefined) firmUpdateData.displayPhone = changes.displayPhone
        if (changes.displayEmail !== undefined) firmUpdateData.displayEmail = changes.displayEmail
        if (changes.website !== undefined) firmUpdateData.website = changes.website
        if (changes.logoUrl !== undefined) firmUpdateData.logoUrl = changes.logoUrl
        if (changes.galleryImages !== undefined) firmUpdateData.galleryImages = changes.galleryImages
        if (changes.operatingHours !== undefined) firmUpdateData.operatingHours = changes.operatingHours
        if (finalSlug) firmUpdateData.slug = finalSlug

        await db.lawFirm.update({
          where: { id: pendingChange.firmId },
          data: firmUpdateData
        })

        // Update related data (practice areas, court appearances, languages)
        // Delete existing and recreate to match the approved changes

        // Practice Areas
        if (changes.practiceAreas) {
          await db.firmPracticeArea.deleteMany({
            where: { firmId: pendingChange.firmId }
          })
          if (changes.practiceAreas.length > 0) {
            await db.firmPracticeArea.createMany({
              data: changes.practiceAreas.map((area: any) => ({
                firmId: pendingChange.firmId!,
                specialisationId: area.specialisationId
              }))
            })
          }
        }

        // Court Appearances
        if (changes.courtAppearances) {
          await db.firmCourtAppearance.deleteMany({
            where: { firmId: pendingChange.firmId }
          })
          if (changes.courtAppearances.length > 0) {
            await db.firmCourtAppearance.createMany({
              data: changes.courtAppearances.map((app: any) => ({
                firmId: pendingChange.firmId!,
                courtName: app.courtName,
                jurisdiction: app.jurisdiction,
                appearanceCount: app.appearanceCount || ''
              }))
            })
          }
        }

        // Languages
        if (changes.languages) {
          await db.firmLanguage.deleteMany({
            where: { firmId: pendingChange.firmId }
          })
          if (changes.languages.length > 0) {
            await db.firmLanguage.createMany({
              data: changes.languages.map((lang: any) => ({
                firmId: pendingChange.firmId!,
                languageName: lang.languageName,
                proficiencyLevel: lang.proficiencyLevel
              }))
            })
          }
        }

        // Create audit log for firm approval
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'APPROVE_FIRM_CHANGES',
            entityType: 'FIRM',
            entityId: pendingChange.firmId,
            metadata: {
              changeId: pendingChange.id,
              adminNotes: notes,
              changes: firmUpdateData,
              originalSlug: changes.slug,
              finalSlug: finalSlug
            }
          }
        })
      }

      // Update pending change status
      await db.pendingChange.update({
        where: { id: changeId },
        data: {
          status: 'APPROVED',
          adminNotes: notes || null,
          processedAt: new Date()
        }
      })

      // TODO: Send notification to user about approval
      
      return NextResponse.json({
        success: true,
        message: 'Changes approved and applied successfully',
        appliedSlug: pendingChange.entityType === 'LAWYER' ? 
          (await db.lawyer.findUnique({ where: { id: pendingChange.lawyerId! }, select: { slug: true } }))?.slug :
          (await db.lawFirm.findUnique({ where: { id: pendingChange.firmId! }, select: { slug: true } }))?.slug
      })

    } else {
      // Reject the changes
      await db.pendingChange.update({
        where: { id: changeId },
        data: {
          status: 'REJECTED',
          adminNotes: notes || null,
          processedAt: new Date()
        }
      })

      // Create audit log for rejection
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: pendingChange.entityType === 'LAWYER' ? 'REJECT_LAWYER_CHANGES' : 'REJECT_FIRM_CHANGES',
          entityType: pendingChange.entityType,
          entityId: pendingChange.lawyerId || pendingChange.firmId || '',
          metadata: {
            changeId: pendingChange.id,
            adminNotes: notes,
            rejectedChanges: changes
          }
        }
      })

      // TODO: Send notification to user about rejection

      return NextResponse.json({
        success: true,
        message: 'Changes rejected successfully'
      })
    }

  } catch (error) {
    console.error('Error processing approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}