"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  User, 
  Star,
  Building2,
  BarChart3,
  Settings,
  Scale,
  LogOut,
  ArrowRightLeft,
  ExternalLink,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { Separator } from "@/components/ui/separator"

const navigation = [
  { name: "Dashboard", href: "/lawyer/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/lawyer/profile", icon: User },
  { name: "Reviews", href: "/lawyer/reviews", icon: Star },
  { name: "Firm Settings", href: "/lawyer/firm", icon: Building2 },
  { name: "Analytics", href: "/lawyer/analytics", icon: BarChart3 },
  { name: "Settings", href: "/lawyer/settings", icon: Settings },
]

export default function LawyerSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [lawyerProfileSlug, setLawyerProfileSlug] = useState<string | null>(null)
  
  const isDualRole = session?.user?.role === 'LAWYER_FIRM_OWNER'

  // Fetch lawyer profile slug for public profile link
  useEffect(() => {
    const fetchLawyerProfile = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/lawyer/profile-id')
        if (response.ok) {
          const data = await response.json()
          setLawyerProfileSlug(data.profileSlug)
        }
      } catch (error) {
        console.error('Error fetching lawyer profile slug:', error)
      }
    }

    fetchLawyerProfile()
  }, [session?.user?.id])

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/lawyer/dashboard" className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">AusVerity</h1>
            <p className="text-xs text-slate-400">Lawyer Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* View Public Profile */}
        <Separator className="bg-slate-700 my-3" />
        
        {lawyerProfileSlug ? (
          <Link
            href={`/lawyer/${lawyerProfileSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Eye className="h-5 w-5" />
            <span className="font-medium">View Profile</span>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Link>
        ) : (
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500">
            <Eye className="h-5 w-5" />
            <span className="font-medium">View Profile</span>
          </div>
        )}
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        {isDualRole && (
          <>
            <Button
              asChild
              variant="ghost"
              className="w-full text-slate-300 hover:text-white hover:bg-slate-800 justify-start"
            >
              <Link href="/firm/dashboard">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Switch to Firm Dashboard
              </Link>
            </Button>
            <Separator className="bg-slate-700" />
          </>
        )}
        <Link 
          href="/"
          className="flex items-center justify-center px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
        <Button
          variant="ghost"
          className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}