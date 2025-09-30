import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContactForm } from "@/components/contact-form"
import { ContactUpgradePrompt } from "@/components/contact-upgrade-prompt"
import { ShareButton } from "@/components/lawyer-profile/share-button"
import {
  Star,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Building2,
  Shield,
  Pencil
} from "lucide-react"
import type { LawyerProfileData } from "@/lib/data/lawyers"

interface LawyerHeaderProps {
  lawyer: NonNullable<LawyerProfileData>
}

export function LawyerHeader({ lawyer }: LawyerHeaderProps) {
  const fullName = `${lawyer.firstName} ${lawyer.lastName}`
  const primaryLocation = lawyer.firm?.locations?.[0]

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-12 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex flex-col sm:flex-row gap-6 flex-1 items-center sm:items-start text-center sm:text-left">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {lawyer.photoUrl ? (
                  <Image
                    src={lawyer.photoUrl}
                    alt={fullName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <Users className="w-16 h-16 text-slate-400" />
                )}
              </div>
              {lawyer.isPaidUser && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-4 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{fullName}</h1>
                {lawyer.isPaidUser && (
                  <Badge className="bg-blue-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {lawyer.yearsExperience && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    {lawyer.yearsExperience}+ Years Experience
                  </Badge>
                )}
              </div>
              {lawyer.position && (
                <p className="text-lg md:text-xl text-slate-600">{lawyer.position}</p>
              )}

              {/* Prominent Rating Display */}
              {lawyer.totalReviews > 0 && (
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(lawyer.avgRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{lawyer.avgRating.toFixed(1)}</span>
                  <span className="text-slate-600">({lawyer.totalReviews} {lawyer.totalReviews === 1 ? 'review' : 'reviews'})</span>
                </div>
              )}

              {lawyer.firm && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Building2 className="w-4 h-4" />
                  {lawyer.firm.slug ? (
                    <Link href={`/firm/${lawyer.firm.slug}`} className="hover:underline font-medium">
                      {lawyer.firm.name}
                    </Link>
                  ) : (
                    <span className="font-medium">{lawyer.firm.name}</span>
                  )}
                </div>
              )}

              {primaryLocation && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{primaryLocation.city}, {primaryLocation.state}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 flex flex-col items-center w-full lg:ml-auto lg:items-stretch lg:w-52">
            <div className="w-1/2 lg:w-full">
              {lawyer.isPaidUser ? (
                <ContactForm
                  recipientType="lawyer"
                  recipientName={fullName}
                  recipientId={lawyer.id}
                  firmName={lawyer.firm?.name}
                  isPaidUser={lawyer.isPaidUser}
                  trigger={
                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                      Contact Lawyer
                    </Button>
                  }
                />
              ) : (
                <ContactUpgradePrompt
                  recipientType="lawyer"
                  recipientName={fullName}
                  recipientId={lawyer.id}
                  trigger={
                    <Button variant="outline" size="lg" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
                      Contact Lawyer
                    </Button>
                  }
                />
              )}
            </div>

            <div className="w-1/2 lg:w-full">
              <Link href={`/submit-review?type=lawyer&id=${lawyer.id}&name=${encodeURIComponent(fullName)}&slug=${lawyer.slug}`}>
                <Button variant="outline" size="lg" className="w-full">
                  <Pencil className="w-5 h-5 mr-2" /> Write a Review
                </Button>
              </Link>
            </div>

            <div className="w-1/2 lg:w-full">
              <ShareButton
                lawyerName={fullName}
                profileUrl={`/lawyer/${lawyer.slug}`}
                variant="ghost"
                size="lg"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}