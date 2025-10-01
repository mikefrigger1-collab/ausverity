import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { normalizeStateCode } from "@/lib/constants/states"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware checking:', pathname)

  // Redirect old /lawyer/[slug] URLs to new /[state]/lawyer/[slug] format
  const oldLawyerPattern = /^\/lawyer\/([a-z0-9-]+)$/i
  const oldLawyerMatch = pathname.match(oldLawyerPattern)
  if (oldLawyerMatch) {
    const slug = oldLawyerMatch[1]
    console.log('🔄 Old lawyer URL detected, looking up state:', slug)

    try {
      const lawyer = await db.lawyer.findUnique({
        where: { slug, status: 'PUBLISHED' },
        select: { state: true }
      })

      if (lawyer?.state) {
        const stateCode = normalizeStateCode(lawyer.state)
        if (stateCode) {
          const newUrl = `/${stateCode}/lawyer/${slug}`
          console.log('🔄 Redirecting to:', newUrl)
          return NextResponse.redirect(new URL(newUrl, request.url), 301)
        }
      }
    } catch (error) {
      console.error('❌ Error looking up lawyer for redirect:', error)
    }
  }

  // Redirect old /firm/[slug] URLs to new /[state]/firm/[slug] format
  const oldFirmPattern = /^\/firm\/([a-z0-9-]+)$/i
  const oldFirmMatch = pathname.match(oldFirmPattern)
  if (oldFirmMatch) {
    const slug = oldFirmMatch[1]
    console.log('🔄 Old firm URL detected, looking up state:', slug)

    try {
      const firm = await db.lawFirm.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
          locations: {
            where: { isPrimary: true },
            take: 1
          }
        }
      })

      if (firm?.locations?.[0]?.state) {
        const stateCode = normalizeStateCode(firm.locations[0].state)
        if (stateCode) {
          const newUrl = `/${stateCode}/firm/${slug}`
          console.log('🔄 Redirecting to:', newUrl)
          return NextResponse.redirect(new URL(newUrl, request.url), 301)
        }
      }
    } catch (error) {
      console.error('❌ Error looking up firm for redirect:', error)
    }
  }

  // Allow public routes that don't need auth
  const publicRoutes = ['/', '/search', '/login', '/register', '/forgot-password', '/submit-review']
  if (publicRoutes.includes(pathname)) {
    console.log('✅ Public route - allowing:', pathname)
    return NextResponse.next()
  }

  // Allow new state-based public profile routes
  const newPublicProfilePattern = /^\/[a-z]{2,3}\/(lawyer|firm)\/[a-z0-9-]+$/i
  if (newPublicProfilePattern.test(pathname)) {
    console.log('✅ State-based public profile route - allowing:', pathname)
    return NextResponse.next()
  }

  // Allow state pages
  const statePagePattern = /^\/[a-z]{2,3}$/i
  if (statePagePattern.test(pathname)) {
    console.log('✅ State page route - allowing:', pathname)
    return NextResponse.next()
  }

  // Allow public profile routes FIRST - before any other checks
  const publicProfilePattern = /^\/(lawyer|firm)\/[a-z0-9-]+$/i
  if (publicProfilePattern.test(pathname)) {
    console.log('✅ Public profile route - allowing:', pathname)
    return NextResponse.next()
  }

  // Get session only for protected routes
  let session
  try {
    session = await auth()
  } catch (error) {
    console.error('❌ Auth error in middleware:', error)
    // If auth fails completely, allow the request to continue for public routes
    return NextResponse.next()
  }

  // Admin routes - only ADMIN role
  if (pathname.startsWith('/admin')) {
    console.log('🔐 Admin route check:', pathname)
    if (!session?.user) {
      console.log('❌ No session - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.user.role !== 'ADMIN') {
      console.log('❌ Not admin - redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('✅ Admin authorized')
    return NextResponse.next()
  }

  // Protected lawyer routes (dashboard, profile editing, etc.)
  if (pathname.startsWith('/lawyer/')) {
    console.log('🔐 Protected lawyer route check:', pathname)
    if (!session?.user) {
      console.log('❌ No session - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.user.role !== 'LAWYER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN') {
      console.log('❌ Wrong role - redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('✅ Lawyer authorized')
    return NextResponse.next()
  }

  // Protected firm routes
  if (pathname.startsWith('/firm/')) {
    console.log('🔐 Protected firm route check:', pathname)
    if (!session?.user) {
      console.log('❌ No session - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.user.role !== 'FIRM_OWNER' && session.user.role !== 'LAWYER_FIRM_OWNER' && session.user.role !== 'ADMIN') {
      console.log('❌ Wrong role - redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('✅ Firm owner authorized')
    return NextResponse.next()
  }

  // General dashboard routes - any authenticated user
  if (pathname.startsWith('/dashboard')) {
    console.log('🔐 Dashboard route check:', pathname)
    if (!session?.user) {
      console.log('❌ No session - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    console.log('✅ User authorized')
    return NextResponse.next()
  }

  // Profile routes - any authenticated user
  if (pathname.startsWith('/profile')) {
    console.log('🔐 Profile route check:', pathname)
    if (!session?.user) {
      console.log('❌ No session - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    console.log('✅ User authorized')
    return NextResponse.next()
  }

  // If we get here, it's not a protected route - allow access
  console.log('✅ Unprotected route - allowing:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth routes - let NextAuth handle these)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
}
