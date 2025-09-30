import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star } from "lucide-react"
import type { FirmProfileData } from "@/lib/data/firms"

type Lawyer = FirmProfileData['lawyers'][0]

interface TeamSectionProps {
  lawyers: Lawyer[]
}

export function TeamSection({ lawyers }: TeamSectionProps) {
  if (!lawyers || lawyers.length === 0) {
    return null
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Our Team ({lawyers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lawyers.map((lawyer) => {
            // This calculation is simple enough to keep here
            const lawyerAvgRating = lawyer.reviews.length > 0
              ? lawyer.reviews.reduce((sum, r) => sum + r.overallRating, 0) / lawyer.reviews.length
              : 0
            const fullName = `${lawyer.firstName} ${lawyer.lastName}`

            return (
              <Link key={lawyer.id} href={lawyer.slug ? `/lawyer/${lawyer.slug}` : `/lawyers/${lawyer.id}`}>
                <div className="border border-slate-200 rounded-lg p-4 h-full hover:shadow-md hover:border-blue-200 transition-all cursor-pointer bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {lawyer.photoUrl ? (
                        <Image src={lawyer.photoUrl} alt={fullName} width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-7 h-7 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">{fullName}</h4>
                      {lawyer.position && (
                        <p className="text-sm text-slate-600 truncate mt-0.5">{lawyer.position}</p>
                      )}
                      {lawyer.reviews.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-slate-900">{lawyerAvgRating.toFixed(1)}</span>
                          <span className="text-xs text-slate-500">({lawyer.reviews.length})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}