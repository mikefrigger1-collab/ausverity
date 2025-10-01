// Middleware temporarily disabled due to Edge Runtime limitations with Prisma/bcrypt
// Auth checks are now handled at the page level
// TODO: Re-enable with Edge-compatible auth solution

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  // Allow all requests through for now
  // Auth is handled in individual pages
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}