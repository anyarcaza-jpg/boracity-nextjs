# BACKEND BORACITY - MANUAL TÉCNICO

**Estado:** ✅ IMPLEMENTADO  
**Versión:** v0.14.0  
**Fecha completado:** 11 de enero de 2026  
**Sesión:** #19

---

## 📊 RESUMEN EJECUTIVO

Backend profesional implementado con:
- ✅ PostgreSQL (Neon) - Base de datos serverless
- ✅ Cloudflare R2 - Object storage para archivos .rfa
- ✅ 8 familias migradas y en producción
- ✅ APIs funcionando en producción
- ✅ Costo mensual: $0 (dentro de free tiers)

---

## 🏗️ ARQUITECTURA IMPLEMENTADA
```
┌─────────────────────────────────────────────────┐
│           FRONTEND (Next.js 14)                 │
│  Components → Pages → App Router                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         SERVICE LAYER (lib/families.ts)         │
│  • Cache management (React + Next.js)           │
│  • Error handling                               │
│  • Business logic                               │
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
│ 8 familias  │      │ Signed URLs      │
│ Serverless  │      │ S3 compatible    │
└─────────────┘      └──────────────────┘
```

---

## 🗄️ BASE DE DATOS (NEON)

### Conexión
```typescript
// src/lib/neon.ts
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);
```

### Schema
```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('furniture', 'doors', 'windows', 'lighting')),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  file_url TEXT,
  file_size TEXT,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  author TEXT DEFAULT 'Boracity Team',
  tags TEXT[],
  revit_versions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para performance
CREATE INDEX idx_families_category ON families(category);
CREATE INDEX idx_families_slug ON families(slug);
CREATE INDEX idx_families_downloads ON families(downloads DESC);
CREATE INDEX idx_families_created ON families(created_at DESC);
```

### Queries Principales
```typescript
// src/lib/db/families.ts

// Obtener todas las familias
export async function getAllFamilies(): Promise<Family[]> {
  const rows = await sql`SELECT * FROM families ORDER BY created_at DESC LIMIT 100`;
  return rows.map(dbRowToFamily);
}

// Obtener por categoría
export async function getFamiliesByCategory(category: FamilyCategory): Promise<Family[]> {
  const rows = await sql`
    SELECT * FROM families 
    WHERE category = ${category}
    ORDER BY downloads DESC LIMIT 50
  `;
  return rows.map(dbRowToFamily);
}

// Buscar familias
export async function searchFamilies(query: string): Promise<Family[]> {
  const rows = await sql`
    SELECT * FROM families 
    WHERE 
      name ILIKE ${'%' + query + '%'} 
      OR description ILIKE ${'%' + query + '%'}
      OR ${query} = ANY(tags)
    ORDER BY downloads DESC LIMIT 20
  `;
  return rows.map(dbRowToFamily);
}

// Incrementar descargas
export async function incrementDownloads(category: FamilyCategory, slug: string): Promise<void> {
  await sql`
    UPDATE families 
    SET downloads = downloads + 1 
    WHERE category = ${category} AND slug = ${slug}
  `;
}
```

---

## 📦 FILE STORAGE (CLOUDFLARE R2)

### Cliente R2
```typescript
// src/lib/r2/client.ts
import { S3Client } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET_NAME = 'boracity-files';
```

### Generar URLs de Descarga
```typescript
// src/lib/r2/download.ts
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getDownloadUrl(
  category: string,
  slug: string,
  expiresIn: number = 300 // 5 minutos
): Promise<string> {
  const fileKey = `${category}/${slug}.rfa`;
  
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  });
  
  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return signedUrl;
}
```

**Ventajas de signed URLs:**
- ✅ Seguras (expiran automáticamente)
- ✅ No consumen bandwidth de Vercel
- ✅ Descarga directa desde R2
- ✅ No se pueden compartir (cada URL es única y temporal)

---

## 🔄 ADAPTER PATTERN

