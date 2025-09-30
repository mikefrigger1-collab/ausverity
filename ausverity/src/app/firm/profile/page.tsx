import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Users,
  Scale
} from 'lucide-react'
import Link from 'next/link'

export default async function FirmProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch firm profile with all relations
  const firm = await db.lawFirm.findUnique({
    where: {
      ownerId: session.user.id
    },
    include: {
      owner: true,
      locations: {
        orderBy: {
          isPrimary: 'desc'
        }
      },
      practiceAreas: {
        include: {
          specialisation: true
        }
      },
      lawyers: {
        include: {
          user: true
        }
      }
    }
  })

  if (!firm) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">No Firm Profile Found</CardTitle>
            <CardDescription className="text-orange-700">
              You need to create a firm profile first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/firm/profile/edit">Create Firm Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Firm Profile</h1>
          <p className="text-slate-600 mt-2">
            Manage your firm's information
          </p>
        </div>
        <Button asChild>
          <Link href="/firm/profile/edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Profile Status */}
      <Card className={
        firm.status === 'PUBLISHED' 
          ? 'border-green-200 bg-green-50' 
          : firm.status === 'PENDING'
          ? 'border-orange-200 bg-orange-50'
          : 'border-slate-200'
      }>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-semibold text-slate-900">Profile Status</p>
            <p className="text-sm text-slate-600">
              {firm.status === 'PUBLISHED' && 'Your firm profile is live and visible to the public'}
              {firm.status === 'PENDING' && 'Your firm profile is pending admin approval'}
              {firm.status === 'DRAFT' && 'Your firm profile is in draft mode'}
            </p>
          </div>
          <Badge variant={firm.status === 'PUBLISHED' ? 'default' : 'secondary'}>
            {firm.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your firm's details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-lg bg-purple-100 flex items-center justify-center">
              {firm.logoUrl ? (
                <img src={firm.logoUrl} alt={firm.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="h-10 w-10 text-purple-600" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{firm.name}</h3>
              {firm.description && (
                <p className="text-slate-600 mt-1">{firm.description.substring(0, 100)}...</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Contact Email</p>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">{firm.email}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-1">Phone Number</p>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">{firm.phone}</span>
              </div>
            </div>

            {firm.website && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Website</p>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-slate-400" />
                  <a href={firm.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                    {firm.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {firm.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-slate-600 mb-2">About</p>
                <p className="text-slate-900 whitespace-pre-wrap">{firm.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Locations */}
      {firm.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Office Locations</CardTitle>
            <CardDescription>Where your firm operates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {firm.locations.map((location) => (
                <div key={location.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{location.city}, {location.state}</p>
                      {location.isPrimary && (
                        <Badge variant="outline">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {location.address}
                    </p>
                    <p className="text-sm text-slate-600">
                      {location.postcode}, {location.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Areas */}
      {firm.practiceAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Practice Areas</CardTitle>
            <CardDescription>Legal services your firm provides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {firm.practiceAreas.map((area) => (
                <Badge key={area.id} variant="outline" className="text-sm">
                  <Scale className="h-3 w-3 mr-1" />
                  {area.specialisation.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Lawyers at your firm</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/firm/team">Manage Team</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {firm.lawyers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No team members yet</p>
              <p className="text-sm mt-1">
                Invite lawyers to join your firm
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {firm.lawyers.map((lawyer) => (
                <Card key={lawyer.id} className="border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">
                          {lawyer.firstName.charAt(0)}{lawyer.lastName.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-semibold">
                        {lawyer.firstName} {lawyer.lastName}
                      </h4>
                      {lawyer.position && (
                        <p className="text-sm text-slate-600">{lawyer.position}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{lawyer.user.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}