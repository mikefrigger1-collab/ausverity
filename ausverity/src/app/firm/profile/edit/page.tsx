import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import FirmProfileForm from '@/components/firm/FirmProfileForm'

export default async function FirmProfileEditPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch existing firm profile if it exists
  const firm = await db.lawFirm.findUnique({
    where: {
      ownerId: session.user.id
    },
    include: {
      locations: true,
      practiceAreas: {
        include: {
          specialisation: true
        }
      }
    }
  })

  // Fetch related data separately
  let courtAppearances: any[] = []
  let languages: any[] = []

  if (firm) {
    courtAppearances = await db.firmCourtAppearance.findMany({
      where: { firmId: firm.id }
    })

    languages = await db.firmLanguage.findMany({
      where: { firmId: firm.id }
    })
  }

  // Check for pending changes to load draft data
  const pendingChange = await db.pendingChange.findFirst({
    where: {
      firmId: firm?.id,
      status: 'PENDING'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Fetch all available specialisations for the dropdown
  const allSpecialisations = await db.specialisation.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  const isNewProfile = !firm

  // If there's a pending change, use that data for editing (draft data)
  // Otherwise use the published profile data
  let profileData = firm ? {
    ...firm,
    courtAppearances,
    languages
  } : null

  if (pendingChange && pendingChange.changesJson && firm) {
    const draftData = pendingChange.changesJson as any

    // Merge draft data with existing firm record
    profileData = {
      ...firm,
      name: draftData.name || firm.name,
      description: draftData.description || firm.description,
      email: draftData.email || firm.email,
      phone: draftData.phone || firm.phone,
      displayPhone: draftData.displayPhone !== undefined ? draftData.displayPhone : firm.displayPhone,
      displayEmail: draftData.displayEmail !== undefined ? draftData.displayEmail : firm.displayEmail,
      website: draftData.website || firm.website,
      logoUrl: draftData.logoUrl || firm.logoUrl,
      galleryImages: draftData.galleryImages || firm.galleryImages,
      operatingHours: draftData.operatingHours || firm.operatingHours,
      // Override the nested arrays with draft data
      practiceAreas: draftData.practiceAreas?.map((area: any) => ({
        id: `draft-${area.specialisationId}`,
        firmId: firm.id,
        specialisationId: area.specialisationId,
        specialisation: allSpecialisations.find(s => s.id === area.specialisationId) || {
          id: area.specialisationId,
          name: area.specialisationName || 'Unknown',
          category: '',
          parentId: null,
          icon: null,
          description: null
        }
      })) || firm.practiceAreas,
      courtAppearances: draftData.courtAppearances?.map((app: any) => ({
        id: app.id || `draft-court-${Math.random()}`,
        courtName: app.courtName,
        jurisdiction: app.jurisdiction,
        appearanceCount: app.appearanceCount || ''
      })) || courtAppearances,
      languages: draftData.languages?.map((lang: any) => ({
        id: lang.id || `draft-lang-${Math.random()}`,
        languageName: lang.languageName,
        proficiencyLevel: lang.proficiencyLevel
      })) || languages,
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/firm/profile">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Link>
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isNewProfile ? 'Create Firm Profile' : 'Edit Firm Profile'}
        </h1>
        <p className="text-slate-600 mt-2">
          {isNewProfile 
            ? 'Set up your firm profile to start building your team and receiving reviews' 
            : 'Update your firm information'}
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
      <FirmProfileForm
        firm={profileData}
        specialisations={allSpecialisations}
        userId={session.user.id}
      />
    </div>
  )
}