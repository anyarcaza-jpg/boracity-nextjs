# 🏗️ ARCHITECTURE - BORACITY

**Version:** v0.3.1  
**Last Updated:** January 3, 2026  
**Purpose:** Complete architectural documentation for future AI context

---

## 🎯 **ARCHITECTURAL OVERVIEW**

Boracity follows a **professional, scalable architecture** based on Next.js 15 App Router best practices.

### **Key Principles:**
1. **Separation of Concerns** - Data, UI, and logic are separated
2. **API-Ready** - Service layer abstracts data source
3. **Component Reusability** - DRY principle enforced
4. **Performance First** - Image optimization, lazy loading
5. **SEO Optimized** - SSR, structured data, semantic HTML

---

## 📊 **LAYER ARCHITECTURE**

```
┌─────────────────────────────────────┐
│         PRESENTATION LAYER          │
│    (Pages, Components, Styling)     │
├─────────────────────────────────────┤
│         APPLICATION LAYER           │
│      (Business Logic, Services)     │
├─────────────────────────────────────┤
│           DATA LAYER                │
│     (Models, Mock Data, Future API) │
└─────────────────────────────────────┘
```

---

## 🗂️ **DIRECTORY STRUCTURE EXPLAINED**

### **`/src/app` - Presentation Layer (Pages)**

```
app/
├── layout.js            # Root layout (applies to all pages)
├── page.js              # Homepage route (/)
├── not-found.js         # 404 page
├── family/
│   └── [id]/
│       └── page.js      # Dynamic route (/family/modern-chair)
├── sitemap.js           # SEO: Dynamic sitemap generation
└── robots.js            # SEO: Search engine directives
```

**Routing Convention:**
- `page.js` = Creates a route
- `layout.js` = Shared layout for children
- `[id]` = Dynamic parameter
- `not-found.js` = Fallback for 404 errors

---

### **`/src/components` - Reusable UI Components**

```
components/
├── FamilyCard.js        # Reusable family card (used in multiple places)
├── Navbar.js            # Site navigation
├── Footer.js            # Site footer
└── SchemaOrg.js         # SEO structured data helpers
```

**Component Philosophy:**
- **Atomic Design** - Small, reusable pieces
- **Props-based** - Flexible and configurable
- **Self-contained** - All styling included
- **Documented** - JSDoc comments explain usage

---

### **`/src/lib` - Application Layer (Services)**

```
lib/
├── families.js          # Family data service (MAIN SERVICE LAYER)
└── config.js            # Environment configuration
```

**Service Layer Pattern:**
```javascript
// PUBLIC API (what pages use)
export async function getAllFamilies()
export async function getFamilyById(id)
export async function getFamiliesByCategory(category)
export async function searchFamilies(searchTerm)

// INTERNAL (hidden implementation)
import { getMockFamilies } from '@/data/mock/families.mock'
```

**Why This Matters:**
- Pages don't know if data comes from mock, API, or database
- Switching from mock → API = change ONE file (`lib/families.js`)
- Easy to test (mock the service layer)
- Consistent error handling in one place

---

### **`/src/data` - Data Layer**

```
data/
├── models/
│   └── family.model.js  # TypeScript-style data models (constants, types)
└── mock/
    └── families.mock.js # Sample data (9 families)
```

**Data Model Example:**
```javascript
// family.model.js defines the "shape" of a family
export const FAMILY_CATEGORIES = {
  FURNITURE: 'furniture',
  DOORS: 'doors',
  WINDOWS: 'windows',
  LIGHTING: 'lighting'
}

// families.mock.js provides actual data
export const mockFamilies = [
  {
    id: 'modern-office-chair',
    name: 'Modern Office Chair',
    category: FAMILY_CATEGORIES.FURNITURE,
    // ... more fields
  }
]
```

**Future Migration Path:**
```
Mock Data (NOW)
    ↓
Strapi CMS (Phase 3)
    ↓
Production Database (Phase 4)
```

---

## 🔄 **DATA FLOW**

### **Example: Loading Homepage**

```
1. User visits "/"
   ↓
2. page.js calls: await getAllFamilies()
   ↓
3. lib/families.js returns: getMockFamilies()
   ↓
4. data/mock/families.mock.js provides: mockFamilies array
   ↓
5. page.js renders: <FamilyCard family={data} />
   ↓
6. components/FamilyCard.js displays the UI
```

**When we connect real API:**
```javascript
// ONLY CHANGE THIS FILE: lib/families.js
export async function getAllFamilies() {
  // OLD:
  // return getMockFamilies()
  
  // NEW:
  const response = await fetch('https://api.boracity.com/families')
  return response.json()
}
```

Pages and components **don't change at all**. ✨

---

## 🖼️ **IMAGE ARCHITECTURE**

### **Strategy: Hybrid Local + CDN**

```
LOCAL IMAGES (in /public)
  ↓
  - Logos, icons, UI elements
  - Small files < 50KB
  - Never change
  ↓
SERVED DIRECTLY BY NEXT.JS

REMOTE IMAGES (ImageKit CDN)
  ↓
  - Family thumbnails
  - Product photos
  - Large galleries
  ↓
OPTIMIZED ON-THE-FLY
  ↓
  - WebP/AVIF conversion
  - Responsive sizes
  - Lazy loading
```

