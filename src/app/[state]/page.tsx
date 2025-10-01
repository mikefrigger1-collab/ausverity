import { notFound } from "next/navigation"
import { isValidStateCode, getStateByCode, AUSTRALIAN_STATES } from "@/lib/constants/states"
import { PRACTICE_AREA_CATEGORIES } from "@/lib/constants/practice-areas"
import { SiteLayout } from "@/components/site-layout"
import { StateSearch } from "@/components/state-search"
import { db } from "@/lib/db"
import Link from "next/link"

interface StatePageProps {
  params: Promise<{ state: string }>
}

// Generate static params for all states
export async function generateStaticParams() {
  return AUSTRALIAN_STATES.map(state => ({
    state: state.code,
  }))
}

// Metadata for SEO
export async function generateMetadata({ params }: StatePageProps) {
  const { state } = await params

  if (!isValidStateCode(state)) {
    return {
      title: 'Invalid State',
    }
  }

  const stateInfo = getStateByCode(state)

  return {
    title: `Lawyers and Law Firms in ${stateInfo?.name} | AusVerity`,
    description: `Find verified lawyers and law firms in ${stateInfo?.name}. Read reviews, compare expertise, and connect with legal professionals across ${stateInfo?.shortName}.`,
    openGraph: {
      title: `Lawyers and Law Firms in ${stateInfo?.name}`,
      description: `Find verified legal professionals in ${stateInfo?.shortName}`,
    },
  }
}

export default async function StatePage({ params }: StatePageProps) {
  const { state } = await params

  // Validate state code
  if (!isValidStateCode(state)) {
    notFound()
  }

  const stateInfo = getStateByCode(state)

  if (!stateInfo) {
    notFound()
  }

  // Fetch featured lawyers and firms in this state
  const [lawyers, firms] = await Promise.all([
    db.lawyer.findMany({
      where: {
        state: {
          in: [stateInfo.code.toUpperCase(), stateInfo.shortName, stateInfo.name],
          mode: 'insensitive'
        },
        status: 'PUBLISHED'
      },
      take: 6,
      orderBy: [
        { subscriptions: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
      include: {
        specialisations: {
          include: {
            specialisation: true
          }
        },
        firm: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    }),
    db.lawFirm.findMany({
      where: {
        locations: {
          some: {
            state: {
              in: [stateInfo.code.toUpperCase(), stateInfo.shortName, stateInfo.name],
              mode: 'insensitive'
            }
          }
        },
        status: 'PUBLISHED'
      },
      take: 6,
      orderBy: [
        { subscriptions: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
      include: {
        locations: {
          where: { isPrimary: true },
          take: 1
        },
        practiceAreas: {
          include: {
            specialisation: true
          },
          take: 3
        }
      }
    })
  ])

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Lawyers and Law Firms in {stateInfo.name}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              Find verified legal professionals in {stateInfo.shortName}. Browse profiles, read reviews, and connect with experienced lawyers and law firms across {stateInfo.name}.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <StateSearch stateCode={state} stateName={stateInfo.name} />

        {/* Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Practice Areas Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Browse by Practice Area
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRACTICE_AREA_CATEGORIES.map(area => (
                <Link
                  key={area.slug}
                  href={`/${state}/${area.slug}`}
                  className="block bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {area.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {area.description}
                  </p>
                  <span className="text-sm text-blue-600 mt-2 inline-block">
                    Find {area.name.toLowerCase()} lawyers →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Lawyers */}
          {lawyers.length > 0 && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Featured Lawyers in {stateInfo.shortName}
                </h2>
                <Link
                  href={`/search?state=${state}&type=lawyer`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all lawyers →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lawyers.map(lawyer => (
                  <Link
                    key={lawyer.id}
                    href={`/${state}/lawyer/${lawyer.slug}`}
                    className="block bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {lawyer.photoUrl ? (
                        <img
                          src={lawyer.photoUrl}
                          alt={`${lawyer.firstName} ${lawyer.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                          {lawyer.firstName[0]}{lawyer.lastName[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {lawyer.firstName} {lawyer.lastName}
                        </h3>
                        {lawyer.position && (
                          <p className="text-sm text-slate-600">{lawyer.position}</p>
                        )}
                        {lawyer.firm && (
                          <p className="text-sm text-slate-500">{lawyer.firm.name}</p>
                        )}
                        {lawyer.specialisations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {lawyer.specialisations.slice(0, 2).map(spec => (
                              <span
                                key={spec.id}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                              >
                                {spec.specialisation.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Featured Firms */}
          {firms.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Featured Law Firms in {stateInfo.shortName}
                </h2>
                <Link
                  href={`/search?state=${state}&type=firm`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all firms →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {firms.map(firm => {
                  const location = firm.locations[0]
                  return (
                    <Link
                      key={firm.id}
                      href={`/${state}/firm/${firm.slug}`}
                      className="block bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {firm.logoUrl ? (
                          <img
                            src={firm.logoUrl}
                            alt={firm.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
                            {firm.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {firm.name}
                          </h3>
                          {location && (
                            <p className="text-sm text-slate-600">
                              {location.city}, {location.state}
                            </p>
                          )}
                          {firm.practiceAreas.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {firm.practiceAreas.map(pa => (
                                <span
                                  key={pa.id}
                                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                                >
                                  {pa.specialisation.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* No Results */}
          {lawyers.length === 0 && firms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No lawyers or firms found in {stateInfo.name} yet.
              </p>
              <Link
                href="/search"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Search all locations →
              </Link>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
