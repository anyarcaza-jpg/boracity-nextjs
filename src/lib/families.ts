// src/lib/families.ts

import type { Family, FamilyCategory, FamilyStats } from '@/types';
import { config } from './config';
import { logger } from './logger';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

import { 
  getAllFamilies as getMockFamilies,
  getFamilyById as getMockFamilyById,
  getFamiliesByCategory as getMockFamiliesByCategory,
  searchFamilies as searchMockFamilies
} from '@/data/mock/families.mock';

/* ============================================
   CORE FUNCTIONS
   ============================================ */

export const getAllFamilies = cache(async (): Promise<Family[]> => {
  return unstable_cache(
    async () => {
      try {
        logger.info('Obteniendo todas las familias (sin cache)');
        const families = getMockFamilies();
        logger.info('Familias obtenidas', { count: families.length });
        return families;
      } catch (error) {
        logger.error('Error al obtener familias', { 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['all-families'],
    {
      revalidate: 3600,
      tags: ['families']
    }
  )();
});

export async function getFamilyById(id: string): Promise<Family | null> {
  try {
    if (!id || id.trim().length < 3) {
      logger.warn('ID inválido', { id });
      return null;
    }
    
    const family = getMockFamilyById(id);
    
    if (!family) {
      logger.warn('Familia no encontrada', { familyId: id });
      return null;
    }
    
    logger.info('Familia recuperada', { familyId: id, name: family.name });
    return family;
    
  } catch (error) {
    logger.error('Error al buscar familia', { 
      familyId: id, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return null;
  }
}

export const getFamiliesByCategory = cache(async (category: FamilyCategory): Promise<Family[]> => {
  return unstable_cache(
    async () => {
      try {
        if (!category) {
          logger.warn('Categoría vacía');
          return [];
        }
        
        const families = getMockFamiliesByCategory(category);
        logger.info('Familias por categoría (sin cache)', { category, count: families.length });
        return families;
        
      } catch (error) {
        logger.error('Error al buscar por categoría', { 
          category, 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['families-by-category', category],
    {
      revalidate: 3600,
      tags: ['families', `category-${category}`]
    }
  )();
});

export const searchFamilies = cache(async (searchTerm: string): Promise<Family[]> => {
  return unstable_cache(
    async () => {
      try {
        if (!searchTerm || searchTerm.trim().length < 2) {
          logger.debug('Búsqueda muy corta', { searchTerm });
          return [];
        }
        
        const results = searchMockFamilies(searchTerm);
        logger.info('Búsqueda ejecutada (sin cache)', { searchTerm, count: results.length });
        return results;
        
      } catch (error) {
        logger.error('Error en búsqueda', { 
          searchTerm, 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['search-families', searchTerm.toLowerCase()],
    {
      revalidate: 1800,
      tags: ['search', 'families']
    }
  )();
});

export async function getFamilyBySlug(
  category: FamilyCategory, 
  slug: string
): Promise<Family | null> {
  try {
    if (!category || !slug || slug.trim().length < 3) {
      logger.warn('Parámetros inválidos', { category, slug });
      return null;
    }
    
    const families = getMockFamiliesByCategory(category);
    const family = families.find(f => f.slug === slug);
    
    if (!family) {
      logger.warn('Familia no encontrada por slug', { category, slug });
      return null;
    }
    
    logger.info('Familia encontrada', { category, slug, name: family.name });
    return family;
    
  } catch (error) {
    logger.error('Error al buscar por slug', { 
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

export async function getFamiliesStats(): Promise<FamilyStats> {
  try {
    const families = getMockFamilies();
    
    const stats: FamilyStats = {
      totalFamilies: families.length,
      totalDownloads: families.reduce((sum, f) => sum + f.metadata.downloads, 0),
      totalViews: families.reduce((sum, f) => sum + f.metadata.views, 0),
      categoriesCount: new Set(families.map(f => f.category)).size,
      recentlyAdded: families
        .sort((a, b) => b.metadata.uploadDate.getTime() - a.metadata.uploadDate.getTime())
        .slice(0, 6)
    };
    
    logger.debug('Stats calculadas', { totalFamilies: stats.totalFamilies });
    return stats;
    
  } catch (error) {
    logger.error('Error calculando stats', { 
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

export async function getPopularFamilies(limit: number = 6): Promise<Family[]> {
  try {
    const families = getMockFamilies();
    const popular = families
      .sort((a, b) => b.metadata.downloads - a.metadata.downloads)
      .slice(0, limit);
    
    logger.debug('Familias populares obtenidas', { count: popular.length });
    return popular;
    
  } catch (error) {
    logger.error('Error obteniendo populares', { 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return [];
  }
}

export async function getRelatedFamilies(familyId: string, limit: number = 4): Promise<Family[]> {
  try {
    if (!familyId || familyId.trim().length < 3) {
      return [];
    }
    
    const currentFamily = getMockFamilyById(familyId);
    if (!currentFamily) {
      return [];
    }
    
    const families = getMockFamiliesByCategory(currentFamily.category);
    const related = families
      .filter(f => f.id !== familyId)
      .slice(0, limit);
    
    logger.debug('Relacionadas obtenidas', { familyId, count: related.length });
    return related;
    
  } catch (error) {
    logger.error('Error obteniendo relacionadas', { 
      familyId, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    return [];
  }
}

export async function getFamilyByIdForRedirect(
  id: string
): Promise<{ category: FamilyCategory; slug: string } | null> {
  try {
    if (!id || id.trim().length < 3) {
      logger.warn('ID inválido para redirect', { id });
      return null;
    }
    
    const families = getMockFamilies();
    const family = families.find(f => f.id === id);
    
    if (!family) {
      logger.warn('Familia no encontrada para redirect', { id });
      return null;
    }
    
    logger.info('Redirect generado', { id, category: family.category, slug: family.slug });
    return {
      category: family.category,
      slug: family.slug
    };
    
  } catch (error) {
    logger.error('Error generando redirect', { 
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
  logger.info('Cache invalidation requested - requires server restart in development');
}

export function invalidateCategoryCache(category: FamilyCategory): void {
  logger.info('Category cache invalidation requested', { category });
}