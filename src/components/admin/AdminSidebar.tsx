"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Scale,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Approvals", href: "/admin/approvals", icon: CheckSquare },
  { name: "Lawyers", href: "/admin/lawyers", icon: UserCheck },
  { name: "Law Firms", href: "/admin/firms", icon: Scale },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">AusVerity</h1>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
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
      </nav>

      {/* Back to Main Site */}
      <div className="p-4 border-t border-slate-800">
        <Link 
          href="/"
          className="flex items-center justify-center px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
      </div>
    </aside>
  )
}