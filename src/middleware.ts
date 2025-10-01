import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function middleware(request: NextRequest) {
  // Middleware temporarily allows all requests through
  // Auth checks are handled at the page level using server components
  // This is necessary because Edge Runtime (used by Vercel middleware) doesn't support Prisma/bcrypt
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
