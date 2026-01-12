# PRÓXIMA SESIÓN: #21 - FRONTEND PÚBLICO & SEO

**Prioridad:** Alta  
**Tiempo estimado:** 4-5 horas  
**Dependencias:** ✅ Sesión 20 completada

---

## ✅ SESIÓN 20 - COMPLETADA

**Lo que logramos:**
- ✅ NextAuth v5 configurado
- ✅ Login funcional con protección de rutas
- ✅ Dashboard admin con estadísticas en tiempo real
- ✅ CRUD completo de familias
- ✅ Upload de archivos a R2 (Cloudflare)
- ✅ Upload de thumbnails a ImageKit
- ✅ Búsqueda en tiempo real
- ✅ Filtrado por categorías
- ✅ Paginación con selector de items
- ✅ UI/UX profesional con colores Boracity

---

## 🎯 OBJETIVO SESIÓN 21

Implementar el frontend público completo: páginas de categorías, páginas de detalle de familias, y optimización SEO.

---

## 📋 TAREAS PRINCIPALES

### 1. Páginas de Categorías (90 min)
- [ ] `/revit/furniture` - Grid de familias
- [ ] `/revit/doors` - Grid de familias
- [ ] `/revit/windows` - Grid de familias
- [ ] `/revit/lighting` - Grid de familias

**Características:**
- [ ] Grid responsive (1-2-3 columnas)
- [ ] Componente `FamilyCard` reutilizable
- [ ] Filtros: Revit version, sort by (popular, recent)
- [ ] Lazy loading / Infinite scroll
- [ ] Breadcrumbs de navegación

### 2. Página de Detalle de Familia (120 min)
- [ ] `/revit/[category]/[slug]` - Detalle completo

**Secciones:**
```
├── Hero Section
│   ├── Thumbnail grande
│   ├── Título + descripción
│   └── Botón "Download .rfa"
│
├── Info Card
│   ├── Category
│   ├── Revit Version
│   ├── File Size
│   ├── Downloads count
│   └── Views count
│
├── Related Families (opcional)
│   └── Slider con 4-6 familias similares
│
└── Footer
```

**Funcionalidad:**
- [ ] Contador de vistas (+1 al cargar página)
- [ ] Contador de descargas (+1 al hacer clic en download)
- [ ] API route: `/api/families/[slug]/download`
- [ ] API route: `/api/families/[slug]/view`

### 3. Componente FamilyCard (30 min)
- [ ] Thumbnail con lazy loading
- [ ] Título truncado (1-2 líneas)
- [ ] Badge de categoría
- [ ] Stats: downloads + views
- [ ] Hover effect + animación
- [ ] Link a página de detalle

### 4. SEO Optimization (45 min)
- [ ] Metadata dinámica por página
- [ ] Open Graph tags (redes sociales)
- [ ] Twitter Cards
- [ ] JSON-LD structured data
- [ ] Sitemap.xml generado dinámicamente
- [ ] Robots.txt

**Ejemplo metadata:**
```typescript
// En página de detalle
export async function generateMetadata({ params }) {
  const family = await getFamily(params.slug);
  
  return {
    title: `${family.name} - Free Revit Family | Boracity`,
    description: family.description,
    openGraph: {
      images: [family.thumbnail_url],
    }
  };
}
```

### 5. Homepage Updates (30 min)
- [ ] Sección "Recent Families" con datos reales
- [ ] Stats dinámicas (usar API)
- [ ] Enlaces funcionales a categorías

### 6. Search Functionality (45 min)
- [ ] Componente de búsqueda en navbar
- [ ] Autocomplete con resultados en tiempo real
- [ ] Página de resultados `/search?q=query`
- [ ] Highlighting de términos buscados

---

## 🗂️ ESTRUCTURA DE ARCHIVOS NUEVOS
```
src/
├── app/
│   ├── revit/
│   │   ├── [category]/
│   │   │   ├── page.tsx              # Lista de familias
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Detalle de familia
│   │   └── layout.tsx                # Layout común
│   ├── search/
│   │   └── page.tsx                  # Página de búsqueda
│   ├── sitemap.ts                    # Sitemap dinámico
│   └── robots.ts                     # Robots.txt
├── components/
│   ├── FamilyCard.tsx                # Card reutilizable
│   ├── FamilyGrid.tsx                # Grid container
│   ├── CategoryHero.tsx              # Hero de categoría
│   └── search/
│       ├── SearchBar.tsx             # Barra de búsqueda
│       └── SearchAutocomplete.tsx    # Autocomplete
└── lib/
    └── api/
        └── families.ts               # Client-side API helpers
```

---

## 📊 API ROUTES NUEVOS

### GET `/api/families/[slug]`
Obtener familia pública (sin auth).

