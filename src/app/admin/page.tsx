import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  UserCheck,
  Building2,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await auth()

  // Calculate date for "this month"
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch dashboard statistics
  const [
    totalUsers,
    totalLawyers,
    totalFirms,
    totalReviews,
    pendingApprovals,
    pendingReviews,
    usersThisMonth,
  ] = await Promise.all([
    db.user.count(),
    db.lawyer.count(),
    db.lawFirm.count(),
    db.review.count(),
    db.pendingChange.count({ where: { status: 'PENDING' } }),
    db.review.count({ where: { status: 'PENDING' } }),
    db.user.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    }),
  ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: `${usersThisMonth} new this month`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Lawyers",
      value: totalLawyers,
      description: "Registered lawyers",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Law Firms",
      value: totalFirms,
      description: "Registered firms",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Reviews",
      value: totalReviews,
      description: `${pendingReviews} pending approval`,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {session?.user?.name || 'Admin'}. Here's what's happening today.
        </p>
      </div>

      {/* Pending Actions Alert */}
      {(pendingApprovals > 0 || pendingReviews > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Action Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-orange-900">
                      {pendingApprovals} pending approval{pendingApprovals !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-orange-700">
                      Profile changes awaiting review
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href="/admin/approvals">
                      Review <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
              {pendingReviews > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-orange-900">
                      {pendingReviews} pending review{pendingReviews !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-orange-700">
                      Reviews awaiting moderation
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin/reviews">
                      Moderate <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
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
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
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
            <Link href="/admin/approvals">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Review Approvals</CardTitle>
                    <CardDescription>Approve pending changes</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/reviews">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Moderate Reviews</CardTitle>
                    <CardDescription>Review flagged content</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/users">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Manage Users</CardTitle>
                    <CardDescription>View and edit users</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>Activity feed coming soon</p>
            <p className="text-sm mt-1">We'll display recent registrations, reviews, and changes here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}