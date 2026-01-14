-- ============================================================================
-- MIGRATION 003: CREATE FAMILY_IMAGES TABLE
-- ============================================================================
-- Propósito: Crear tabla para almacenar múltiples imágenes por familia
-- Fecha: 14 de Enero, 2026
-- Autor: Boracity Team
-- ============================================================================

-- PASO 1: Eliminar la tabla si ya existe (por seguridad)
-- Esto asegura que podemos ejecutar esta migración múltiples veces sin errores
DROP TABLE IF EXISTS family_images CASCADE;

-- PASO 2: Crear la tabla family_images
-- Esta tabla guardará TODAS las imágenes de la galería de cada familia
CREATE TABLE family_images (
  
  -- ID único de cada imagen (se genera automáticamente)
  -- Ejemplo: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ID de la familia a la que pertenece esta imagen
  -- Se conecta con la tabla "families"
  -- Si borras una familia, sus imágenes también se borran automáticamente (CASCADE)
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  
  -- URL de la imagen original en ImageKit
  -- Ejemplo: "https://ik.imagekit.io/nbqxh22tq/furniture/chair-image-1.jpg"
  image_url TEXT NOT NULL,
  
  -- URL de la imagen optimizada (thumbnail pequeño 400px)
  -- ImageKit genera esto automáticamente para cargas rápidas
  -- Ejemplo: "https://ik.imagekit.io/nbqxh22tq/tr:w-400/furniture/chair-image-1.jpg"
  thumbnail_url TEXT,
  
  -- ¿Esta imagen es la principal/portada? (true o false)
  -- Solo UNA imagen por familia debería tener is_primary = true
  -- Ejemplo: true para la primera imagen, false para el resto
  is_primary BOOLEAN DEFAULT false,
  
  -- Orden en el que se muestra la imagen en la galería
  -- 0 = primera imagen, 1 = segunda, 2 = tercera, etc.
  -- Máximo 5 (porque permitimos máximo 6 imágenes: 0,1,2,3,4,5)
  order_index INTEGER DEFAULT 0 CHECK (order_index >= 0 AND order_index <= 5),
  
  -- Texto alternativo para SEO y accesibilidad
  -- Describe la imagen para Google y lectores de pantalla
  -- Ejemplo: "Modern ergonomic office chair in gray fabric"
  alt_text TEXT,
  
  -- Fecha y hora en que se subió la imagen
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Fecha y hora de la última actualización (cambio de orden, alt_text, etc.)
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PASO 3: CREAR ÍNDICES PARA MEJORAR LA VELOCIDAD
-- ============================================================================

-- Índice para buscar rápidamente todas las imágenes de una familia
-- Esto hace que la query "Dame todas las imágenes de la familia X" sea súper rápida
CREATE INDEX idx_family_images_family_id ON family_images(family_id);

-- Índice para ordenar imágenes correctamente
-- Esto hace que la query "Dame imágenes ordenadas" sea súper rápida
CREATE INDEX idx_family_images_order ON family_images(family_id, order_index);

-- Índice para encontrar rápidamente la imagen principal de cada familia
-- Esto hace que la query "Dame la imagen principal" sea súper rápida
CREATE INDEX idx_family_images_primary ON family_images(family_id, is_primary) WHERE is_primary = true;

-- ============================================================================
-- COMENTARIOS ADICIONALES
-- ============================================================================

-- CÓMO FUNCIONA:
-- 1. Cada familia puede tener hasta 6 imágenes
-- 2. Una de ellas será la "principal" (is_primary = true)
-- 3. Las imágenes se ordenan usando order_index (0 a 5)
-- 4. Cada imagen tiene su versión original (image_url) y thumbnail (thumbnail_url)
-- 5. Si borras una familia, todas sus imágenes se borran automáticamente

-- EJEMPLO DE DATOS:
-- family_id: "123-abc"
-- order_index: 0, is_primary: true  → Esta es la imagen principal (se muestra primero)
-- order_index: 1, is_primary: false → Segunda imagen en la galería
-- order_index: 2, is_primary: false → Tercera imagen en la galería
-- ...y así hasta 6 imágenes máximo

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================