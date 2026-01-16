# Changelog

All notable changes to Boracity project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-01-16

### 🎉 Major Features

#### Sistema de Favoritos Completo (Sesiones 25-26)
- **localStorage** para usuarios no autenticados
- **PostgreSQL** para usuarios autenticados
- **Migración automática** al hacer login
- **Sincronización** entre dispositivos
- **Página `/favorites`** con búsqueda y filtros

### Added
- `FavoriteButton` component reutilizable
- `useFavorites` custom hook híbrido (v3.1)
- `src/lib/storage/favorites.ts` - Helper de localStorage
- `src/lib/db/user-favorites.ts` - Funciones de base de datos
- `src/app/api/user/favorites/route.ts` - API endpoints
- `src/app/favorites/page.tsx` - Página de favoritos
- `src/components/Providers.tsx` - SessionProvider wrapper
- Tabla `user_favorites` en PostgreSQL
- 3 índices optimizados para performance
- Migración `004_create_user_favorites.sql`
- Script `create-admin.ts` para crear usuario admin
- Contador de favoritos en navbar
- Animaciones en FavoriteButton (hover, active)

### Changed
- Integrado FavoriteButton en `FamilyCard`
- Integrado FavoriteButton en página de detalle (`UserInfo`)
- Actualizado `layout.tsx` con SessionProvider
- Hook `useFavorites` ahora soporta modo híbrido
- Optimistic updates en toggleFavorite (mejor UX)

### Fixed
- Encoding de comillas tipográficas en código
- TypeError en propiedades undefined
- SQL constraint syntax error
- Recargas infinitas en hook v3.0
- Cache agresivo en fetch API
- Tag `<a>` incompleto en JSX

### Documentation
- `SESSION_25_26_FAVORITES_SYSTEM.md` - Documentación completa (1,200+ líneas)
- Actualizado `README.md` con sistema de favoritos
- Actualizado `PROGRESS.md` con métricas actualizadas
- Actualizado `NEXT_SESSION.md` con plan para Sesión 27

### Performance
- Índices en `user_favorites` para queries rápidas
- Optimistic updates (sin esperar respuesta de API)
- Debouncing en operaciones de favoritos

### Technical
- Total archivos creados: 9
- Total archivos modificados: 4
- Líneas de código: ~1,200
- Duración: 8 horas (2 sesiones)

---

## [1.1.0] - 2026-01-14

### 🔍 Búsqueda Avanzada (Sesión 24)

### Added
- Sistema de búsqueda avanzada completo
- Infinite scroll con paginación
- `useDebounce` custom hook (300ms delay)
- `useClickOutside` custom hook
- Filtros por categoría múltiple
- Ordenamiento (recientes, populares, alfabético)
- Loading states con skeletons
- Empty states mejorados

### Changed
- `/search` page completamente rediseñada
- Mejoras significativas en UX de búsqueda
- Performance mejorado con debouncing

### Technical
- 3 custom hooks creados
- Duración: 4 horas

---

## [1.0.0] - 2026-01-13

### 🎨 Frontend Público Completo (Sesiones 21-23)

### Added
- Páginas de categorías (`/revit/furniture`, `/revit/doors`, etc.)
- Página de detalle de familia (`/revit/[category]/[slug]`)
- Galería de imágenes con navegación
- Breadcrumbs de navegación
- Related families section
- Stats display (views, downloads, file size)
- SEO básico (meta tags dinámicos)
- Botón de descarga funcional
- Botón de compartir

### Changed
- Estructura de rutas públicas
- Componente `FamilyCard` mejorado
- Navbar con links activos

### Technical
- 8 páginas creadas
- 5 componentes nuevos
- Duración: ~8 horas

---

## [0.14.0] - 2026-01-12

### 🔐 Admin Panel Completo (Sesión 20)

### Added
- NextAuth v5 authentication
- Login page (`/admin/login`)
- Dashboard con estadísticas
- CRUD completo de familias
  - Create family (`/admin/families/new`)
  - Read families (`/admin/families`)
  - Update family (`/admin/families/edit`)
  - Delete family (modal de confirmación)
- Upload de archivos a Cloudflare R2
- Upload de imágenes a ImageKit
- Búsqueda en tiempo real
- Filtros por categoría
- Paginación (5/10/25/50 items)
- Protected routes con middleware
- Logout funcional

