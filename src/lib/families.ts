// src/lib/families.ts
// v0.15.0 - Service Layer with Pagination Support

import type { Family, FamilyCategory, FamilyStats } from '@/types';
import * as db from './db/families';
import type { SearchResult } from './db/families';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { logger } from './logger';

/**
 * SERVICE LAYER - Data Abstraction with Caching
 * 
 * This file is the interface between frontend and database.
 * Frontend calls these functions without knowing data source.
 * 
 * Benefits:
 * - Frontend doesn't change (same functions)
 * - Can change backend without breaking anything
 * - Centralized caching
 */

// Re-export types
export type { SearchResult };

/* ============================================
   CORE FUNCTIONS
   ============================================ */

/**
 * Get all families with cache
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
      revalidate: 3600, // 1 hour
      tags: ['families']
    }
  )();
});

/**
 * Get family by ID (slug)
 */
export async function getFamilyById(id: string): Promise<Family | null> {
  try {
    if (!id || id.trim().length < 3) {
      logger.warn('Invalid family ID', { id });
      return null;
    }
    
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
 * Get families by category with cache
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
      revalidate: 3600, // 1 hour
      tags: ['families', `category-${category}`]
    }
  )();
});

/**
 * Search families with cache and pagination support
 * 
 * Note: Pagination results are NOT cached because they change frequently
 * Only cache is applied at database level for performance
 * 
 * @param searchTerm - Search query
 * @param tags - Optional array of tags to filter by
 * @param page - Page number (1-based, default: 1)
 * @param limit - Results per page (default: 20)
 * @returns SearchResult with families, total, pagination info
 */
export async function searchFamilies(
  searchTerm: string, 
  tags: string[] = [],
  page: number = 1,
  limit: number = 20
): Promise<SearchResult> {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      logger.debug('Search term too short', { searchTerm });
      return {
        families: [],
        total: 0,
        page: 1,
        limit,
        hasMore: false
      };
    }
    
    logger.info('Searching families', { 
      searchTerm, 
      tags, 
      page, 
      limit 
    });
    
    const result = await db.searchFamilies(searchTerm, tags, page, limit);
    
    logger.info('Search completed', { 
      searchTerm, 
      tags, 
      page,
      count: result.families.length,
      total: result.total,
      hasMore: result.hasMore
    });
    
    return result;
    
  } catch (error) {
    logger.error('Error searching families', { 
      searchTerm,
      tags,
      page, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    
    return {
      families: [],
      total: 0,
      page: 1,
      limit,
      hasMore: false
    };
  }
}

/**
 * Get all unique tags from database with cache
 * Used for populating tag filters in search UI
 */
export const getAllTags = cache(async (): Promise<string[]> => {
  return unstable_cache(
    async () => {
      try {
        logger.info('Fetching all tags');
        const tags = await db.getAllTags();
        logger.info('Tags fetched', { count: tags.length });
        return tags;
      } catch (error) {
        logger.error('Error fetching tags', { 
          error: error instanceof Error ? error.message : 'Unknown' 
        });
        return [];
      }
    },
    ['all-tags'],
    {
      revalidate: 3600,
      tags: ['tags', 'families']
    }
  )();
});

/**
 * Get family by category + slug
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
    
    const family = await db.getFamilyBySlug(slug);
    
    if (!family || family.category !== category) {
      logger.warn('Family not found by slug or category mismatch', { category, slug });
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
 * Get statistics
 */
export async function getFamiliesStats(): Promise<FamilyStats> {
  try {
    logger.info('Fetching family stats');
    const stats = await db.getStats();
    
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
 * Get popular families
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
 * Get related families
 */
export async function getRelatedFamilies(familyId: string, limit: number = 4): Promise<Family[]> {
  try {
    if (!familyId || familyId.trim().length < 3) {
      return [];
    }
    
    const currentFamily = await getFamilyById(familyId);
    if (!currentFamily) {
      return [];
    }
    
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
 * Get info for redirect by ID
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
}

export function invalidateCategoryCache(category: FamilyCategory): void {
  logger.info('Category cache invalidation requested', { category });
}