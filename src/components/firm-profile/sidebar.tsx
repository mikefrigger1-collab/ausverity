import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Globe, MapPin, Shield, ExternalLink } from "lucide-react"
import type { FirmProfileData } from "@/lib/data/firms"

interface SidebarProps {
  firm: NonNullable<FirmProfileData>
}

export function Sidebar({ firm }: SidebarProps) {
  return (
    <>
      {/* Contact Information Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-0">
          {firm.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href={`mailto:${firm.email}`} className="text-blue-600 hover:underline break-all">
                  {firm.email}
                </a>
              </div>
            </div>
          )}
          {firm.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a href={`tel:${firm.phone}`} className="text-blue-600 hover:underline">
                  {firm.phone}
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Office Locations Card */}
      {firm.locations.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Office Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {firm.locations.map((location) => (
                <div key={location.id} className="pb-4 last:pb-0 border-b last:border-0 border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900">{location.city}, {location.state}</p>
                    {location.isPrimary && (
                      <Badge variant="outline" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${location.address}, ${location.city}, ${location.state} ${location.postcode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    {location.address}<br />
                    {location.city}, {location.state} {location.postcode}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action Card */}
      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <CardContent className="p-6 md:p-7 text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 mb-2">Ready to Get Started?</h3>
          <p className="text-sm text-slate-600 mb-4">
            Contact {firm.name} today to discuss your legal needs.
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Contact Our Firm
          </Button>
        </CardContent>
      </Card>
    </>
  )
}