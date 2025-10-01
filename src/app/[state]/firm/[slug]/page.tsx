import { notFound } from "next/navigation"
import { getFirmProfile } from "@/lib/data/firms"
import { isValidStateCode, getStateByCode, normalizeStateCode } from "@/lib/constants/states"
import { SiteLayout } from "@/components/site-layout"

import { FirmHeader } from "@/components/firm-profile/firm-header"
import { ReviewsSection } from "@/components/firm-profile/reviews-section"
import { AboutSection } from "@/components/firm-profile/about-section"
import { TeamSection } from "@/components/firm-profile/team-section"
import { Sidebar } from "@/components/firm-profile/sidebar"

interface FirmProfilePageProps {
  params: Promise<{ state: string; slug: string }>
}

// Generate static params for all valid state codes
export async function generateStaticParams() {
  // Return empty array to let Next.js generate pages on-demand
  return []
}

// Metadata for SEO
export async function generateMetadata({ params }: FirmProfilePageProps) {
  const { state, slug } = await params

  if (!isValidStateCode(state)) {
    return {
      title: 'Invalid State',
    }
  }

  const firm = await getFirmProfile(slug)

  if (!firm) {
    return {
      title: 'Firm Not Found',
    }
  }

  // Verify firm has a location in the correct state
  const firmInState = firm.locations.some(location =>
    normalizeStateCode(location.state) === state
  )

  if (!firmInState) {
    return {
      title: 'Firm Not Found',
    }
  }

  const primaryLocation = firm.locations.find(l => l.isPrimary) || firm.locations[0]
  const locationStr = primaryLocation ? `${primaryLocation.city}, ${primaryLocation.state}` : 'Australia'
  const stateInfo = getStateByCode(state)
  const practiceAreas = firm.practiceAreas.map(pa => pa.specialisation.name).join(', ')

  return {
    title: `${firm.name} - Law Firm in ${stateInfo?.name} | AusVerity`,
    description: `${firm.name} is a law firm based in ${locationStr}${practiceAreas ? `, specialising in ${practiceAreas}` : ''}.${firm.totalReviews > 0 ? ` ${firm.avgRating.toFixed(1)} stars from ${firm.totalReviews} reviews.` : ''}${firm.description ? ` ${firm.description.substring(0, 100)}...` : ''}`,
    openGraph: {
      title: `${firm.name} - Law Firm in ${stateInfo?.name}`,
      description: `${locationStr}${practiceAreas ? ` | ${practiceAreas}` : ''}`,
      images: firm.logoUrl ? [firm.logoUrl] : [],
    },
  }
}

export default async function FirmProfilePage({ params }: FirmProfilePageProps) {
  const { state, slug } = await params

  // Validate state code
  if (!isValidStateCode(state)) {
    notFound()
  }

  const firm = await getFirmProfile(slug)

  if (!firm) {
    notFound()
  }

  // Verify firm has a location in the correct state
  const firmInState = firm.locations.some(location =>
    normalizeStateCode(location.state) === state
  )

  if (!firmInState) {
    notFound()
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
        <FirmHeader firm={firm} />

        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            <main className="lg:col-span-2 space-y-8 md:space-y-10">
              <AboutSection description={firm.description} name={firm.name} />
              <TeamSection lawyers={firm.lawyers} />

              <ReviewsSection
                firmId={firm.id}
                initialReviews={firm.reviews}
                totalReviews={firm.totalReviews}
                ratingBreakdown={firm.ratingBreakdown}
                firmName={firm.name}
              />
            </main>

            <aside className="space-y-6 md:space-y-7 lg:sticky lg:top-6 self-start">
              <Sidebar firm={firm} />
            </aside>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
