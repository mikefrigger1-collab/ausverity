"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { SiteLayout } from "@/components/site-layout"
import {
  Search,
  Star,
  MapPin,
  Filter,
  SlidersHorizontal,
  Users,
  Building2,
  Clock,
  Award,
  ChevronDown,
  X,
  Loader2,
  Grid,
  List,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react"

// Types for search results
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
  featured?: boolean
}

// Practice areas for filtering
const practiceAreas = [
  "Family Law",
  "Criminal Law", 
  "Property Law",
  "Commercial Law",
  "Personal Injury",
  "Wills & Estates",
  "Employment Law",
  "Immigration Law",
  "Tax Law",
  "Intellectual Property"
]

// Australian states
const states = [
  "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'all')
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    searchParams.get('areas')?.split(',').filter(Boolean) || []
  )
  const [minRating, setMinRating] = useState([parseFloat(searchParams.get('rating') || '0')])
  const [minExperience, setMinExperience] = useState([parseInt(searchParams.get('experience') || '0')])
  const [resultType, setResultType] = useState<'all' | 'lawyer' | 'firm'>(
    (searchParams.get('type') as 'all' | 'lawyer' | 'firm') || 'all'
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)

  // Real search function using API
  const performSearch = useCallback(async () => {
    console.log('🔍 Performing search with filters:', {
      query,
      location,
      selectedState,
      selectedAreas,
      minRating,
      minExperience,
      resultType,
      sortBy
    })

    setIsLoading(true)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (query) params.set('query', query)
      if (location) params.set('location', location)
      if (selectedState && selectedState !== 'all') params.set('state', selectedState)
      if (selectedAreas.length > 0) params.set('areas', selectedAreas.join(','))
      if (minRating[0] > 0) params.set('rating', minRating[0].toString())
      if (minExperience[0] > 0) params.set('experience', minExperience[0].toString())
      params.set('type', resultType)
      params.set('sort', sortBy)

      const apiUrl = `/api/search?${params.toString()}`
      console.log('🌐 Fetching:', apiUrl)

      const response = await fetch(apiUrl)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Search failed')
      }

      const data = await response.json()

      console.log('✅ Search results:', {
        count: data.results?.length || 0,
        total: data.total
      })

      setResults(data.results || [])
      setTotalResults(data.total || 0)
    } catch (error) {
      console.error('❌ Search error:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [query, location, selectedState, selectedAreas, minRating, minExperience, resultType, sortBy])

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('location', location)
    if (selectedState && selectedState !== 'all') params.set('state', selectedState)
    if (selectedAreas.length > 0) params.set('areas', selectedAreas.join(','))
    if (minRating[0] > 0) params.set('rating', minRating[0].toString())
    if (minExperience[0] > 0) params.set('experience', minExperience[0].toString())
    if (resultType !== 'all') params.set('type', resultType)
    if (sortBy !== 'relevance') params.set('sort', sortBy)
    
    router.replace(`/search?${params.toString()}`)
  }, [query, location, selectedState, selectedAreas, minRating, minExperience, resultType, sortBy, router])

  // Perform search when filters change
  useEffect(() => {
    performSearch()
    updateURL()
  }, [performSearch, updateURL])

  // Handle practice area filter
  const togglePracticeArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setQuery('')
    setLocation('')
    setSelectedState('all')
    setSelectedAreas([])
    setMinRating([0])
    setMinExperience([0])
    setResultType('all')
    setSortBy('relevance')
  }

  // Render result card
  const renderResultCard = (result: SearchResult) => {
    const isLawyer = result.type === 'lawyer'
    const profileUrl = isLawyer
    ? `/lawyer/${result.slug || result.id}` // Fallback to id if slug missing
    : `/firm/${result.slug || result.id}` // Fallback to id if slug missing

    return (
      <Link key={result.id} href={profileUrl} className="block h-full w-full">
        <Card className={`h-full w-full border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden ${result.featured ? 'ring-2 ring-blue-400 bg-gradient-to-br from-blue-50 to-white' : 'hover:shadow-md'}`}>
          {result.featured && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5">
              <Award className="w-3 h-3 shrink-0" />
              <span className="truncate">Featured Professional</span>
            </div>
          )}
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              {/* Profile Image/Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-300 shrink-0 shadow-sm">
                {(isLawyer ? result.photoUrl : result.logoUrl) ? (
                  <Image
                    src={isLawyer ? result.photoUrl! : result.logoUrl!}
                    alt={result.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400">
                    {isLawyer ? <Users className="w-8 h-8 sm:w-10 sm:h-10" /> : <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate leading-tight">{result.name}</h3>
                    {isLawyer && result.firm && (
                      <p className="text-xs sm:text-sm text-slate-600 truncate mt-0.5">{result.firm.name}</p>
                    )}
                  </div>
                  {result.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 shrink-0 font-semibold">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{result.location.city}, {result.location.state}</span>
                </div>

                {/* Experience */}
                {isLawyer && result.yearsExperience && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{result.yearsExperience} years experience</span>
                  </div>
                )}

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {result.specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs font-medium border-slate-300 bg-white">
                      {spec}
                    </Badge>
                  ))}
                  {result.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs font-medium border-blue-300 text-blue-700 bg-blue-50">
                      +{result.specializations.length - 2} more
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-slate-900">{result.avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {result.reviewCount} review{result.reviewCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50 overflow-x-hidden">
        {/* Search Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search for lawyers, firms, or practice areas..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 text-lg border-slate-300"
                />
              </div>
              <div className="lg:w-64">
                <Input
                  placeholder="Location (city, state, postcode)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 text-lg border-slate-300"
                />
              </div>
              <Button 
                onClick={performSearch}
                size="lg" 
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
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
                <Button variant="ghost" onClick={clearFilters} className="text-slate-600 hover:text-red-600 hover:bg-red-50 ml-auto">
                  <X className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>

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
                    {/* State Filter */}
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-2 block">
                        State/Territory
                      </label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger>
                          <SelectValue placeholder="All states" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Practice Areas */}
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-3 block">
                        Practice Areas
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {practiceAreas.map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={area}
                              checked={selectedAreas.includes(area)}
                              onCheckedChange={() => togglePracticeArea(area)}
                            />
                            <label htmlFor={area} className="text-sm text-slate-700 cursor-pointer">
                              {area}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

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

                    {/* Minimum Experience - Only show for lawyers */}
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
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">
                    {query ? `Results for "${query}"` : 'Browse Legal Professionals'}
                  </h1>
                  <p className="text-slate-600 mt-1">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      <span className="font-medium">
                        {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex items-center gap-2"
                  >
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </Button>
                </div>
              </div>

              {/* Results Grid */}
              {isLoading ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-lg text-slate-600 font-medium">Searching for legal professionals...</p>
                  <p className="text-sm text-slate-500 mt-2">This won't take long</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className={`grid gap-4 w-full ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {results.map(renderResultCard)}
                  </div>

                  {/* Results Summary */}
                  <div className="mt-8 text-center text-sm text-slate-500">
                    Showing {results.length} of {totalResults} {totalResults === 1 ? 'result' : 'results'}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                    <p className="text-slate-600 mb-6">
                      We couldn't find any legal professionals matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button onClick={clearFilters} variant="outline" size="lg">
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Load More */}
              {results.length > 0 && !isLoading && results.length < totalResults && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" className="min-w-48">
                    Load More Results
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
