import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LawyerSettingsForm } from '@/components/lawyer/LawyerSettingsForm'

export default async function LawyerSettingsPage() {
  const session = await auth()

  if (!session || (session.user.role !== 'LAWYER' && session.user.role !== 'LAWYER_FIRM_OWNER')) {
    redirect('/lawyer/dashboard')
  }

  const lawyer = await db.lawyer.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      displayPhone: true,
      displayEmail: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    }
  })

  if (!lawyer) {
    redirect('/lawyer/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <LawyerSettingsForm lawyer={lawyer} />
    </div>
  )
}