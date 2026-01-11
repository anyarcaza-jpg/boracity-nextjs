# 🏛️ Boracity - Free Revit Families & 3D Assets

![Version](https://img.shields.io/badge/version-0.13.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production--Ready-success)

> Professional BIM content library for architects, designers, and students. Download high-quality Revit families, SketchUp models, and 3D assets — 100% free.

**🆕 NEW in v0.13.0:** Redesigned detail pages with minimalist UI, image gallery with zoom magnifier, and liquid glass effects!

---

## 🚀 Features

### ✨ Core Features
- **🔍 Smart Search Autocomplete** - Real-time suggestions with keyboard navigation
- **📦 Professional BIM Content** - Curated Revit families, SketchUp models, D5 Render assets
- **🖼️ Optimized Images** - ImageKit CDN with automatic optimization
- **📱 Fully Responsive** - Desktop, tablet, and mobile optimized
- **⚡ Fast Performance** - Next.js 15 with App Router, optimized builds
- **🎨 Modern UI/UX** - Clean, minimalist interface with liquid glass effects
- **♿ Accessible** - Keyboard navigation, ARIA labels, semantic HTML

### 🆕 Detail Pages v2.0 (v0.13.0)
- **🖼️ Image Gallery** - Navigate through multiple images with arrows and thumbnails
- **🔍 Zoom Magnifier** - Interactive x2.5 zoom with liquid glass lupa effect
- **👤 User Info** - Author profile with Follow, Like, Save, and Share actions
- **📊 Minimalist Stats** - Clean horizontal stats display (Likes, Downloads, Views, Collections)
- **🎯 Enhanced Download** - Prominent button with gradient and loading states
- **🏷️ Visual Tags** - Clickable tags for easy navigation
- **✨ Liquid Glass** - Subtle glass effects on key interactive elements

### 🔍 Autocomplete PRO (v0.12.0)
- **Real-time Suggestions** - Instant results as you type (300ms debounce)
- **Keyboard Navigation** - Full control with ↑↓ Enter Esc
- **Recent Searches** - LocalStorage-based history (max 5)
- **Thumbnails Preview** - See family previews before clicking
- **Mobile Optimized** - Bottom sheet UI for mobile devices
- **Smart Loading** - Spinner states and empty state handling
- **Click Outside Close** - Intuitive UX patterns
- **Smooth Animations** - CSS transitions and keyframes

### 🗂️ Content Features
- **Category Browsing** - Furniture, Doors, Windows, Lighting, and more
- **Advanced Filters** - Filter by category, sort by relevance/downloads/date
- **Search Results** - Fast search with highlighted results
- **Family Details** - Complete specs, downloads, metadata
- **Download Tracking** - View counts and download statistics

### 🎨 Design System
- **Tailwind CSS** - Utility-first styling
- **Custom Components** - Reusable, type-safe components
- **Dark Mode Ready** - Infrastructure for theme switching
- **Animations** - Smooth transitions and micro-interactions
- **Icons** - Lucide React icon library

---

## 📸 Screenshots

### Desktop - Autocomplete
```
┌────────────────────────────────────────────┐
│ Free Revit Families & 3D Assets           │
│        for Architects                      │
│                                            │
│ [chair________________] [🔍 Search]        │
│    ↓                                       │
│ ┌──────────────────────────────────────┐  │
│ │ RECENT SEARCHES        Clear all     │  │
│ ├──────────────────────────────────────┤  │
│ │ 🕒 door                               │  │
│ │ 🕒 window                             │  │
│ ├──────────────────────────────────────┤  │
│ │ [img] ALUNVA Bar Chair      1,247    │  │
│ │       Furniture                       │  │
│ │ [img] Armchair Ottoman        892    │  │
│ │       Furniture                       │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### Mobile - Bottom Sheet
```
┌──────────────────────┐
│                      │
│   [Hero Content]     │
│                      │
│ [chair___] [Search]  │
│                      │
├──────────────────────┤
│       ─────          │ ← Drag handle
│ [img] Bar Chair      │
│       Furniture      │
│ [img] Armchair       │
│       Furniture      │
│                      │
└──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.1.3 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Images:** Next.js Image + ImageKit CDN

### Backend
- **API Routes:** Next.js API Routes
- **Data:** TypeScript mock data (ready for database)
- **Storage:** LocalStorage (search history)

### Development
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript strict mode
- **Git Hooks:** Pre-commit validation

### Infrastructure
- **CDN:** ImageKit (image optimization)
- **Hosting:** Vercel (recommended)
- **Domain:** Custom domain ready

---

## 📦 Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Clone & Install
```bash
# Clone repository
git clone https://github.com/yourusername/boracity-nextjs.git
cd boracity-nextjs

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Quick Start

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables
Create `.env.local`:
```env
# ImageKit (optional, for image optimization)
NEXT_PUBLIC_IMAGEKIT_ID=your_imagekit_id

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## 📁 Project Structure
```
boracity-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── search/            # Search results page
│   │   ├── revit/             # Category pages
│   │   │   └── [category]/
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # ✨ Detail page (v0.13.0)
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/                # ✨ NEW: Base UI components
│   │   │   └── GlassCard.tsx
│   │   ├── detail/            # ✨ NEW: Detail page components
│   │   │   ├── ImageGallery.tsx      # Gallery with zoom
│   │   │   ├── UserInfo.tsx          # User + actions
│   │   │   ├── MetadataStats.tsx     # Stats display
│   │   │   └── DownloadButton.tsx    # Download CTA
│   │   ├── search/            # Search components
│   │   │   ├── SearchAutocomplete.tsx
│   │   │   ├── SearchSuggestion.tsx
│   │   │   └── SearchRecent.tsx
│   │   ├── FamilyCard.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDebounce.ts
│   │   └── useClickOutside.ts
│   │
│   ├── lib/                   # Utilities & helpers
│   │   ├── utils.ts           # ✨ NEW: CN helper & formatters
│   │   ├── families.ts        # Family service layer
│   │   ├── searchHistory.ts   # LocalStorage manager
│   │   ├── imagekit.ts        # Image optimization
│   │   └── validators.ts      # Input validation
│   │
│   ├── data/                  # Data layer
│   │   ├── mock/              # Mock data (dev)
│   │   └── models/            # TypeScript models
│   │
│   └── types/                 # TypeScript types
│       └── index.ts
│
├── public/                    # Static assets
│   ├── images/
│   └── fonts/
│
├── docs/                      # Documentation
│   ├── SESSION_17_UX_REDESIGN_COMPLETE.md  # ✨ NEW
│   ├── SESSION_16_AUTOCOMPLETE_PRO.md
│   ├── SESSION_15_COMPLETE.md
│   └── ARCHITECTURE.md
│
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## 🎯 Key Features Explained

### 1. Autocomplete System

**Performance Optimization:**
```typescript
// Debounce reduces API calls by 80%
const debouncedQuery = useDebounce(query, 300);

// Without debounce: 5 API calls for "chair"
// With debounce: 1 API call when user stops typing
```

**Keyboard Navigation:**
- `↓` Next suggestion
- `↑` Previous suggestion  
- `Enter` Select/Search
- `Esc` Close dropdown

**LocalStorage Persistence:**
```typescript
SearchHistory.addSearch('chair');    // Save search
SearchHistory.getHistory();          // ['chair', 'door']
SearchHistory.clearHistory();        // Clear all
```

### 2. Image Optimization

**ImageKit Integration:**
```typescript
// Automatic format selection (WebP, AVIF)
// Lazy loading
// Responsive sizing
const url = getThumbnailUrl('bar-chair.png', 'furniture');
// → https://ik.imagekit.io/.../bar-chair.png?tr=w-400,q-80,f-auto
```

### 3. Responsive Design

**Breakpoints:**
- Mobile: `< 768px` (Bottom sheet UI)
- Tablet: `768px - 1024px` (Hybrid)
- Desktop: `> 1024px` (Dropdown UI)

**Mobile-First Approach:**
```css
/* Mobile by default */
.dropdown { position: fixed; bottom: 0; }

/* Desktop override */
@media (min-width: 768px) {
  .dropdown { position: absolute; top: 100%; }
}
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] Search autocomplete appears on typing
- [ ] Keyboard navigation works (↑↓ Enter Esc)
- [ ] Recent searches persist after reload
- [ ] Click outside closes dropdown
- [ ] Mobile bottom sheet works
- [ ] Images load from ImageKit
- [ ] Loading states appear
- [ ] Empty states show correctly
- [ ] Search results page works

