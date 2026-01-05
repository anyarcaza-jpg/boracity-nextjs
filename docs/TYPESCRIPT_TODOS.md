# 🔧 TYPESCRIPT - TODOs Y DEUDA TÉCNICA

**Proyecto:** Boracity v0.5.0  
**Fecha:** 5 de Enero, 2026  
**Estado Migración:** ✅ 100% TypeScript  
**Deuda Técnica:** ⚠️ Media (8 TODOs críticos)

---

## ⚠️ IMPORTANTE

Este documento lista **TODOS los hacks temporales** que usamos para completar la migración rápidamente. 

**Cada `as any` es una bomba de tiempo.** Deben eliminarse antes de producción.

---

## 🚨 CRÍTICO - PRIORIDAD ALTA

### **TODO 1: Eliminar `as any` en params de páginas**

**Archivos afectados:** 3

**Ubicación exacta:**

1. **`src/app/revit/[category]/[slug]/page.tsx`**
   - Línea 10: `const family = await getFamilyBySlug(category as any, slug);`
   - Línea 25: `const family = await getFamilyBySlug(category as any, slug);`

2. **`src/app/revit/[category]/page.tsx`**
   - Línea 25: `const families = await getFamiliesByCategory(category as any);`

**Problema:**
```typescript
// ❌ Actual (unsafe)
const family = await getFamilyBySlug(category as any, slug);

// TypeScript no valida si category es válido
// Usuario puede acceder a /revit/INVALID_CATEGORY/slug
// App crashea en runtime
```

**Solución:**
```typescript
// ✅ Correcto (safe)
import { CATEGORY_LIST } from '@/data/models/family.model';

export default async function Page({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = await params;
  
  // Validar category es válido
  if (!CATEGORY_LIST.includes(category as FamilyCategory)) {
    notFound();
  }
  
  // Ahora es seguro el cast
  const family = await getFamilyBySlug(category as FamilyCategory, slug);
  
  if (!family) {
    notFound();
  }
  
  // ...
}
```

**Estimación:** 20 minutos  
**Impacto:** 🔴 Alto (seguridad)  
**Dificultad:** 🟢 Fácil

---

### **TODO 2: Activar `strict: true` en tsconfig.json**

**Ubicación:** `tsconfig.json` línea 12

**Estado actual:**
```json
{
  "compilerOptions": {
    "strict": false  // ❌ Desactivado temporalmente
  }
}
```

**Por qué lo desactivamos:**
- Permitió migración más rápida
- Evitó 100+ errores de tipos
- Funcionó como "modo entrenamiento"

**Por qué debemos activarlo:**
- Detecta bugs que `strict: false` ignora
- Previene `undefined` y `null` accidents
- Valida tipos más rigurosamente
- Es el estándar profesional

**Proceso de activación:**

```bash
# Paso 1: Activar strict mode
# Edita tsconfig.json: "strict": true

# Paso 2: Ver cuántos errores aparecen
npx tsc --noEmit

# Paso 3: Arreglar uno por uno
# Empezar por archivos pequeños (config.ts)
# Terminar con archivos grandes (pages)

# Paso 4: Verificar que todo compila
npm run build
```

**Errores esperados al activar:**
- `Object is possibly 'null'`
- `Object is possibly 'undefined'`
- `Parameter implicitly has an 'any' type`
- `Function lacks return type annotation`

**Estrategia:**
1. Activar `strict: true`
2. Arreglar errores en batches de 10
3. Commit después de cada batch
4. Si te atascas, desactiva temporalmente y continúa mañana

**Estimación:** 2-3 horas  
**Impacto:** 🔴 Alto (calidad)  
**Dificultad:** 🟡 Media

---

### **TODO 3: Eliminar `unoptimized: true` de next.config.js**

**Ubicación:** `next.config.js` línea 3

**Estado actual:**
```javascript
const nextConfig = {
  images: {
    unoptimized: true,  // ❌ CRÍTICO: Desactivado
  },
};
```