El adapter traduce entre la estructura flat de PostgreSQL y la estructura nested del frontend.
```typescript
// src/lib/db/adapters.ts

export interface FamilyRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  thumbnail_url: string;
  file_url: string;
  file_size: string;
  downloads: number;
  views: number;
  author: string;
  tags: string[];
  revit_versions: string[];
  created_at: Date;
  updated_at: Date;
}

export function dbRowToFamily(row: FamilyRow): Family {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description || '',
    
    images: {
      thumbnail: row.thumbnail_url || '',
      category: row.category,
      gallery: [],
    },
    
    file: {
      size: row.file_size || '0 KB',
      revitVersions: row.revit_versions || ['2025', '2024', '2023'],
      downloadUrl: row.file_url || '',
    },
    
    metadata: {
      tags: row.tags || [],
      author: row.author || 'Boracity Team',
      uploadDate: new Date(row.created_at),
      downloads: row.downloads || 0,
      views: row.views || 0,
    },
    
    seo: {
      title: `${row.name} - Free Revit Family | Boracity`,
      description: row.description || '',
      keywords: row.tags || [],
    },
  };
}
```

**¿Por qué adapter?**
- ✅ Frontend NO cambia (usa estructura nested)
- ✅ DB usa estructura flat (más eficiente)
- ✅ Conversión automática y transparente

---

## 🔐 VARIABLES DE ENTORNO

### Desarrollo (.env.local)
```bash
# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/nbqxh22tq
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_IYrsU2dUqmFKkxQBybcI2s2P9FQ=

# Neon Database
DATABASE_URL=postgresql://neondb_owner:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require

# Cloudflare R2
R2_ACCOUNT_ID=d19e6898d84c4d8c1ec79d9dbde1a772
R2_ACCESS_KEY_ID=8f1e68191ee7f2bed7f5b3fb4740eb4f
R2_SECRET_ACCESS_KEY=94008c3326bef07bd03b8e12fec38284842211b9c570519c7065105523d6945
R2_BUCKET_NAME=boracity-files
```

### Producción (Vercel)
Todas las variables configuradas en: **Settings → Environment Variables**

---

## 📊 DATOS ACTUALES

### Familias en Producción
```
✅ 8 familias migradas:
1. ALUNVA Bar Chair - Modern Design (furniture)
2. Armchair 78 with Ottoman (furniture)
3. Exterior Door - Two Lite (doors)
4. Exterior Glass Wood Door (doors)
5. Awning Window - Triple Vertical (windows)
6. Casement Window - Double (windows)
7. Ceiling Lamp - Modern Pendant (lighting)
8. Ceiling Fan with Integrated Light (lighting)
```

