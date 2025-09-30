import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Building2,
  Award,
  Languages,
  Scale
} from 'lucide-react'
import Link from 'next/link'
import { ContactReveal } from '@/components/lawyer/ContactReveal'

export default async function LawyerProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch lawyer profile with all relations
  const lawyer = await db.lawyer.findUnique({
    where: {
      userId: session.user.id
    },
    include: {
      user: true,
      firm: {
        include: {
          locations: true
        }
      },
      specialisations: {
        include: {
          specialisation: true
        }
      },
      courtAppearances: true,
      languages: true,
      certifications: true,
    }
  })

  if (!lawyer) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">No Profile Found</CardTitle>
            <CardDescription className="text-orange-700">
              You need to create a lawyer profile first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/lawyer/profile/edit">Create Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getInitials = () => {
    return `${lawyer.firstName.charAt(0)}${lawyer.lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-8">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Profile</h1>
          <p className="text-base md:text-lg text-slate-600 mt-2">
            Manage your professional information
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/lawyer/profile/edit">
            <Edit className="h-5 w-5 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Profile Status */}
      <Card className={
        lawyer.status === 'PUBLISHED'
          ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
          : lawyer.status === 'PENDING'
          ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md'
          : 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
      }>
        <CardContent className="py-6 px-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-slate-900">Profile Status</p>
                <Badge
                  variant={lawyer.status === 'PUBLISHED' ? 'default' : 'secondary'}
                  className={
                    lawyer.status === 'PUBLISHED'
                      ? 'bg-green-600 text-white'
                      : lawyer.status === 'PENDING'
                      ? 'bg-orange-600 text-white'
                      : 'bg-blue-600 text-white'
                  }
                >
                  {lawyer.status}
                </Badge>
              </div>
              <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
                {lawyer.status === 'PUBLISHED' && (
                  <>
                    <span className="font-medium">✓ Your profile is live!</span> It&apos;s now visible to the public and clients can find and contact you.
                  </>
                )}
                {lawyer.status === 'PENDING' && (
                  <>
                    <span className="font-medium">⏳ Under review</span> Your profile has been submitted and is awaiting admin approval. You&apos;ll be notified once it&apos;s published.
                  </>
                )}
                {lawyer.status === 'DRAFT' && (
                  <>
                    <span className="font-medium">📝 Draft mode</span> Your profile is not yet visible to the public. Complete your profile and save to submit it for approval.
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-slate-100">
              <AvatarImage src={lawyer.photoUrl || undefined} />
              <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                {lawyer.firstName} {lawyer.lastName}
              </h3>
              {lawyer.position && (
                <p className="text-base md:text-lg text-slate-600 mt-1">{lawyer.position}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lawyer.yearsExperience && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Years of Experience</p>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-3 text-slate-400" />
                  <span className="text-base font-medium text-slate-900">{lawyer.yearsExperience} years</span>
                </div>
              </div>
            )}
          </div>

          {(lawyer.displayEmail && lawyer.email) || (lawyer.displayPhone && lawyer.phone) ? (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 mb-3">Contact Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lawyer.displayEmail && lawyer.email && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Email</p>
                      <ContactReveal type="email" value={lawyer.email} />
                    </div>
                  )}
                  {lawyer.displayPhone && lawyer.phone && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Phone</p>
                      <ContactReveal type="phone" value={lawyer.phone} />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {lawyer.bio && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 mb-3">Biography</p>
                <p className="text-base text-slate-900 whitespace-pre-wrap leading-relaxed">{lawyer.bio}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Firm */}
      {lawyer.firm && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Current Firm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg md:text-xl text-slate-900">{lawyer.firm.name}</h4>
                <p className="text-base text-slate-600 mt-1">{lawyer.firm.email}</p>
                {lawyer.firm.locations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">Locations:</p>
                    {lawyer.firm.locations.map((location) => (
                      <div key={location.id} className="flex items-center text-base text-slate-600 mt-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        {location.city}, {location.state}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Specialisations */}
      {lawyer.specialisations.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Practice Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {lawyer.specialisations.map((spec) => (
                <Badge key={spec.id} variant="outline" className="text-sm md:text-base py-2 px-3">
                  <Scale className="h-4 w-4 mr-2" />
                  {spec.specialisation.name}
                  {spec.yearsExperience && (
                    <span className="ml-2 text-xs md:text-sm text-slate-500">
                      ({spec.yearsExperience} yrs)
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Court Appearances */}
      {lawyer.courtAppearances.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Court Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lawyer.courtAppearances.map((court) => (
                <div key={court.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-base md:text-lg text-slate-900">{court.courtName}</p>
                    <p className="text-sm md:text-base text-slate-600 mt-1">{court.jurisdiction}</p>
                  </div>
                  {court.appearanceCount > 0 && (
                    <Badge variant="secondary" className="text-sm md:text-base py-1 px-3">
                      {court.appearanceCount} appearances
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages */}
      {lawyer.languages.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {lawyer.languages.map((lang) => (
                <Badge key={lang.id} variant="outline" className="text-sm md:text-base py-2 px-3">
                  <Languages className="h-4 w-4 mr-2" />
                  {lang.languageName}
                  <span className="ml-2 text-xs md:text-sm text-slate-500">
                    ({lang.proficiencyLevel})
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {lawyer.certifications.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Certifications & Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lawyer.certifications.map((cert) => (
                <div key={cert.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base md:text-lg text-slate-900">{cert.name}</p>
                    <p className="text-sm md:text-base text-slate-600 mt-1">{cert.issuingBody}</p>
                    <div className="flex items-center text-xs md:text-sm text-slate-500 mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      Earned: {new Date(cert.dateEarned).toLocaleDateString('en-AU')}
                      {cert.expiryDate && (
                        <span className="ml-2">
                          • Expires: {new Date(cert.expiryDate).toLocaleDateString('en-AU')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}