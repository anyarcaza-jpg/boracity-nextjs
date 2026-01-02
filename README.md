# 🏗️ Boracity - Next.js Migration

> Professional BIM & 3D Assets Platform - Multi-Product Architecture

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Status](https://img.shields.io/badge/status-In_Development-orange)

---

## 🎯 **Project Overview**

Boracity es una plataforma multi-producto para descargar recursos arquitectónicos profesionales:

- ✅ **Revit Families** - 10,000+ BIM families (Phase 1 - Active)
- 🚧 **SketchUp Models** - 3D models (Q2 2025)
- 🚧 **D5 Render Assets** - Rendering assets (Q2 2025)
- 🚧 **Textures** - PBR textures 4K (Q2 2025)

---

## ✨ **Current Features**

### **Implemented:**
- ✅ Next.js 15 with App Router
- ✅ Dynamic routes `/family/[id]` with SSR
- ✅ Unique meta tags per family (SEO optimized)
- ✅ Responsive design (mobile-first)
- ✅ Professional orange branding (#FF4500)
- ✅ Family detail pages with stats
- ✅ Breadcrumb navigation

### **In Progress:**
- 🚧 Navbar and Footer components
- 🚧 Complete homepage
- 🚧 Search functionality
- 🚧 Category filters
- 🚧 Authentication system

---

## 🛠️ **Tech Stack**

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript (ES6+)
- **Styling:** Custom CSS (modular architecture)
- **Fonts:** Inter (Google Fonts)
- **Icons:** Font Awesome 6.5.1
- **Version Control:** Git + GitHub

---

## 📂 **Project Structure**
```
boracity-nextjs/
├── src/
│   ├── app/
│   │   ├── family/
│   │   │   └── [id]/          # Dynamic family pages
│   │   │       └── page.js    # SSR with unique meta tags
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Homepage
│   └── styles/
│       ├── core/              # Variables, reset, typography
│       ├── layout/            # Navbar, hero, footer
│       ├── components/        # Buttons, cards, forms
│       ├── pages/             # Page-specific styles
│       └── responsive.css     # Media queries
├── public/                    # Static assets
├── .gitignore
├── package.json
├── next.config.mjs
└── README.md
```

---

## 🚀 **Getting Started**

### **Prerequisites:**
- Node.js 24.12.0 LTS or higher
- npm 11.6.2 or higher

### **Installation:**
```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/boracity-nextjs.git
cd boracity-nextjs

# Install dependencies
npm install

# Run development server
npm run dev
```

### **Open in browser:**
```
http://localhost:3000
```

---

## 📄 **Available Pages**

### **Family Detail Pages:**
```
http://localhost:3000/family/1  # Modern Executive Chair
http://localhost:3000/family/2  # Contemporary Office Desk
http://localhost:3000/family/3  # Glass Entrance Door
```

Each family has:
- Unique URL
- Dynamic meta tags (SEO)
- Breadcrumbs
- Stats (downloads, file size, version)
- Category badge
- Download button

---

## 🎨 **Design System**

### **Brand Colors:**
- Primary: `#FF4500` (Orange)
- Primary Dark: `#E63E00`
- Secondary: `#212121` (Black)
- Success: `#27AE60` (Green)
- Background: `#F5F5F5`

### **Typography:**
- Font Family: Inter
- Sizes: 12px - 56px (responsive)
- Weights: 400, 500, 600, 700, 800

---

## 📊 **SEO Features**

### **Dynamic Meta Tags:**
Each family page generates unique:
- Title: `{family.name} - Free Revit Family | Boracity`
- Description: Custom per family
- Open Graph tags (Facebook, LinkedIn)
- Twitter Cards
- Schema.org markup

### **SSR Benefits:**
- Google indexes each family individually
- Better ranking vs client-side rendering
- Faster initial page load
- Social media previews work correctly

---

## 🔄 **Migration Status**

### **From Vanilla JS:**
- ✅ CSS architecture migrated
- ✅ Design system preserved
- ✅ Orange branding maintained
- ✅ Responsive design working

### **New Features (Next.js):**
- ✅ Server-Side Rendering (SSR)
- ✅ Dynamic routes
- ✅ File-based routing
- ✅ Automatic code splitting
- ✅ Image optimization ready

---

## 📝 **Development Log**

### **v0.1.0 - Initial Migration (Jan 2026)**
- Next.js project setup
- CSS migration completed
- Dynamic family pages created
- SEO optimization implemented
- First 3 mock families added

---

## 🎯 **Roadmap**

### **Phase 1 (Current):**
- [x] Next.js setup
- [x] Dynamic family pages
- [ ] Complete homepage
- [ ] Navbar/Footer components

### **Phase 2 (Q1 2026):**
- [ ] Strapi CMS integration
- [ ] Real family data
- [ ] Search functionality
- [ ] Category filters

### **Phase 3 (Q2 2026):**
- [ ] Authentication system
- [ ] User dashboard
- [ ] SketchUp models launch
- [ ] D5 Render assets launch

### **Phase 4 (Q3 2026):**
- [ ] Textures launch
- [ ] API for Anyarin plugin
- [ ] Premium features
- [ ] Payment integration

---

## 👨‍💻 **Author**

**Boracity Team**
- Website: [boracity.com](https://www.boracity.com) (coming soon)
- GitHub: [@boracity](https://github.com/YOUR-USERNAME)
- Contact: support@boracity.com

---

## 📄 **License**

Copyright © 2026 Boracity. All rights reserved.

This project is proprietary and confidential.

---

## 🙏 **Acknowledgments**

- Inspiration: Freepik, Envato Elements
- Competitors analyzed: RevitCity, 3D Warehouse, BIMobject, BlocksRVT
- Framework: Next.js by Vercel
- Fonts: Inter by Google Fonts

---

**⭐ Star this repo if you find it useful!**