### **Image Component Usage:**

```javascript
// Local image (logo)
<Image 
  src="/images/logo/logo.svg"
  width={40}
  height={40}
  priority  // Load immediately
/>

// Remote image (family thumbnail)
<Image
  src="https://ik.imagekit.io/boracity/chair.jpg"
  fill  // Fill parent container
  className="object-cover"
/>
```

---

## 🎨 **STYLING ARCHITECTURE**

### **Tailwind-First Approach**

```
✅ USE: Tailwind utility classes
❌ AVOID: Custom CSS files

EXCEPTION: Complex animations or very specific needs
```

**Customization:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF4500',        // Boracity Orange
        'primary-dark': '#E63E00', // Hover state
      }
    }
  }
}
```

---

## 🔐 **ERROR HANDLING STRATEGY**

### **Pattern: Graceful Degradation**

```javascript
// ALL service functions follow this pattern:
export async function getFamilyById(id) {
  try {
    // 1. Validate input
    if (!id) throw new Error('ID required')
    
    // 2. Process
    const family = getMockFamilyById(id)
    
    // 3. Validate output
    if (!family) throw new Error('Not found')
    
    // 4. Return success
    return family
    
  } catch (error) {
    // 5. Log for debugging
    console.error('Error:', error)
    
    // 6. Return safe fallback
    return null
  }
}
```

**Result:** App never crashes, always shows *something*.

---

## 📱 **RESPONSIVE DESIGN STRATEGY**

### **Mobile-First Approach**

```javascript
// Tailwind breakpoints (default first = mobile)
<div className="
  text-base          // Mobile (default)
  sm:text-lg         // Small tablets (640px+)
  md:text-xl         // Tablets (768px+)
  lg:text-2xl        // Desktops (1024px+)
">
```

**Grid Example:**
```javascript
<div className="
  grid 
  grid-cols-1        // 1 column on mobile
  sm:grid-cols-2     // 2 columns on tablets
  lg:grid-cols-3     // 3 columns on desktop
">
```

---

## 🚀 **PERFORMANCE OPTIMIZATIONS**

### **Implemented:**
1. **Image Optimization**
   - Next.js Image component (automatic WebP/AVIF)
   - Lazy loading (images load when visible)
   - Responsive images (different sizes per device)

2. **Code Splitting**
   - Next.js automatic (each page = separate bundle)
   - Components lazy loaded when needed

3. **Server-Side Rendering**
   - Initial page loads server-rendered HTML
   - Faster First Contentful Paint (FCP)

### **Future:**
1. Loading states (skeleton screens)
2. Prefetching links on hover
3. Service Worker for offline support

---

## 🔮 **FUTURE ARCHITECTURE CHANGES**

### **Phase 3: API Integration**

```javascript
// Current (Mock)
lib/families.js → data/mock/families.mock.js

// Future (Strapi)
lib/families.js → fetch('https://cms.boracity.com/api/families')
```

**NO CHANGES NEEDED in:**
- ✅ Pages
- ✅ Components
- ✅ Models

**ONLY CHANGE:**
- ⚠️ lib/families.js (service layer)

---

### **Phase 4: TypeScript Migration**

```
JavaScript (NOW)         TypeScript (FUTURE)
─────────────────       ───────────────────
page.js           →     page.tsx
FamilyCard.js     →     FamilyCard.tsx
families.js       →     families.ts

+ Add type definitions:
  - Family interface
  - Service response types
  - Component prop types
```

---

## 📚 **DESIGN PATTERNS USED**

1. **Repository Pattern** - Service layer abstracts data source
2. **Component Composition** - Small components build bigger UIs
3. **Props Drilling** - Data flows down via props
4. **Atomic Design** - Components are atoms → molecules → organisms

---

## 🎯 **KEY ARCHITECTURAL DECISIONS**

### **Why Service Layer?**
**Decision:** All data access through `lib/families.js`  
**Reason:** Easy to swap mock → API without touching UI  
**Trade-off:** Extra abstraction, but worth it for flexibility

### **Why No State Management (Redux/Zustand)?**
**Decision:** Use React's built-in state for now  
**Reason:** App is mostly read-only (no complex state)  
**When to add:** If we add shopping cart, user auth, etc.

### **Why Tailwind over CSS Modules?**
**Decision:** 100% Tailwind utilities  
**Reason:** Faster development, no naming conflicts  
**Trade-off:** HTML can look verbose, but consistent

---

## 📖 **FOR FUTURE AI ASSISTANCE**

When continuing this project, remember:

1. **Never modify data in pages** - Always use service layer
2. **Reuse FamilyCard component** - Don't recreate card UI
3. **Follow error handling pattern** - try/catch with fallbacks
4. **Use Next.js Image** - Never use `<img>` tag
5. **Mobile-first responsive** - Start with mobile, add up

---

**Last Updated:** January 3, 2026  
**Next Review:** When implementing Phase 3 (API)