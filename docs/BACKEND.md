# 🔧 BACKEND DOCUMENTATION - BORACITY

**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Purpose:** Technical implementation guide for backend services

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Database - PostgreSQL on Neon](#1-database---postgresql-on-neon)
3. [File Storage - Cloudflare R2](#2-file-storage---cloudflare-r2)
4. [CDN - ImageKit](#3-cdn---imagekit)
5. [API Routes](#4-api-routes)
6. [Authentication](#5-authentication-future)
7. [Migrations](#6-migrations)
8. [Testing](#7-testing)
9. [Monitoring & Logs](#8-monitoring--logs)
10. [Troubleshooting](#9-troubleshooting)

---

## 🎯 **OVERVIEW**

### **Backend Stack Summary**

```
┌─────────────────────────────────────────────────────┐
│  BACKEND SERVICES                                   │
├─────────────────────────────────────────────────────┤
│  1. Neon PostgreSQL    → Metadata & relationships   │
│  2. Cloudflare R2      → File storage (.rfa files)  │
│  3. ImageKit CDN       → Image optimization         │
│  4. Vercel Functions   → API routes                 │
└─────────────────────────────────────────────────────┘
```

### **Service Responsibilities**

| Service | Purpose | What It Stores | Cost |
|---------|---------|----------------|------|
| **Neon** | Database | Family metadata, user data, stats | $0-5/mo |
| **R2** | File storage | .rfa family files | ~$1/mo |
| **ImageKit** | CDN | Thumbnails, hero images | $0/mo |
| **Vercel** | Compute | API routes, serverless functions | $0/mo |

---

## 1. 💾 **DATABASE - POSTGRESQL ON NEON**

### **1.1 Overview**

**Provider:** Neon.tech  
**Type:** Serverless PostgreSQL  
**Region:** US East (Ohio) - aws-us-east-1  
**Version:** PostgreSQL 16

### **1.2 Why Neon?**

```
✅ Serverless (no connection management)
✅ HTTP-based queries (perfect for Vercel)
✅ 3GB free tier
✅ Automatic scaling
✅ Built-in connection pooling
✅ Point-in-time recovery (7 days)

vs Supabase:
❌ Supabase requires $25/mo Pro for production
❌ Supabase charges for egress
✅ Neon is free for small projects
```

### **1.3 Connection Setup**

**Installation:**
```bash
npm install @neondatabase/serverless
```

**Configuration:**
```typescript
// src/lib/neon.ts
import { neon } from '@neondatabase/serverless';

// Connection string from environment
const sql = neon(process.env.DATABASE_URL!);

// HTTP-based connection (no persistent connection)
// Perfect for serverless environments like Vercel
export { sql };
```

**Environment Variable:**
```bash
# .env.local
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/boracity?sslmode=require"
```

**Where to get it:**
1. Go to https://console.neon.tech
2. Select your project
3. Go to "Connection Details"
4. Copy the connection string (Pooled connection)

### **1.4 Database Schema**

**Complete Schema:**
```sql
-- ============================================================
-- FAMILIES TABLE (Core content)
-- ============================================================
CREATE TABLE families (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Routing & URLs
  slug TEXT UNIQUE NOT NULL,           -- URL-friendly: 'modern-bar-chair'
  category TEXT NOT NULL,              -- 'furniture', 'doors', etc.
  
  -- Content
  name TEXT NOT NULL,                  -- Display name
  description TEXT,                    -- Rich text description
  
  -- External Resource URLs
  thumbnail_url TEXT,                  -- ImageKit CDN URL
  file_url TEXT,                       -- Cloudflare R2 URL
  file_size TEXT,                      -- '2.5 MB', '10.3 MB'
  
  -- Engagement Metrics
  downloads INTEGER DEFAULT 0,         -- Download counter
  views INTEGER DEFAULT 0,             -- View counter
  likes INTEGER DEFAULT 0,             -- Like counter (future)
  
  -- Metadata
  author TEXT DEFAULT 'Boracity Team', -- Creator name
  tags TEXT[],                         -- Search tags
  revit_versions TEXT[],               -- ['2025', '2024', '2023']
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_category CHECK (
    category IN (
      'furniture', 'doors', 'windows', 'lighting',
      'plumbing', 'electrical', 'structural', 'generic'
    )
  ),
  CONSTRAINT valid_slug CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'  -- Only lowercase, numbers, hyphens
  )
);

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

-- Category filtering (most common query)
CREATE INDEX idx_families_category 
  ON families(category);

-- Slug lookup (detail pages)
CREATE INDEX idx_families_slug 
  ON families(slug);

-- Popular sorting
CREATE INDEX idx_families_downloads 
  ON families(downloads DESC);

-- Recent sorting
CREATE INDEX idx_families_created 
  ON families(created_at DESC);

-- Full-text search
CREATE INDEX idx_families_search 
  ON families 
  USING gin(to_tsvector('english', name || ' ' || coalesce(description, '')));

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Increment download counter (atomic)
CREATE OR REPLACE FUNCTION increment_downloads(family_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE families 
  SET downloads = downloads + 1 
  WHERE id = family_uuid;
END;
$$ LANGUAGE plpgsql;

-- Increment view counter (atomic)
CREATE OR REPLACE FUNCTION increment_views(family_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE families 
  SET views = views + 1 
  WHERE id = family_uuid;
END;
$$ LANGUAGE plpgsql;

-- Search families (full-text)
CREATE OR REPLACE FUNCTION search_families(search_query TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name TEXT,
  category TEXT,
  thumbnail_url TEXT,
  downloads INTEGER,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.slug,
    f.name,
    f.category,
    f.thumbnail_url,
    f.downloads,
    ts_rank(
      to_tsvector('english', f.name || ' ' || coalesce(f.description, '')),
      plainto_tsquery('english', search_query)
    ) as relevance
  FROM families f
  WHERE 
    to_tsvector('english', f.name || ' ' || coalesce(f.description, '')) 
    @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC, f.downloads DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

### **1.5 Query Patterns**

**Basic Queries:**
```typescript
// src/lib/db/families.ts
import { sql } from '@/lib/neon';

// Get all families
export async function getAllFamilies() {
  const families = await sql`
    SELECT * FROM families 
    ORDER BY created_at DESC 
    LIMIT 100
  `;
  return families;
}

// Get family by slug
export async function getFamilyBySlug(category: string, slug: string) {
  const [family] = await sql`
    SELECT * FROM families 
    WHERE category = ${category} 
    AND slug = ${slug}
  `;
  return family || null;
}

// Get families by category
export async function getFamiliesByCategory(category: string) {
  const families = await sql`
    SELECT * FROM families 
    WHERE category = ${category}
    ORDER BY downloads DESC
    LIMIT 50
  `;
  return families;
}

// Search families (using full-text search)
export async function searchFamilies(query: string) {
  const families = await sql`
    SELECT * FROM search_families(${query})
  `;
  return families;
}

// Increment download counter
export async function incrementDownloads(familyId: string) {
  await sql`
    SELECT increment_downloads(${familyId}::uuid)
  `;
}

// Increment view counter
export async function incrementViews(familyId: string) {
  await sql`
    SELECT increment_views(${familyId}::uuid)
  `;
}

// Get popular families
export async function getPopularFamilies(limit: number = 10) {
  const families = await sql`
    SELECT * FROM families 
    ORDER BY downloads DESC 
    LIMIT ${limit}
  `;
  return families;
}

// Get recent families
export async function getRecentFamilies(limit: number = 10) {
  const families = await sql`
    SELECT * FROM families 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
  return families;
}

// Get statistics
export async function getStats() {
  const [stats] = await sql`
    SELECT 
      COUNT(*)::int as total_families,
      SUM(downloads)::int as total_downloads,
      SUM(views)::int as total_views,
      COUNT(DISTINCT category)::int as total_categories
    FROM families
  `;
  return stats;
}
```

### **1.6 Data Types**

**TypeScript Interface:**
```typescript
// src/types/database.ts

export interface Family {
  id: string;
  slug: string;
  category: FamilyCategory;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  file_url: string | null;
  file_size: string | null;
  downloads: number;
  views: number;
  likes: number;
  author: string;
  tags: string[];
  revit_versions: string[];
  created_at: Date;
  updated_at: Date;
}

export type FamilyCategory = 
  | 'furniture' 
  | 'doors' 
  | 'windows' 
  | 'lighting'
  | 'plumbing'
  | 'electrical'
  | 'structural'
  | 'generic';

export interface FamilyStats {
  total_families: number;
  total_downloads: number;
  total_views: number;
  total_categories: number;
}
```

### **1.7 Limits & Quotas**

**Free Tier (Current):**
```
Storage: 3 GB
Compute: 191 hours/month
Branches: 10
Projects: 1

When to Upgrade:
├─ Storage >2.5 GB → Consider Scale plan
├─ Compute >150 hours → Monitor usage
└─ Need staging → Create branch (free)
```

**Scale Plan ($19/month):**
```
Storage: 8 GB
Compute: Unlimited
Branches: Unlimited
Projects: Unlimited
```

### **1.8 Connection Best Practices**

```typescript
// ✅ GOOD: Use SQL template literals
const family = await sql`
  SELECT * FROM families WHERE id = ${familyId}
`;

// ❌ BAD: String concatenation (SQL injection risk)
const family = await sql(
  `SELECT * FROM families WHERE id = '${familyId}'`
);

// ✅ GOOD: Batch operations
const families = await sql`
  INSERT INTO families (name, slug, category)
  SELECT * FROM json_populate_recordset(null::families, ${JSON.stringify(data)})
  RETURNING *
`;

// ❌ BAD: Loop with individual inserts
for (const item of data) {
  await sql`INSERT INTO families ...`;  // N queries
}

// ✅ GOOD: Use transactions for related operations
const [family] = await sql.transaction([
  sql`INSERT INTO families ...`,
  sql`UPDATE stats SET count = count + 1`
]);

// ✅ GOOD: Use prepared statements for repeated queries
const getFamilyById = sql.prepare('SELECT * FROM families WHERE id = $1');
const family = await getFamilyById(id);
```

### **1.9 Monitoring**

**Check Database Size:**
```sql
-- Run in Neon SQL Editor
SELECT 
  pg_size_pretty(pg_database_size('boracity')) as database_size,
  pg_size_pretty(pg_total_relation_size('families')) as families_table_size;
```

**Check Query Performance:**
```sql
-- Enable query stats
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Alert Thresholds:**
```typescript
const DATABASE_ALERTS = {
  storage_warning: 2.5,      // GB - 83% of free tier
  storage_critical: 2.9,     // GB - 97% of free tier
  query_time_warning: 1000,  // ms - slow query
  query_time_critical: 5000, // ms - very slow query
};
```

---

## 2. 📦 **FILE STORAGE - CLOUDFLARE R2**

### **2.1 Overview**

**Provider:** Cloudflare R2  
**Type:** S3-compatible object storage  
**Bucket:** boracity-files  
**Region:** Automatic (global)

### **2.2 Why Cloudflare R2?**

```
✅ $0 egress (unlimited downloads)
✅ S3-compatible API
✅ Global CDN included
✅ $0.015/GB storage (cheap)
✅ Cloudflare's network (fast)

vs AWS S3:
❌ S3: $0.09/GB egress = $45/month for 500GB
✅ R2: $0/GB egress = $0/month for ∞ GB

This one decision saves $540/year
```

### **2.3 Setup**

**Installation:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Configuration:**
```typescript
// src/lib/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client (S3-compatible)
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export { r2 };
```

**Environment Variables:**
```bash
# .env.local
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=boracity-files
R2_PUBLIC_URL=https://files.boracity.com  # Optional: custom domain
```

### **2.4 Bucket Structure**

```
boracity-files/
├── families/
│   ├── furniture/
│   │   ├── modern-bar-chair.rfa
│   │   ├── armchair-ottoman.rfa
│   │   ├── office-desk-01.rfa
│   │   └── ...
│   ├── doors/
│   │   ├── exterior-glass-wood.rfa
│   │   ├── interior-panel-door.rfa
│   │   └── ...
│   ├── windows/
│   │   ├── casement-window.rfa
│   │   └── ...
│   ├── lighting/
│   └── ...
├── temp/
│   └── uploads/              # Temporary uploads (24h retention)
│       ├── temp-uuid-123.rfa
│       └── ...
└── backups/                  # Manual backups (optional)
    └── 2026-01-11/
        └── ...

Naming Convention:
- Lowercase only
- Hyphens for spaces
- No special characters
- Pattern: {category}/{slug}.rfa
```

### **2.5 Upload Operations**

**Upload File:**
```typescript
// src/lib/r2/upload.ts
import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadFile(
  file: File,
  category: string,
  slug: string
): Promise<string> {
  const key = `families/${category}/${slug}.rfa`;
  
  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Upload to R2
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: 'application/octet-stream',
    Metadata: {
      'uploaded-by': 'admin',
      'upload-date': new Date().toISOString(),
    },
  }));
  
  // Return the file URL
  const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return fileUrl;
}
```

**Generate Signed URL (for downloads):**
```typescript
// src/lib/r2/download.ts
import { r2 } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getDownloadUrl(
  category: string,
  slug: string,
  expiresIn: number = 300  // 5 minutes
): Promise<string> {
  const key = `families/${category}/${slug}.rfa`;
  
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });
  
  // Generate signed URL (expires in 5 minutes)
  const signedUrl = await getSignedUrl(r2, command, { 
    expiresIn 
  });
  
  return signedUrl;
}
```

**Delete File:**
```typescript
// src/lib/r2/delete.ts
import { r2 } from '@/lib/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function deleteFile(
  category: string,
  slug: string
): Promise<void> {
  const key = `families/${category}/${slug}.rfa`;
  
  await r2.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  }));
}
```

**List Files:**
```typescript
// src/lib/r2/list.ts
import { r2 } from '@/lib/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function listFiles(category?: string) {
  const prefix = category ? `families/${category}/` : 'families/';
  
  const response = await r2.send(new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME!,
    Prefix: prefix,
  }));
  
  return response.Contents?.map(obj => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
  })) || [];
}
```

### **2.6 Download Flow**

**Complete Download Flow:**
```
1. User clicks "Download" button on detail page
   ↓
