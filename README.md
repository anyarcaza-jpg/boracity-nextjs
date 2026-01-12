# 🏗️ BORACITY - Free Revit Families Platform

**Version:** 1.0.0  
**Status:** 🟢 Production Ready  
**Last Updated:** January 12, 2026

Modern web platform for downloading professional Revit families, BIM assets, and 3D models. Built with Next.js 15, TypeScript, and PostgreSQL.

---

## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/anyarcaza-jpg/boracity-nextjs.git
cd boracity-nextjs

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Admin Panel](#-admin-panel)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### ✅ Implemented (v1.0.0)

#### Admin Panel
- 🔐 **Secure Authentication** - NextAuth v5 with JWT sessions
- 📊 **Real-time Dashboard** - Statistics and analytics
- 📝 **Full CRUD** - Create, read, update, delete families
- 📤 **File Uploads** - .rfa files to R2, thumbnails to ImageKit
- 🔍 **Search & Filters** - Real-time search, category filters
- 📄 **Pagination** - Customizable items per page (5/10/25/50)
- 🎨 **Professional UI** - Boracity branded, responsive design
- 🚪 **Logout** - Secure session management

#### Backend
- 🗄️ **PostgreSQL Database** - Neon serverless with pooling
- ☁️ **Cloudflare R2** - Storage for .rfa files
- 🖼️ **ImageKit CDN** - Optimized image delivery
- 🔒 **Bcrypt Hashing** - Secure password storage
- ⚡ **API Routes** - RESTful endpoints with validation
- 🛡️ **Middleware Protection** - Route-based authentication

#### Frontend
- 🏠 **Homepage** - Hero, categories, stats, features
- 🎨 **Responsive Design** - Mobile, tablet, desktop
- 🧭 **Navigation** - Navbar, footer, breadcrumbs
- 🔍 **Search** - Autocomplete component (ready)

### 🔜 Coming Soon (v1.1+)

- 📑 **Category Pages** - Browse families by category
- 📖 **Family Detail Pages** - Full info, download tracking
- 👤 **User Registration** - Public user accounts
- ⭐ **Favorites** - Save families to collections
- 💬 **Comments & Ratings** - Community feedback
- 💳 **Premium Plans** - Monetization with Stripe

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 3.4
- **UI Components:** Lucide React

### Backend
- **Database:** PostgreSQL (Neon Serverless)
- **Auth:** NextAuth v5 (Auth.js)
- **File Storage:** Cloudflare R2 (S3 compatible)
- **Image CDN:** ImageKit
- **Password Hashing:** Bcrypt

### Deployment
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions (automatic)
- **Edge Network:** Vercel Edge
- **DNS:** Cloudflare (recommended)

### Development
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript strict mode
- **Version Control:** Git + GitHub

---

## 📁 Project Structure
```
boracity-nextjs/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/              # Login page
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin sidebar + auth check
│   │   │   ├── page.tsx            # Dashboard
│   │   │   └── families/
│   │   │       ├── page.tsx        # List (Server Component)
│   │   │       ├── FamiliesTableClient.tsx
│   │   │       ├── new/            # Create family
│   │   │       └── [slug]/edit/    # Edit family
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── families/       # CRUD endpoints
│   │   │   │   └── upload/         # File upload
│   │   │   └── auth/
│   │   │       └── [...nextauth]/  # NextAuth handlers
│   │   ├── revit/
│   │   │   └── [category]/
│   │   │       └── [slug]/         # Family detail (future)
│   │   ├── page.tsx                # Homepage
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── FamilyCard.tsx
│   │   └── search/
│   │       └── SearchAutocomplete.tsx
│   ├── lib/
│   │   ├── auth.ts                 # NextAuth config
│   │   ├── neon.ts                 # Database client
│   │   ├── imagekit.ts             # ImageKit client
│   │   └── r2/
│   │       └── upload.ts           # R2 upload functions
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts               # Route protection
├── public/
│   └── assets/
│       └── images/
├── docs/
│   ├── SESSION_20.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── BACKEND.md
│   ├── DEPLOYMENT.md
│   ├── PROGRESS.md
│   └── NEXT_SESSION.md
├── .env.local                      # Local environment variables
├── .env.example                    # Template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 🔐 Environment Variables

### Required Variables

Create `.env.local` in root directory:
```bash
# ===================================
# DATABASE
# ===================================
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# ===================================
# AUTHENTICATION (NextAuth v5)
# ===================================
# Generate: openssl rand -base64 32
AUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin credentials (initial setup)
ADMIN_EMAIL=admin@boracity.com
ADMIN_PASSWORD=Admin123!Change

# ===================================
# CLOUDFLARE R2 (File Storage)
# ===================================
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=boracity-files
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# ===================================
# IMAGEKIT (Image CDN)
# ===================================
IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxx

# For client-side access
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxx
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
```

### Get Credentials

**Neon (Database):**
1. Sign up at https://neon.tech
2. Create project → Copy connection string
3. Use **Pooled connection** for serverless

**Cloudflare R2:**
1. Go to https://dash.cloudflare.com
2. R2 → Create bucket → `boracity-files`
3. API Tokens → Create token → Read & Write
4. Enable public access for downloads

**ImageKit:**
1. Sign up at https://imagekit.io
2. Dashboard → Developer Options → API Keys
3. Copy Public Key, Private Key, URL endpoint

---

## 🎮 Scripts
```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript errors

# Utilities
npm run clean            # Remove .next directory
```

---

## 👨‍💼 Admin Panel

### Access Admin Panel

**URL:** `/admin`

**Default Credentials:**
- Email: `admin@boracity.com`
- Password: (set in `.env.local`)

⚠️ **Change password immediately after first login!**

### Features

#### Dashboard (`/admin`)
- Total families count
- Total downloads
- Total views
- Families by category breakdown
- Quick actions (Add new, Manage)

#### Manage Families (`/admin/families`)
- **List View:**
  - Search by name, slug, description
  - Filter by category
  - Pagination (5/10/25/50 per page)
  - Sort options
  
- **Create New (`/admin/families/new`):**
  - Name, category, description
  - Revit version selector
  - Upload .rfa file (→ Cloudflare R2)
  - Upload thumbnail (→ ImageKit)
  - Auto-generate slug
  - Validation checks

- **Edit (`/admin/families/[slug]/edit`):**
  - Update name, category, description
  - Slug is read-only (prevents broken links)
  - Re-upload files (optional)

- **Delete:**
  - Confirmation modal
  - Cascade delete (files remain in storage)

### Security

- ✅ JWT-based sessions
- ✅ Route protection via middleware
- ✅ Admin role validation
- ✅ Bcrypt password hashing
- ✅ CSRF protection (NextAuth)
- ✅ SQL injection prevention

---

## 📚 API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/families` | List all families |
| GET | `/api/families/[slug]` | Get family details |

### Admin Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/families` | Create family |
| GET | `/api/admin/families/[slug]` | Get family (admin) |
| PUT | `/api/admin/families/[slug]` | Update family |
| DELETE | `/api/admin/families/[slug]` | Delete family |
| POST | `/api/admin/upload` | Upload files |

**Authentication:** All admin endpoints require valid session with `role: 'admin'`.

**Full API docs:** See `docs/API.md`

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
```

2. **Import to Vercel:**
   - Go to https://vercel.com
   - Import GitHub repository
   - Select `boracity-nextjs`

3. **Add Environment Variables:**
   - Settings → Environment Variables
   - Add all variables from `.env.local`
   - Select: Production, Preview, Development

4. **Deploy:**
   - Vercel auto-deploys on every push to `main`
   - Preview deployments for pull requests

### Manual Deploy
```bash
# Build and test locally
npm run build
npm run start

# Deploy to Vercel
npx vercel --prod
```

### Post-Deployment

1. **Change admin password** in production
2. **Test all features:**
   - Login/logout
   - Create family
   - Upload files
   - Edit/delete
3. **Monitor logs:** Vercel Dashboard → Functions → Logs

**Full deployment guide:** See `docs/DEPLOYMENT.md`

---

## 📊 Database Schema

### families
```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  rfa_url TEXT,
  thumbnail_url TEXT,
  revit_version VARCHAR(10),
  file_size INTEGER,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Migrations:** See `docs/DEPLOYMENT.md#database-migrations`

---

## 🏗️ Architecture

### Pattern: Server Components + Client Components
```typescript
// Server Component (default) - Direct DB access
export default async function FamiliesPage() {
  const families = await sql`SELECT * FROM families`;
  return <FamiliesTableClient families={families} />;
}

// Client Component - Interactivity
'use client';
export default function FamiliesTableClient({ families }) {
  const [search, setSearch] = useState('');
  // ... interactive logic
}
```

**Benefits:**
- Less JavaScript sent to client
- Better performance
- Direct database queries
- Optimal for SEO

**Full architecture:** See `docs/ARCHITECTURE.md`

---

## 📈 Roadmap

### ✅ v1.0.0 (Current) - Admin Panel
- Admin authentication
- Full CRUD operations
- File uploads
- Search & filters

### 🎯 v1.1.0 (Next) - Public Frontend
- Category pages
- Family detail pages
- Search functionality
- Download tracking
- SEO optimization

### 🚀 v1.2.0 - User System
- User registration
- Favorites/collections
- Comments & ratings
- User profiles

### 💎 v2.0.0 - Monetization
- Premium plans (Stripe)
- Paid families
- Subscription management
- Analytics dashboard

---

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Database connection error:**
```bash
# Check DATABASE_URL format
# Use pooled connection string from Neon
# Verify database is active (not hibernated)
```

**Auth not working:**
```bash
# Verify AUTH_SECRET is set
# Check NEXTAUTH_URL matches your domain
# Clear browser cookies
```

**Files not uploading:**
```bash
# Check R2 credentials
# Verify ImageKit keys
# Check bucket/folder permissions
# Ensure file size < 50MB
```

---

## 🤝 Contributing

### Development Workflow

1. **Create feature branch:**
```bash
   git checkout -b feature/new-feature
```

2. **Make changes:**
   - Follow existing code style
   - Add TypeScript types
   - Write comments for complex logic

3. **Test locally:**
```bash
   npm run type-check
   npm run lint
   npm run build
```

4. **Commit:**
```bash
   git add .
   git commit -m "feat: add new feature"
```

5. **Push and create PR:**
```bash
   git push origin feature/new-feature
```

### Code Style

- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Server Components by default
- Client Components only when needed
- Meaningful variable names
- Comment complex logic

---

## 📄 License

**Proprietary** - All rights reserved.

This is a private project for Boracity. Unauthorized copying, distribution, or use is prohibited.

---

## 👤 Author

**Anyarcaza**
- GitHub: [@anyarcaza-jpg](https://github.com/anyarcaza-jpg)
- Email: admin@boracity.com

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Cloudflare R2](https://cloudflare.com/r2) - Object storage
- [ImageKit](https://imagekit.io) - Image CDN
- [Vercel](https://vercel.com) - Deployment platform
- [NextAuth](https://next-auth.js.org) - Authentication
- [TailwindCSS](https://tailwindcss.com) - Styling

---

## 📞 Support

For issues or questions:
1. Check `docs/` folder for detailed guides
2. Search existing GitHub issues
3. Create new issue with reproduction steps
4. Contact: admin@boracity.com

---

## 🎉 Changelog

### v1.0.0 (January 12, 2026)
- 🎉 Initial production release
- ✅ Admin panel complete
- ✅ Authentication system
- ✅ CRUD operations
- ✅ File upload system
- ✅ Search & filters
- ✅ Pagination
- ✅ Professional UI/UX

**Previous versions:** See `docs/SESSION_*.md`

---

## 📊 Project Stats

- **Sessions:** 20
- **Hours invested:** ~60
- **Files:** 50+
- **Lines of code:** ~5,000
- **Components:** 25+
- **API routes:** 10+
- **Database tables:** 2
- **Families:** 9
- **Total downloads:** 12,586
- **Total views:** 31,529

---

## 🔗 Quick Links

- **Documentation:** `/docs`
- **Admin Panel:** `/admin`
- **API Docs:** `/docs/API.md`
- **Architecture:** `/docs/ARCHITECTURE.md`
- **Deployment:** `/docs/DEPLOYMENT.md`
- **Progress:** `/docs/PROGRESS.md`

---

**Built with ❤️ for the architecture community**

**Version:** 1.0.0  
**Last Updated:** January 12, 2026  
**Status:** 🟢 Production Ready