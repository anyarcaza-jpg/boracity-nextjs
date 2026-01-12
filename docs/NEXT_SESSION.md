# 🚀 PRÓXIMA SESIÓN 19 - BACKEND IMPLEMENTATION

**Fecha estimada:** 12-13 de Enero, 2026  
**Duración estimada:** 2-3 horas  
**Objetivo:** Implementar backend completo (PostgreSQL + Cloudflare R2)

---

## 🎯 OBJETIVO PRINCIPAL

Migrar de mock data a backend real con:
- ✅ Base de datos PostgreSQL en Neon
- ✅ File storage en Cloudflare R2
- ✅ API routes funcionales
- ✅ Migración de las 9 familias existentes
- ✅ Sistema de descargas operativo

---

## 📚 CONTEXTO (Sesión 18 - Completada)

### **Lo que hicimos hoy:**

```
✅ Análisis completo de arquitectura
✅ Decisión de stack tecnológico
✅ Comparación de costos (Supabase vs Neon+R2)
✅ Documentación completa:
   ├─ ARCHITECTURE.md (actualizado a v0.14.0)
   ├─ BACKEND.md (nuevo - manual técnico)
   ├─ AUDITORIA_COMPLETA.md
   ├─ PLAN_DE_TRABAJO_HOY.md
   └─ DOCUMENTACION_INDICE.md

✅ Arquitectura decidida:
   ├─ Vercel Free: $0/mes (hosting)
   ├─ Neon PostgreSQL: $0/mes (database)
   ├─ Cloudflare R2: ~$1/mes (files)
   └─ ImageKit: $0/mes (CDN)
   
   COSTO TOTAL: $12/año vs $1,380/año con Supabase
```

---

## 📋 PLAN DE IMPLEMENTACIÓN

### **FASE 1: Setup Neon Database** (30-45 min)

#### **Paso 1.1: Crear cuenta y proyecto**
```
1. Ir a https://console.neon.tech
2. Sign up (GitHub OAuth recomendado)
3. Create new project: "boracity-db"
4. Region: US East (Ohio) - más cercano
5. PostgreSQL version: 16
```

#### **Paso 1.2: Ejecutar schema**
```sql
-- Copiar de BACKEND.md sección 1.4
-- O usar el archivo migrations/001_initial_schema.sql

CREATE TABLE families (...);
CREATE INDEX idx_families_category ON families(category);
-- etc.
```

#### **Paso 1.3: Configurar variables de entorno**
```bash
# .env.local
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/boracity?sslmode=require"
```

#### **Paso 1.4: Instalar dependencias**
```bash
npm install @neondatabase/serverless
```

#### **Paso 1.5: Crear lib/neon.ts**
```typescript
// Código en BACKEND.md sección 1.3
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
export { sql };
```

---

### **FASE 2: Setup Cloudflare R2** (30-45 min)

#### **Paso 2.1: Crear cuenta**
```
1. Ir a https://dash.cloudflare.com
2. Sign up / Log in
3. Go to R2 Object Storage
4. Create bucket: "boracity-files"
```

#### **Paso 2.2: Generar API tokens**
```
1. R2 → Manage R2 API Tokens
2. Create API token
3. Permissions: Object Read & Write
4. Copy:
   - Account ID
   - Access Key ID
   - Secret Access Key
```

#### **Paso 2.3: Configurar variables**
```bash
# .env.local (agregar)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=boracity-files
R2_PUBLIC_URL=https://files.boracity.com  # opcional
```

#### **Paso 2.4: Instalar dependencias**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### **Paso 2.5: Crear lib/r2.ts**
```typescript
// Código en BACKEND.md sección 2.3
import { S3Client } from '@aws-sdk/client-s3';
const r2 = new S3Client({...});
export { r2 };
```

---

### **FASE 3: Migrar datos** (30-45 min)

