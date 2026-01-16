# 🏗️ Boracity - Free Revit Families & 3D Assets

> Professional BIM families library for architects and designers. Built with Next.js 15, TypeScript, PostgreSQL, and deployed on Vercel.

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://boracity-nextjs.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.0-orange)](PROGRESS.md)

---

## 🚀 [Live Demo](https://boracity-nextjs.vercel.app)

**Admin Panel:** [https://boracity-nextjs.vercel.app/admin](https://boracity-nextjs.vercel.app/admin)  
**Credentials:** `admin@boracity.com` / `Admin123!Change`

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### **Para Usuarios:**
- 🔍 **Búsqueda Avanzada** - Encuentra familias por nombre, categoría o tags
- 📁 **Categorización** - Furniture, Doors, Windows, Lighting
- 🖼️ **Vista Previa** - Thumbnails optimizados con ImageKit
- ⬇️ **Descarga Directa** - Archivos RFA/RVT listos para usar
- ❤️ **Sistema de Favoritos** - Guarda tus familias favoritas (localStorage + PostgreSQL)
- 📊 **Estadísticas** - Views y downloads tracking
- 📱 **Responsive Design** - Mobile, tablet y desktop

### **Panel Administrativo:**
- 🔐 **Autenticación Segura** - NextAuth v5 con JWT
- ✏️ **CRUD Completo** - Create, Read, Update, Delete familias
- 🖼️ **Gestión de Imágenes** - Upload y optimización automática
- 📤 **Upload de Archivos** - Soporte para RFA/RVT
- 📈 **Dashboard** - Estadísticas en tiempo real
- 🔒 **Protected Routes** - Middleware de autorización

### **Técnicas:**
- ⚡ **Server Components** - Next.js 15 App Router
- 🎨 **Tailwind CSS** - Styling moderno y responsive
- 🗄️ **PostgreSQL** - Base de datos relacional con Neon
- 🖼️ **ImageKit** - CDN y optimización de imágenes
- ☁️ **Cloudflare R2** - Almacenamiento de archivos
- 🔄 **ISR & Cache** - Revalidación incremental
- 📱 **PWA Ready** - Progressive Web App capabilities
- 💾 **Hybrid Storage** - localStorage para invitados, PostgreSQL para usuarios

---

## 🛠️ Tech Stack

### **Frontend:**
- **Framework:** Next.js 15.1.3 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4
- **State:** React 19 + Server Components
- **Icons:** Lucide React
- **Forms:** React Hook Form (planeado)
- **Validation:** Zod (planeado)

### **Backend:**
- **Runtime:** Node.js 20.x
- **API:** Next.js API Routes
- **Authentication:** NextAuth v5 (Auth.js)
- **Database:** PostgreSQL 16 (Neon serverless)
- **ORM:** Direct SQL queries with Neon client

### **Infrastructure:**
- **Hosting:** Vercel (Edge Network)
- **Database:** Neon (Serverless Postgres)
- **Storage:** Cloudflare R2 + ImageKit
- **CDN:** Vercel Edge + ImageKit
- **Monitoring:** Vercel Analytics

### **Development:**
- **Package Manager:** npm
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel auto-deploy
- **Code Style:** ESLint + Prettier (configurado)

---

## 🏗️ Arquitectura
```
┌─────────────────────────────────────────────┐
│           Vercel Edge Network               │
│  (Next.js 15 - Server & Client Components)  │
└──────────────┬──────────────────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼────┐      ┌──────▼──────┐
│  Neon   │      │  ImageKit   │
│  (DB)   │      │   (CDN)     │
└─────────┘      └─────────────┘
     │                   │
┌────▼─────────────────┬─┘
│  Cloudflare R2       │
│  (File Storage)      │
└──────────────────────┘
```

### **Patrón de Capas:**
```typescript
┌─────────────────────────────────────┐
│  UI Layer (React Components)        │  ← Client & Server Components
├─────────────────────────────────────┤
│  Service Layer (src/lib/)           │  ← Business logic + Cache
├─────────────────────────────────────┤
│  Data Layer (src/lib/db/)           │  ← Database queries
├─────────────────────────────────────┤
│  Database (PostgreSQL/Neon)         │  ← Data persistence
└─────────────────────────────────────┘
```

---

## 🚀 Instalación

### **Prerrequisitos:**
- Node.js 20.x o superior
- npm 10.x o superior
- PostgreSQL (local o Neon)
- Git

### **Clonar el repositorio:**
```bash
git clone https://github.com/anyarcaza-jpg/boracity-nextjs.git
cd boracity-nextjs
```

### **Instalar dependencias:**
```bash
npm install
```

### **Configurar variables de entorno:**

Crea `.env.local` en la raíz del proyecto:
```env
# Database (Neon)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
AUTH_SECRET="tu-secret-muy-largo-y-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Admin User (para crear usuario inicial)
ADMIN_EMAIL="admin@boracity.com"
ADMIN_PASSWORD="Admin123!Change"

# ImageKit (opcional para desarrollo)
IMAGEKIT_PUBLIC_KEY="public_xxx"
IMAGEKIT_PRIVATE_KEY="private_xxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/xxx"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/xxx"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_xxx"

# Cloudflare R2 (opcional para desarrollo)
R2_ACCESS_KEY_ID="xxx"
R2_SECRET_ACCESS_KEY="xxx"
R2_BUCKET_NAME="boracity"
R2_ACCOUNT_ID="xxx"
```

### **Inicializar la base de datos:**
```bash
# Ejecutar migraciones
npm run db:migrate

# Crear usuario admin
npx tsx scripts/create-admin.ts

# Seed de datos de prueba (opcional)
npm run db:seed
```

### **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración

### **Base de Datos (Neon):**

1. Crea cuenta en [Neon](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string
4. Pégala en `DATABASE_URL`

### **NextAuth:**

Genera un secret seguro:
```bash
# Linux/Mac:
openssl rand -base64 32

# Windows (PowerShell):
# Usa cualquier string aleatorio de 32+ caracteres
```

### **ImageKit (Opcional):**

1. Crea cuenta en [ImageKit](https://imagekit.io)
2. Obtén API keys del dashboard
3. Configura las variables de entorno

### **Cloudflare R2 (Opcional):**

1. Crea cuenta en [Cloudflare](https://cloudflare.com)
2. Crea un R2 bucket
3. Genera API tokens
4. Configura las variables de entorno

---

## 💻 Desarrollo

### **Scripts Disponibles:**
```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build de producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint

# Database
npm run db:migrate   # Ejecuta migraciones
npm run db:seed      # Seed de datos de prueba
npm run db:reset     # Reset completo de DB

# Tests (planeado)
npm run test         # Ejecuta tests
npm run test:watch   # Tests en modo watch
```

### **Estructura del Proyecto:**
```
boracity-nextjs/
├── public/                  # Archivos estáticos
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # Route group (auth pages)
│   │   ├── admin/         # Admin panel
│   │   │   └── families/  # CRUD de familias
│   │   ├── api/           # API Routes
│   │   │   ├── admin/     # Admin API endpoints
│   │   │   └── user/      # User API endpoints (favoritos)
│   │   ├── favorites/     # Página de favoritos
│   │   ├── revit/         # Public family pages
│   │   └── layout.tsx     # Root layout
│   │
│   ├── components/        # React Components
│   │   ├── ui/           # UI primitives
│   │   ├── admin/        # Admin components
│   │   ├── FavoriteButton.tsx  # Botón de favoritos
│   │   └── Providers.tsx       # SessionProvider wrapper
│   │
│   ├── lib/              # Service Layer
│   │   ├── db/           # Database queries
│   │   │   ├── families.ts
│   │   │   ├── users.ts
│   │   │   ├── user-favorites.ts  # Funciones de favoritos
│   │   │   └── adapters.ts
│   │   ├── storage/      # Storage helpers
│   │   │   └── favorites.ts      # localStorage helper
│   │   ├── auth.ts       # NextAuth config
│   │   ├── families.ts   # Business logic
│   │   ├── imagekit.ts   # ImageKit utils
│   │   └── neon.ts       # DB connection
│   │
│   ├── hooks/            # Custom React Hooks
│   │   └── useFavorites.ts      # Hook híbrido de favoritos
│   │
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   │
│   └── middleware.ts     # Route protection
│
├── docs/                 # Documentación
│   ├── SESSION_*.md     # Sesiones de desarrollo
│   ├── NEXT_SESSION.md  # Próxima sesión
│   ├── PROGRESS.md      # Estado del proyecto
│   └── API.md           # API documentation
│
├── migrations/          # SQL migrations
│   ├── 001_initial.sql
│   ├── 002_create_users.sql
│   ├── 003_create_family_images.sql
│   └── 004_create_user_favorites.sql
│
├── scripts/             # Utility scripts
│   └── create-admin.ts  # Crear usuario admin
│
├── .env.local          # Variables de entorno (local)
├── next.config.js      # Next.js config
├── tailwind.config.ts  # Tailwind config
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies
```

### **Convenciones de Código:**

- **Components:** PascalCase (`FamilyCard.tsx`)
- **Utils/Libs:** camelCase (`favorites.ts`)
- **Hooks:** camelCase con prefijo `use` (`useFavorites.ts`)
- **API Routes:** kebab-case en URLs (`/api/admin/families`)
- **Database:** snake_case (`family_id`, `created_at`)

---

## 🌐 Deployment

### **Vercel (Recomendado):**

1. **Push a GitHub:**
   ```bash
   git push origin main
   ```

2. **Conecta con Vercel:**
   - Importa el proyecto desde GitHub
   - Configura variables de entorno
   - Deploy automático en cada push

3. **Variables de entorno en Vercel:**
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - `IMAGEKIT_*` (todas las keys)
   - `R2_*` (todas las keys)

### **Build Manual:**
```bash
npm run build
npm run start
```

---

## 📡 API Reference

### **Endpoints Públicos:**

#### **GET /api/families**
Obtiene todas las familias.

**Query Parameters:**
- `category` (opcional) - Filtrar por categoría
- `search` (opcional) - Búsqueda por texto

**Response:**
```json
{
  "families": [
    {
      "id": "uuid",
      "slug": "modern-chair",
      "name": "Modern Chair",
      "category": "furniture",
      "thumbnail_url": "https://...",
      "downloads": 100,
      "views": 500
    }
  ]
}
```

#### **GET /api/families?ids=xxx,yyy**
Obtiene familias específicas por IDs (para página de favoritos).

**Query Parameters:**
- `ids` (requerido) - IDs separados por comas

---

### **Endpoints de Usuario (Requieren autenticación):**

#### **GET /api/user/favorites**
Obtiene favoritos del usuario autenticado.

**Headers:**
- `Cookie: authjs.session-token=xxx`

**Response:**
```json
{
  "favorites": ["uuid1", "uuid2", "uuid3"],
  "count": 3
}
```

#### **POST /api/user/favorites**
Agrega favorito o migra desde localStorage.

**Body (agregar):**
```json
{
  "familyId": "uuid"
}
```

**Body (migrar):**
```json
{
  "migrate": true,
  "familyIds": ["uuid1", "uuid2"]
}
```

#### **DELETE /api/user/favorites?familyId=xxx**
Elimina un favorito.

---

### **Endpoints Admin (Requieren autenticación + role admin):**

#### **GET /api/admin/families**
Obtiene todas las familias (admin view).

#### **POST /api/admin/family**
Crea una nueva familia.

#### **PUT /api/admin/family?slug=xxx**
Actualiza una familia.

#### **DELETE /api/admin/family?slug=xxx**
Elimina una familia.

Ver `docs/API.md` para documentación completa.

---

## 🗄️ Database Schema

### **Tabla: families**
```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_families_category ON families(category);
CREATE INDEX idx_families_slug ON families(slug);
CREATE INDEX idx_families_created_at ON families(created_at DESC);
```

### **Tabla: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### **Tabla: user_favorites** ✨ (NUEVO)
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_family UNIQUE(user_id, family_id)
);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_family_id ON user_favorites(family_id);
CREATE INDEX idx_user_favorites_user_family ON user_favorites(user_id, family_id);
```

### **Tabla: family_images (planeada)**
```sql
CREATE TABLE family_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Ver `migrations/` para todas las migraciones.

---

## 📊 Estado del Proyecto

**Última actualización:** 16 de Enero, 2026  
**Versión:** 1.2.0  
**Sesión completada:** Sesión 26  
**Status:** ✅ **En producción**

### **Progress Bar:**
```
████████████████████░░░░░░ 75% Completado

Backend:           ████████████████████ 100% ✅
Admin Panel:       ████████████████████ 100% ✅
Frontend Público:  ██████████████░░░░░░ 70%  🟡
Autenticación:     ████████████████████ 100% ✅
Favoritos:         ████████████████████ 100% ✅
SEO & Analytics:   ████░░░░░░░░░░░░░░░░ 20%  🟡
```

### **✅ Funcionalidades Implementadas:**

#### **Core Features:**
- ✅ Login y autenticación (NextAuth v5)
- ✅ Admin panel completo
- ✅ CRUD de familias (Create, Read, Update, Delete)
- ✅ Base de datos PostgreSQL (Neon)
- ✅ **Sistema de favoritos completo** 🎉
  - localStorage para usuarios no autenticados
  - PostgreSQL para usuarios autenticados
  - Migración automática al hacer login
  - Página `/favorites` con búsqueda
  - Sincronización entre dispositivos
- ✅ 9 familias de prueba en producción
- ✅ Búsqueda avanzada con infinite scroll
- ✅ Paginación client-side
- ✅ Middleware de protección de rutas

#### **UI/UX:**
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states con spinners
- ✅ Modal de confirmación para delete
- ✅ Error boundaries
- ✅ Form validation
- ✅ **FavoriteButton component** con animaciones
- ✅ Contador de favoritos en navbar
- ✅ Empty states elegantes

#### **Técnico:**
- ✅ Next.js 15 App Router
- ✅ Server & Client Components
- ✅ TypeScript estricto
- ✅ Service Layer pattern
- ✅ Database adapters
- ✅ ImageKit integration
- ✅ **Custom Hooks** (useFavorites, useDebounce, useClickOutside)
- ✅ **Optimistic UI updates**
- ✅ Vercel deployment

### **📊 Métricas:**
- **Sesiones completadas:** 26
- **Horas invertidas:** ~75 horas
- **Archivos creados:** 70+
- **Líneas de código:** ~8,500
- **Componentes React:** 35+
- **API Routes:** 15+
- **Custom Hooks:** 3
- **Tablas en BD:** 3

### **⏳ En Progreso / Próximamente:**

#### **Alta Prioridad (Sesión 27):**
- 🔄 Sistema de upload completo (drag & drop)
- 🔄 Manejo de imágenes múltiples en admin
- 🔄 Componente ImageGalleryUploader
- 🔄 Edición de galería (eliminar, reordenar)

#### **Media Prioridad:**
- ⏳ Registro de usuarios públicos
- ⏳ Perfiles de usuario
- ⏳ Validación con Zod
- ⏳ Toast notifications
- ⏳ Loading skeletons

#### **Baja Prioridad:**
- ⏸️ Dashboard de analytics
- ⏸️ Comentarios y ratings
- ⏸️ Sistema de versiones
- ⏸️ Export/Import de familias
- ⏸️ API pública
- ⏸️ Tests automatizados

### **🐛 Bugs Conocidos:**

**Ninguno** - Todos los bugs fueron resueltos en las sesiones 25-26.

---

## 🗺️ Roadmap

### **Q1 2026 (Enero - Marzo):**
- [x] ✅ Sistema de autenticación completo
- [x] ✅ CRUD básico de familias
- [x] ✅ **Sistema de favoritos completo**
- [ ] 🔄 Sistema de uploads (archivos + imágenes)
- [ ] 🔄 Páginas de detalle públicas mejoradas
- [ ] ⏳ 50+ familias en catálogo

### **Q2 2026 (Abril - Junio):**
- [ ] ⏸️ Sistema de usuarios públicos (registro)
- [ ] ⏸️ Dashboard de analytics
- [ ] ⏸️ Sistema de comentarios
- [ ] ⏸️ Ratings y reviews
- [ ] ⏸️ 100+ familias

### **Q3 2026 (Julio - Septiembre):**
- [ ] ⏸️ Sistema de suscripciones
- [ ] ⏸️ Marketplace premium
- [ ] ⏸️ SEO avanzado
- [ ] ⏸️ 200+ familias

### **Q4 2026 (Octubre - Diciembre):**
- [ ] ⏸️ AI-powered search
- [ ] ⏸️ Mobile app (React Native)
- [ ] ⏸️ Multi-language support
- [ ] ⏸️ 500+ familias

---

## 👥 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork el proyecto**
2. **Crea una branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit tus cambios** (`git commit -m 'Add some AmazingFeature'`)
4. **Push a la branch** (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### **Guidelines:**

- Sigue las convenciones de código existentes
- Escribe tests para nuevas features (cuando estén disponibles)
- Actualiza la documentación
- Asegúrate de que el build pase (`npm run build`)
- Describe claramente los cambios en el PR

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **Next.js Team** - Por el increíble framework
- **Vercel** - Por el hosting y deployment seamless
- **Neon** - Por PostgreSQL serverless
- **ImageKit** - Por la optimización de imágenes
- **Cloudflare** - Por R2 storage

---

## 📞 Contacto

**Proyecto:** [https://github.com/anyarcaza-jpg/boracity-nextjs](https://github.com/anyarcaza-jpg/boracity-nextjs)  
**Live Site:** [https://boracity-nextjs.vercel.app](https://boracity-nextjs.vercel.app)  
**Admin Panel:** [https://boracity-nextjs.vercel.app/admin](https://boracity-nextjs.vercel.app/admin)

**Mantainer:** [@anyarcaza-jpg](https://github.com/anyarcaza-jpg)  
**Email:** admin@boracity.com

---

## 📚 Documentación Adicional

- [Sistema de Favoritos - Sesiones 25-26](docs/SESSION_25_26_FAVORITES_SYSTEM.md) ⭐
- [Progreso General](docs/PROGRESS.md)
- [Próxima Sesión - Roadmap](docs/NEXT_SESSION.md)
- [Búsqueda Avanzada - Sesión 24](docs/SESSION_24_DOCUMENTATION.md)
- [API Documentation](docs/API.md) (planeado)
- [Deployment Guide](docs/DEPLOYMENT.md) (planeado)

---

## 🔧 Troubleshooting

### **Problema: Build falla en Vercel**
```bash
# Solución: Verificar variables de entorno
# Ir a Vercel → Settings → Environment Variables
# Asegurar que todas las variables requeridas estén configuradas
```

### **Problema: Error de conexión a base de datos**
```bash
# Solución: Verificar DATABASE_URL
# Asegurar que incluye ?sslmode=require
# Verificar que la IP está whitelisted en Neon
```

### **Problema: Imágenes no cargan**
```bash
# Solución: Verificar ImageKit config
# Verificar NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
# Asegurar que las URLs son correctas
```

### **Problema: Login no funciona**
```bash
# Solución: Verificar AUTH_SECRET
# Generar nuevo secret si es necesario
# Verificar que NEXTAUTH_URL es correcto
```

### **Problema: Favoritos no se guardan**
```bash
# Sin login: Verificar que localStorage está habilitado
# Con login: Verificar que sesión está activa
# Ver consola del navegador para errores
```

Ver `docs/TROUBLESHOOTING.md` para más problemas comunes.

---

## 🎯 Quick Start (TL;DR)
```bash
# 1. Clone
git clone https://github.com/anyarcaza-jpg/boracity-nextjs.git
cd boracity-nextjs

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 4. Setup DB
npx tsx scripts/create-admin.ts

# 5. Run
npm run dev

# 6. Visit
open http://localhost:3000
```

**Admin:** http://localhost:3000/admin  
**Login:** admin@boracity.com / Admin123!Change

---

<div align="center">

**Hecho con ❤️ por el equipo de Boracity**

⭐ **Star this repo** si te resultó útil!

[Report Bug](https://github.com/anyarcaza-jpg/boracity-nextjs/issues) · [Request Feature](https://github.com/anyarcaza-jpg/boracity-nextjs/issues) · [Documentation](docs/)

---

**v1.2.0** | 26 Sesiones | 75 Horas | 8,500+ Líneas de Código | Sistema de Favoritos ✨

</div>