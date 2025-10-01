import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContactForm } from "@/components/contact-form"
import { ContactUpgradePrompt } from "@/components/contact-upgrade-prompt"
import { ContactReveal } from "@/components/lawyer/ContactReveal"
import { Mail, Phone, MapPin, Shield, Award, Clock, Globe, Linkedin, Twitter, Facebook } from "lucide-react"
import type { LawyerProfileData } from "@/lib/data/lawyers"

interface SidebarProps {
  lawyer: NonNullable<LawyerProfileData>
}

export function Sidebar({ lawyer }: SidebarProps) {
  const fullName = `${lawyer.firstName} ${lawyer.lastName}`
  const primaryLocation = lawyer.firm?.locations?.[0]

  return (
    <>
      {/* Contact Information Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4"><CardTitle className="text-xl">Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-5 pt-0">
          {/* Lawyer's Personal Contact Info (if displayed) */}
          {lawyer.displayEmail && lawyer.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <ContactReveal type="email" value={lawyer.email} />
              </div>
            </div>
          )}
          {lawyer.displayPhone && lawyer.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <ContactReveal type="phone" value={lawyer.phone} />
              </div>
            </div>
          )}

          {/* Lawyer's Address */}
          {lawyer.address && lawyer.city && lawyer.state && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Office Address</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${lawyer.address}, ${lawyer.city}, ${lawyer.state} ${lawyer.postcode || ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm block"
                >
                  {lawyer.address}<br />
                  {lawyer.city}, {lawyer.state} {lawyer.postcode}
                </a>
              </div>
            </div>
          )}

          {/* Firm Contact Info */}
          {lawyer.firm?.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Firm Email</p>
                <a href={`mailto:${lawyer.firm.email}`} className="text-blue-600 hover:underline break-all">
                  {lawyer.firm.email}
                </a>
              </div>
            </div>
          )}
          {lawyer.firm?.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Firm Phone</p>
                <a href={`tel:${lawyer.firm.phone}`} className="text-blue-600 hover:underline">
                  {lawyer.firm.phone}
                </a>
              </div>
            </div>
          )}
          {primaryLocation && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-slate-600 text-sm">
                  {primaryLocation.address}<br />
                  {primaryLocation.city}, {primaryLocation.state} {primaryLocation.postcode}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      {(lawyer.linkedinUrl || lawyer.twitterUrl || lawyer.facebookUrl || lawyer.websiteUrl) && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Connect Online</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {lawyer.linkedinUrl && (
                <a
                  href={lawyer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {lawyer.twitterUrl && (
                <a
                  href={lawyer.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
              {lawyer.facebookUrl && (
                <a
                  href={lawyer.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {lawyer.websiteUrl && (
                <a
                  href={lawyer.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">Website</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operating Hours */}
      {lawyer.operatingHours && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {Object.entries(lawyer.operatingHours as Record<string, any>).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center text-sm">
                  <span className="font-medium capitalize">{day}</span>
                  {hours.closed ? (
                    <span className="text-slate-500 italic">Closed</span>
                  ) : (
                    <span className="text-slate-700">
                      {hours.open} - {hours.close}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages */}
      {lawyer.languages.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Languages</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {lawyer.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="text-sm">{lang.languageName}</span>
                  <Badge variant="outline" className="text-xs">
                    {lang.proficiencyLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {lawyer.certifications.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {lawyer.certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium text-sm">{cert.name}</p>
                  <p className="text-sm text-slate-600">{cert.issuingBody}</p>
                  <p className="text-xs text-slate-500">
                    Earned: {new Date(cert.dateEarned).getFullYear()}
                  </p>
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
            Contact {lawyer.firstName} today to discuss your legal needs.
          </p>
          {lawyer.isPaidUser ? (
            <ContactForm
              recipientType="LAWYER"
              recipientName={fullName}
              recipientId={lawyer.id}
              firmName={lawyer.firm?.name}
              trigger={
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              }
            />
          ) : (
            <ContactUpgradePrompt
              recipientType="LAWYER"
              recipientName={fullName}
              recipientId={lawyer.id}
              trigger={
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                  Contact Options
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}