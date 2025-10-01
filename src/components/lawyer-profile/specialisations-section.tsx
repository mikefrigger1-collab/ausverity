import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale } from "lucide-react"
import type { LawyerProfileData } from "@/lib/data/lawyers"

type Specialisation = NonNullable<LawyerProfileData>['specialisations'][0]

interface SpecialisationsSectionProps {
  specialisations: Specialisation[]
}

export function SpecialisationsSection({ specialisations }: SpecialisationsSectionProps) {
  if (!specialisations || specialisations.length === 0) {
    return null
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
          <Scale className="w-6 h-6 text-blue-600" />
          Practice Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-3">
          {specialisations.map((spec) => (
            <Link
              key={spec.id}
              href={`/search?specialisation=${encodeURIComponent(spec.specialisation.name)}`}
              className="inline-block transition-transform hover:scale-105"
            >
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer text-sm md:text-base py-1.5 px-3">
                {spec.specialisation.name}
                {spec.yearsExperience && (
                  <span className="ml-1 text-blue-600">({spec.yearsExperience}y)</span>
                )}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}