### Changed
- Estructura de carpetas admin
- Schema de base de datos (tabla users)
- Configuración de NextAuth

### Fixed
- 30+ bugs resueltos durante la sesión
- Error 404 en `/admin/families`
- Error 500 con SQL queries en Client Components
- Constraint `valid_slug` bloqueando guiones
- R2 y ImageKit authentication issues

### Technical
- Archivos creados/modificados: 26+
- Líneas de código: ~1,300
- Duración: 11 horas

---

## [0.10.0] - 2026-01-10

### Backend Completo (Sesiones 11-19)

### Added
- Schema de base de datos completo
- Tabla `families` con todos los campos
- 9 familias de prueba en producción
- API Routes públicas (`/api/families`)
- Funciones de base de datos en `src/lib/db/`
- Validaciones server-side
- Error handling robusto
- Optimización de queries SQL
- Índices en base de datos

### Technical
- Total de sesiones: 9
- Duración: ~27 horas

---

## [0.5.0] - 2026-01-05

### Fundación del Proyecto (Sesiones 1-10)

### Added
- Inicialización del proyecto con Next.js 15
- TypeScript configuration
- TailwindCSS setup
- PostgreSQL (Neon) configurado
- Cloudflare R2 para storage
- ImageKit para CDN
- Componentes base:
  - Navbar
  - Footer
  - FamilyCard (diseño inicial)
  - Button
  - Input
- Estructura de routing
- Homepage con hero section
- Categorías con iconos
- Stats dinámicas

### Technical
- Framework: Next.js 15 (App Router)
- Database: PostgreSQL (Neon)
- Styling: TailwindCSS
- Deployment: Vercel

---

## Project Statistics

### Total Development
- **Sesiones completadas:** 26
- **Horas invertidas:** ~75 horas
- **Líneas de código:** ~8,500
- **Componentes creados:** 35+
- **API Routes:** 15+
- **Custom Hooks:** 3
- **Páginas:** 20+

### Database
- **Tablas:** 3 (families, users, user_favorites)
- **Migraciones:** 4
- **Índices:** 15+
- **Familias en producción:** 9

### Features Completadas
- ✅ Autenticación
- ✅ Admin Panel
- ✅ CRUD Familias
- ✅ Frontend Público
- ✅ Búsqueda Avanzada
- ✅ Sistema de Favoritos

### Features Pendientes
- ⏳ Upload completo en admin
- ⏳ Registro de usuarios públicos
- ⏳ Comentarios y ratings
- ⏳ Sistema de suscripciones
- ⏳ Mobile app

---

## Version History Summary

| Version | Date       | Milestone                    | Sessions |
|---------|------------|------------------------------|----------|
| 1.2.0   | 2026-01-16 | Sistema de Favoritos         | 25-26    |
| 1.1.0   | 2026-01-14 | Búsqueda Avanzada           | 24       |
| 1.0.0   | 2026-01-13 | Frontend Público Completo    | 21-23    |
| 0.14.0  | 2026-01-12 | Admin Panel Completo         | 20       |
| 0.10.0  | 2026-01-10 | Backend Completo             | 11-19    |
| 0.5.0   | 2026-01-05 | Fundación del Proyecto       | 1-10     |

---

## Upgrade Guide

### From 1.1.0 to 1.2.0

**Database Changes:**
```sql
-- Run migration 004
\i migrations/004_create_user_favorites.sql
```

**Environment Variables:**
```env
# Add to .env.local
ADMIN_EMAIL="admin@boracity.com"
ADMIN_PASSWORD="Admin123!Change"
```

**Create Admin User:**
```bash
npx tsx scripts/create-admin.ts
```

**No breaking changes** - Sistema de favoritos es completamente nuevo y no afecta funcionalidad existente.

---

## Contributors

- [@anyarcaza-jpg](https://github.com/anyarcaza-jpg) - Project Lead & Main Developer

---

## Links

- [Repository](https://github.com/anyarcaza-jpg/boracity-nextjs)
- [Live Demo](https://boracity-nextjs.vercel.app)
- [Admin Panel](https://boracity-nextjs.vercel.app/admin)
- [Documentation](docs/)

---

**Note:** This changelog is maintained manually. For detailed session notes, see `docs/SESSION_*.md` files.