**Por qué está desactivado:**
- Era más fácil para desarrollo
- Evitaba configurar image domains
- PERO: Afecta performance en producción

**Impacto en producción:**
- 📉 Imágenes sin optimizar (tamaño 5-10x más grande)
- 📉 Sin lazy loading automático
- 📉 Sin WebP conversion
- 📉 Sin responsive images
- 📉 Score Lighthouse: 50-60 en vez de 90+

**Solución:**
```javascript
// next.config.js
const nextConfig = {
  images: {
    unoptimized: false,  // ✅ Activar optimización
    domains: [
      'via.placeholder.com',  // Para placeholders
      'boracity.com',         // Tu dominio
      // Agregar otros dominios según necesites
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

**Pasos:**
1. Listar todos los dominios de imágenes usados
2. Agregarlos a `domains` array
3. Cambiar `unoptimized: false`
4. Testear todas las páginas
5. Verificar que imágenes cargan

**Estimación:** 30 minutos  
**Impacto:** 🔴 Alto (performance)  
**Dificultad:** 🟢 Fácil

---

## 🟡 IMPORTANTE - PRIORIDAD MEDIA

### **TODO 4: Implementar búsqueda funcional**

**Ubicación:** `src/components/Navbar.tsx`

**Estado actual:**
```typescript
// ❌ Búsqueda es solo decorativa
<input 
  type="text" 
  placeholder="Search families..."
  className="..."
/>
```

**Problema:**
- Input existe pero no hace nada
- searchFamilies() existe en lib/families.ts pero no se usa
- Mala UX (usuario espera que funcione)

**Solución:**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchFamilies } from '@/lib/families';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    const results = await searchFamilies(query);
    setSearchResults(results);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search families..."
      />
      
      {/* Dropdown de resultados */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg">
          {searchResults.map(family => (
            <div 
              key={family.id}
              onClick={() => router.push(`/revit/${family.category}/${family.slug}`)}
              className="p-3 hover:bg-gray-50 cursor-pointer"
            >
              {family.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Estimación:** 1 hora  
**Impacto:** 🟡 Medio (UX)  
**Dificultad:** 🟢 Fácil

---

### **TODO 5: Agregar error boundaries**

**Problema actual:**
- Si un componente crashea, toda la app crashea
- Usuario ve pantalla blanca
- No hay logging de errores

**Solución:**
Crear `src/app/error.tsx`:

```typescript
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error a servicio de monitoring
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

También crear `src/app/global-error.tsx` para errores del root layout.

**Estimación:** 45 minutos  
**Impacto:** 🟡 Medio (UX/DX)  
**Dificultad:** 🟢 Fácil

---

### **TODO 6: Agregar loading states**

**Problema:**
- Páginas aparecen instantáneamente (mock data)
- Cuando conectes API real, habrá delay
- No hay feedback visual de carga

**Solución:**
Crear `loading.tsx` en cada ruta:

```typescript
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

Crear uno para cada ruta principal:
- `src/app/loading.tsx`
- `src/app/revit/loading.tsx`
- `src/app/revit/[category]/loading.tsx`
- `src/app/revit/[category]/[slug]/loading.tsx`

**Estimación:** 1 hora  
**Impacto:** 🟡 Medio (UX)  
**Dificultad:** 🟢 Fácil

---

## 🟢 NICE TO HAVE - PRIORIDAD BAJA

### **TODO 7: Agregar unit tests**

**Estado actual:** 0 tests

**Archivos prioritarios para testear:**
1. `src/lib/families.ts` (service layer)
2. `src/data/models/family.model.ts` (constantes)
3. `src/components/FamilyCard.tsx` (componente UI)

**Setup:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

**Ejemplo test:**
```typescript
// src/lib/__tests__/families.test.ts
import { getAllFamilies, getFamilyById } from '../families';

