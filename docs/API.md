# 📚 BORACITY API DOCUMENTATION

**Version:** 2.0.0 (Session 24 Update)  
**Last Updated:** January 15, 2026  

---

## 🌐 PUBLIC ENDPOINTS

### No authentication required
Estos endpoints están disponibles públicamente sin necesidad de autenticación.

---

## GET `/api/search`

Buscar familias con Full-Text Search y paginación.

**Query Parameters:**
- `q` (required): Search query (2-100 characters)
- `tags` (optional): Comma-separated tags to filter (e.g., "modern,wooden")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)

**Examples:**
```bash
# Basic search
GET /api/search?q=chair

# Search with pagination
GET /api/search?q=chair&page=2&limit=20

# Search with tags
GET /api/search?q=chair&tags=modern,wooden

# Complete search
GET /api/search?q=chair&tags=modern&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Modern Office Chair",
      "slug": "modern-office-chair",
      "category": "furniture",
      "description": "A modern office chair...",
      "thumbnailUrl": "https://ik.imagekit.io/xxx/thumb.png",
      "metadata": {
        "downloads": 1247,
        "views": 3891,
        "fileSize": "245 KB",
        "revitVersion": "2024",
        "uploadDate": "2026-01-12T10:30:00Z"
      },
      "tags": ["modern", "office", "chair", "furniture"]
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "hasMore": true,
    "totalPages": 8
  },
  "query": "chair",
  "tags": ["modern"]
}
```

**Response (400) - Validation Error:**
```json
{
  "success": false,
  "error": "Query parameter \"q\" is required",
  "example": "/api/search?q=chair&page=1&limit=20"
}
```

**Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-Response-Time: 45ms
X-Total-Results: 150
X-Current-Page: 1
```

**Rate Limit:**
- 20 requests per minute per IP

**Search Features:**
- ✅ Full-Text Search with relevance ranking
- ✅ Multi-word queries ("modern chair")
- ✅ Tag filtering (AND logic)
- ✅ Intelligent ranking (relevance + popularity)
- ✅ Name boost (2x score for title matches)
- ✅ Automatic fallback to ILIKE if FTS fails

---

## GET `/api/tags`

Obtener todos los tags únicos disponibles.

**No parameters required**

**Example:**
```bash
GET /api/tags
```

**Response (200):**
```json
{
  "success": true,
  "tags": [
    "LED",
    "armchair",
    "awning",
    "bar",
    "casement",
    "ceiling",
    "ceiling fan",
    "chair",
    "door",
    "double",
    "exterior",
    "fan",
    "furniture",
    "glass",
    "kitchen",
    "lighting",
    "living room",
    "modern",
    "ottoman",
    "pendant",
    "triple",
    "two lite",
    "vertical",
    "window",
    "wood"
  ],
  "count": 25
}
```

**Response (500) - Error:**
```json
{
  "success": false,
  "error": "Failed to fetch tags"
}
```

**Cache:**
- Server-side cache: 1 hour
- Tags are refreshed automatically when families are created/updated

---

## 🔒 ADMIN ENDPOINTS

### Autenticación requerida
Todos los endpoints de admin requieren:
- ✅ Usuario autenticado (sesión válida)
- ✅ Rol de admin (`user.role === 'admin'`)

---

## POST `/api/admin/families`

Crear una nueva familia.

**Request Body:**
```json
{
  "name": "Modern Office Chair",
  "slug": "modern-office-chair",
  "category": "furniture",
  "description": "A modern office chair with ergonomic design",
  "revit_version": "2024",
  "rfa_url": "https://pub-xxx.r2.dev/rfa-files/123-file.rfa",
  "thumbnail_url": "https://ik.imagekit.io/xxx/thumbnails/123-thumb.png",
  "file_size": 2048000
}
```

**Response (200):**
```json
{
  "success": true,
  "family": {
    "id": "uuid",
    "slug": "modern-office-chair"
  }
}
```

**Validaciones:**
- `name`, `slug`, `category`, `description` son requeridos
- `slug` debe ser único
- `rfa_url` y `thumbnail_url` son opcionales

---

## GET `/api/admin/families/[slug]`

Obtener una familia por slug.

**Response (200):**
```json
{
  "family": {
    "id": "uuid",
    "name": "Modern Office Chair",
    "slug": "modern-office-chair",
    "category": "furniture",
    "description": "A modern office chair...",
    "revit_version": "2024",
    "rfa_url": "https://...",
    "thumbnail_url": "https://...",
    "file_size": 2048000,
    "downloads": 0,
    "views": 0,
    "created_at": "2026-01-12T..."
  }
}
```

**Response (404):**
```json
{
  "error": "Family not found"
}
```

---

## PUT `/api/admin/families/[slug]`

Actualizar una familia existente.

**Request Body:**
```json
{
  "name": "Updated Name",
  "category": "furniture",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "family": {
    "id": "uuid",
    "slug": "modern-office-chair"
  }
}
```

**Notas:**
- El `slug` NO se puede modificar
- Solo `name`, `category` y `description` son editables

---

## DELETE `/api/admin/families/[slug]`

Eliminar una familia.

**Response (200):**
```json
{
  "success": true
}
```

**Response (404):**
```json
{
  "error": "Family not found"
}
```

---

## POST `/api/admin/upload`

Subir archivos a Cloudflare R2 o ImageKit.

**Request (multipart/form-data):**
```
file: File (archivo .rfa o imagen)
type: "rfa" | "thumbnail"
```

**Response (200) - RFA:**
```json
{
  "success": true,
  "url": "https://pub-xxx.r2.dev/rfa-files/1234567890-file.rfa",
  "fileName": "file.rfa",
  "fileSize": 2048000
}
```

**Response (200) - Thumbnail:**
```json
{
  "success": true,
  "url": "https://ik.imagekit.io/xxx/thumbnails/1234567890-thumb.png",
  "fileName": "thumb.png"
}
```

**Validaciones:**
- Si `type === 'rfa'`: el archivo debe terminar en `.rfa`
- Si `type === 'thumbnail'`: el archivo debe ser una imagen (`image/*`)
- `type` debe ser `"rfa"` o `"thumbnail"`

**Errores comunes:**
```json
{
  "error": "No file provided"
}
```
```json
{
  "error": "File must be a .rfa file"
}
```
```json
{
  "error": "File must be an image"
}
```
```json
{
  "error": "Invalid type. Must be 'rfa' or 'thumbnail'"
}
```

---

## 📊 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 400 | Bad Request (validación fallida) |
| 401 | Unauthorized (no autenticado o no admin) |
| 404 | Not Found (familia no existe) |
| 429 | Too Many Requests (rate limit excedido) |
| 500 | Internal Server Error |

---

## 🔧 Servicios Externos

### Cloudflare R2
- **Uso:** Almacenamiento de archivos .rfa
- **Bucket:** `boracity-files`
- **URL pública:** `https://pub-8ea99d5661d04c9fb5bd6dcaa871a261.r2.dev`

### ImageKit
- **Uso:** CDN de imágenes (thumbnails)
- **URL endpoint:** `https://ik.imagekit.io/nbqxh22tq`
- **Carpeta:** `thumbnails/`

---

## 💡 Ejemplo de Flujo Completo

### 1. Upload de archivos (Admin)
```javascript
// Upload RFA
const rfaFormData = new FormData();
rfaFormData.append('file', rfaFile);
rfaFormData.append('type', 'rfa');

const rfaResponse = await fetch('/api/admin/upload', {
  method: 'POST',
  body: rfaFormData,
});
const rfaData = await rfaResponse.json();

// Upload Thumbnail
const thumbFormData = new FormData();
thumbFormData.append('file', thumbFile);
thumbFormData.append('type', 'thumbnail');

const thumbResponse = await fetch('/api/admin/upload', {
  method: 'POST',
  body: thumbFormData,
});
const thumbData = await thumbResponse.json();
```

### 2. Crear familia con URLs (Admin)
```javascript
const createResponse = await fetch('/api/admin/families', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Modern Office Chair',
    slug: 'modern-office-chair',
    category: 'furniture',
    description: 'A modern office chair...',
    revit_version: '2024',
    rfa_url: rfaData.url,
    thumbnail_url: thumbData.url,
    file_size: rfaData.fileSize,
  }),
});
```

### 3. Búsqueda pública (Frontend)
```javascript
// Basic search
const searchResponse = await fetch('/api/search?q=chair');
const searchData = await searchResponse.json();

// With pagination and tags
const advancedSearch = await fetch(
  '/api/search?q=chair&tags=modern,wooden&page=2&limit=20'
);
const advancedData = await advancedSearch.json();
```

### 4. Infinite scroll implementation (Frontend)
```javascript
const [results, setResults] = useState([]);
const [page, setPage] = useState(1);

async function loadMore() {
  const response = await fetch(
    `/api/search?q=${query}&page=${page + 1}&limit=20`
  );
  const data = await response.json();
  
  setResults(prev => [...prev, ...data.data]);
  setPage(prev => prev + 1);
}

// Load more when user scrolls to 80% of page
useEffect(() => {
  const handleScroll = () => {
    const scrollPercentage = 
      (window.scrollY + window.innerHeight) / document.body.offsetHeight;
    
    if (scrollPercentage > 0.8 && data.pagination.hasMore) {
      loadMore();
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

## 🚀 Performance Tips

### Search Optimization
- Use pagination (`page` and `limit` params) to avoid loading all results
- Cache tags endpoint result on client (updates hourly)
- Implement debounce for search input (300-500ms)

### Rate Limiting
- Search endpoint: 20 requests/minute per IP
- Implement retry logic with exponential backoff
- Show user-friendly error messages when rate limited

### Caching Strategy
- Tags: Server cache 1 hour, client cache 1 hour
- Search results: No cache (always fresh)
- Family details: Server cache 30 minutes

---

**Documentation Version:** 2.0.0  
**API Version:** 2.0.0  
**Last Updated:** January 15, 2026