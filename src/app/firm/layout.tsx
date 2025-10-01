import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import FirmSidebar from '@/components/firm/FirmSidebar'

export default async function FirmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // If no session, this is a public profile page - render without sidebar
  if (!session?.user) {
    return <>{children}</>
  }
  
  const userRole = session.user.role
  
  // If user has wrong role, just render content without sidebar
  if (userRole !== 'FIRM_OWNER' && userRole !== 'LAWYER_FIRM_OWNER' && userRole !== 'ADMIN') {
    return <>{children}</>
  }

  // Authenticated firm owner - show dashboard layout with sidebar
  return (
    <div className="flex h-screen bg-slate-50">
      <FirmSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}