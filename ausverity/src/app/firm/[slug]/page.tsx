import { notFound } from "next/navigation"
import { getFirmProfile } from "@/lib/data/firms"
import { SiteLayout } from "@/components/site-layout"

import { FirmHeader } from "@/components/firm-profile/firm-header"
import { ReviewsSection } from "@/components/firm-profile/reviews-section"

import { AboutSection } from "@/components/firm-profile/about-section"
import { TeamSection } from "@/components/firm-profile/team-section"
import { Sidebar } from "@/components/firm-profile/sidebar"


interface FirmProfilePageProps {
  params: Promise<{ slug: string }>
  }

export default async function FirmProfilePage({ params }: FirmProfilePageProps) {
  const { slug } = await params
  const firm = await getFirmProfile(slug)

  if (!firm) {
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