### Script de Migración
```typescript
// scripts/seed.ts
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  for (const family of mockFamilies) {
    await sql`
      INSERT INTO families (
        slug, category, name, description,
        thumbnail_url, file_url, file_size,
        downloads, views, author, tags, revit_versions, created_at
      ) VALUES (
        ${family.slug}, ${family.category}, ${family.name}, ${family.description},
        ${family.images.thumbnail}, ${family.file.downloadUrl}, ${family.file.size},
        ${family.metadata.downloads}, ${family.metadata.views}, ${family.metadata.author},
        ${family.metadata.tags}, ${family.file.revitVersions}, ${family.metadata.uploadDate}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        downloads = EXCLUDED.downloads
    `;
  }
}
```

**Ejecutar:** `npx tsx scripts/seed.ts`

---

## 🚀 DEPLOYMENT

### Build & Deploy
```bash
# 1. Commit cambios
git add .
git commit -m "feat: implement backend v0.14.0"

# 2. Push a GitHub
git push origin main

# 3. Vercel auto-deploy
# (automático al detectar push)
```

### Verificación Post-Deploy
- ✅ Homepage carga 8 familias
- ✅ Categorías funcionan (furniture, doors, windows, lighting)
- ✅ Páginas individuales cargan correctamente
- ✅ Metadata correcta (downloads, views, author)
- ✅ Imágenes desde ImageKit
- ✅ Sin errores en consola

---

## 💰 COSTOS MENSUALES

### Neon (PostgreSQL)
- **Plan:** Free
- **Límites:** 0.5GB storage, 192MB RAM
- **Uso actual:** ~5MB (8 familias)
- **Costo:** $0/mes

### Cloudflare R2
- **Plan:** Free
- **Límites:** 10GB storage, 1M Class A ops/mes, 10M Class B ops/mes
- **Uso actual:** 0GB (archivos aún no subidos)
- **Costo:** $0/mes

### Vercel
- **Plan:** Hobby (Free)
- **Límites:** 100GB bandwidth/mes
- **Uso actual:** Bajo (imágenes en ImageKit, archivos en R2)
- **Costo:** $0/mes

**Total mensual:** $0 🎉

---

## 📈 PERFORMANCE

### Tiempos de Carga
- Homepage: ~800ms (con cache)
- Página individual: ~400ms (con cache)
- Database query: ~50-100ms
- R2 signed URL: ~200ms

### Cache Strategy
```typescript
// React cache (request-level)
export const getAllFamilies = cache(async () => {
  // Next.js cache (data-level)
  return unstable_cache(
    async () => db.getAllFamilies(),
    ['all-families'],
    { revalidate: 3600 } // 1 hora
  )();
});
```

---

## 🔧 MANTENIMIENTO

### Agregar Nueva Familia
```sql
INSERT INTO families (
  slug, category, name, description,
  thumbnail_url, file_url, file_size,
  author, tags, revit_versions
) VALUES (
  'new-chair',
  'furniture',
  'Modern Office Chair',
  'Ergonomic office chair with adjustable height',
  'https://ik.imagekit.io/.../chair.png',
  '/downloads/new-chair.rfa',
  '156 KB',
  'Boracity Team',
  ARRAY['chair', 'office', 'furniture'],
  ARRAY['2025', '2024', '2023']
);
```

### Actualizar Estadísticas
```sql
-- Incrementar descargas
UPDATE families SET downloads = downloads + 1 WHERE slug = 'bar-chair-modern';

-- Incrementar vistas
UPDATE families SET views = views + 1 WHERE slug = 'bar-chair-modern';
```

### Verificar Datos
```sql
-- Ver todas las familias
SELECT slug, name, category, downloads FROM families ORDER BY downloads DESC;

-- Estadísticas generales
SELECT 
  COUNT(*) as total_families,
  SUM(downloads) as total_downloads,
  SUM(views) as total_views
FROM families;

-- Por categoría
SELECT category, COUNT(*) FROM families GROUP BY category;
```

---

## 🐛 TROUBLESHOOTING

### Error: "password authentication failed"
**Causa:** DATABASE_URL incorrecta  
**Solución:** Verificar que la URL de Neon esté correcta en .env.local

### Error: "Cannot find module '@neondatabase/serverless'"
**Causa:** Dependencias no instaladas  
**Solución:** `npm install @neondatabase/serverless`

### Error: "R2_ACCOUNT_ID is not defined"
**Causa:** Variables de entorno faltantes  
**Solución:** Verificar que todas las variables R2_* estén en .env.local

### Familias no aparecen en producción
**Causa:** Variables de entorno no configuradas en Vercel  
**Solución:** Settings → Environment Variables → Verificar todas las variables

---

## 📚 RECURSOS

### Documentación Oficial
- Neon: https://neon.tech/docs
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Next.js: https://nextjs.org/docs
- AWS S3 SDK: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/

### Archivos Relacionados
- `/docs/ARCHITECTURE.md` - Arquitectura completa
- `/docs/AUDITORIA_PRE_BACKEND.md` - Auditoría inicial
- `/docs/SESSION_19_BACKEND.md` - Sesión de implementación

---

## 🎯 PRÓXIMOS PASOS (v0.15.0)

### Funcionalidades Pendientes
- [ ] Admin panel con autenticación
- [ ] Upload de archivos .rfa a R2
- [ ] CRUD completo de familias
- [ ] Sistema de usuarios
- [ ] Colecciones/favoritos
- [ ] Comentarios y ratings

### Mejoras Técnicas
- [ ] Migrations automáticas
- [ ] Testing suite completo
- [ ] Monitoring y alertas
- [ ] Backup automático
- [ ] CDN para thumbnails

---

**Última actualización:** 11 de enero de 2026  
**Versión del documento:** 2.0  
**Estado:** ✅ Implementado y en producción