### Browser Testing
- [x] Chrome 120+
- [x] Firefox 120+
- [x] Safari 17+
- [x] Edge 120+
- [x] Mobile Chrome
- [x] Mobile Safari

---

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 95+
- **SEO:** 100

### Optimizations Applied
- ✅ Next.js Image optimization
- ✅ ImageKit CDN with auto-format
- ✅ Debounced search (80% fewer API calls)
- ✅ Code splitting (automatic)
- ✅ Lazy loading components
- ✅ Optimized fonts (local)
- ✅ Minimal JavaScript bundle

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (v0.1.0 - v0.13.0)
- [x] Project setup & architecture
- [x] Homepage with hero
- [x] Category browsing
- [x] Search functionality
- [x] Family detail pages
- [x] Autocomplete PRO
- [x] Mobile responsive
- [x] Image optimization
- [x] **Detail page redesign with gallery** ✨ NEW
- [x] **Zoom magnifier with liquid glass** ✨ NEW
- [x] **User interactions (Follow, Like, Save, Share)** ✨ NEW

### Phase 2: Enhancement 🚧 (v0.14.0 - v0.20.0)
- [ ] SEO advanced (FAQ Schema, HowTo Schema)
- [ ] Related families improved
- [ ] Responsive mobile optimization
- [ ] User authentication
- [ ] Favorites system
- [ ] Download history
- [ ] Advanced filters
- [ ] Search analytics
- [ ] Voice search
- [ ] Collections/Playlists
- [ ] Comments & ratings

