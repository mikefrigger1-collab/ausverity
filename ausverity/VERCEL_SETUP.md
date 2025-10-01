# Vercel Deployment Setup

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### Database
**IMPORTANT:** Remove `&channel_binding=require` if present - it causes connection failures!

```
DATABASE_URL=postgresql://neondb_owner:npg_zu4oL2POhBwX@ep-bold-surf-a7fxm62m.ap-southeast-2.aws.neon.tech/neondb?sslmode=require

DIRECT_URL=postgresql://neondb_owner:npg_zu4oL2POhBwX@ep-bold-surf-a7fxm62m-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
```

Note: DATABASE_URL should use the **direct connection** (without `-pooler`), DIRECT_URL should use the **pooled connection** (with `-pooler`).

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

1. **Middleware**: The middleware file has been COMPLETELY REMOVED to fix 404 errors. Even an empty middleware file can cause routing failures in Vercel.

2. **Database URL**:
   - Use the **direct connection** (without `-pooler`) for `DATABASE_URL`
   - Use the **pooled connection** (with `-pooler`) for `DIRECT_URL`
   - **Remove `&channel_binding=require`** - this parameter causes connection failures!

3. **NEXTAUTH_URL**: This should match your production domain (`https://www.ausverity.com.au`), not the Vercel preview URL.

4. **Homepage**: The homepage is now statically generated with fallback stats, so it doesn't require database connection at build time.

5. **Output Mode**: `output: 'standalone'` is configured in next.config.ts for optimal Vercel deployment.

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
