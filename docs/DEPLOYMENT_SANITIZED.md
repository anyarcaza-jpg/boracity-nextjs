# 🚀 Deployment Guide - Boracity Next.js

## ✅ Deployed Successfully on Vercel

**Live URL:** https://boracity-nextjs.vercel.app  
**Deployment Date:** January 11, 2026  
**Platform:** Vercel  

---

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git repository connected to Vercel
- Accounts set up on:
  - Neon (PostgreSQL)
  - Cloudflare (R2)
  - ImageKit (CDN)

---

## 🎯 Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

### 2. Vercel Auto-Deploy

Vercel automatically detects changes and deploys:
- Build time: ~2-3 minutes
- Auto-detects Next.js framework
- Runs `npm install` and `npm run build`

---

## 🔐 Environment Variables Setup

### Required Environment Variables

Configure these in Vercel Dashboard → Settings → Environment Variables:

```env
# ===================================
# NEXT.JS PUBLIC
# ===================================
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# ===================================
# DATABASE (Neon PostgreSQL)
# ===================================
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require

# ===================================
# NEXTAUTH
# ===================================
AUTH_SECRET=your-super-secret-key-here-32-chars-minimum
NEXTAUTH_URL=https://your-domain.vercel.app

# ===================================
# ADMIN USER
# ===================================
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# ===================================
# IMAGEKIT (Image CDN)
# ===================================
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxx

# Para el servidor (APIs)
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# ===================================
# CLOUDFLARE R2 (File Storage)
# ===================================
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your-bucket-name
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

---

## 📝 How to Obtain Credentials

### 1. Neon PostgreSQL

1. Go to: https://console.neon.tech
2. Create a new project
3. Go to Dashboard → Connect
4. Copy the connection string (pooled)
5. Paste as `DATABASE_URL`

**Format:**
```
postgresql://username:password@host.neon.tech/database?sslmode=require
```

---

### 2. Cloudflare R2

1. Go to: https://dash.cloudflare.com
2. Navigate to R2 → Manage R2 API Tokens
3. Create API Token with "Read and Write" permissions
4. Copy:
   - Account ID
   - Access Key ID
   - Secret Access Key
5. Get your bucket name from R2 dashboard
6. Get public URL from bucket settings

---

### 3. ImageKit

1. Go to: https://imagekit.io/dashboard
2. Navigate to Developer Options → API Keys
3. Copy:
   - Public Key
   - Private Key
   - URL Endpoint

**Note:** Public keys are safe to expose in frontend. Private keys must remain secret.

---

### 4. NextAuth Secret

Generate a secure random string (32+ characters):

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## ⚠️ Common Issues & Solutions

### Issue #1: React 19 Compatibility

**Error:**
```
Conflicting peer dependency: react@18.3.1
lucide-react@"0.263.1" requires react "^18.0.0"
```

**Solution:**
Use React 18 instead of React 19. Update `package.json`:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

---

### Issue #2: Next.js 15 Params API Change

**Error:**
```
Type '{ params: { category: string } }' does not satisfy PageProps
```

**Solution:**
In Next.js 15, `params` is now a Promise. Update all dynamic routes:

**Before (Next.js 14):**
```typescript
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
}
```

**After (Next.js 15):**
```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
}
```

**Files affected:**
- `src/app/revit/[category]/page.tsx`
- `src/app/revit/[category]/[slug]/page.tsx`

---

### Issue #3: useSearchParams() Requires Suspense

**Error:**
```
useSearchParams() should be wrapped in a suspense boundary
```

**Solution:**
Wrap components using `useSearchParams()` with `<Suspense>`:

```typescript
import { Suspense } from 'react';

function SearchComponent() {
  const searchParams = useSearchParams();
  // component logic
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}
```

---

### Issue #4: Database Connection Errors

**Error:**
```
Connection timeout
Error: getaddrinfo ENOTFOUND
```

**Solutions:**

1. **Check DATABASE_URL format:**
   - Must include `?sslmode=require`
   - Use pooled connection string from Neon

2. **Whitelist Vercel IPs in Neon:**
   - Neon → Settings → IP Allow
   - Add: `0.0.0.0/0` (allow all) or Vercel's IP ranges

3. **Verify connection string:**
```bash
# Test locally
npx tsx scripts/test-connection.ts
```

---

### Issue #5: ImageKit Upload Fails

**Error:**
```
Authentication failed
Invalid signature
```

**Solutions:**

1. **Verify all 3 keys are set:**
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`

