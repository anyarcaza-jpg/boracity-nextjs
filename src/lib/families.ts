// src/lib/families.ts
// v0.14.0 - Backend con PostgreSQL

import type { Family, FamilyCategory, FamilyStats } from '@/types';
import * as db from './db/families';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { logger } from './logger';

/**
 * CAPA DE SERVICIO - Abstracción de datos
 * 
 * Este archivo es la interfaz entre el frontend y la base de datos.
 * El frontend llama estas funciones sin saber de dónde vienen los datos.
 * 
 * Ventajas:
 * - Frontend no cambia (mismas funciones)
 * - Podemos cambiar el backend sin romper nada
 * - Cache centralizado aquí
 */

/* ============================================
   CORE FUNCTIONS
   ============================================ */

/**
 * Obtener todas las familias con cache
 */
export const getAllFamilies = cache(async (): Promise<Family[]> => {
  return unstable_cache(
    async () => {
      try {
        logger.info('Fetching all families from database');
        const families = await db.getAllFamilies();
        logger.info('Families fetched', { count: families.length });
        return families;
      } catch (error) {
        logger.error('Error fetching families', { 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['all-families'],
    {
      revalidate: 3600, // 1 hora
      tags: ['families']
    }
  )();
});

/**
 * Obtener familia por ID (slug en realidad)
 */
export async function getFamilyById(id: string): Promise<Family | null> {
  try {
    if (!id || id.trim().length < 3) {
      logger.warn('Invalid family ID', { id });
      return null;
    }
    
    // En v0.14.0, el ID es el slug
    // Necesitamos extraer category del slug o buscarlo
    const allFamilies = await getAllFamilies();
    const family = allFamilies.find(f => f.slug === id);
    
    if (!family) {
      logger.warn('Family not found', { id });
      return null;
    }
    
    logger.info('Family retrieved', { id, name: family.name });
    return family;
    
  } catch (error) {
    logger.error('Error fetching family by ID', { 
      id, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return null;
  }
}

/**
 * Obtener familias por categoría con cache
 */
export const getFamiliesByCategory = cache(async (category: FamilyCategory): Promise<Family[]> => {
  return unstable_cache(
    async () => {
      try {
        if (!category) {
          logger.warn('Empty category');
          return [];
        }
        
        logger.info('Fetching families by category', { category });
        const families = await db.getFamiliesByCategory(category);
        logger.info('Families by category fetched', { category, count: families.length });
        return families;
        
      } catch (error) {
        logger.error('Error fetching by category', { 
          category, 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['families-by-category', category],
    {
      revalidate: 3600, // 1 hora
      tags: ['families', `category-${category}`]
    }
  )();
});

/**
 * Buscar familias con cache
 */
export const searchFamilies = cache(async (searchTerm: string): Promise<Family[]> => {
  return unstable_cache(
    async () => {
      try {
        if (!searchTerm || searchTerm.trim().length < 2) {
          logger.debug('Search term too short', { searchTerm });
          return [];
        }
        
        logger.info('Searching families', { searchTerm });
        const results = await db.searchFamilies(searchTerm);
        logger.info('Search completed', { searchTerm, count: results.length });
        return results;
        
      } catch (error) {
        logger.error('Error searching families', { 
          searchTerm, 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['search-families', searchTerm.toLowerCase()],
    {
      revalidate: 1800, // 30 minutos
      tags: ['search', 'families']
    }
  )();
});

/**
 * Obtener familia por category + slug
 */
export async function getFamilyBySlug(
  category: FamilyCategory, 
  slug: string
): Promise<Family | null> {
  try {
    if (!category || !slug || slug.trim().length < 3) {
      logger.warn('Invalid parameters', { category, slug });
      return null;
    }
    
    logger.info('Fetching family by slug', { category, slug });
    const family = await db.getFamilyBySlug(category, slug);
    
    if (!family) {
      logger.warn('Family not found by slug', { category, slug });
      return null;
    }
    
    logger.info('Family found', { category, slug, name: family.name });
    return family;
    
  } catch (error) {
    logger.error('Error fetching by slug', { 
      category, 
      slug, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return null;
  }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Obtener estadísticas
 */
export async function getFamiliesStats(): Promise<FamilyStats> {
  try {
    logger.info('Fetching family stats');
    const stats = await db.getStats();
    
    // Obtener las más recientes
    const allFamilies = await getAllFamilies();
    const recentlyAdded = allFamilies
      .sort((a, b) => b.metadata.uploadDate.getTime() - a.metadata.uploadDate.getTime())
      .slice(0, 6);
    
    return {
      totalFamilies: stats.totalFamilies,
      totalDownloads: stats.totalDownloads,
      totalViews: stats.totalViews,
      categoriesCount: stats.categoriesCount,
      recentlyAdded,
    };
    
  } catch (error) {
    logger.error('Error fetching stats', { 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return {
      totalFamilies: 0,
      totalDownloads: 0,
      totalViews: 0,
      categoriesCount: 0,
      recentlyAdded: []
    };
  }
}

/**
 * Obtener familias populares
 */
export async function getPopularFamilies(limit: number = 6): Promise<Family[]> {
  try {
    logger.info('Fetching popular families', { limit });
    const families = await db.getPopularFamilies(limit);
    logger.debug('Popular families fetched', { count: families.length });
    return families;
    
  } catch (error) {
    logger.error('Error fetching popular families', { 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return [];
  }
}

/**
 * Obtener familias relacionadas
 */
export async function getRelatedFamilies(familyId: string, limit: number = 4): Promise<Family[]> {
  try {
    if (!familyId || familyId.trim().length < 3) {
      return [];
    }
    
    // Obtener la familia actual
    const currentFamily = await getFamilyById(familyId);
    if (!currentFamily) {
      return [];
    }
    
    // Obtener otras de la misma categoría
    logger.info('Fetching related families', { familyId, category: currentFamily.category });
    const categoryFamilies = await getFamiliesByCategory(currentFamily.category);
    
    const related = categoryFamilies
      .filter(f => f.slug !== familyId)
      .slice(0, limit);
    
    logger.debug('Related families found', { familyId, count: related.length });
    return related;
    
  } catch (error) {
    logger.error('Error fetching related families', { 
      familyId, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return [];
  }
}

/**
 * Obtener info para redirect por ID
 */
export async function getFamilyByIdForRedirect(
  id: string
): Promise<{ category: FamilyCategory; slug: string } | null> {
  try {
    if (!id || id.trim().length < 3) {
      logger.warn('Invalid ID for redirect', { id });
      return null;
    }
    
    const family = await getFamilyById(id);
    
    if (!family) {
      logger.warn('Family not found for redirect', { id });
      return null;
    }
    
    logger.info('Redirect generated', { id, category: family.category, slug: family.slug });
    return {
      category: family.category,
      slug: family.slug
    };
    
  } catch (error) {
    logger.error('Error generating redirect', { 
      id, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return null;
  }
}

/* ============================================
   CACHE MANAGEMENT
   ============================================ */

export function invalidateFamiliesCache(): void {
  logger.info('Cache invalidation requested');
  // En producción: revalidateTag('families')
}

export function invalidateCategoryCache(category: FamilyCategory): void {
  logger.info('Category cache invalidation requested', { category });
  // En producción: revalidateTag(`category-${category}`)
}