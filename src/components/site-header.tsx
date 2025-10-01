"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AUSTRALIAN_STATES } from "@/lib/constants/states"
import {
  Shield,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Building2,
  Scale,
  HelpCircle,
  MapPin,
  ChevronDown
} from "lucide-react"

export function SiteHeader() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const navigation = [
    { name: "About", href: "/about", icon: HelpCircle },
  ]

  const states = AUSTRALIAN_STATES.map(state => ({
    code: state.code,
    name: state.name,
    shortName: state.shortName
  }))

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/dashboard"

    switch (session.user.role) {
      case "ADMIN":
        return "/admin"
      case "LAWYER":
        return "/lawyer/dashboard"
      case "FIRM_OWNER":
        return "/firm/dashboard"
      case "LAWYER_FIRM_OWNER":
        return "/dual-dashboard"
      default:
        return "/dashboard"
    }
  }

  // Handle scroll to show/hide header
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down & past threshold
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])

  return (
    <header className={`sticky z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm transition-all duration-300 ${
      isVisible ? 'top-0 opacity-100' : '-top-20 opacity-0'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              AusVerity
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8">


            {/* States Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200">
                  <MapPin className="h-4 w-4" />
                  <span>States</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">
                  Browse by State
                </div>
                <DropdownMenuSeparator />
                {states.map((state) => (
                  <DropdownMenuItem key={state.code} asChild>
                    <Link href={`/${state.code}`} className="flex items-center justify-between cursor-pointer">
                      <span>{state.name}</span>
                      <span className="text-xs text-slate-500">{state.shortName}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/search" className="flex items-center cursor-pointer font-medium">
                    <Search className="mr-2 h-4 w-4" />
                    <span>See All Lawyers</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

                        {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {session?.user ? (
              <>
                {/* Dashboard Link for authenticated users */}
                <Link href={getDashboardLink()} className="hidden lg:block">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-3">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user.name && (
                          <p className="font-medium text-slate-900">{session.user.name}</p>
                        )}
                        {session.user.email && (
                          <p className="w-[200px] truncate text-sm text-slate-500">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Guest Navigation */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-medium px-4">
                      Join AusVerity
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo - Fixed Header */}
                  <div className="flex items-center space-x-3 px-6 py-6 border-b border-slate-200">
                    <Shield className="h-7 w-7 text-blue-600" />
                    <span className="text-xl font-bold text-slate-900">AusVerity</span>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-6">
                      {/* Mobile Navigation */}


                      {/* Mobile States Section */}
                      <div className="pt-4">
                        <div className="px-4 mb-3">
                          <h3 className="text-sm font-semibold text-slate-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Browse by State
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {states.map((state) => (
                            <Link
                              key={state.code}
                              href={`/${state.code}`}
                              onClick={() => setIsOpen(false)}
                              className="flex flex-col items-center justify-center px-3 py-3 text-center bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                              <span className="text-sm font-medium">{state.shortName}</span>
                              <span className="text-xs text-slate-500 mt-0.5">{state.name.split(' ')[0]}</span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/search"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3.5 mt-3 text-base font-medium text-slate-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Search className="h-5 w-5 flex-shrink-0" />
                          <span>See All Lawyers</span>
                        </Link>
                      </div>

                                            <nav className="flex flex-col space-y-1 pt-4 border-t border-slate-200">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3.5 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </nav>

                      {/* Mobile Auth Section */}
                      {session?.user ? (
                        <div className="space-y-3 pt-4 border-t border-slate-200">
                          {/* User Info */}
                          <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg">
                            <Avatar className="h-11 w-11 flex-shrink-0">
                              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-base">
                                {session.user.name?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate text-base">{session.user.name}</p>
                              <p className="text-sm text-slate-500 truncate">{session.user.email}</p>
                            </div>
                          </div>

                          <Link
                            href={getDashboardLink()}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3.5 text-base font-medium text-slate-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                            <span>Dashboard</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" size="lg" className="w-full justify-center font-medium text-base h-12 mb-4">
                              Log In
                            </Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            <Button size="lg" className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-medium text-base h-12">
                              Join AusVerity
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed Footer - Logout Button */}
                  {session?.user && (
                    <div className="border-t border-slate-200 px-6 py-4">
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        size="lg"
                        className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-medium text-base h-12"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Log out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}