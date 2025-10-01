"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Building2,
  Star,
  Users,
  BarChart3,
  Settings,
  Scale,
  LogOut,
  ArrowRightLeft,
  ExternalLink,
  Eye,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/firm/dashboard", icon: LayoutDashboard },
  { name: "Firm Profile", href: "/firm/profile", icon: Building2 },
  { name: "Team Management", href: "/firm/team", icon: Users },
  { name: "Reviews", href: "/firm/reviews", icon: Star },
  { name: "Analytics", href: "/firm/analytics", icon: BarChart3 },
  { name: "Settings", href: "/firm/settings", icon: Settings },
]

export default function FirmSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [firmProfileSlug, setFirmProfileSlug] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const isDualRole = session?.user?.role === 'LAWYER_FIRM_OWNER'

  // Fetch firm profile ID for public profile link
  useEffect(() => {
    const fetchFirmProfile = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/firm/profile-id')
        if (response.ok) {
          const data = await response.json()
          setFirmProfileSlug(data.profileSlug)
        }
      } catch (error) {
        console.error('Error fetching firm profile ID:', error)
      }
    }

    fetchFirmProfile()
  }, [session?.user?.id])

  // Handle scroll to show/hide hamburger menu
  useEffect(() => {
    const mainContent = document.getElementById('firm-main-content')

    if (!mainContent) return

    const controlNavbar = () => {
      const currentScrollY = mainContent.scrollTop

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down & past threshold
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    mainContent.addEventListener('scroll', controlNavbar)

    return () => {
      mainContent.removeEventListener('scroll', controlNavbar)
    }
  }, [lastScrollY])

  const SidebarContent = () => (
    <div className="h-full bg-slate-900 text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/firm/dashboard" className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">AusVerity</h1>
            <p className="text-xs text-slate-400">Firm Portal</p>
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
              onClick={() => setIsOpen(false)}
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
        
        {firmProfileSlug ? (
          <Link
            href={`/firm/${firmProfileSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
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
              <Link href="/lawyer/dashboard" onClick={() => setIsOpen(false)}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Switch to Lawyer Dashboard
              </Link>
            </Button>
            <Separator className="bg-slate-700" />
          </>
        )}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
        <Button
          variant="ghost"
          className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => {
            setIsOpen(false)
            signOut({ callbackUrl: '/login' })
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden fixed top-4 z-50 bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 ${
              isVisible ? 'left-4 opacity-100' : '-left-16 opacity-0'
            }`}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-slate-900">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}