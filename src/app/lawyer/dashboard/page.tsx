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
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2">
            Manage your professional information
          </p>
        </div>
        <Button asChild>
          <Link href="/lawyer/profile/edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Profile Status */}
      <Card className={
        lawyer.status === 'PUBLISHED' 
          ? 'border-green-200 bg-green-50' 
          : lawyer.status === 'PENDING'
          ? 'border-orange-200 bg-orange-50'
          : 'border-slate-200'
      }>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-semibold text-slate-900">Profile Status</p>
            <p className="text-sm text-slate-600">
              {lawyer.status === 'PUBLISHED' && 'Your profile is live and visible to the public'}
              {lawyer.status === 'PENDING' && 'Your profile is pending admin approval'}
              {lawyer.status === 'DRAFT' && 'Your profile is in draft mode'}
            </p>
          </div>
          <Badge variant={lawyer.status === 'PUBLISHED' ? 'default' : 'secondary'}>
            {lawyer.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your personal and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={lawyer.photoUrl || undefined} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">
                {lawyer.firstName} {lawyer.lastName}
              </h3>
              {lawyer.position && (
                <p className="text-slate-600">{lawyer.position}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Email</p>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">{lawyer.user.email}</span>
              </div>
            </div>

            {lawyer.yearsExperience && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Years of Experience</p>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">{lawyer.yearsExperience} years</span>
                </div>
              </div>
            )}
          </div>

          {lawyer.bio && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-slate-600 mb-2">Biography</p>
                <p className="text-slate-900 whitespace-pre-wrap">{lawyer.bio}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Firm */}
      {lawyer.firm && (
        <Card>
          <CardHeader>
            <CardTitle>Current Firm</CardTitle>
            <CardDescription>Your firm association</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{lawyer.firm.name}</h4>
                <p className="text-sm text-slate-600">{lawyer.firm.email}</p>
                {lawyer.firm.locations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-slate-700">Locations:</p>
                    {lawyer.firm.locations.map((location) => (
                      <div key={location.id} className="flex items-center text-sm text-slate-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
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
        <Card>
          <CardHeader>
            <CardTitle>Practice Areas</CardTitle>
            <CardDescription>Your areas of specialisation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lawyer.specialisations.map((spec) => (
                <Badge key={spec.id} variant="outline" className="text-sm">
                  <Scale className="h-3 w-3 mr-1" />
                  {spec.specialisation.name}
                  {spec.yearsExperience && (
                    <span className="ml-1 text-xs text-slate-500">
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
        <Card>
          <CardHeader>
            <CardTitle>Court Experience</CardTitle>
            <CardDescription>Courts where you have appeared</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lawyer.courtAppearances.map((court) => (
                <div key={court.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{court.courtName}</p>
                    <p className="text-sm text-slate-600">{court.jurisdiction}</p>
                  </div>
                  {court.appearanceCount && court.appearanceCount !== '0' && (
                    <Badge variant="secondary">
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
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Languages you speak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lawyer.languages.map((lang) => (
                <Badge key={lang.id} variant="outline">
                  <Languages className="h-3 w-3 mr-1" />
                  {lang.languageName}
                  <span className="ml-1 text-xs text-slate-500">
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
        <Card>
          <CardHeader>
            <CardTitle>Certifications & Memberships</CardTitle>
            <CardDescription>Your professional qualifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lawyer.certifications.map((cert) => (
                <div key={cert.id} className="flex items-start space-x-3 p-3 border rounded">
                  <div className="bg-blue-50 p-2 rounded">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-slate-600">{cert.issuingBody}</p>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
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