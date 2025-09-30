import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Globe, Users, Calendar, CheckCircle, Shield, Pencil, MessageSquare, Building2, ExternalLink } from "lucide-react"
import type { FirmProfileData } from "@/lib/data/firms"

interface FirmHeaderProps {
  firm: NonNullable<FirmProfileData>
}

export function FirmHeader({ firm }: FirmHeaderProps) {
  const primaryLocation = firm.locations.find(loc => loc.isPrimary) || firm.locations[0]

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-12 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex flex-col sm:flex-row gap-6 flex-1 items-center sm:items-start text-center sm:text-left">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden border">
                {firm.logoUrl ? (
                  <Image src={firm.logoUrl} alt={firm.name} width={128} height={128} className="object-contain p-2" priority />
                ) : (
                  <Building2 className="w-16 h-16 text-slate-400" />
                )}
              </div>
              {firm.isPaidUser && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-4 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{firm.name}</h1>
                {firm.isPaidUser && (
                  <Badge className="bg-blue-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>

              {primaryLocation && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{primaryLocation.city}, {primaryLocation.state}</span>
                </div>
              )}

              {/* Prominent Rating Display */}
              {firm.totalReviews > 0 && (
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(firm.avgRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{firm.avgRating.toFixed(1)}</span>
                  <span className="text-slate-600">({firm.totalReviews} {firm.totalReviews === 1 ? 'review' : 'reviews'})</span>
                </div>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-600">
                {firm.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={firm.website.startsWith('http') ? firm.website : `https://${firm.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{firm.totalLawyers} lawyer{firm.totalLawyers !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Established {new Date(firm.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex flex-col items-center w-full lg:ml-auto lg:items-stretch lg:w-52">
            <div className="w-1/2 lg:w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-5 h-5 mr-2" /> Contact Firm
              </Button>
            </div>

            <div className="w-1/2 lg:w-full">
              <Link href={`/submit-review?type=firm&id=${firm.id}&name=${encodeURIComponent(firm.name)}&slug=${firm.slug}`}>
                <Button variant="outline" size="lg" className="w-full">
                  <Pencil className="w-5 h-5 mr-2" /> Write a Review
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}