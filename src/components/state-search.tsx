"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { getLawyerUrl, getFirmUrl } from "@/lib/utils/url-helpers"
import {
  Search,
  Star,
  MapPin,
  Users,
  Building2,
  Loader2,
  X,
  CheckCircle,
  Filter,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronRight
} from "lucide-react"

interface SearchResult {
  id: string
  slug?: string
  type: 'lawyer' | 'firm'
  name: string
  firstName?: string
  lastName?: string
  firm?: {
    id: string
    name: string
  }
  location: {
    city: string
    state: string
  }
  specializations: string[]
  avgRating: number
  reviewCount: number
  yearsExperience?: number
  photoUrl?: string
  logoUrl?: string
  verified: boolean
}

interface StateSearchProps {
  stateCode: string
  stateName: string
  practiceArea?: string // Optional: if provided, filters by this practice area and hides the practice area selector
}

// Practice areas organized by category
const practiceAreasData: Record<string, string[]> = {
  "Family Law": [
    "Divorce & Separation",
    "Child Custody & Parenting",
    "Property Settlement",
    "Spousal Maintenance",
    "De Facto Relationships",
    "Adoption",
    "Domestic Violence & AVO"
  ],
  "Criminal Law": [
    "Drink Driving & Traffic Offences",
    "Assault & Violence",
    "Drug Offences",
    "Fraud & White Collar Crime",
    "Sexual Offences",
    "Theft & Property Crimes",
    "Appeals"
  ],
  "Property Law": [
    "Conveyancing",
    "Residential Property",
    "Commercial Property",
    "Property Development",
    "Leasing & Tenancy",
    "Strata & Body Corporate",
    "Property Disputes"
  ],
  "Wills & Estates": [
    "Will Drafting",
    "Estate Planning",
    "Probate & Administration",
    "Contested Wills",
    "Powers of Attorney",
    "Guardianship",
    "Trust Law"
  ],
  "Employment Law": [
    "Unfair Dismissal",
    "Workplace Discrimination",
    "Workplace Bullying",
    "Employment Contracts",
    "Workers Compensation",
    "Redundancy",
    "Workplace Safety"
  ],
  "Personal Injury": [
    "Motor Vehicle Accidents",
    "Medical Negligence",
    "Public Liability Claims",
    "Work Injury Compensation",
    "Total & Permanent Disability (TPD)",
    "Dust Diseases"
  ],
  "Business Law": [
    "Commercial Law",
    "Company Law",
    "Contract Law",
    "Business Formation & Structure",
    "Mergers & Acquisitions",
    "Commercial Disputes",
    "Business Sales & Purchases",
    "Franchising",
    "Partnership Agreements"
  ],
  "Immigration Law": [
    "Visa Applications",
    "Skilled Migration",
    "Family Migration",
    "Business Migration",
    "Citizenship",
    "Visa Refusals & Appeals",
    "Deportation & Removal"
  ],
  "Litigation": [
    "Civil Litigation",
    "Commercial Litigation",
    "Mediation & Alternative Dispute Resolution",
    "Debt Recovery",
    "Building & Construction Disputes",
    "Defamation"
  ],
  "Bankruptcy & Insolvency": [
    "Bankruptcy",
    "Insolvency",
    "Liquidation",
    "Voluntary Administration",
    "Debt Agreements"
  ],
  "Intellectual Property": [
    "Trademark Law",
    "Copyright Law",
    "Patent Law",
    "Trade Secrets"
  ],
  "Tax Law": [
    "Income Tax",
    "GST",
    "Tax Disputes",
    "Tax Planning"
  ],
  "Environmental Law": [
    "Planning & Development",
    "Native Title",
    "Mining & Resources"
  ],
  "Administrative Law": [
    "Government Law",
    "Constitutional Law",
    "Freedom of Information"
  ],
  "Other": [
    "Aviation Law",
    "Banking & Finance Law",
    "Competition & Consumer Law",
    "Entertainment & Media Law",
    "Health & Medical Law",
    "Insurance Law",
    "Privacy Law",
    "Sports Law",
    "Superannuation Law",
    "Technology & IT Law",
    "Telecommunications Law"
  ]
}

const primaryCategories = Object.keys(practiceAreasData)