#### **Paso 3.1: Seed database con familias**
```typescript
// scripts/seed.ts (crear)
import { sql } from '@/lib/neon';
import { mockFamilies } from '@/data/mock/families.mock';

async function seed() {
  for (const family of mockFamilies) {
    await sql`
      INSERT INTO families (
        slug, category, name, description,
        thumbnail_url, file_url, file_size,
        author, tags, revit_versions
      ) VALUES (
        ${family.id},
        ${family.category},
        ${family.name},
        ${family.description},
        ${family.images.thumbnail},
        'https://drive.google.com/...', // Temporal
        ${family.fileSize},
        ${family.author},
        ${family.tags},
        ${family.revitVersions}
      )
    `;
  }
}

seed();
```

#### **Paso 3.2: Ejecutar seed**
```bash
npm run seed
# o
tsx scripts/seed.ts
```

#### **Paso 3.3: Verificar datos**
```sql
-- En Neon SQL Editor
SELECT COUNT(*) FROM families;
-- Debería mostrar: 9

SELECT * FROM families LIMIT 3;
-- Ver los primeros 3 registros
```

---

### **FASE 4: Actualizar lib/families.ts** (30 min)

#### **Paso 4.1: Reemplazar mock con Neon**

**ANTES (v0.13.0):**
```typescript
// src/lib/families.ts
import { mockFamilies } from '@/data/mock/families.mock';

export async function getAllFamilies() {
  return mockFamilies;
}
```

**DESPUÉS (v0.14.0):**
```typescript
// src/lib/families.ts
import { sql } from './neon';

export async function getAllFamilies() {
  const families = await sql`
    SELECT * FROM families 
    ORDER BY created_at DESC 
    LIMIT 100
  `;
  return families;
}

export async function getFamilyBySlug(category: string, slug: string) {
  const [family] = await sql`
    SELECT * FROM families 
    WHERE category = ${category} 
    AND slug = ${slug}
  `;
  return family || null;
}

export async function getFamiliesByCategory(category: string) {
  const families = await sql`
    SELECT * FROM families 
    WHERE category = ${category}
    ORDER BY downloads DESC
  `;
  return families;
}

// ... resto de funciones (código en BACKEND.md sección 1.5)
```

---

### **FASE 5: Crear API Routes** (45 min)

#### **Paso 5.1: API de descarga**
```typescript
// src/app/api/download/route.ts
// Código completo en BACKEND.md sección 2.6

import { NextRequest, NextResponse } from 'next/server';
import { getFamilyBySlug, incrementDownloads } from '@/lib/db/families';
import { getDownloadUrl } from '@/lib/r2/download';

export async function POST(request: NextRequest) {
  const { category, slug } = await request.json();
  
  // Get family from DB
  const family = await getFamilyBySlug(category, slug);
  if (!family) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  // Increment counter
  await incrementDownloads(family.id);
  
  // Generate R2 signed URL
  const downloadUrl = await getDownloadUrl(category, slug);
  
  return NextResponse.json({ downloadUrl });
}
```

#### **Paso 5.2: API de búsqueda**
```typescript
// src/app/api/search/route.ts
// Código en BACKEND.md sección 4.3

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  const results = await searchFamilies(query);
  return NextResponse.json({ results });
}
```

#### **Paso 5.3: API de estadísticas**
```typescript
// src/app/api/stats/route.ts
// Código en BACKEND.md sección 4.3

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}
```

---

### **FASE 6: Testing** (30 min)

#### **Paso 6.1: Test local**
```bash
npm run dev

# Probar:
1. Homepage carga familias ✓
2. Category pages funcionan ✓
3. Detail pages cargan ✓
4. Search funciona ✓
5. Stats se actualizan ✓
```

#### **Paso 6.2: Test database**
```typescript
// En DevTools console
fetch('/api/families')
  .then(r => r.json())
  .then(console.log);

// Debería mostrar las familias desde PostgreSQL
```

#### **Paso 6.3: Test errores**
```typescript
// Intentar URL inválido
fetch('/api/families/invalid-slug')
  .then(r => r.json())
  .then(console.log);

// Debería retornar error 404 sin romper
```

---

### **FASE 7: Deploy a Vercel** (30 min)

#### **Paso 7.1: Configurar variables en Vercel**
```
1. Vercel Dashboard → Project Settings → Environment Variables
2. Agregar:
   DATABASE_URL=postgresql://...
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET_NAME=boracity-files
```