describe('Families Service', () => {
  describe('getAllFamilies', () => {
    it('should return array of families', async () => {
      const families = await getAllFamilies();
      
      expect(Array.isArray(families)).toBe(true);
      expect(families.length).toBeGreaterThan(0);
    });
    
    it('should return families with required properties', async () => {
      const families = await getAllFamilies();
      const family = families[0];
      
      expect(family).toHaveProperty('id');
      expect(family).toHaveProperty('name');
      expect(family).toHaveProperty('category');
      expect(family).toHaveProperty('slug');
    });
  });
  
  describe('getFamilyById', () => {
    it('should return family when id exists', async () => {
      const family = await getFamilyById('fam_001');
      
      expect(family).not.toBeNull();
      expect(family?.id).toBe('fam_001');
    });
    
    it('should return null when id does not exist', async () => {
      const family = await getFamilyById('INVALID_ID');
      
      expect(family).toBeNull();
    });
  });
});
```

**Meta inicial:**
- ✅ 50% coverage en service layer
- ✅ Tests para funciones críticas
- ✅ Prevenir regresiones

**Estimación:** 3-4 horas  
**Impacto:** 🟢 Bajo (pero buena práctica)  
**Dificultad:** 🟡 Media

---

### **TODO 8: Mejorar tipos de Next.js metadata**

**Problema:**
```typescript
// ❌ Sin tipos explícitos
export const metadata = {
  title: 'Boracity',
  description: '...'
};
```

**Solución:**
```typescript
// ✅ Con tipos de Next.js
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boracity',
  description: '...',
  openGraph: {
    title: 'Boracity',
    description: '...',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boracity',
    description: '...',
  },
};
```

**Archivos a actualizar:**
- Todos los `page.tsx` con metadata
- Todas las funciones `generateMetadata()`

**Estimación:** 1 hora  
**Impacto:** 🟢 Bajo (mejor autocomplete)  
**Dificultad:** 🟢 Fácil

---

## 📋 RESUMEN DE TODOs

| # | TODO | Prioridad | Tiempo | Dificultad |
|---|------|-----------|--------|------------|
| 1 | Eliminar `as any` en params | 🔴 Alta | 20 min | 🟢 Fácil |
| 2 | Activar `strict: true` | 🔴 Alta | 2-3h | 🟡 Media |
| 3 | Optimizar imágenes | 🔴 Alta | 30 min | 🟢 Fácil |
| 4 | Implementar búsqueda | 🟡 Media | 1h | 🟢 Fácil |
| 5 | Error boundaries | 🟡 Media | 45 min | 🟢 Fácil |
| 6 | Loading states | 🟡 Media | 1h | 🟢 Fácil |
| 7 | Unit tests | 🟢 Baja | 3-4h | 🟡 Media |
| 8 | Mejorar tipos metadata | 🟢 Baja | 1h | 🟢 Fácil |

**Total estimado:** ~10-12 horas de trabajo

---

## 🎯 PLAN DE ACCIÓN SUGERIDO

### **Sesión 9 (1.5 horas) - Críticos Rápidos**
```
✅ TODO 1: Eliminar as any (20 min)
✅ TODO 3: Optimizar imágenes (30 min)
✅ TODO 5: Error boundaries (45 min)
```

### **Sesión 10 (3 horas) - Strict Mode**
```
✅ TODO 2: Activar strict: true (2-3h)
```

### **Sesión 11 (2 horas) - UX Improvements**
```
✅ TODO 4: Búsqueda funcional (1h)
✅ TODO 6: Loading states (1h)
```

### **Sesión 12 (4 horas) - Testing**
```
✅ TODO 7: Unit tests (3-4h)
✅ TODO 8: Tipos metadata (1h)
```

---

## ⚠️ WARNINGS ACTUALES

### **1. Middleware Deprecation**
```
⚠ The "middleware" file convention is deprecated
```

**Solución:** Migrar a `middleware.ts` con nuevo patrón (Next.js 15+).  
**Urgencia:** Baja (funciona, pero deprecado)  
**Tiempo:** 15 minutos

### **2. Type Assertions Everywhere**
- 3x `as any` en páginas
- Potenciales crashes en runtime
- Ver TODO 1

---

## 📝 NOTAS IMPORTANTES

### **Antes de Producción:**

```bash
# Checklist Pre-Producción
[ ] TODO 1 completado (as any eliminados)
[ ] TODO 2 completado (strict: true)
[ ] TODO 3 completado (imágenes optimizadas)
[ ] TODO 5 completado (error boundaries)
[ ] npm run build exitoso
[ ] npm run start funciona
[ ] Lighthouse score > 90
[ ] 0 console.errors en producción
```

### **Comandos Útiles:**

```bash
# Buscar todos los "as any"
grep -r "as any" src/