2. Frontend sends request to API route:
   POST /api/download
   { familyId: "abc-123" }
   ↓
3. API Route (src/app/api/download/route.ts):
   a. Validate request
   b. Get family from Neon database
   c. Increment download counter
   d. Generate R2 signed URL (valid 5 min)
   e. Return URL to frontend
   ↓
4. Frontend redirects browser to signed URL
   window.location.href = downloadUrl;
   ↓
5. Browser downloads directly from R2
   (No Vercel bandwidth used! ✅)
   ↓
6. Download complete
```

**API Route Implementation:**
```typescript
// src/app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFamilyBySlug, incrementDownloads } from '@/lib/db/families';
import { getDownloadUrl } from '@/lib/r2/download';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { category, slug } = await request.json();
    
    // Validate inputs
    if (!category || !slug) {
      return NextResponse.json(
        { error: 'Missing category or slug' },
        { status: 400 }
      );
    }
    
    // Get family from database
    const family = await getFamilyBySlug(category, slug);
    
    if (!family) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }
    
    // Increment download counter (async, don't wait)
    incrementDownloads(family.id).catch(err => 
      logger.error('Failed to increment downloads', { familyId: family.id, error: err })
    );
    
    // Generate signed download URL
    const downloadUrl = await getDownloadUrl(category, slug);
    
    logger.info('Download URL generated', {
      familyId: family.id,
      category,
      slug,
    });
    
    return NextResponse.json({
      downloadUrl,
      fileName: `${slug}.rfa`,
      fileSize: family.file_size,
    });
    
  } catch (error) {
    logger.error('Download API error', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **2.7 Cost Calculation**

**Monthly Cost Breakdown:**
```typescript
const R2_PRICING = {
  storage: 0.015,      // per GB/month
  classA: 4.50,        // per million operations (write)
  classB: 0.36,        // per million operations (read)
  egress: 0,           // FREE ⭐⭐⭐
};

// Example: 50GB storage, 25K downloads/month
const monthlyCost = {
  storage: 50 * 0.015,              // $0.75
  writes: (100 / 1_000_000) * 4.50, // $0.0005 (100 uploads)
  reads: (25_000 / 1_000_000) * 0.36, // $0.009 (25K downloads)
  egress: 0,                         // $0 (unlimited downloads)
  total: 0.75 + 0.0005 + 0.009,     // ≈ $0.76/month
};
```

### **2.8 Monitoring**

**Check R2 Usage:**
```bash
# Via Cloudflare Dashboard
# https://dash.cloudflare.com/r2

# Current month stats:
Storage: 52.3 GB × $0.015 = $0.78
Operations: 850K reads = $0.31
Egress: 380 GB × $0 = $0.00
──────────────────────────────────
Total: $1.09
```

**Alert Thresholds:**
```typescript
const R2_ALERTS = {
  storage_warning: 100,      // GB - $1.50/month
  storage_critical: 500,     // GB - $7.50/month
  operations_warning: 5,     // dollars/month
};
```

---

## 3. 🖼️ **CDN - IMAGEKIT**

### **3.1 Overview**

**Provider:** ImageKit.io  
**Type:** Image CDN with optimization  
**Base URL:** `https://ik.imagekit.io/nbqxh22tq`

### **3.2 Why ImageKit?**

```
✅ 20GB bandwidth free/month
✅ Automatic WebP/AVIF conversion
✅ Responsive image resizing
✅ Lazy loading built-in
✅ Quality optimization
✅ CDN included

vs Self-hosting:
❌ Self: Need to optimize images manually
❌ Self: No CDN caching
❌ Self: More Vercel bandwidth usage
✅ ImageKit: Handles everything automatically
```

### **3.3 Setup**

**Configuration:**
```typescript
// src/lib/imagekit.ts

const IMAGEKIT_BASE = 'https://ik.imagekit.io/nbqxh22tq/revit';

export function getImageUrl(
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
  }
): string {
  const params = new URLSearchParams();
  
  // Transformation parameters
  if (options?.width) params.set('w', options.width.toString());
  if (options?.height) params.set('h', options.height.toString());
  if (options?.quality) params.set('q', options.quality.toString());
  if (options?.format) params.set('f', options.format);
  
  const query = params.toString();
  const url = `${IMAGEKIT_BASE}/${path}`;
  
  return query ? `${url}?tr=${query}` : url;
}

// Presets for common use cases
export const ImagePresets = {
  thumbnail: { width: 400, quality: 80, format: 'auto' as const },
  card: { width: 600, quality: 85, format: 'auto' as const },
  detail: { width: 1200, quality: 90, format: 'auto' as const },
  hero: { width: 1920, quality: 85, format: 'auto' as const },
};
```

**Usage:**
```typescript
// In components
import { getImageUrl, ImagePresets } from '@/lib/imagekit';

const thumbnailUrl = getImageUrl(
  'furniture/modern-chair.png',
  ImagePresets.thumbnail
);
// Result: https://ik.imagekit.io/nbqxh22tq/revit/furniture/modern-chair.png?tr=w-400,q-80,f-auto
```

### **3.4 Image Paths**

**Folder Structure:**
```
imagekit.io/nbqxh22tq/revit/
├── furniture/
│   ├── modern-chair.png
│   ├── bar-stool.png
│   └── ...
├── doors/
│   ├── exterior-door.png
│   └── ...
├── windows/
├── lighting/
└── hero/
    ├── home-hero.jpg
    └── ...
```

### **3.5 Optimization Examples**

```typescript
// Thumbnail (small, compressed)
getImageUrl('furniture/chair.png', { 
  width: 400, 
  quality: 75, 
  format: 'auto' 
});

// Responsive (different sizes)
const srcSet = [400, 800, 1200].map(w => 
  `${getImageUrl('furniture/chair.png', { width: w })} ${w}w`
).join(', ');

// Progressive loading (blur placeholder)
getImageUrl('furniture/chair.png', { 
  width: 20,    // Tiny blur placeholder
  quality: 30 
});
```

### **3.6 Monitoring**

**Free Tier Limits:**
```
Bandwidth: 20 GB/month
Requests: 20,000/month
Storage: 20 GB
Transformations: Unlimited

When to Upgrade ($49/month):
├─ Bandwidth >18 GB consistently
├─ Requests >18K consistently
└─ Need more storage
```

---

## 4. 🌐 **API ROUTES**

### **4.1 Overview**

All API routes live in `src/app/api/` following Next.js App Router conventions.

### **4.2 Available Routes**

```
/api/
├── families/
│   ├── route.ts              → GET all families
│   └── [id]/
│       └── route.ts          → GET family by ID
├── download/
│   └── route.ts              → POST generate download URL
├── search/
│   └── route.ts              → GET search families
└── stats/
    └── route.ts              → GET site statistics
```

### **4.3 Implementation Examples**

**Get All Families:**
```typescript
// src/app/api/families/route.ts
import { NextResponse } from 'next/server';
import { getAllFamilies } from '@/lib/db/families';

export async function GET() {
  try {
    const families = await getAllFamilies();
    
    return NextResponse.json({
      success: true,
      count: families.length,
      data: families,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch families' },
      { status: 500 }
    );
  }
}

// Optional: Rate limiting
export const runtime = 'edge';
export const maxDuration = 10; // seconds
```

**Search Families:**
```typescript
// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchFamilies } from '@/lib/db/families';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }
  
  try {
    const results = await searchFamilies(query);
    
    return NextResponse.json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
```

**Get Statistics:**
```typescript
// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db/families';

export async function GET() {
  try {
    const stats = await getStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// Cache for 1 hour
export const revalidate = 3600;
```

### **4.4 Error Handling Pattern**

```typescript
// Standard error response format
try {
  // ... operation
  return NextResponse.json({ success: true, data });
} catch (error) {
  logger.error('API error', { error, route: '/api/families' });
  
  return NextResponse.json(
    { 
      success: false, 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message 
    },
    { status: 500 }
  );
}
```

---

## 5. 🔐 **AUTHENTICATION (Future)**

### **5.1 Planned Implementation**

**Provider Options:**
```
Option A: Clerk (Recommended)
├─ $25/month for 10K MAU
├─ Built-in UI components
├─ Email, Google, GitHub auth
└─ User management dashboard

Option B: Auth.js (formerly NextAuth)
├─ Free (self-hosted)
├─ More configuration needed
├─ Full control
└─ OAuth providers

Option C: Supabase Auth
├─ Free tier available
├─ Email auth + OAuth
├─ Row Level Security
└─ Good for simple apps
```

**Recommendation:** Start with Clerk for faster development.

### **5.2 Protected Routes**

```typescript
// src/middleware.ts (when auth is added)
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/revit/(.*)',
    '/api/families',
    '/api/search',
  ],
  privateRoutes: [
    '/admin/(.*)',
    '/api/upload',
    '/api/delete',
  ],
});
```

---

## 6. 📋 **MIGRATIONS**

### **6.1 Migration Files**

Location: `docs/migrations/`

```
migrations/
├── 001_initial_schema.sql      → Create families table
├── 002_add_indexes.sql         → Add performance indexes
├── 003_add_functions.sql       → Add helper functions
└── README.md                   → Migration instructions
```

### **6.2 Running Migrations**

**Manual (Neon SQL Editor):**
1. Go to https://console.neon.tech
2. Select your project
3. Go to "SQL Editor"
4. Copy contents of migration file
5. Execute
6. Verify with `\d families`

**Automated (Future):**
```bash
# Using node-pg-migrate or similar
npm run migrate:up
npm run migrate:down
npm run migrate:create "add_users_table"
```

---

## 7. 🧪 **TESTING**

### **7.1 Database Tests**

```typescript
// src/lib/db/__tests__/families.test.ts
import { describe, it, expect, beforeAll } from '@jest/globals';
import { getAllFamilies, getFamilyBySlug } from '../families';

describe('Family Database Operations', () => {
  it('should fetch all families', async () => {
    const families = await getAllFamilies();
    expect(families).toBeInstanceOf(Array);
    expect(families.length).toBeGreaterThan(0);
  });
  
  it('should fetch family by slug', async () => {
    const family = await getFamilyBySlug('furniture', 'modern-chair');
    expect(family).toBeDefined();
    expect(family?.category).toBe('furniture');
  });
});
```

### **7.2 API Tests**

```typescript
// src/app/api/families/__tests__/route.test.ts
import { GET } from '../route';

describe('/api/families', () => {
  it('should return families list', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
  });
});
```

---

## 8. 📊 **MONITORING & LOGS**

### **8.1 Logging**

```typescript
// src/lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...meta,
    };
    
    if (process.env.NODE_ENV === 'production') {
      // Structured JSON for monitoring tools
      console.log(JSON.stringify(logData));
    } else {
      // Colored console for development
      console.log(`[${level.toUpperCase()}]`, message, meta || '');
    }
  }
  
  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }
  
  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }
  
  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }
}

export const logger = new Logger();
```

### **8.2 Monitoring Dashboards**

**Services to Monitor:**
- Vercel: https://vercel.com/dashboard/usage
- Neon: https://console.neon.tech
- Cloudflare R2: https://dash.cloudflare.com/r2
- ImageKit: https://imagekit.io/dashboard

**Key Metrics:**
```typescript
const METRICS = {
  vercel_bandwidth: '45 GB / 100 GB',
  neon_storage: '1.8 GB / 3 GB',
  r2_storage: '52 GB',
  r2_cost: '$1.09/month',
  imagekit_bandwidth: '15 GB / 20 GB',
};
```

---

## 9. 🐛 **TROUBLESHOOTING**

### **9.1 Common Issues**

**Database Connection Failed:**
```
Error: Connection timeout
Solution:
1. Check DATABASE_URL in .env.local
2. Verify Neon project is not suspended
3. Check if IP is whitelisted (usually not needed)
4. Restart dev server
```

**R2 Upload Failed:**
```
Error: Access Denied
Solution:
1. Verify R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY
2. Check bucket name is correct
3. Verify API token has write permissions
4. Check CORS settings in R2 dashboard
```

**ImageKit 404:**
```
Error: Image not found
Solution:
1. Verify image exists in ImageKit dashboard
2. Check path is correct (case-sensitive)
3. Verify NEXT_PUBLIC_IMAGEKIT_ID is correct
4. Clear browser cache
```

### **9.2 Debug Mode**

```typescript
// Enable debug logs
// .env.local
DEBUG=true
LOG_LEVEL=debug

// In code
if (process.env.DEBUG) {
  logger.debug('Family query', { category, slug });
}
```

---

## 📚 **RELATED DOCUMENTATION**

- [ARCHITECTURE.md](./ARCHITECTURE.md) - High-level architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [API.md](./API.md) - API documentation
- [COST_TRACKING.md](./COST_TRACKING.md) - Monthly cost tracking

---

**Last Updated:** January 11, 2026  
**Next Review:** When implementing authentication or scaling  
**Version:** 1.0.0