#### **Paso 7.2: Deploy**
```bash
git add .
git commit -m "feat: implement backend (Neon + R2)"
git push origin main

# Vercel auto-deploys
```

#### **Paso 7.3: Verificar producción**
```bash
# Probar URL de producción
curl https://boracity.com/api/families

# Debería retornar JSON con familias
```

---

## 🔧 TROUBLESHOOTING COMÚN

### **Error: Connection timeout (Neon)**
```
✓ Verificar DATABASE_URL correcto
✓ Verificar que proyecto Neon no está suspended
✓ Reiniciar dev server
```

### **Error: Access Denied (R2)**
```
✓ Verificar API tokens correctos
✓ Verificar permisos en token (Read & Write)
✓ Verificar bucket name correcto
```

### **Error: Module not found**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error: Type mismatch**
```typescript
// Asegurar que tipos coincidan con schema
// Ver BACKEND.md sección 1.6 para tipos correctos
```

---

## 📊 CHECKLIST COMPLETO

```
Setup:
□ Cuenta Neon creada
□ Proyecto PostgreSQL creado
□ Schema ejecutado
□ Variables de entorno configuradas
□ Cuenta Cloudflare creada
□ Bucket R2 creado
□ API tokens generados

Código:
□ lib/neon.ts creado
□ lib/r2.ts creado
□ lib/families.ts actualizado
□ API routes creados
□ scripts/seed.ts creado

Testing:
□ Seed ejecutado (9 familias en DB)
□ Homepage carga desde DB
□ Category pages funcionan
□ Detail pages funcionan
□ Search funciona
□ No errores en console

Deploy:
□ Variables en Vercel configuradas
□ Deploy exitoso
□ Site funciona en producción
□ Database conectado
□ R2 accesible
```

---

## 🎯 RESULTADO ESPERADO

Al final de la Sesión 19 tendrás:

```
✅ Backend funcional en producción
✅ Data en PostgreSQL (no más mock)
✅ Files en Cloudflare R2
✅ API routes operativos
✅ Costos: $0-1/mes
✅ Escalable a millones de visitas
✅ Ready para agregar más familias

Estado del proyecto:
v0.13.0 (Frontend only) → v0.14.0 (Full-stack)
Architecture: Mock data → Production database
Capacity: 9 families → Unlimited
```

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

Durante la implementación, tener abiertos:

1. **BACKEND.md** - Manual técnico (código para copiar)
2. **ARCHITECTURE.md** - Big picture (por si te pierdes)
3. **Neon Console** - https://console.neon.tech
4. **Cloudflare Dashboard** - https://dash.cloudflare.com

---

## 💡 TIPS PARA LA SESIÓN

### **Antes de empezar:**
1. Leer BACKEND.md sección 1-2 (Setup)
2. Tener GitHub account listo
3. Tener tarjeta de crédito lista (para Cloudflare)
4. Backup del proyecto actual

### **Durante la sesión:**
1. Ir paso a paso (no saltarse pasos)
2. Probar cada fase antes de continuar
3. Hacer commits frecuentes
4. Si algo falla, ver BACKEND.md sección 9 (Troubleshooting)

### **Después de implementar:**
1. Probar todo en producción
2. Monitorear por 24 horas
3. Verificar costos reales
4. Crear SESSION_19_IMPLEMENTATION.md

---

## 🚀 PRÓXIMA SESIÓN (20)

Una vez que el backend esté funcionando, en la Sesión 20 haremos:

```
□ Admin panel para subir familias
□ Upload de archivos a R2
□ Form de crear/editar familias
□ Image upload a ImageKit
□ Validación de archivos .rfa
```

---

## 🎉 ESTADO ACTUAL

**Documentación:** 100% completa ✅  
**Backend diseñado:** 100% ✅  
**Backend implementado:** 0% ⏳  

**Próximo paso:** Implementar! 🔥

---

*Documento actualizado: 11 Enero 2026*  
*Para: Sesión 19 - Backend Implementation*  
*Prerequisito: Sesión 18 completada (documentación)*