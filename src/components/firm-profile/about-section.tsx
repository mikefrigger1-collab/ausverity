import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

interface AboutSectionProps {
  description: string | null
  name: string
}

export function AboutSection({ description, name }: AboutSectionProps) {
  if (!description) {
    return null
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          About {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}