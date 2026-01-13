# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.14.0] - 2026-01-13

### ✨ Added
- **Sistema de edición de familias** - Página `/admin/families/edit?slug=xxx`
- **API route con query params** - `/api/admin/family` (GET/PUT/DELETE)
- **Modal de confirmación** - Para eliminación de familias
- **Suspense boundaries** - Para `useSearchParams()` en Next.js 15
- **Funciones ImageKit** - `getImageKitUrl`, `getThumbnailUrl`, `getDetailUrl`, `isImageKitUrl`

### 🔧 Fixed
- **Next.js 15 params API** - Migración de `params` síncrono a `Promise`
- **Service layer restaurado** - `src/lib/families.ts` completamente reconstruido
- **TypeScript overloads** - `getFamilyBySlug` con sobrecarga correcta
- **Loop de redirección** - Login/admin redirect infinito resuelto
- **Suspense warnings** - `useSearchParams` ahora envuelto en `<Suspense>`
- **Module resolution** - Imports de `adapters.ts` corregidos

### 🚀 Changed
- **Estructura de rutas** - `/admin/families/[slug]/edit` → `/admin/families/edit?slug=xxx`
- **API endpoints** - De dynamic routes a query params
- **Login ubicación** - Movido de `(auth)/login` a `/login`
- **Carpeta [slug] eliminada** - Evitar problemas con Windows

### 🗑️ Removed
- **Route group (auth)** - Carpeta problemática eliminada
- **Dynamic route [slug]** - Reemplazado por query params

### 🔐 Security
- **AUTH_SECRET** - Variable de entorno agregada en Vercel
- **NEXTAUTH_URL** - Configuración correcta para producción

### 📚 Documentation
- **SESSION_21_COMPLETE.md** - Documentación completa de Sesión 21
- **NEXT_SESSION.md** - Roadmap para Sesión 22
- **README.md** - Completamente reescrito y actualizado

---

## [0.13.0] - 2024-12-XX

### ✨ Added
- **Admin panel completo** - Dashboard, lista de familias
- **CRUD básico** - Create y Read de familias
- **Autenticación** - NextAuth v5 con JWT
- **Middleware** - Protección de rutas admin

### 🔧 Fixed
- **Database connection** - PostgreSQL con Neon
- **Environment variables** - Configuración en Vercel

---

## [0.12.0] - 2024-11-XX

### ✨ Added
- **Migración a Next.js 15** - App Router completo
- **TypeScript estricto** - Configuración mejorada
- **Tailwind CSS** - Styling system

### 🚀 Changed
- **Pages Router → App Router** - Migración completa
- **Estructura de carpetas** - Reorganización

---

## [0.11.0] - 2024-10-XX

### ✨ Added
- **Frontend inicial** - Landing page
- **Componentes base** - Navbar, Footer, FamilyCard
- **Routing básico** - Next.js Pages Router

---

## [0.10.0] - 2024-09-XX

### ✨ Added
- **Proyecto inicial** - Setup de Next.js
- **Git repository** - GitHub setup
- **Vercel deployment** - Primera deployment

---

## [Unreleased]

### 🚧 En Progreso (Sesión 22)
- Sistema de subida de archivos RFA/RVT
- Manejo de imágenes múltiples
- Página de detalle individual
- Validación con Zod

### 🎯 Planeado
- Toast notifications
- Drag & drop uploads
- Búsqueda avanzada
- Dashboard de analytics

---

## Tipos de Cambios

- **Added** - Para nuevas funcionalidades
- **Changed** - Para cambios en funcionalidades existentes
- **Deprecated** - Para funcionalidades que serán removidas
- **Removed** - Para funcionalidades removidas
- **Fixed** - Para corrección de bugs
- **Security** - Para mejoras de seguridad

---

## Enlaces

- [GitHub Repository](https://github.com/anyarcaza-jpg/boracity-nextjs)
- [Live Site](https://boracity-nextjs.vercel.app)
- [Documentation](docs/)

---

**Última actualización:** 13 de Enero, 2026