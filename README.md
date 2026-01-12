# Boracity - Revit Family Library Platform

> Professional platform for downloading free Revit families for architecture and BIM projects.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech/)
[![Cloudflare R2](https://img.shields.io/badge/Storage-R2-orange)](https://www.cloudflare.com/products/r2/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🚀 Project Status

**Current Version:** v0.14.0  
**Status:** ✅ Production (Backend Implemented)

### Implementation Progress

- ✅ **Frontend** (v0.13.0) - Complete
  - Modern UI with Next.js 15 + React 19
  - Responsive design
  - Category system (Furniture, Doors, Windows, Lighting)
  - Search and filters
  - Individual family pages
  - SEO optimized

- ✅ **Backend** (v0.14.0) - Complete ⭐ NEW
  - PostgreSQL database (Neon)
  - Cloudflare R2 for file storage
  - 8 families in production
  - RESTful APIs
  - Signed URLs for secure downloads
  - Cost: $0/month (free tiers)

- 🟡 **Admin Panel** (v0.15.0) - Next Session
  - Authentication system
  - CRUD for families
  - File upload to R2
  - Dashboard with statistics

---

## 📊 Current Data

- **Families:** 8 (migrated from mock data)
- **Categories:** 4 (Furniture, Doors, Windows, Lighting)
- **Database:** PostgreSQL (Neon serverless)
- **Storage:** Cloudflare R2
- **CDN:** ImageKit for images

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.1.4 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **State:** React 19 (RSC + Server Actions)

### Backend
- **Database:** PostgreSQL (Neon serverless)
- **ORM:** Native SQL with `@neondatabase/serverless`
- **File Storage:** Cloudflare R2 (S3-compatible)
- **Image CDN:** ImageKit
- **Authentication:** (Pending - Session 20)

### Infrastructure
- **Hosting:** Vercel (Free tier)
- **Database:** Neon (Free tier - 0.5GB)
- **Storage:** Cloudflare R2 (Free tier - 10GB)
- **CI/CD:** GitHub Actions + Vercel auto-deploy

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode
- **Git Hooks:** Husky (optional)

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────┐
│           FRONTEND (Next.js 15)                 │
│  • App Router (RSC)                             │
│  • Server Components                            │
│  • Client Components                            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         SERVICE LAYER (lib/families.ts)         │
│  • React cache (request-level)                  │
│  • Next.js cache (data-level)                   │
│  • Error handling                               │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌─────────────┐      ┌──────────────────┐
│  DATABASE   │      │   FILE STORAGE   │
│  (Neon)     │      │   (R2)           │
├─────────────┤      ├──────────────────┤
│ PostgreSQL  │      │ Cloudflare R2    │
│ 8 families  │      │ .rfa files       │
│ Serverless  │      │ Signed URLs      │
└─────────────┘      └──────────────────┘
```

---

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/anyarcaza-jpg/boracity-nextjs.git
cd boracity-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root:
```bash
# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ImageKit CDN
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key

# Neon Database
DATABASE_URL=postgresql://user:password@host/database

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=boracity-files
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

### Neon PostgreSQL

1. Create account at [neon.tech](https://neon.tech)
2. Create project "Boracity"
3. Get connection string
4. Run migration:
```bash
# Execute SQL schema
psql $DATABASE_URL < migrations/001_initial.sql
```

5. Seed initial data:
```bash
npx tsx scripts/seed.ts
```

---

## 📂 Project Structure
```
boracity-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/       # Public pages
│   │   ├── revit/             # Family pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   └── features/         # Feature components
│   ├── lib/                   # Utilities
│   │   ├── db/               # Database queries
│   │   │   ├── families.ts   # Family queries
│   │   │   └── adapters.ts   # DB ↔ Frontend adapter
│   │   ├── r2/               # Cloudflare R2
│   │   │   ├── client.ts     # R2 client
│   │   │   └── download.ts   # Signed URLs
│   │   ├── neon.ts           # Database connection
│   │   ├── families.ts       # Service layer
│   │   └── utils.ts          # Utilities
│   ├── types/                 # TypeScript types
│   └── data/                  # Static data
├── public/                    # Static assets
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
│   └── seed.ts               # Data seeding
├── migrations/                # SQL migrations
│   └── 001_initial.sql       # Initial schema
└── tests/                     # Tests (pending)
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
```bash
# Push to GitHub
git push origin main
```

2. **Configure on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import repository
- Add environment variables
- Deploy

3. **Environment Variables in Vercel**

All variables from `.env.local` must be configured in:
**Settings → Environment Variables**

---

## 📊 Performance

- **Homepage load:** ~800ms (with cache)
- **Individual page:** ~400ms (with cache)
- **Database query:** ~50-100ms
- **Build time:** ~90 seconds
- **Lighthouse score:** 95+ (mobile)

---

## 💰 Costs

### Current (with free tiers)
- **Neon PostgreSQL:** $0/month
- **Cloudflare R2:** $0/month
- **Vercel Hosting:** $0/month
- **ImageKit CDN:** $0/month
- **Total:** $0/month 🎉

### Projected (with growth)
- **Neon:** $0-19/month
- **R2:** $0-5/month
- **Vercel:** $0-20/month
- **Total:** $0-44/month (scalable)

---

## 🧪 Testing
```bash
# Run tests (pending implementation)
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

---

## 📖 Documentation

Full documentation available in `/docs`:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[BACKEND.md](docs/BACKEND.md)** - Backend technical manual
- **[API.md](docs/API.md)** - API documentation
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide
- **[SESSION_19_BACKEND.md](docs/SESSION_19_BACKEND.md)** - Backend implementation session

---

## 🗺️ Roadmap

### v0.15.0 - Admin Panel (Next)
- [ ] Authentication system (Clerk/NextAuth)
- [ ] Admin dashboard
- [ ] CRUD for families
- [ ] File upload to R2
- [ ] User management

### v0.16.0 - User Features
- [ ] User registration/login
- [ ] Collections/Favorites
- [ ] Download history
- [ ] User profiles

### v0.17.0 - Social Features
- [ ] Comments on families
- [ ] Ratings and reviews
- [ ] Share functionality
- [ ] Newsletter system

### v0.18.0 - Advanced Features
- [ ] Advanced search with filters
- [ ] Family comparison tool
- [ ] Recommendations engine
- [ ] Analytics dashboard

### v1.0.0 - Production Ready
- [ ] Complete testing suite
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Monitoring and alerts
- [ ] Documentation complete

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Anyarcaza**
- GitHub: [@anyarcaza-jpg](https://github.com/anyarcaza-jpg)
- Website: [boracity.com](https://boracity.com)

---

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Vercel** for free hosting
- **Neon** for serverless PostgreSQL
- **Cloudflare** for R2 storage
- **shadcn** for beautiful UI components
- **Community** for support and feedback

---

## 📞 Support

- **Email:** support@boracity.com
- **Issues:** [GitHub Issues](https://github.com/anyarcaza-jpg/boracity-nextjs/issues)
- **Discussions:** [GitHub Discussions](https://github.com/anyarcaza-jpg/boracity-nextjs/discussions)

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/anyarcaza-jpg/boracity-nextjs?style=social)
![GitHub forks](https://img.shields.io/github/forks/anyarcaza-jpg/boracity-nextjs?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/anyarcaza-jpg/boracity-nextjs?style=social)

---

**Built with ❤️ for the BIM community**

---

*Last updated: January 11, 2026*