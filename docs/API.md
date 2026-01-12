---

## ADMIN ENDPOINTS

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

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 400 | Bad Request (validación fallida) |
| 401 | Unauthorized (no autenticado o no admin) |
| 404 | Not Found (familia no existe) |
| 500 | Internal Server Error |

---

## Servicios Externos

### Cloudflare R2
- **Uso:** Almacenamiento de archivos .rfa
- **Bucket:** `boracity-files`
- **URL pública:** `https://pub-8ea99d5661d04c9fb5bd6dcaa871a261.r2.dev`

### ImageKit
- **Uso:** CDN de imágenes (thumbnails)
- **URL endpoint:** `https://ik.imagekit.io/nbqxh22tq`
- **Carpeta:** `thumbnails/`

---

## Ejemplo de Flujo Completo

### 1. Upload de archivos
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

### 2. Crear familia con URLs
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

---