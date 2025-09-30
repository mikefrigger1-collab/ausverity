import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  User, 
  Building2, 
  CheckCircle, 
  XCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default async function ApprovalsPage() {
  // Fetch all pending changes
  const pendingChanges = await db.pendingChange.findMany({
    where: {
      status: 'PENDING'
    },
    include: {
      lawyer: {
        include: {
          user: true
        }
      },
      firm: {
        include: {
          owner: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Function to get entity name
  const getEntityName = (change: typeof pendingChanges[0]) => {
    if (change.entityType === 'LAWYER' && change.lawyer) {
      return `${change.lawyer.firstName} ${change.lawyer.lastName}`
    }
    if (change.entityType === 'FIRM' && change.firm) {
      return change.firm.name
    }
    return 'Unknown'
  }

  // Function to get submitter email
  const getSubmitterEmail = (change: typeof pendingChanges[0]) => {
    if (change.lawyer?.user) {
      return change.lawyer.user.email
    }
    if (change.firm?.owner) {
      return change.firm.owner.email
    }
    return 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="text-slate-600 mt-2">
          Review and approve changes to profiles
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingChanges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Lawyer Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingChanges.filter(c => c.entityType === 'LAWYER').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Firm Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingChanges.filter(c => c.entityType === 'FIRM').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Changes List */}
      <div className="space-y-4">
        {pendingChanges.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                All caught up!
              </h3>
              <p className="text-slate-600 text-center max-w-md">
                There are no pending changes to review at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          pendingChanges.map((change) => (
            <Card key={change.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      change.entityType === 'LAWYER' 
                        ? 'bg-blue-50' 
                        : 'bg-purple-50'
                    }`}>
                      {change.entityType === 'LAWYER' ? (
                        <User className={`h-5 w-5 ${
                          change.entityType === 'LAWYER' 
                            ? 'text-blue-600' 
                            : 'text-purple-600'
                        }`} />
                      ) : (
                        <Building2 className={`h-5 w-5 ${
                          change.entityType === 'LAWYER' 
                            ? 'text-blue-600' 
                            : 'text-purple-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getEntityName(change)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className="mr-2">
                          {change.entityType}
                        </Badge>
                        Submitted by {getSubmitterEmail(change)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(change.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    <p className="font-medium mb-1">Changes requested:</p>
                    <p className="text-slate-500">
                      Click "Review" to see the detailed changes
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/approvals/${change.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}