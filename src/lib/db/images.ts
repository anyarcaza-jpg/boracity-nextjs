// src/lib/db/images.ts

import { sql } from '@/lib/neon';
import { logger } from '@/lib/logger';
import type { FamilyImage, CreateFamilyImageInput } from '@/types';

/**
 * SERVICE LAYER - FAMILY IMAGES
 * 
 * Manejo de múltiples imágenes por familia (galería)
 * Sigue el mismo patrón que families.ts
 */

// ============================================
// QUERIES - LEER IMÁGENES
// ============================================

/**
 * Obtener todas las imágenes de una familia
 * Retorna array ordenado por order_index
 */
export async function getImagesByFamilyId(familyId: string): Promise<FamilyImage[]> {
  try {
    const rows = await sql`
      SELECT 
        id,
        family_id as "familyId",
        image_url as "imageUrl",
        thumbnail_url as "thumbnailUrl",
        is_primary as "isPrimary",
        order_index as "orderIndex",
        alt_text as "altText",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM family_images
      WHERE family_id = ${familyId}
      ORDER BY order_index ASC
    `;

    return rows.map(row => ({
      id: row.id,
      familyId: row.familyId,
      imageUrl: row.imageUrl,
      thumbnailUrl: row.thumbnailUrl,
      isPrimary: row.isPrimary,
      orderIndex: row.orderIndex,
      altText: row.altText,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  } catch (error) {
    logger.error('Error getting images by family ID', { familyId, error });
    return [];
  }
}

/**
 * Obtener imagen principal de una familia
 */
export async function getPrimaryImage(familyId: string): Promise<FamilyImage | null> {
  try {
    const rows = await sql`
      SELECT 
        id,
        family_id as "familyId",
        image_url as "imageUrl",
        thumbnail_url as "thumbnailUrl",
        is_primary as "isPrimary",
        order_index as "orderIndex",
        alt_text as "altText",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM family_images
      WHERE family_id = ${familyId}
      AND is_primary = true
      LIMIT 1
    `;

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      familyId: row.familyId,
      imageUrl: row.imageUrl,
      thumbnailUrl: row.thumbnailUrl,
      isPrimary: row.isPrimary,
      orderIndex: row.orderIndex,
      altText: row.altText,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  } catch (error) {
    logger.error('Error getting primary image', { familyId, error });
    return null;
  }
}

// ============================================
// MUTACIONES - CREAR IMÁGENES
// ============================================

/**
 * Crear múltiples imágenes de una vez
 * Usado cuando subes una galería completa
 */
export async function createImages(images: CreateFamilyImageInput[]): Promise<FamilyImage[]> {
  try {
    // Validar que no exceda 6 imágenes
    if (images.length > 6) {
      logger.warn('Attempted to create more than 6 images', { count: images.length });
      throw new Error('Maximum 6 images per family allowed');
    }

    const createdImages: FamilyImage[] = [];

    for (const image of images) {
      const rows = await sql`
        INSERT INTO family_images (
          family_id,
          image_url,
          thumbnail_url,
          is_primary,
          order_index,
          alt_text
        ) VALUES (
          ${image.familyId},
          ${image.imageUrl},
          ${image.thumbnailUrl || null},
          ${image.isPrimary || false},
          ${image.orderIndex || 0},
          ${image.altText || null}
        )
        RETURNING 
          id,
          family_id as "familyId",
          image_url as "imageUrl",
          thumbnail_url as "thumbnailUrl",
          is_primary as "isPrimary",
          order_index as "orderIndex",
          alt_text as "altText",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;

      if (rows.length > 0) {
        const row = rows[0];
        createdImages.push({
          id: row.id,
          familyId: row.familyId,
          imageUrl: row.imageUrl,
          thumbnailUrl: row.thumbnailUrl,
          isPrimary: row.isPrimary,
          orderIndex: row.orderIndex,
          altText: row.altText,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      }
    }

    logger.info('Images created', { familyId: images[0]?.familyId, count: createdImages.length });
    return createdImages;
  } catch (error) {
    logger.error('Error creating images', { error });
    return [];
  }
}

/**
 * Crear una sola imagen
 */
export async function createImage(image: CreateFamilyImageInput): Promise<FamilyImage | null> {
  try {
    // Validar límite de 6 imágenes
    const existing = await getImagesByFamilyId(image.familyId);
    if (existing.length >= 6) {
      logger.warn('Family already has 6 images', { familyId: image.familyId });
      throw new Error('Maximum 6 images per family allowed');
    }

    const rows = await sql`
      INSERT INTO family_images (
        family_id,
        image_url,
        thumbnail_url,
        is_primary,
        order_index,
        alt_text
      ) VALUES (
        ${image.familyId},
        ${image.imageUrl},
        ${image.thumbnailUrl || null},
        ${image.isPrimary || false},
        ${image.orderIndex || 0},
        ${image.altText || null}
      )
      RETURNING 
        id,
        family_id as "familyId",
        image_url as "imageUrl",
        thumbnail_url as "thumbnailUrl",
        is_primary as "isPrimary",
        order_index as "orderIndex",
        alt_text as "altText",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    if (rows.length === 0) return null;

    const row = rows[0];
    logger.info('Image created', { familyId: image.familyId, imageId: row.id });

    return {
      id: row.id,
      familyId: row.familyId,
      imageUrl: row.imageUrl,
      thumbnailUrl: row.thumbnailUrl,
      isPrimary: row.isPrimary,
      orderIndex: row.orderIndex,
      altText: row.altText,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  } catch (error) {
    logger.error('Error creating image', { error });
    return null;
  }
}

// ============================================
// MUTACIONES - ACTUALIZAR IMÁGENES
// ============================================

/**
 * Actualizar orden de imágenes (drag & drop)
 */
export async function updateImageOrder(imageId: string, newOrder: number): Promise<boolean> {
  try {
    if (newOrder < 0 || newOrder > 5) {
      logger.warn('Invalid order index', { imageId, newOrder });
      return false;
    }

    const rows = await sql`
      UPDATE family_images
      SET 
        order_index = ${newOrder},
        updated_at = NOW()
      WHERE id = ${imageId}
      RETURNING id
    `;

    const success = rows.length > 0;
    if (success) {
      logger.info('Image order updated', { imageId, newOrder });
    }

    return success;
  } catch (error) {
    logger.error('Error updating image order', { imageId, newOrder, error });
    return false;
  }
}

/**
 * Establecer imagen como principal
 * Automáticamente quita is_primary de las demás
 */
export async function setPrimaryImage(familyId: string, imageId: string): Promise<boolean> {
  try {
    // Primero, quitar is_primary de todas las imágenes de esta familia
    await sql`
      UPDATE family_images
      SET is_primary = false
      WHERE family_id = ${familyId}
    `;

    // Luego, establecer la nueva imagen como primary
    const rows = await sql`
      UPDATE family_images
      SET 
        is_primary = true,
        updated_at = NOW()
      WHERE id = ${imageId}
      AND family_id = ${familyId}
      RETURNING id
    `;

    const success = rows.length > 0;
    if (success) {
      logger.info('Primary image set', { familyId, imageId });
    }

    return success;
  } catch (error) {
    logger.error('Error setting primary image', { familyId, imageId, error });
    return false;
  }
}

/**
 * Actualizar alt text de una imagen
 */
export async function updateImageAltText(imageId: string, altText: string): Promise<boolean> {
  try {
    const rows = await sql`
      UPDATE family_images
      SET 
        alt_text = ${altText},
        updated_at = NOW()
      WHERE id = ${imageId}
      RETURNING id
    `;

    const success = rows.length > 0;
    if (success) {
      logger.info('Image alt text updated', { imageId });
    }

    return success;
  } catch (error) {
    logger.error('Error updating alt text', { imageId, error });
    return false;
  }
}

// ============================================
// MUTACIONES - ELIMINAR IMÁGENES
// ============================================

/**
 * Eliminar una imagen específica
 */
export async function deleteImage(imageId: string): Promise<boolean> {
  try {
    const rows = await sql`
      DELETE FROM family_images
      WHERE id = ${imageId}
      RETURNING id
    `;

    const deleted = rows.length > 0;
    if (deleted) {
      logger.info('Image deleted', { imageId });
    }

    return deleted;
  } catch (error) {
    logger.error('Error deleting image', { imageId, error });
    return false;
  }
}

/**
 * Eliminar todas las imágenes de una familia
 * Útil cuando se elimina una familia completa
 */
export async function deleteAllImagesByFamilyId(familyId: string): Promise<boolean> {
  try {
    const rows = await sql`
      DELETE FROM family_images
      WHERE family_id = ${familyId}
      RETURNING id
    `;

    const count = rows.length;
    logger.info('All images deleted for family', { familyId, count });

    return true;
  } catch (error) {
    logger.error('Error deleting all images', { familyId, error });
    return false;
  }
}