### Phase 3: Scale 📅 (v1.0.0+)
- [ ] Database integration (Postgres)
- [ ] Real file uploads
- [ ] User-generated content
- [ ] Admin dashboard
- [ ] API documentation
- [ ] Mobile app (React Native)
- [ ] Premium features

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Test on mobile before PR
- Update documentation

---

## 📝 Documentation

### Available Docs
- [SESSION_17_UX_REDESIGN_COMPLETE.md](docs/SESSION_17_UX_REDESIGN_COMPLETE.md) - ✨ Detail page redesign (v0.13.0)
- [SESSION_16_AUTOCOMPLETE_PRO.md](docs/SESSION_16_AUTOCOMPLETE_PRO.md) - Autocomplete features
- [SESSION_15_COMPLETE.md](docs/SESSION_15_COMPLETE.md) - Search system implementation
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical architecture
- [SEO_STRATEGY.md](docs/SEO_STRATEGY.md) - SEO guidelines

### Code Comments
All major functions include JSDoc comments:
```typescript
/**
 * Fetch suggestions from API with debounce
 * @param searchTerm - User query string
 */
const fetchSuggestions = async (searchTerm: string) => {
  // Implementation
}
```

---

## 🐛 Known Issues

### Current
None! 🎉

### Reported & Fixed
- ~~URLs duplicating in OptimizedImage~~ (Fixed in v0.12.0)
- ~~Mobile dropdown covering navbar~~ (Fixed in v0.12.0)
- ~~ImageKit 404 errors~~ (Fixed in v0.12.0)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👥 Team

**Lead Developer:** Your Name  
**Architecture:** Claude (Anthropic)  
**Design:** Tailwind Labs  
**Icons:** Lucide Icons

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [ImageKit](https://imagekit.io/) - Image optimization CDN
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/boracity-nextjs/issues)
- **Email:** support@boracity.com
- **Docs:** [Documentation](docs/)

---

## 🌟 Star Us!

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for architects and designers worldwide**

Last updated: January 11, 2026 | Version 0.13.0