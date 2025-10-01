# Vercel Deployment Setup

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_zu4oL2POhBwX@ep-bold-surf-a7fxm62m.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30

DIRECT_URL=postgresql://neondb_owner:npg_zu4oL2POhBwX@ep-bold-surf-a7fxm62m-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
```

### NextAuth
```
NEXTAUTH_SECRET=yKXfbuebGHtAjHO3jalr6nQr8UFQ4v2vHp8E74u9JMk=

NEXTAUTH_URL=https://www.ausverity.com.au
```

### Public App URL
```
NEXT_PUBLIC_APP_URL=https://www.ausverity.com.au
```

## Important Notes

1. **Middleware**: The middleware has been temporarily disabled to work around Edge Runtime limitations with Prisma and bcrypt. Auth checks should be implemented at the page level.

2. **Database URL**: Make sure to use the direct connection URL (not the pooler) for `DATABASE_URL` to ensure stable connections during builds.

3. **NEXTAUTH_URL**: This should match your production domain (`https://www.ausverity.com.au`), not the Vercel preview URL.

4. **Build Issues**: If you encounter 404 errors on all pages:
   - Verify all environment variables are set correctly in Vercel
   - Check the build logs for any Edge Runtime warnings
   - Ensure the middleware is using the simplified version (no auth checks)

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] Database is accessible from Vercel
- [ ] Build completes successfully
- [ ] Homepage loads without 404
- [ ] Dynamic routes work (lawyer profiles, firm profiles)
- [ ] API routes respond correctly

## TODO: Future Improvements

- [ ] Re-implement middleware auth with Edge-compatible solution
- [ ] Add page-level auth checks to all protected routes:
  - `/admin/*` routes
  - `/lawyer/dashboard`
  - `/firm/dashboard`
  - `/dashboard`
  - `/profile`