### POST `/api/families/[slug]/view`
Incrementar contador de vistas.

### POST `/api/families/[slug]/download`
Incrementar contador de descargas y retornar URL.

### GET `/api/search?q=query`
Buscar familias por nombre, descripción, tags.

---

## 🎨 UI/UX MEJORAS

### FamilyCard Design
```
┌─────────────────────┐
│                     │
│   [Thumbnail]       │
│                     │
├─────────────────────┤
│ Modern Office Chair │
│ [Furniture Badge]   │
├─────────────────────┤
│ 👁️ 1.2k  ⬇️ 456    │
└─────────────────────┘
```

### Detalle de Familia - Hero
```
┌─────────────────────────────────────────┐
│                                         │
│   [Large Thumbnail]   ┌──────────────┐  │
│                       │ Category      │  │
│                       │ Revit 2024    │  │
│   Modern Office Chair │ 2.4 MB        │  │
│   Professional ergon...│ 456 downloads│  │
│                       │ 1.2k views    │  │
│   [Download .rfa]     └──────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔍 SEO STRATEGY

### 1. Dynamic Metadata
Cada página tiene metadata única:
- Title: `{Family Name} - Free Revit Family | Boracity`
- Description: Primeras 160 chars de la descripción
- OG Image: Thumbnail de la familia

### 2. Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Modern Office Chair",
  "description": "...",
  "category": "Furniture",
  "image": "https://...",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 3. Sitemap.xml
```xml
<urlset>
  <url>
    <loc>https://boracity.com/</loc>
    <lastmod>2026-01-12</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://boracity.com/revit/furniture/modern-office-chair</loc>
    <lastmod>2026-01-12</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- ... más familias -->
</urlset>
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
- Mobile: 1 columna (< 640px)
- Tablet: 2 columnas (640px - 1024px)
- Desktop: 3 columnas (> 1024px)

### Componentes Responsive
- FamilyGrid: Auto-ajuste de columnas
- CategoryHero: Stack vertical en móvil
- FamilyDetail: Info card abajo en móvil

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### 1. Image Optimization
```typescript
<Image
  src={family.thumbnail_url}
  alt={family.name}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

### 2. Server Components por Defecto
- Páginas de categoría: Server Component
- Páginas de detalle: Server Component
- Solo usar Client Components para interactividad

### 3. Caching
```typescript
// Revalidar cada 1 hora
export const revalidate = 3600;

// O on-demand con revalidatePath
revalidatePath('/revit/furniture');
```

---

## 🧪 TESTING CHECKLIST

- [ ] Todas las categorías muestran familias correctas
- [ ] Páginas de detalle cargan correctamente
- [ ] Descargas incrementan contador
- [ ] Vistas incrementan contador
- [ ] Búsqueda funciona
- [ ] SEO metadata correcta en todas las páginas
- [ ] Responsive en mobile, tablet, desktop
- [ ] Lazy loading de imágenes funciona
- [ ] Links de navegación funcionan

---

## 🚀 DEPLOY CHECKLIST

- [ ] Build sin errores: `npm run build`
- [ ] Lighthouse score > 90 (Performance, SEO)
- [ ] Testing en Vercel preview
- [ ] Verificar metadata con Facebook Debugger
- [ ] Verificar metadata con Twitter Card Validator
- [ ] Submit sitemap a Google Search Console
- [ ] Deploy a producción

---

## 📚 RECURSOS ÚTILES

- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Next.js Image: https://nextjs.org/docs/app/api-reference/components/image
- Schema.org Product: https://schema.org/Product
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci

---

## 🎯 RESULTADO ESPERADO

Al finalizar Sesión 21:

✅ Usuario puede:
- Ver todas las familias por categoría
- Ver detalle completo de cada familia
- Descargar archivos .rfa
- Buscar familias
- Navegar con breadcrumbs

✅ Sistema tiene:
- SEO optimizado (metadata, structured data)
- Performance optimizado (lazy loading, caching)
- UI profesional y responsive
- Analytics de descargas y vistas

---

## 💡 PRIORIDADES

**MUST HAVE (核心):**
1. Páginas de categorías funcionando
2. Páginas de detalle funcionando
3. Botón download funcional
4. SEO básico (metadata)

**NICE TO HAVE (bonus):**
- Búsqueda con autocomplete
- Related families
- Infinite scroll
- JSON-LD structured data

---

## 🔮 DESPUÉS DE SESIÓN 21

**Sesión 22:** Sistema de favoritos/colecciones
**Sesión 23:** Comentarios y ratings
**Sesión 24:** Analytics dashboard avanzado
**Sesión 25:** Sistema de suscripción/monetización

---

**¡Nos vemos en la Sesión 21! 🚀**

---

**Última actualización:** 12 de enero de 2026  
**Preparado por:** Sesión 20