// src/lib/db/families.ts

import { sql } from '@/lib/neon';
import { dbRowToFamily, type FamilyRow } from './adapters';
import type { Family, FamilyCategory } from '@/types';
import { logger } from '@/lib/logger';

/**
 * FUNCIONES DE BASE DE DATOS
 * 
 * Todas las queries a PostgreSQL están aquí.
 * Usan el adapter para convertir rows → Family objects.
 */

// ============================================
// QUERIES PRINCIPALES
// ============================================

/**
 * Obtener todas las familias
 */
export async function getAllFamilies(): Promise<Family[]> {
  try {
    const rows = await sql`
      SELECT * FROM families 
      ORDER BY created_at DESC 
      LIMIT 100
    `;
    
    return rows.map(dbRowToFamily);
  } catch (error) {
    logger.error('Error getting all families', { error });
    return [];
  }
}

/**
 * Obtener familia por slug - SOBRECARGA CORREGIDA
 */
export async function getFamilyBySlug(slug: string): Promise<Family | null>;
export async function getFamilyBySlug(
  category: FamilyCategory,
  slug: string
): Promise<Family | null>;
export async function getFamilyBySlug(
  categoryOrSlug: FamilyCategory | string,
  slug?: string
): Promise<Family | null> {
  try {
    // Si solo se pasa un parámetro, es el slug
    if (slug === undefined) {
      const rows = await sql`
        SELECT * FROM families 
        WHERE slug = ${categoryOrSlug}
        LIMIT 1
      `;
      
      if (rows.length === 0) return null;
      return dbRowToFamily(rows[0]);
    }
    
    // Si se pasan dos parámetros, es category + slug
    const rows = await sql`
      SELECT * FROM families 
      WHERE category = ${categoryOrSlug} 
      AND slug = ${slug}
      LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return dbRowToFamily(rows[0]);
  } catch (error) {
    logger.error('Error getting family by slug', { categoryOrSlug, slug, error });
    return null;
  }
}

/**
 * Obtener familias por categoría
 */
export async function getFamiliesByCategory(
  category: FamilyCategory
): Promise<Family[]> {
  try {
    const rows = await sql`
      SELECT * FROM families 
      WHERE category = ${category}
      ORDER BY downloads DESC
      LIMIT 50
    `;
    
    return rows.map(dbRowToFamily);
  } catch (error) {
    logger.error('Error getting families by category', { category, error });
    return [];
  }
}

/**
 * Buscar familias (full-text search)
 */
export async function searchFamilies(query: string): Promise<Family[]> {
  try {
    if (!query || query.length < 2) return [];
    
    const rows = await sql`
      SELECT * FROM families 
      WHERE 
        name ILIKE ${'%' + query + '%'} 
        OR description ILIKE ${'%' + query + '%'}
        OR ${query} = ANY(tags)
      ORDER BY downloads DESC
      LIMIT 20
    `;
    
    return rows.map(dbRowToFamily);
  } catch (error) {
    logger.error('Error searching families', { query, error });
    return [];
  }
}

// ============================================
// MUTACIONES (CREATE, UPDATE, DELETE)
// ============================================

/**
 * Actualizar una familia (VERSIÓN SIMPLE Y SEGURA)
 */
export async function updateFamily(
  slug: string,
  data: {
    name?: string;
    category?: string;
    description?: string;
  }
): Promise<Family | null> {
  try {
    const { name, category, description } = data;

    // Query con template literal (compatible con Neon)
    const rows = await sql`
      UPDATE families
      SET 
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING *
    `;
    
    if (rows.length === 0) {
      logger.warn('Family not found for update', { slug });
      return null;
    }
    
    logger.info('Family updated', { slug });
    return dbRowToFamily(rows[0]);
  } catch (error) {
    logger.error('Error updating family', { slug, error });
    return null;
  }
}

/**
 * Eliminar una familia
 */
export async function deleteFamily(slug: string): Promise<boolean> {
  try {
    const rows = await sql`
      DELETE FROM families
      WHERE slug = ${slug}
      RETURNING id
    `;
    
    const deleted = rows.length > 0;
    
    if (deleted) {
      logger.info('Family deleted', { slug });
    } else {
      logger.warn('Family not found for deletion', { slug });
    }
    
    return deleted;
  } catch (error) {
    logger.error('Error deleting family', { slug, error });
    return false;
  }
}

// ============================================
// CONTADORES (para analytics)
// ============================================

/**
 * Incrementar contador de descargas
 */
export async function incrementDownloads(
  category: FamilyCategory,
  slug: string
): Promise<void> {
  try {
    await sql`
      UPDATE families 
      SET downloads = downloads + 1 
      WHERE category = ${category} 
      AND slug = ${slug}
    `;
    
    logger.info('Download incremented', { category, slug });
  } catch (error) {
    logger.error('Error incrementing downloads', { category, slug, error });
  }
}

/**
 * Incrementar contador de vistas
 */
export async function incrementViews(
  category: FamilyCategory,
  slug: string
): Promise<void> {
  try {
    await sql`
      UPDATE families 
      SET views = views + 1 
      WHERE category = ${category} 
      AND slug = ${slug}
    `;
  } catch (error) {
    logger.error('Error incrementing views', { category, slug, error });
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================

/**
 * Obtener familias populares
 */
export async function getPopularFamilies(limit: number = 6): Promise<Family[]> {
  try {
    const rows = await sql`
      SELECT * FROM families 
      ORDER BY downloads DESC 
      LIMIT ${limit}
    `;
    
    return rows.map(dbRowToFamily);
  } catch (error) {
    logger.error('Error getting popular families', { error });
    return [];
  }
}

/**
 * Obtener estadísticas generales
 */
export async function getStats() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_families,
        SUM(downloads) as total_downloads,
        SUM(views) as total_views,
        COUNT(DISTINCT category) as categories_count
      FROM families
    `;
    
    return {
      totalFamilies: Number(result[0].total_families),
      totalDownloads: Number(result[0].total_downloads),
      totalViews: Number(result[0].total_views),
      categoriesCount: Number(result[0].categories_count),
    };
  } catch (error) {
    logger.error('Error getting stats', { error });
    return {
      totalFamilies: 0,
      totalDownloads: 0,
      totalViews: 0,
      categoriesCount: 0,
    };
  }
}