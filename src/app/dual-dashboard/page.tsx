import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DualDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-lg text-slate-600">
            Choose which dashboard you'd like to access
          </p>
        </div>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Lawyer Dashboard */}
<Link href="/lawyer/dashboard">
  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
    <CardHeader>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <ArrowRight className="h-6 w-6 text-slate-400" />
      </div>
      <CardTitle className="text-2xl">Lawyer Dashboard</CardTitle>
      <CardDescription className="text-base">
        Manage your personal lawyer profile
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm text-slate-600">
        <li className="flex items-center">
          <span className="mr-2">•</span>
          Edit your lawyer profile
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          View and respond to reviews
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          Manage firm associations
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          View your analytics
        </li>
      </ul>
    </CardContent>
  </Card>
</Link>

{/* Firm Owner Dashboard */}
<Link href="/firm/dashboard">
  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
    <CardHeader>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Building2 className="h-8 w-8 text-purple-600" />
        </div>
        <ArrowRight className="h-6 w-6 text-slate-400" />
      </div>
      <CardTitle className="text-2xl">Firm Dashboard</CardTitle>
      <CardDescription className="text-base">
        Manage your law firm
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm text-slate-600">
        <li className="flex items-center">
          <span className="mr-2">•</span>
          Edit firm information
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          Manage team members
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          Invite lawyers to join
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          View firm analytics
        </li>
      </ul>
    </CardContent>
  </Card>
</Link>
        </div>

        {/* Quick Note */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Tip:</strong> You can switch between dashboards at any time using the navigation menu
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}