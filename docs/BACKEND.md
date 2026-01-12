---

## ADMIN PANEL BACKEND

### Arquitectura Implementada

El admin panel sigue una arquitectura de **Server Components + Client Components** para optimizar rendimiento y SEO.

---

## Sistema de Autenticación

### NextAuth v5 (Auth.js)

**Archivo:** `src/lib/auth.ts`
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validar contra PostgreSQL
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        
        // Verificar password con bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        
        if (isValid) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  }
});
```

### Middleware de Protección

**Archivo:** `src/middleware.ts`
```typescript
export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/admin/:path*']
};
```

**Características:**
- ✅ Todas las rutas `/admin/*` requieren autenticación
- ✅ Redirección automática a `/login` si no está autenticado
- ✅ Verificación de rol `admin` en el layout

---

## Patrón Server + Client Components

### Server Component (Data Fetching)

**Ejemplo:** `src/app/admin/families/page.tsx`
```typescript
// ✅ Server Component (por defecto en App Router)
export default async function FamiliesPage() {
  // Query directo a PostgreSQL
  const result = await sql`SELECT * FROM families ORDER BY created_at DESC`;
  const families = result;

  // Pasar datos al Client Component
  return <FamiliesTableClient families={families} />;
}
```

**Ventajas:**
- Query directo a la base de datos (sin API route)
- Código del servidor no se envía al cliente
- Mejor rendimiento (menos JavaScript en el navegador)

### Client Component (Interactividad)

**Ejemplo:** `src/app/admin/families/FamiliesTableClient.tsx`
```typescript
'use client';

export default function FamiliesTableClient({ families }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, family: null });

  const handleDelete = async (slug) => {
    await fetch(`/api/admin/families/${slug}`, { method: 'DELETE' });
    router.refresh(); // Revalidar Server Component
  };

  return (
    <div>
      {/* UI interactiva */}
    </div>
  );
}
```

**Ventajas:**
- React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange, etc.)
- Interactividad del lado del cliente

---

## Sistema de Upload de Archivos

### Flow Completo
```
1. Usuario selecciona archivo
   ↓
2. FormData se envía a /api/admin/upload
   ↓
3. API valida tipo de archivo
   ↓
4. Si es RFA → Upload a Cloudflare R2
   Si es imagen → Upload a ImageKit
   ↓
5. Retorna URL pública
   ↓
6. URL se guarda en PostgreSQL al crear/editar familia
```

### Cloudflare R2 Integration

**Archivo:** `src/lib/r2/upload.ts`
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  }
});

export async function uploadToR2(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await r2Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: `rfa-files/${fileName}`,
    Body: buffer,
    ContentType: file.type,
  }));

  return `${process.env.R2_PUBLIC_URL}/rfa-files/${fileName}`;
}
```

### ImageKit Integration

**Archivo:** `src/lib/imagekit.ts`
```typescript
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadToImageKit(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await imagekit.upload({
    file: buffer,
    fileName: `${Date.now()}-${file.name}`,
    folder: '/thumbnails',
  });

  return result.url;
}
```

---

## API Routes Structure
```
src/app/api/
├── admin/
│   ├── families/
│   │   ├── route.ts              # POST (crear)
│   │   └── [slug]/
│   │       └── route.ts          # GET, PUT, DELETE
│   └── upload/
│       └── route.ts              # POST (upload a R2/ImageKit)
└── auth/
    └── [...nextauth]/
        └── route.ts              # NextAuth handlers
```

---

## Validaciones Implementadas

### Server-Side

**En API routes:**
```typescript
// Validar campos requeridos
if (!name || !slug || !category) {
  return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
}

// Validar slug único
const existing = await sql`SELECT id FROM families WHERE slug = ${slug}`;
if (existing.length > 0) {
  return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
}

// Validar tipo de archivo
if (type === 'rfa' && !file.name.endsWith('.rfa')) {
  return NextResponse.json({ error: 'File must be a .rfa file' }, { status: 400 });
}
```

### Client-Side

**En formularios:**
```typescript
// Validar antes de submit
if (!formData.name.trim()) {
  alert('Name is required');
  return;
}

// Auto-generar slug
const slug = formData.name.toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '');
```

---

## Database Queries Optimizadas

### Estadísticas del Dashboard
```typescript
const result = await sql`
  SELECT 
    COUNT(*) as total_families,
    SUM(downloads) as total_downloads,
    SUM(views) as total_views,
    COUNT(CASE WHEN category = 'furniture' THEN 1 END) as furniture_count,
    COUNT(CASE WHEN category = 'doors' THEN 1 END) as doors_count,
    COUNT(CASE WHEN category = 'windows' THEN 1 END) as windows_count,
    COUNT(CASE WHEN category = 'lighting' THEN 1 END) as lighting_count
  FROM families
`;
```

**Ventajas:**
- Una sola query en lugar de 7
- Mejor rendimiento
- Menos carga en la base de datos

### Búsqueda y Filtrado

**Client-side filtering (datos ya cargados):**
```typescript
const filteredFamilies = families.filter(f => {
  const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.slug.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
  return matchesSearch && matchesCategory;
});
```

**Para grandes datasets (futuro):**
```sql
SELECT * FROM families 
WHERE 
  (name ILIKE '%query%' OR slug ILIKE '%query%') 
  AND (category = 'filter' OR 'all' = 'all')
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

---

## Error Handling

### Try-Catch Pattern
```typescript
try {
  const result = await sql`...`;
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Database error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

### Validación de Sesión
```typescript
const session = await auth();

if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

if (session.user.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## Seguridad Implementada

### 1. Password Hashing
```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

### 2. JWT Sessions
- Tokens firmados con `AUTH_SECRET`
- Expiración automática
- No almacena datos sensibles en localStorage

### 3. CSRF Protection
- NextAuth maneja tokens CSRF automáticamente
- Cookies httpOnly

### 4. SQL Injection Prevention
- Uso de prepared statements (template literals de Neon)
- Nunca concatenar strings directamente

### 5. Role-Based Access Control (RBAC)
```typescript
// En layout de admin
if (session.user.role !== 'admin') {
  redirect('/');
}
```

---

## Performance Optimizations

### 1. Server Components por Defecto
- Menos JavaScript enviado al cliente
- Queries directos a la base de datos

### 2. Client Components Solo Cuando Necesario
- Interactividad (botones, inputs, modals)
- React hooks

### 3. Paginación Client-Side
- Cargar todas las familias una vez
- Filtrar/paginar en el navegador
- Para >1000 items → migrar a paginación server-side

### 4. Imagen Optimization
- ImageKit CDN con transformaciones on-the-fly
- Lazy loading con Next.js Image component

### 5. Connection Pooling
- Neon serverless con pooling automático
- Reducción de latencia

---

## Próximas Mejoras Backend

- 🟡 Rate limiting en API routes
- 🟡 Cache con Redis
- 🟡 Background jobs para procesamiento de archivos
- 🟡 Webhooks para notificaciones
- 🟡 Logs estructurados (Winston/Pino)
- 🟡 Health check endpoints
- 🟡 API versioning
- 🟡 GraphQL layer (opcional)

---