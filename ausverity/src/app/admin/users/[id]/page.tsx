import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Building2,
  Shield,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import UserRoleManager from '@/components/admin/UserRoleManager'

interface PageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  const user = await db.user.findUnique({
    where: {
      id: params.id
    },
    include: {
      lawyer: {
        include: {
          firm: true,
          specialisations: {
            include: {
              specialisation: true
            }
          },
          reviews: {
            take: 5,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      },
      firmOwner: {
        include: {
          lawyers: true,
          locations: true
        }
      },
      reviews: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'LAWYER':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FIRM_OWNER':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'CLIENT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return Shield
      case 'LAWYER':
        return UserIcon
      case 'FIRM_OWNER':
        return Building2
      default:
        return UserIcon
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/users">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${
            user.role === 'ADMIN' ? 'bg-orange-50' :
            user.role === 'LAWYER' ? 'bg-green-50' :
            user.role === 'FIRM_OWNER' ? 'bg-purple-50' :
            'bg-blue-50'
          }`}>
            <RoleIcon className={`h-8 w-8 ${
              user.role === 'ADMIN' ? 'text-orange-600' :
              user.role === 'LAWYER' ? 'text-green-600' :
              user.role === 'FIRM_OWNER' ? 'text-purple-600' :
              'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user.name || 'No Name Set'}
            </h1>
            <p className="text-slate-600 mt-1">{user.email}</p>
          </div>
        </div>
        <Badge className={getRoleBadgeColor(user.role)}>
          {user.role.replace('_', ' ')}
        </Badge>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Basic account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">User ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Email Status</p>
              <div className="flex items-center">
                {user.emailVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-orange-600">Not Verified</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Registration Date</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString('en-AU', {
                    dateStyle: 'long'
                  })}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Last Updated</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-slate-400 mr-2" />
                <span className="text-sm">
                  {new Date(user.updatedAt).toLocaleDateString('en-AU', {
                    dateStyle: 'long'
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Change the user's role and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserRoleManager userId={user.id} currentRole={user.role} />
        </CardContent>
      </Card>

      {/* Lawyer Profile (if applicable) */}
      {user.lawyer && (
        <Card>
          <CardHeader>
            <CardTitle>Lawyer Profile</CardTitle>
            <CardDescription>Associated lawyer profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="font-medium">
                  {user.lawyer.firstName} {user.lawyer.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <Badge variant="outline">{user.lawyer.status}</Badge>
              </div>
              {user.lawyer.firm && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Current Firm</p>
                  <p className="font-medium">{user.lawyer.firm.name}</p>
                </div>
              )}
              {user.lawyer.yearsExperience && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Years of Experience</p>
                  <p className="font-medium">{user.lawyer.yearsExperience} years</p>
                </div>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-slate-600 mb-2">Total Reviews</p>
              <p className="text-2xl font-bold">{user.lawyer.reviews.length}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Firm Owner Profile (if applicable) */}
      {user.firmOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Law Firm Profile</CardTitle>
            <CardDescription>Owned law firm information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Firm Name</p>
                <p className="font-medium">{user.firmOwner.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <Badge variant="outline">{user.firmOwner.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Contact Email</p>
                <p className="font-medium">{user.firmOwner.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Contact Phone</p>
                <p className="font-medium">{user.firmOwner.phone}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Team Members</p>
                <p className="text-2xl font-bold">{user.firmOwner.lawyers.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Locations</p>
                <p className="text-2xl font-bold">{user.firmOwner.locations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Recent activity and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">Reviews Written</p>
              <p className="text-2xl font-bold">{user.reviews.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Account Age</p>
              <p className="text-2xl font-bold">
                {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Last Active</p>
              <p className="text-sm font-medium">
                {new Date(user.updatedAt).toLocaleDateString('en-AU')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}