# Buscar TODOs en código
grep -r "TODO" src/

# Contar líneas TypeScript
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Verificar tipos sin compilar
npx tsc --noEmit

# Ver tree de dependencias
npm ls --depth=0
```

---

## 🎓 APRENDIZAJES

### **Por qué usamos hacks temporales:**

1. **Velocidad > Perfección**
   - Migrar 19 archivos en 2 horas
   - Proyecto funcional al 100%
   - Deuda técnica documentada

2. **Iteración > Perfección inicial**
   - Mejor tener TypeScript con `as any`
   - Que seguir con JavaScript puro
   - Los hacks se arreglan después

3. **Progreso visible motiva**
   - Ver el proyecto en TypeScript funcionar
   - Motiva a continuar mejorando
   - Deuda técnica es manejable

### **Cuándo NO usar `as any`:**

❌ **NUNCA en:**
- Funciones públicas de API
- Validación de input de usuario
- Operaciones de base de datos
- Código de autenticación

✅ **OK temporalmente en:**
- Migraciones rápidas
- Prototipos
- Código interno que controlas 100%
- CON DOCUMENTACIÓN de por qué

---

## 🔄 PROCESO DE ELIMINACIÓN DE DEUDA

### **Workflow recomendado:**

```
1. Elegir 1 TODO
2. Crear branch: git checkout -b fix/todo-1
3. Implementar fix
4. Testear manualmente
5. npm run build (verificar que compila)
6. Commit: git commit -m "fix: remove as any from category params"
7. Merge a main
8. Marcar TODO como completado
9. Repetir
```

### **Prioridad:**

```
🔴 Antes de producción: TODOs 1, 2, 3
🟡 Primera semana: TODOs 4, 5, 6
🟢 Primer mes: TODOs 7, 8
```

---

## ✅ CHECKLIST DE LIMPIEZA

Marcar cuando completes cada TODO:

```
Críticos:
[ ] TODO 1: Eliminar as any
[ ] TODO 2: Strict mode
[ ] TODO 3: Optimizar imágenes

Importantes:
[ ] TODO 4: Búsqueda funcional
[ ] TODO 5: Error boundaries
[ ] TODO 6: Loading states

Nice to have:
[ ] TODO 7: Unit tests
[ ] TODO 8: Tipos metadata
```

**Cuando todos estén ✅:**
- Proyecto production-ready
- Deuda técnica = 0
- TypeScript en su máximo potencial

---

## 🎯 OBJETIVO FINAL

**Estado deseado:**
```typescript
// ✅ 0 "as any"
// ✅ strict: true activado
// ✅ 100% tipos correctos
// ✅ Error handling robusto
// ✅ Tests pasando
// ✅ Performance óptima
// ✅ Lighthouse 95+
```

**Cuando llegues ahí:**
- Código nivel Senior+
- Listo para escalar
- Listo para contratar equipo
- Listo para inversores
- Listo para producción

---

**Recuerda:** La deuda técnica es como deuda financiera.  
**Un poco está bien, pero debe pagarse pronto.** 💳

---

*Documento creado: 5 Enero 2026*  
*Última actualización: Pendiente*  
*Próxima revisión: Sesión 9*