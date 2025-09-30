import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface AboutSectionProps {
  bio: string | null
  firstName: string
}

export function AboutSection({ bio, firstName }: AboutSectionProps) {
  if (!bio) {
    return null
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
          <Users className="w-6 h-6 text-blue-600" />
          About {firstName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
          {bio}
        </p>
      </CardContent>
    </Card>
  )
}