import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Shield,
  Users,
  Star,
  CheckCircle,
  Target,
  Heart,
  Search,
  TrendingUp,
  Award,
  Globe
} from "lucide-react"

export const metadata = {
  title: 'About AusVerity | Australia\'s Trusted Legal Directory',
  description: 'Learn about AusVerity\'s mission to connect Australians with verified legal professionals. Discover our commitment to transparency, trust, and excellence in legal services.',
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About AusVerity
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Australia's most trusted platform for finding and connecting with verified legal professionals
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Mission Statement */}
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
                    <div className="prose prose-lg text-slate-700 leading-relaxed space-y-4">
                      <p>
                        Finding the right legal professional shouldn't be difficult. At AusVerity, we're transforming how Australians connect with lawyers and law firms by creating a transparent, trustworthy platform built on verified credentials and authentic client experiences.
                      </p>
                      <p>
                        We understand that choosing legal representation is one of the most important decisions you'll make. Whether you're dealing with a family matter, starting a business, purchasing property, or facing legal challenges, having the right legal support can make all the difference. That's why we've created a platform that puts trust, transparency, and quality at the forefront.
                      </p>
                      <p>
                        Our platform empowers you with the information you need to make informed decisions. Browse by practice area, location, experience, and client reviews. Read about each lawyer's expertise, see their track record, and understand their approach before making contact. We believe transparency leads to better outcomes for everyone – clients find the right fit, and legal professionals connect with clients who truly need their services.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Values */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-3 rounded-lg mb-4">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Transparency</h3>
                        <p className="text-slate-600">
                          We provide clear, comprehensive information about each lawyer's experience, specialisations, and client feedback.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-purple-100 p-3 rounded-lg mb-4">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Excellence</h3>
                        <p className="text-slate-600">
                          We showcase legal professionals who demonstrate commitment to quality service and client satisfaction.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-orange-100 p-3 rounded-lg mb-4">
                        <Heart className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Client-Focused</h3>
                        <p className="text-slate-600">
                          Your needs come first. We've built our platform to make finding the right legal help simple and stress-free.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-8 text-center">AusVerity by the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">1,000+</div>
                  <div className="text-blue-100">Verified Lawyers</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Star className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">5,000+</div>
                  <div className="text-blue-100">Client Reviews</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">15+</div>
                  <div className="text-blue-100">Practice Areas</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Globe className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">All</div>
                  <div className="text-blue-100">States & Territories</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Ready to Find Your Legal Professional?
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Browse verified lawyers and law firms across Australia. Search by location, practice area, or expertise to find the perfect match for your legal needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                    <Link href="/search">
                      <Search className="h-5 w-5 mr-2" />
                      Search Lawyers
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8">
                    <Link href="/register">
                      Join as a Legal Professional
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
