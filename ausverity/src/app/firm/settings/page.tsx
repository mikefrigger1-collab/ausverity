import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FirmSettingsForm } from '@/components/firm/FirmSettingsForm'

export default async function FirmSettingsPage() {
  const session = await auth()

  if (!session || (session.user.role !== 'FIRM_OWNER' && session.user.role !== 'LAWYER_FIRM_OWNER')) {
    redirect('/firm/dashboard')
  }

  const firm = await db.lawFirm.findUnique({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      email: true,
      phone: true,
      displayPhone: true,
      displayEmail: true,
      status: true,
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    }
  })

  if (!firm) {
    redirect('/firm/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your firm account settings and preferences
        </p>
      </div>

      <FirmSettingsForm firm={firm} />
    </div>
  )
}