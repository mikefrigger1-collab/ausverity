import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getLawyerProfile } from "@/lib/data/lawyers"
import { isValidStateCode, getStateByCode, normalizeStateCode } from "@/lib/constants/states"
import { SiteLayout } from "@/components/site-layout"
import { Skeleton } from "@/components/ui/skeleton"

import { LawyerHeader } from "@/components/lawyer-profile/lawyer-header"
import { AboutSection } from "@/components/lawyer-profile/about-section"
import { SpecialisationsSection } from "@/components/lawyer-profile/specialisations-section"
import { ReviewsSection } from "@/components/lawyer-profile/reviews-section"
import { Sidebar } from "@/components/lawyer-profile/sidebar"
import { MobileActionBar } from "@/components/lawyer-profile/mobile-action-bar"

interface LawyerProfilePageProps {
  params: Promise<{ state: string; slug: string }>
}

// Generate static params for all valid state codes
export async function generateStaticParams() {
  const states = ['nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt']
  // Return empty array to let Next.js generate pages on-demand
  // This prevents build-time generation of all possible combinations
  return []
}

// Metadata for SEO
export async function generateMetadata({ params }: LawyerProfilePageProps) {
  const { state, slug } = await params

  if (!isValidStateCode(state)) {
    return {
      title: 'Invalid State',
    }
  }

  const lawyer = await getLawyerProfile(slug)

  if (!lawyer) {
    return {
      title: 'Lawyer Not Found',
    }
  }

  // Verify lawyer is in the correct state
  const lawyerStateCode = normalizeStateCode(lawyer.state || '')
  if (lawyerStateCode !== state) {
    return {
      title: 'Lawyer Not Found',
    }
  }

  const fullName = `${lawyer.firstName} ${lawyer.lastName}`
  const specialisations = lawyer.specialisations.map(s => s.specialisation.name).join(', ')
  const location = lawyer.firm?.locations?.[0]
  const locationStr = location ? `${location.city}, ${location.state}` : 'Australia'
  const stateInfo = getStateByCode(state)

  return {
    title: `${fullName} - ${lawyer.position || 'Lawyer'} in ${stateInfo?.name} | AusVerity`,
    description: `View ${fullName}'s profile on AusVerity. ${lawyer.yearsExperience ? `${lawyer.yearsExperience}+ years experience` : 'Experienced lawyer'} specialising in ${specialisations}. Based in ${locationStr}.${lawyer.totalReviews > 0 ? ` ${lawyer.avgRating.toFixed(1)} stars from ${lawyer.totalReviews} reviews.` : ''}`,
    openGraph: {
      title: `${fullName} - ${lawyer.position || 'Lawyer'} in ${stateInfo?.name}`,
      description: `${specialisations} | ${locationStr}`,
      images: lawyer.photoUrl ? [lawyer.photoUrl] : [],
    },
  }
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const { state, slug } = await params

  // Validate state code
  if (!isValidStateCode(state)) {
    notFound()
  }

  const lawyer = await getLawyerProfile(slug)

  if (!lawyer) {
    notFound()
  }

  // Verify lawyer is in the correct state
  const lawyerStateCode = normalizeStateCode(lawyer.state || '')
  if (lawyerStateCode !== state) {
    notFound()
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
        <LawyerHeader lawyer={lawyer} />

        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            <main className="lg:col-span-2 space-y-8 md:space-y-10">
              <AboutSection bio={lawyer.bio} firstName={lawyer.firstName} />
              <SpecialisationsSection specialisations={lawyer.specialisations} />

              <Suspense fallback={<ReviewsSkeleton />}>
                <ReviewsSection
                  lawyerId={lawyer.id}
                  initialReviews={lawyer.reviews}
                  totalReviews={lawyer.totalReviews}
                  ratingBreakdown={lawyer.ratingBreakdown}
                  lawyerFirstName={lawyer.firstName}
                />
              </Suspense>
            </main>

            <aside className="space-y-6 md:space-y-7 lg:sticky lg:top-6 self-start">
              <Sidebar lawyer={lawyer} />
            </aside>
          </div>
        </div>

        <MobileActionBar lawyer={lawyer} />
      </div>
    </SiteLayout>
  )
}

// Loading skeleton for reviews section
function ReviewsSkeleton() {
  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
