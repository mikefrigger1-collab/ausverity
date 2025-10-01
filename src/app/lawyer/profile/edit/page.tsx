import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import LawyerProfileForm from '@/components/lawyer/LawyerProfileForm'

export default async function LawyerProfileEditPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch existing lawyer profile if it exists
  const lawyer = await db.lawyer.findUnique({
    where: {
      userId: session.user.id
    },
    include: {
      specialisations: {
        include: {
          specialisation: true
        }
      },
      courtAppearances: true,
      languages: true,
      certifications: true,
    }
  })

  // Check for pending changes to load draft data
  const pendingChange = await db.pendingChange.findFirst({
    where: {
      lawyerId: lawyer?.id,
      status: 'PENDING'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Debug logging
  console.log('Edit page - Lawyer data:', {
    lawyerId: lawyer?.id,
    specialisations: lawyer?.specialisations?.length || 0,
    courtAppearances: lawyer?.courtAppearances?.length || 0,
    languages: lawyer?.languages?.length || 0,
    certifications: lawyer?.certifications?.length || 0,
    hasPendingChange: !!pendingChange
  })

  // Fetch all available specialisations for the dropdown
  const allSpecialisations = await db.specialisation.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  const isNewProfile = !lawyer

  // If there's a pending change, use that data for editing (draft data)
  // Otherwise use the published profile data
  let profileData = lawyer

  if (pendingChange && pendingChange.changesJson && lawyer) {
    const draftData = pendingChange.changesJson as any

    // Merge draft data with existing lawyer record
    // This works for both CREATE and UPDATE actions
    profileData = {
      ...lawyer,
      firstName: draftData.firstName || lawyer.firstName,
      lastName: draftData.lastName || lawyer.lastName,
      position: draftData.position || lawyer.position,
      yearsExperience: draftData.yearsExperience || lawyer.yearsExperience,
      bio: draftData.bio || lawyer.bio,
      photoUrl: draftData.photoUrl || lawyer.photoUrl,
      slug: draftData.slug || lawyer.slug,
      phone: draftData.phone || lawyer.phone,
      email: draftData.email || lawyer.email,
      displayPhone: draftData.displayPhone !== undefined ? draftData.displayPhone : lawyer.displayPhone,
      displayEmail: draftData.displayEmail !== undefined ? draftData.displayEmail : lawyer.displayEmail,
      address: draftData.address || lawyer.address,
      city: draftData.city || lawyer.city,
      state: draftData.state || lawyer.state,
      postcode: draftData.postcode || lawyer.postcode,
      country: draftData.country || lawyer.country,
      linkedinUrl: draftData.linkedinUrl || lawyer.linkedinUrl,
      twitterUrl: draftData.twitterUrl || lawyer.twitterUrl,
      facebookUrl: draftData.facebookUrl || lawyer.facebookUrl,
      websiteUrl: draftData.websiteUrl || lawyer.websiteUrl,
      operatingHours: draftData.operatingHours || lawyer.operatingHours,
      // Override the nested arrays with draft data
      specialisations: draftData.practiceAreas?.map((area: any) => ({
        id: `draft-${area.specialisationId}`,
        lawyerId: lawyer.id,
        specialisationId: area.specialisationId,
        yearsExperience: area.yearsExperience,
        description: area.description,
        specialisation: allSpecialisations.find(s => s.id === area.specialisationId) || {
          id: area.specialisationId,
          name: area.specialisationName || 'Unknown',
          category: '',
          parentId: null,
          icon: null,
          description: null
        }
      })) || lawyer.specialisations,
      courtAppearances: draftData.courtAppearances?.map((app: any) => ({
        id: app.id || `draft-court-${Math.random()}`,
        courtName: app.courtName,
        jurisdiction: app.jurisdiction,
        appearanceCount: app.appearanceCount || 0
      })) || lawyer.courtAppearances,
      languages: draftData.languages?.map((lang: any) => ({
        id: lang.id || `draft-lang-${Math.random()}`,
        languageName: lang.languageName,
        proficiencyLevel: lang.proficiencyLevel
      })) || lawyer.languages,
      certifications: draftData.certifications?.map((cert: any) => ({
        id: cert.id || `draft-cert-${Math.random()}`,
        name: cert.name,
        issuingBody: cert.issuingBody,
        dateEarned: cert.dateEarned ? new Date(cert.dateEarned) : new Date(),
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null
      })) || lawyer.certifications,
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/lawyer/profile">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isNewProfile ? 'Create Your Profile' : 'Edit Your Profile'}
        </h1>
        <p className="text-slate-600 mt-2">
          {isNewProfile
            ? 'Set up your professional profile to start receiving client reviews'
            : 'Update your professional information'}
        </p>
      </div>

      {/* Draft Notice */}
      {pendingChange && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <CardTitle className="text-blue-900">Draft in Progress</CardTitle>
                <CardDescription className="text-blue-700">
                  You have unsaved changes from {new Date(pendingChange.createdAt).toLocaleDateString('en-AU')}. 
                  These changes are shown below and will be submitted for admin approval when you save.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">Profile Changes Require Approval</CardTitle>
          <CardDescription className="text-orange-700">
            Any changes you make will be submitted for admin review before going live on your public profile.
            Your changes are automatically saved as a draft and will be restored if you leave this page.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Form */}
      <LawyerProfileForm 
        lawyer={profileData} 
        specialisations={allSpecialisations}
        userId={session.user.id}
      />
    </div>
  )
}