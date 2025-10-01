import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Building2,
  Star,
  Eye,
  Users,
  TrendingUp,
  AlertCircle,
  Edit,
  UserPlus,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default async function FirmDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch firm profile
  const firm = await db.lawFirm.findUnique({
    where: {
      ownerId: session.user.id
    },
    include: {
      lawyers: true,
      locations: true,
      reviews: {
        where: {
          status: 'APPROVED'
        },
        include: {
          author: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      },
      _count: {
        select: {
          reviews: {
            where: {
              status: 'APPROVED'
            }
          },
          lawyers: true
        }
      }
    }
  })

  if (!firm) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">No Firm Profile Found</CardTitle>
            <CardDescription className="text-orange-700">
              You need to create a firm profile to access this dashboard.
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

  // Calculate profile completeness
  const profileFields = [
    firm.name,
    firm.description,
    firm.email,
    firm.phone,
    firm.logoUrl,
    firm.locations.length > 0,
  ]
  const completedFields = profileFields.filter(Boolean).length
  const profileCompleteness = Math.round((completedFields / profileFields.length) * 100)

  // Calculate average rating
  const avgRating = firm.reviews.length > 0
    ? firm.reviews.reduce((sum, r) => sum + r.overallRating, 0) / firm.reviews.length
    : 0

  // Count views (placeholder)
  const viewCount = 0

  const stats = [
    {
      title: "Profile Views",
      value: viewCount,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Last 30 days"
    },
    {
      title: "Team Members",
      value: firm._count.lawyers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: `${firm.lawyers.length} active lawyers`
    },
    {
      title: "Total Reviews",
      value: firm._count.reviews,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: avgRating > 0 ? `${avgRating.toFixed(1)} average rating` : "No reviews yet"
    },
    {
      title: "Profile Status",
      value: firm.status,
      icon: firm.status === 'PUBLISHED' ? CheckCircle : AlertCircle,
      color: firm.status === 'PUBLISHED' ? "text-green-600" : "text-orange-600",
      bgColor: firm.status === 'PUBLISHED' ? "bg-green-50" : "bg-orange-50",
      description: firm.status === 'PUBLISHED' ? "Visible to public" : "Pending approval"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back!
        </h1>
        <p className="text-slate-600 mt-2">
          Here's an overview of {firm.name}'s performance
        </p>
      </div>

      {/* Profile Completeness Alert */}
      {profileCompleteness < 100 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">Complete Your Firm Profile</CardTitle>
                <CardDescription className="text-blue-700">
                  A complete profile gets more visibility and trust from clients
                </CardDescription>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {profileCompleteness}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompleteness} className="mb-3" />
            <Button asChild size="sm">
              <Link href="/firm/profile/edit">
                <Edit className="h-4 w-4 mr-2" />
                Complete Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </div>
              <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/firm/profile/edit">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Edit className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Edit Firm Profile</CardTitle>
                    <CardDescription>Update firm information</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/firm/team">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Manage Team</CardTitle>
                    <CardDescription>Add or remove lawyers</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/firm/reviews">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">View Reviews</CardTitle>
                    <CardDescription>Client feedback</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Lawyers at your firm</CardDescription>
            </div>
            {firm._count.lawyers > 0 && (
              <Button asChild variant="outline" size="sm">
                <Link href="/firm/team">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Team
                </Link>
              </Button>
            )}
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
              <Button asChild className="mt-4" size="sm">
                <Link href="/firm/team">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Lawyers
                </Link>
              </Button>
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
                      <Badge variant="outline" className="mt-2">
                        {lawyer.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest client reviews for your firm</CardDescription>
            </div>
            {firm._count.reviews > 0 && (
              <Button asChild variant="outline" size="sm">
                <Link href="/firm/reviews">View All</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {firm.reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Star className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No reviews yet</p>
              <p className="text-sm mt-1">
                Reviews will appear here once clients submit them
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {firm.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{review.overallRating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-slate-600">
                        by {review.author.name || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}