export function StateSearch({ stateCode, stateName, practiceArea }: StateSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [resultType, setResultType] = useState<'all' | 'lawyer' | 'firm'>('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedAreas, setSelectedAreas] = useState<string[]>(() => {
    // If practiceArea is provided, pre-populate with all subcategories
    if (practiceArea && practiceAreasData[practiceArea]) {
      return [practiceArea, ...practiceAreasData[practiceArea]]
    }
    return []
  })
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState([0])
  const [minExperience, setMinExperience] = useState([0])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(async () => {
    setIsLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      if (query) params.set('query', query)
      if (location) params.set('location', location)
      params.set('state', stateCode.toUpperCase())
      if (selectedAreas.length > 0) params.set('areas', selectedAreas.join(','))
      if (minRating[0] > 0) params.set('rating', minRating[0].toString())
      if (minExperience[0] > 0) params.set('experience', minExperience[0].toString())
      params.set('type', resultType)
      params.set('sort', sortBy)

      const response = await fetch(`/api/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [query, location, stateCode, selectedAreas, minRating, minExperience, resultType, sortBy])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const clearSearch = () => {
    setQuery('')
    setLocation('')
    setResultType('all')
    setSortBy('relevance')
    setSelectedAreas([])
    setMinRating([0])
    setMinExperience([0])
    setResults([])
    setHasSearched(false)
  }

  const togglePracticeArea = (area: string) => {
    setSelectedAreas(prev => {
      const newAreas = prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
      return newAreas
    })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Initial search on mount
  useEffect(() => {
    performSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-search when filters change (after initial search)
  useEffect(() => {
    if (hasSearched) {
      performSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAreas, minRating, minExperience, resultType, sortBy, hasSearched])

  const renderResultCard = (result: SearchResult) => {
    const isLawyer = result.type === 'lawyer'

    let profileUrl: string
    if (isLawyer) {
      profileUrl = getLawyerUrl({ slug: result.slug, state: result.location.state })
        || `/lawyer/${result.slug || result.id}`
    } else {
      profileUrl = getFirmUrl({ slug: result.slug, locations: [result.location] })
        || `/firm/${result.slug || result.id}`
    }

    return (
      <Link key={result.id} href={profileUrl} className="block">
        <Card className="border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              {/* Profile Image/Logo */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-300 shrink-0">
                {(isLawyer ? result.photoUrl : result.logoUrl) ? (
                  <Image
                    src={isLawyer ? result.photoUrl! : result.logoUrl!}
                    alt={result.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400">
                    {isLawyer ? <Users className="w-8 h-8" /> : <Building2 className="w-8 h-8" />}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-slate-900 truncate">{result.name}</h3>
                    {isLawyer && result.firm && (
                      <p className="text-sm text-slate-600 truncate">{result.firm.name}</p>
                    )}
                  </div>
                  {result.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 shrink-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{result.location.city}, {result.location.state}</span>
                </div>

                {/* Specializations */}
                {result.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {result.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs border-slate-300">
                        {spec}
                      </Badge>
                    ))}
                    {result.specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                        +{result.specializations.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Rating */}
                {result.reviewCount > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-slate-900">{result.avgRating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {result.reviewCount} review{result.reviewCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <>
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder={`Search lawyers and firms in ${stateName}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="lg:w-64">
                <Input
                  placeholder="City or postcode"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(selectedAreas.length > 0 || minRating[0] > 0 || minExperience[0] > 0) && (
                  <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
                    {selectedAreas.length + (minRating[0] > 0 ? 1 : 0) + (minExperience[0] > 0 ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 hidden sm:block" />
                <Select value={resultType} onValueChange={(value: 'all' | 'lawyer' | 'firm') => setResultType(value)}>
                  <SelectTrigger className="w-32 sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="lawyer">Lawyers</SelectItem>
                    <SelectItem value="firm">Firms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400 hidden sm:block" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 sm:w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="experience">Most Experience</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(query || location || selectedAreas.length > 0 || minRating[0] > 0 || minExperience[0] > 0) && (
                <Button variant="ghost" onClick={clearSearch} className="text-slate-600 hover:text-red-600 hover:bg-red-50 ml-auto">
                  <X className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Results with Sidebar */}
      <div className="bg-slate-50">
        <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="lg:sticky lg:top-6 space-y-4">
                <Card className="border-slate-200 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="w-5 h-5 text-slate-600" />
                      Refine Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Practice Areas - Hidden when practiceArea prop is provided */}
                    {!practiceArea && (
                      <div>
                        <label className="text-sm font-medium text-slate-900 mb-3 block">
                          Practice Areas
                        </label>
                        <div className="space-y-1 max-h-96 overflow-y-auto">
                          {primaryCategories.map((category) => (
                            <div key={category}>
                              {/* Primary Category */}
                              <button
                                type="button"
                                onClick={() => {
                                  togglePracticeArea(category)
                                  toggleCategory(category)
                                }}
                                className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`state-cat-${category}`}
                                    checked={selectedAreas.includes(category)}
                                    onCheckedChange={() => {}}
                                    onClick={(e) => e.preventDefault()}
                                  />
                                  <span>{category}</span>
                                </div>
                                {expandedCategories.includes(category) ? (
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-500" />
                                )}
                              </button>

                              {/* Subcategories */}
                              {expandedCategories.includes(category) && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {practiceAreasData[category].map((subArea) => (
                                    <div key={subArea} className="flex items-center space-x-2 py-1.5">
                                      <Checkbox
                                        id={`state-sub-${subArea}`}
                                        checked={selectedAreas.includes(subArea)}
                                        onCheckedChange={() => togglePracticeArea(subArea)}
                                      />
                                      <label htmlFor={`state-sub-${subArea}`} className="text-sm text-slate-600 cursor-pointer">
                                        {subArea}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Minimum Rating */}
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-3 block">
                        Minimum Rating: {minRating[0].toFixed(1)}★
                      </label>
                      <Slider
                        value={minRating}
                        onValueChange={setMinRating}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Minimum Experience */}
                    {resultType !== 'firm' && (
                      <div>
                        <label className="text-sm font-medium text-slate-900 mb-3 block">
                          Minimum Experience: {minExperience[0]} years
                        </label>
                        <Slider
                          value={minExperience}
                          onValueChange={setMinExperience}
                          max={30}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {hasSearched && (
                <>
                  {/* Results Header */}
                  <div className="mb-6">
                    <p className="text-slate-600">
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Searching...
                        </span>
                      ) : (
                        <span className="font-medium">
                          {results.length} {results.length === 1 ? 'result' : 'results'} found in {stateName}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Results Grid */}
                  {!isLoading && (
                    <>
                      {results.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {results.map(renderResultCard)}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                          <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Search className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                            <p className="text-slate-600 mb-6">
                              We couldn't find any legal professionals matching your criteria in {stateName}. Try adjusting your filters or search terms.
                            </p>
                            <Button onClick={clearSearch} variant="outline" size="lg">
                              <X className="w-4 h-4 mr-2" />
                              Clear All Filters
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
