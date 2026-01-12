# PRÓXIMA SESIÓN: #20 - ADMIN PANEL & AUTHENTICATION

**Prioridad:** Media  
**Tiempo estimado:** 3-4 horas  
**Dependencias:** ✅ Sesión 19 completada

---

## 🎯 OBJETIVO

Implementar panel de administración con autenticación para gestionar familias Revit.

---

## 📋 TAREAS PRINCIPALES

### 1. Setup Autenticación (45 min)
- [ ] Configurar Clerk (recomendado) o NextAuth
- [ ] Crear páginas login/registro
- [ ] Proteger rutas /admin con middleware
- [ ] Roles: Admin, User

### 2. Admin Dashboard (30 min)
- [ ] Layout admin con sidebar
- [ ] Dashboard home con estadísticas:
  - Total familias
  - Descargas totales
  - Vistas totales
  - Gráficos (opcional)

### 3. Gestión de Familias - CRUD (90 min)
- [ ] **Listar:** Tabla con todas las familias
  - Filtros: categoría, búsqueda
  - Ordenar: nombre, descargas, fecha
  - Paginación
- [ ] **Crear:** Formulario nueva familia
  - Campos: nombre, categoría, descripción, tags
  - Upload thumbnail (ImageKit)
  - Upload .rfa (R2)
- [ ] **Editar:** Formulario edición
  - Pre-llenar datos existentes
  - Actualizar DB + archivos si es necesario
- [ ] **Eliminar:** Confirmación + eliminar
  - Borrar de DB
  - Borrar archivos de R2 (opcional)

### 4. Upload de Archivos (45 min)
- [ ] **Componente upload .rfa a R2:**
```typescript
  // Flujo:
  1. Usuario selecciona .rfa
  2. Validar: extensión, tamaño (<50MB)
  3. Upload a R2: category/slug.rfa
  4. Guardar URL en DB
  5. Progress indicator
```
- [ ] **Upload thumbnail a ImageKit**
  - Drag & drop o file picker
  - Preview antes de subir
  - Guardar URL en DB

### 5. Testing & Deploy (30 min)
- [ ] Testing local completo
- [ ] Verificar permisos y roles
- [ ] Deploy a Vercel
- [ ] Testing en producción

---

## 🛠️ STACK TECNOLÓGICO

### Autenticación
**Opción A: Clerk (Recomendado)**
- ✅ Setup rápido (15 min)
- ✅ UI components incluidos
- ✅ Free tier generoso
- ✅ Roles y permisos built-in

**Opción B: NextAuth**
- ⚠️ Más configuración manual
- ✅ Más control
- ✅ Totalmente gratuito

### UI Components
- shadcn/ui (ya instalado)
- React Hook Form + Zod
- TanStack Table (para listar familias)

### File Upload
- react-dropzone
- AWS S3 SDK (ya instalado para R2)
- ImageKit SDK (para thumbnails)

---

## 📦 DEPENDENCIAS NUEVAS
```bash
# Autenticación (elegir una)
npm install @clerk/nextjs        # Opción A
npm install next-auth            # Opción B

# UI & Forms
npm install react-dropzone
npm install @tanstack/react-table
npm install react-hook-form

# Ya tienes: shadcn/ui, zod, @aws-sdk/*
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS NUEVOS
```
src/
├── app/
│   ├── (auth)/              # Grupo de rutas auth
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── admin/               # Rutas protegidas
│       ├── layout.tsx       # Layout admin
│       ├── page.tsx         # Dashboard
│       └── families/
│           ├── page.tsx     # Lista
│           ├── new/
│           │   └── page.tsx # Crear
│           └── [slug]/
│               └── edit/
│                   └── page.tsx # Editar
├── components/
│   └── admin/
│       ├── FamilyTable.tsx
│       ├── FamilyForm.tsx
│       └── FileUploader.tsx
├── lib/
│   ├── auth/
│   │   └── middleware.ts    # Protección rutas
│   └── r2/
│       └── upload.ts        # Subir archivos a R2
└── middleware.ts            # Auth middleware global
```

---

## 🔐 FLUJO DE AUTENTICACIÓN
```
Usuario no autenticado
  ↓
Intenta acceder /admin
  ↓
Middleware detecta (redirect)
  ↓
/sign-in (login con Clerk/NextAuth)
  ↓
Autenticación exitosa
  ↓
Redirect a /admin/dashboard
  ↓
Verificar rol = admin
  ↓
Acceso concedido ✅
```

---

## 📊 SCHEMA DB - NUEVAS TABLAS (Opcional)

Si quieres usuarios en tu propia DB:
```sql
-- Tabla users (opcional, Clerk maneja esto)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla activity_log (para auditoría)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  resource TEXT NOT NULL, -- 'family'
  resource_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚠️ PREREQUISITOS

### Antes de empezar Sesión 20:

1. **Decidir sistema de auth:**
   - [ ] ¿Clerk o NextAuth?
   - Recomendación: Clerk (más rápido)

2. **Crear cuenta Clerk (si eliges Clerk):**
   - [ ] Ir a https://clerk.com
   - [ ] Crear cuenta gratuita
   - [ ] Crear aplicación "Boracity Admin"
   - [ ] Copiar API keys

3. **Verificar backend funcionando:**
   - [x] 8 familias en producción ✅
   - [x] PostgreSQL conectado ✅
   - [x] R2 configurado ✅

---

## 🎯 RESULTADO ESPERADO

Al finalizar Sesión 20:

✅ Admin puede:
- Iniciar sesión seguro
- Ver dashboard con stats
- Listar todas las familias
- Crear nueva familia (con upload)
- Editar familia existente
- Eliminar familia

✅ Sistema tiene:
- Autenticación funcionando
- Rutas protegidas
- CRUD completo
- Upload a R2 funcionando
- UI profesional

---

## 💡 TIPS PARA LA SESIÓN

1. **Empezar con auth:** Es la base de todo
2. **UI primero, lógica después:** Mockear datos si es necesario
3. **Testing incremental:** Probar cada feature antes de continuar
4. **Commits frecuentes:** Guardar progreso cada 30 min

---

## 📚 RECURSOS ÚTILES

- Clerk Quickstart: https://clerk.com/docs/quickstarts/nextjs
- NextAuth Setup: https://next-auth.js.org/getting-started/example
- TanStack Table: https://tanstack.com/table/latest
- React Dropzone: https://react-dropzone.js.org/
- shadcn/ui Forms: https://ui.shadcn.com/docs/components/form

---

## 🚀 MOTIVACIÓN

**Después de Sesión 20:**
- ✅ Backend completo read/write
- ✅ Admin panel funcional
- ✅ Sistema profesional listo para usuarios reales
- ✅ Base sólida para monetización futura

**Siguiente después de esto (Sesión 21+):**
- Sistema de colecciones/favoritos
- Comentarios y ratings
- Analytics dashboard
- Marketplace (vender familias premium)

---

**Nos vemos en la Sesión 20! 🚀**

---

**Última actualización:** 11 de enero de 2026  
**Preparado por:** Sesión 19