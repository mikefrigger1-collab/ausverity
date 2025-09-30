import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm'

export default async function AdminSettingsPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
    }
  })

  if (!user) {
    redirect('/admin')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your admin account settings and preferences
        </p>
      </div>

      <AdminSettingsForm user={user} />
    </div>
  )
}