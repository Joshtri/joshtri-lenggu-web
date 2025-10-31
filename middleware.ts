import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes that don't need authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/login(.*)',
  '/auth/signup(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware((auth, request) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return
  }

  // Protect all other routes (optional - comment out if you want all routes public for now)
  // auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}