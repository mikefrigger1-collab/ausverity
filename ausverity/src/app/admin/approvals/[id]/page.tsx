import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  User,
  Building2,
  Clock,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import ApprovalActions from '@/components/admin/ApprovalActions'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ApprovalDetailPage({ params }: PageProps) {
  const { id } = await params
  const change = await db.pendingChange.findUnique({
    where: {
      id
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
    }
  })

  if (!change) {
    notFound()
  }

  // Get entity name
  const entityName = change.entityType === 'LAWYER' && change.lawyer
    ? `${change.lawyer.firstName} ${change.lawyer.lastName}`
    : change.entityType === 'FIRM' && change.firm
    ? change.firm.name
    : 'Unknown'

  // Get submitter email
  const submitterEmail = change.lawyer?.user?.email || change.firm?.owner?.email || 'Unknown'

  // Parse changes JSON
  const changes = change.changesJson as Record<string, any>

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/approvals">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              change.entityType === 'LAWYER' ? 'bg-blue-50' : 'bg-purple-50'
            }`}>
              {change.entityType === 'LAWYER' ? (
                <User className="h-6 w-6 text-blue-600" />
              ) : (
                <Building2 className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{entityName}</h1>
              <p className="text-slate-600 mt-1">
                <Badge variant="outline" className="mr-2">
                  {change.entityType}
                </Badge>
                Profile changes pending approval
              </p>
            </div>
          </div>
        </div>
        <Badge 
          variant={
            change.status === 'APPROVED' 
              ? 'default' 
              : change.status === 'REJECTED' 
              ? 'destructive' 
              : 'secondary'
          }
          className="text-sm"
        >
          {change.status}
        </Badge>
      </div>

      {/* Submission Info */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-slate-600">Submitted by:</span>
            <span className="ml-2 font-medium">{submitterEmail}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-slate-600">Submitted on:</span>
            <span className="ml-2 font-medium">
              {new Date(change.createdAt).toLocaleString('en-AU', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}
            </span>
          </div>
          {change.processedAt && (
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-2 text-slate-500" />
              <span className="text-slate-600">Processed on:</span>
              <span className="ml-2 font-medium">
                {new Date(change.processedAt).toLocaleString('en-AU', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Changes Requested */}
      <Card>
        <CardHeader>
          <CardTitle>Changes Requested</CardTitle>
          <CardDescription>
            Review the changes below before approving or rejecting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(changes).map(([field, value]) => (
              <div key={field}>
                <div className="flex items-start justify-between py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 capitalize mb-1">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <div className="text-sm text-slate-600">
                      <div className="bg-slate-50 p-3 rounded-md">
                        <p className="font-mono whitespace-pre-wrap break-words">
                          {typeof value === 'object' 
                            ? JSON.stringify(value, null, 2) 
                            : String(value)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      {change.adminNotes && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">{change.adminNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {change.status === 'PENDING' && (
        <Card>
          <CardHeader>
            <CardTitle>Review Actions</CardTitle>
            <CardDescription>
              Approve or reject these changes. You can optionally add notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApprovalActions changeId={change.id} />
          </CardContent>
        </Card>
      )}

      {/* Already Processed */}
      {change.status !== 'PENDING' && (
        <Card className={
          change.status === 'APPROVED' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }>
          <CardContent className="flex items-center space-x-3 py-6">
            {change.status === 'APPROVED' ? (
              <>
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    This change has been approved
                  </p>
                  <p className="text-sm text-green-700">
                    The changes have been applied to the profile
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">
                    This change has been rejected
                  </p>
                  <p className="text-sm text-red-700">
                    The changes were not applied to the profile
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}