2. **Check for trailing slashes:**
   - URL should be: `https://ik.imagekit.io/your_id`
   - NOT: `https://ik.imagekit.io/your_id/`

3. **Regenerate keys if needed:**
   - ImageKit Dashboard → Developer Options → API Keys → Regenerate

---

### Issue #6: R2 Upload Fails

**Error:**
```
403 Forbidden
The AWS Access Key Id you provided does not exist
```

**Solutions:**

1. **Verify credentials are correct:**
   - Account ID matches your Cloudflare account
   - Access Key ID and Secret are from active token
   - Bucket name is correct

2. **Check token permissions:**
   - Token must have "Read and Write" permissions
   - Token must not be expired or revoked

3. **Test connection:**
```bash
npx tsx scripts/test-r2.ts
```

---

## 🔒 Security Best Practices

### 1. Rotate Credentials Regularly

**When to rotate:**
- Every 90 days (recommended)
- When team member leaves
- If credentials are exposed
- After security incident

**How to rotate:**

**Cloudflare R2:**
1. Create new API token
2. Update environment variables
3. Revoke old token

**ImageKit:**
1. Regenerate Private Key in dashboard
2. Update environment variables

**Neon:**
1. Reset password in console
2. Update DATABASE_URL

---

### 2. Never Commit Credentials

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.development
```

---

### 3. Use Environment-Specific Variables

**Development:**
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production:**
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

### 4. Restrict API Access

**Cloudflare R2:**
- Use separate tokens for dev/prod
- Limit token to specific buckets
- Set IP restrictions if possible

**ImageKit:**
- Use restricted keys with specific permissions
- Separate keys for different environments

**Neon:**
- Use connection pooling for serverless
- Set connection limits
- Enable SSL mode

---

## 📊 Monitoring & Logs

### Vercel Dashboard

Monitor deployment health:
- Build logs: Vercel → Deployments → [Your Deploy] → Build Logs
- Runtime logs: Vercel → Deployments → [Your Deploy] → Runtime Logs
- Analytics: Vercel → Analytics

---

### Database Monitoring

**Neon Console:**
- Queries per second
- Connection count
- Storage usage
- CPU usage

Navigate to: Neon → Your Project → Monitoring

---

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

---

## 🚀 Performance Optimization

### 1. Enable Caching

```typescript
// In API routes
export const revalidate = 60; // Cache for 60 seconds

// In pages
export const revalidate = 3600; // Cache for 1 hour
```

---

### 2. Optimize Images

Already configured via ImageKit:
- Automatic format conversion (WebP)
- Lazy loading
- Responsive images
- CDN delivery

---

### 3. Database Query Optimization

Use indexes for frequently queried fields:

```sql
-- Already created
CREATE INDEX idx_families_category ON families(category);
CREATE INDEX idx_families_slug ON families(slug);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
```

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured in Vercel
- [ ] Database migrations run on production DB
- [ ] Admin user created
- [ ] Test uploads (images + files)
- [ ] Test authentication flow
- [ ] Test favorites system
- [ ] Test search functionality
- [ ] Verify all pages render correctly
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Test in multiple browsers
- [ ] Set up error monitoring
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (auto with Vercel)

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

**Main Branch (Production):**
```
git push origin main
→ Vercel detects push
→ Runs build
→ Deploys to production
→ URL: https://boracity-nextjs.vercel.app
```

**Preview Deployments:**
```
git push origin feature-branch
→ Vercel creates preview deployment
→ Unique URL: https://boracity-nextjs-[hash].vercel.app
```

---

### Manual Deployments

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Vercel provides DNS records

### 2. Configure DNS

Add these records to your DNS provider:

**For root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Update Environment Variables

```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 📞 Support & Resources

### Official Documentation

- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **Neon:** https://neon.tech/docs
- **Cloudflare R2:** https://developers.cloudflare.com/r2
- **ImageKit:** https://docs.imagekit.io

### Community

- **Next.js Discord:** https://discord.gg/nextjs
- **Vercel Discord:** https://discord.gg/vercel

---

## 🎉 Deployment Complete!

Your Boracity application is now live and accessible at:
**https://boracity-nextjs.vercel.app**

For issues or questions, refer to the troubleshooting section above.

---

**Last Updated:** January 16, 2026  
**Maintained by:** @anyarcaza-jpg