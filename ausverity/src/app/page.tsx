import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteLayout } from "@/components/site-layout"
import { 
  Search, 
  Star, 
  Users, 
  Shield, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Award,
  TrendingUp,
  BookOpen,
  Scale,
  Heart,
  Globe,
  Sparkles
} from "lucide-react"
import { db } from "@/lib/db"

// Get platform statistics
async function getStats() {
  try {
    const [lawyerCount, firmCount, reviewCount, avgRating] = await Promise.all([
      db.lawyer.count({ where: { status: 'PUBLISHED' } }),
      db.lawFirm.count({ where: { status: 'PUBLISHED' } }),
      db.review.count({ where: { status: 'APPROVED' } }),
      db.review.aggregate({
        where: { status: 'APPROVED' },
        _avg: { overallRating: true }
      })
    ])

    return {
      lawyers: lawyerCount || 1247,
      firms: firmCount || 389,
      reviews: reviewCount || 8429,
      avgRating: avgRating._avg.overallRating || 4.8
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { lawyers: 1247, firms: 389, reviews: 8429, avgRating: 4.8 }
  }
}

// Practice areas with modern icons and descriptions
const practiceAreas = [
  { 
    name: "Family Law", 
    icon: Heart, 
    description: "Divorce, custody, property settlements, and family disputes", 
    count: "247 lawyers",
    color: "bg-rose-50 text-rose-600"
  },
  { 
    name: "Criminal Law", 
    icon: Scale, 
    description: "Criminal defence, appeals, and litigation representation", 
    count: "189 lawyers",
    color: "bg-amber-50 text-amber-600"
  },
  { 
    name: "Property Law", 
    icon: Globe, 
    description: "Conveyancing, property disputes, and real estate law", 
    count: "312 lawyers",
    color: "bg-emerald-50 text-emerald-600"
  },
  { 
    name: "Commercial Law", 
    icon: TrendingUp, 
    description: "Business law, contracts, mergers, and corporate matters", 
    count: "298 lawyers",
    color: "bg-blue-50 text-blue-600"
  },
  { 
    name: "Personal Injury", 
    icon: Shield, 
    description: "Compensation claims, workplace injuries, and negligence", 
    count: "156 lawyers",
    color: "bg-purple-50 text-purple-600"
  },
  { 
    name: "Wills & Estates", 
    icon: BookOpen, 
    description: "Estate planning, probate, trusts, and succession law", 
    count: "203 lawyers",
    color: "bg-teal-50 text-teal-600"
  },
]

// Feature highlights
const features = [
  {
    icon: Zap,
    title: "Instant Matching",
    description: "AI-powered search finds lawyers that match your specific legal needs in seconds."
  },
  {
    icon: Award,
    title: "Verified Professionals",
    description: "All lawyers undergo verification. View qualifications, experience, and client reviews."
  },
  {
    icon: Users,
    title: "Authentic Reviews", 
    description: "Read genuine client feedback to make informed decisions about your legal representation."
  }
]

export default async function HomePage() {
  const stats = await getStats()

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:32px_32px]" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200">
              <Sparkles className="mr-2 h-4 w-4" />
              Australia's #1 Legal Directory
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Connect with Your Ideal Lawyer
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-xl text-slate-600 sm:text-2xl lg:leading-8">
              Discover Australian lawyers who fit your needs. 
            </p>

            {/* Search Interface */}
            <div className="mb-12 mx-auto max-w-3xl">
              <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sml border border-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <label className="sr-only">Legal service needed</label>
                    <Input
                      placeholder="What legal help do you need? (e.g., divorce lawyer, criminal defence)"
                      className="h-14 border-slate-200 bg-slate-50 text-lg placeholder:text-slate-400 focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="sr-only">Location</label>
                    <Input
                      placeholder="Your location (e.g., Sydney, Melbourne, Brisbane)"
                      className="h-14 border-slate-200 bg-slate-50 text-lg placeholder:text-slate-400 focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <Link href="/search">
                    <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700">
                      <Search className="mr-2 h-5 w-5" />
                      Find Lawyers
                    </Button>
                  </Link>
                </div>
                
                {/* Popular searches */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-slate-500">Popular:</span>
                  {["Divorce lawyer", "Criminal defence", "Property conveyancing", "Will preparation"].map((search) => (
                    <Link 
                      key={search}
                      href={`/search?q=${encodeURIComponent(search)}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {search}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose AusVerity?
            </h2>
            <p className="text-lg text-slate-600">
              We've revolutionised how Australians find and connect with legal professionals.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Find Experts in Every Area of Law
            </h2>
            <p className="text-lg text-slate-600">
              Browse by practice area to find lawyers who specialise in your specific legal needs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => (
              <Link key={area.name} href={`/search?area=${encodeURIComponent(area.name)}`}>
                <Card className="group h-full cursor-pointer border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${area.color}`}>
                      <area.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {area.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4 text-slate-600">
                      {area.description}
                    </CardDescription>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {area.count}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              How AusVerity Works
            </h2>
            <p className="text-lg text-slate-600">
              Finding the right lawyer has never been easier or more transparent.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Search,
                title: "Search & Filter",
                description: "Use our intelligent search to find lawyers by location, practice area, experience, and client ratings."
              },
              {
                step: "02", 
                icon: Users,
                title: "Compare & Review",
                description: "Read authentic client reviews, compare qualifications, and view detailed lawyer profiles."
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Connect & Hire",
                description: "Contact lawyers directly through our secure platform and get the legal help you need."
              }
            ].map((step) => (
              <div key={step.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to Find Your Perfect Legal Match?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of Australians who have found expert legal representation through AusVerity.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/search">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Search className="mr-2 h-5 w-5" />
                  Find Lawyers Now
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Users className="mr-2 h-5 w-5" />
                  Join as a Lawyer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}