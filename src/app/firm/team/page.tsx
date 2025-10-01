import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  UserPlus,
  Mail,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import InviteLawyerForm from '@/components/firm/InviteLawyerForm'
import RemoveLawyerButton from '@/components/firm/RemoveLawyerButton'

export default async function FirmTeamPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch firm with team and pending invitations
  const firm = await db.lawFirm.findUnique({
    where: {
      ownerId: session.user.id
    },
    include: {
      lawyers: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      invitations: {
        where: {
          status: 'PENDING'
        },
        include: {
          lawyer: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
        <p className="text-slate-600 mt-2">
          Manage lawyers at {firm.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firm.lawyers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firm.invitations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Lawyer */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Lawyer to Join</CardTitle>
          <CardDescription>
            Send an invitation to a lawyer to join your firm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteLawyerForm firmId={firm.id} />
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {firm.invitations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Pending Invitations</CardTitle>
            <CardDescription className="text-blue-700">
              Lawyers you've invited who haven't responded yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {firm.invitations.map((invitation) => (
                <Card key={invitation.id} className="border bg-white">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {invitation.lawyer.firstName.charAt(0)}{invitation.lawyer.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {invitation.lawyer.firstName} {invitation.lawyer.lastName}
                        </p>
                        <p className="text-sm text-slate-600">{invitation.lawyer.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-slate-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Sent {new Date(invitation.createdAt).toLocaleDateString('en-AU', {
                          dateStyle: 'medium'
                        })}
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Current Team Members</CardTitle>
          <CardDescription>Lawyers currently at your firm</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.lawyers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No team members yet</p>
              <p className="text-sm mt-1">
                Use the form above to invite lawyers to your firm
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {firm.lawyers.map((lawyer) => (
                <Card key={lawyer.id} className="border">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-purple-600">
                          {lawyer.firstName.charAt(0)}{lawyer.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          {lawyer.firstName} {lawyer.lastName}
                        </h4>
                        {lawyer.position && (
                          <p className="text-sm text-slate-600">{lawyer.position}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <p className="text-xs text-slate-500">{lawyer.user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{lawyer.status}</Badge>
                      <RemoveLawyerButton 
                        lawyerId={lawyer.id} 
                        lawyerName={`${lawyer.firstName} ${lawyer.lastName}`}
                      />
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