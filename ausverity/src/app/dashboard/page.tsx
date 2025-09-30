import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Redirect users to their role-specific dashboards
  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin')
    case 'LAWYER':
      redirect('/lawyer/dashboard')
    case 'FIRM_OWNER':
      redirect('/firm/dashboard')
    case 'LAWYER_FIRM_OWNER':
      redirect('/dual-dashboard')
    case 'CLIENT':
      redirect('/')
    default:
      redirect('/')
  }
}