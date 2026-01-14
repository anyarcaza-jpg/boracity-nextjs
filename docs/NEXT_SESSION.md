## 📋 TAREAS PARA SESIÓN 22

### **🎯 OBJETIVO PRINCIPAL:**
Implementar sistema completo de uploads en el ADMIN PANEL.

**NOTA IMPORTANTE:** La página de detalle público (`/revit/{category}/{slug}`) 
YA EXISTE y funciona. Lo que falta es la funcionalidad de subida en el admin.

---

### **TAREA 1: Sistema de Upload de Archivos en Admin** ⭐⭐⭐

#### **Subtareas:**

**1.1 Implementar campo de archivo en formulario de creación**
- Archivo: `src/app/admin/families/new/page.tsx`
- Agregar input file con validación (RFA/RVT, max 50MB)
- Progress bar durante upload
- Preview del nombre del archivo

**1.2 Crear API route de upload para archivos**
- Archivo: `src/app/api/admin/upload/file/route.ts`
- Integrar con R2 (Cloudflare) o ImageKit
- Validación server-side (tipo, tamaño)
- Retornar URL del archivo subido

**1.3 Actualizar formulario de edición**
- Archivo: `src/app/admin/families/edit/page.tsx`
- Mostrar archivo actual (si existe)
- Permitir reemplazar archivo
- Botón para eliminar archivo

**1.4 Actualizar funciones de DB**
- Archivo: `src/lib/db/families.ts`
- Asegurar que `createFamily()` guarda `file_url`
- Modificar `updateFamily()` para actualizar `file_url`

---

### **TAREA 2: Sistema de Galería de Imágenes en Admin** ⭐⭐⭐

**NOTA:** La galería pública YA funciona. Falta implementar la subida en admin.

#### **Subtareas:**

**2.1 Componente de subida múltiple de imágenes**
- Crear: `src/components/admin/ImageGalleryUploader.tsx`
- Drag & drop para múltiples imágenes
- Preview de imágenes antes de subir
- Marcar imagen principal
- Reordenar imágenes (drag to reorder)

**2.2 API route para subida de imágenes**
- Archivo: `src/app/api/admin/upload/images/route.ts`
- Upload múltiple a ImageKit
- Generar thumbnails automáticamente
- Retornar URLs (original + thumbnail)

**2.3 Tabla de imágenes en base de datos**
- Verificar si existe tabla `family_images`
- Si no existe, crear migración:
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

**2.4 Integrar en formularios de admin**
- Agregar en `/admin/families/new`
- Agregar en `/admin/families/edit`
- Mostrar galería actual con opciones de editar/eliminar

---

### **TAREA 3: Funcionalidades Faltantes en Página de Detalle** ⭐⭐

**NOTA:** La página existe, pero hay funcionalidades que pueden no estar completas.

#### **Subtareas:**

**3.1 Verificar e implementar contador de vistas**
- Al cargar la página, incrementar `views` en DB
- Actualizar función en `src/lib/db/families.ts`

**3.2 Verificar funcionalidad de descarga**
- API route: `/api/download?slug=xxx`
- Incrementar contador de `downloads`
- Redirect a archivo en R2/ImageKit

**3.3 Implementar sistema de likes (opcional)**
- Botón de like funcional
- Guardar en localStorage (temporal) o DB
- Actualizar contador en tiempo real

**3.4 Implementar collections (opcional)**
- Botón "Add to collection"
- Sistema de colecciones por usuario
- Requiere autenticación de usuarios públicos
```

---

## ✅ **RESUMEN DE LA CORRECCIÓN:**

### **LO QUE YA FUNCIONA (Frontend público):**
```
✅ /revit/{category}/{slug} - Página de detalle
✅ Galería de imágenes (visualización)
✅ Botón de descarga
✅ Related families
✅ Breadcrumbs
✅ Stats display
```

### **LO QUE FALTA (Admin panel):**
```
❌ Upload de archivos RFA/RVT en formularios
❌ Upload de múltiples imágenes en admin
❌ Editar galería de imágenes
❌ Eliminar imágenes de galería
❌ Reordenar imágenes
```

### **LO QUE FALTA (Funcionalidad):**
```
⚠️ Incremento real de vistas al visitar detalle
⚠️ Incremento real de downloads al descargar
⚠️ Sistema de likes funcional (si no está)
⚠️ Sistema de collections (si no está)