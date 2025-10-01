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
  MapPin,
  AlertCircle,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import LeaveFirmButton from '@/components/lawyer/LeaveFirmButton'
import FirmInvitationActions from '@/components/lawyer/FirmInvitationActions'

export default async function LawyerFirmPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch lawyer profile with firm and invitations
  const lawyer = await db.lawyer.findUnique({
    where: {
      userId: session.user.id
    },
    include: {
      firm: {
        include: {
          owner: true,
          locations: true
        }
      },
      invitations: {
        where: {
          status: 'PENDING'
        },
        include: {
          firm: {
            include: {
              owner: true,
              locations: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      relationshipHistory: {
        orderBy: {
          endDate: 'desc'
        },
        take: 5
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Firm Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your firm association and invitations
        </p>
      </div>

      {/* Current Firm */}
      {lawyer.firm ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Firm</CardTitle>
                <CardDescription>Your current firm association</CardDescription>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{lawyer.firm.name}</h3>
                {lawyer.firm.description && (
                  <p className="text-sm text-slate-600 mt-1">{lawyer.firm.description}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Firm Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contact Email</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">{lawyer.firm.email}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Phone</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">{lawyer.firm.phone}</span>
                </div>
              </div>
            </div>

            {/* Firm Locations */}
            {lawyer.firm.locations.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Office Locations</p>
                  <div className="space-y-2">
                    {lawyer.firm.locations.map((location) => (
                      <div key={location.id} className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                        <span>
                          {location.address}, {location.city}, {location.state} {location.postcode}
                          {location.isPrimary && (
                            <Badge variant="outline" className="ml-2">Primary</Badge>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Leave Firm Button */}
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Leave this firm</p>
                <p className="text-sm text-slate-600 mt-1">
                  You can leave this firm at any time. Your profile will be updated to show you as an independent lawyer.
                </p>
                <LeaveFirmButton lawyerId={lawyer.id} firmName={lawyer.firm.name} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Not Associated with a Firm</CardTitle>
            <CardDescription>
              You're currently listed as an independent lawyer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 text-sm text-slate-600">
              <UserPlus className="h-5 w-5" />
              <p>Wait for a firm to invite you, or contact a firm directly to request joining.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {lawyer.invitations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Pending Invitations</CardTitle>
            <CardDescription className="text-blue-700">
              You have {lawyer.invitations.length} pending invitation{lawyer.invitations.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lawyer.invitations.map((invitation) => (
                <Card key={invitation.id} className="border bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-50 p-2 rounded">
                          <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{invitation.firm.name}</h4>
                          <p className="text-sm text-slate-600">{invitation.firm.email}</p>
                          {invitation.firm.locations.length > 0 && (
                            <div className="flex items-center text-sm text-slate-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {invitation.firm.locations[0].city}, {invitation.firm.locations[0].state}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(invitation.createdAt).toLocaleDateString('en-AU', {
                          dateStyle: 'medium'
                        })}
                      </div>
                    </div>

                    <FirmInvitationActions invitationId={invitation.id} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationship History */}
      {lawyer.relationshipHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Associations</CardTitle>
            <CardDescription>Your firm history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lawyer.relationshipHistory.map((history) => (
                <div key={history.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium">Firm ID: {history.firmId}</p>
                      {history.role && (
                        <p className="text-sm text-slate-600">{history.role}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 text-right">
                    <p>{new Date(history.startDate).toLocaleDateString('en-AU')} - {history.endDate ? new Date(history.endDate).toLocaleDateString('en-AU') : 'Present'}</p>
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