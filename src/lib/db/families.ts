// src/lib/db/families.ts
// Version: 2.2.0 (Session 24 - Pagination Support for Infinite Scroll)

import { sql } from '@/lib/neon';
import { dbRowToFamily, type FamilyRow } from './adapters';
import type { Family, FamilyCategory } from '@/types';
import { logger } from '@/lib/logger';

/**
 * DATABASE LAYER - PostgreSQL Queries
 * 
 * All database queries for families are defined here.
 * Uses adapter pattern to convert database rows to Family objects.
 */

// ============================================
// TYPES
// ============================================

export interface SearchResult {
  families: Family[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================
// CORE QUERIES
// ============================================

/**
 * Get all families from database
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
 * Get family by slug (overloaded function)
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
    if (slug === undefined) {
      const rows = await sql`
        SELECT * FROM families 
        WHERE slug = ${categoryOrSlug}
        LIMIT 1
      `;
      
      if (rows.length === 0) return null;
      return dbRowToFamily(rows[0]);
    }
    
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
 * Get families by category
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
 * Search families using PostgreSQL Full-Text Search with Pagination
 * 
 * Version: 2.2.0 (Pagination + Infinite Scroll Support)
 * 
 * Key features:
 * - PostgreSQL Full-Text Search with ts_rank for relevance scoring
 * - Multi-word query support ("modern chair")
 * - Intelligent ranking (relevance + name matching + popularity)
 * - Tag filtering support
 * - Pagination for infinite scroll
 * - Total count for UI indicators
 * - Automatic fallback to ILIKE if FTS fails
 * 
 * Examples:
 * - searchFamilies("chair") returns first 20 families
 * - searchFamilies("chair", [], 1, 20) returns families 1-20
 * - searchFamilies("chair", ["modern"], 2, 20) returns families 21-40 with "modern" tag
 * 
 * @param query - Search term (minimum 2 characters)
 * @param tags - Optional array of tags to filter by
 * @param page - Page number (1-based, default: 1)
 * @param limit - Results per page (default: 20, max: 100)
 * @returns SearchResult object with families, total, page, limit, hasMore
 */
export async function searchFamilies(
  query: string, 
  tags: string[] = [],
  page: number = 1,
  limit: number = 20
): Promise<SearchResult> {
  try {
    if (!query || query.length < 2) {
      logger.debug('Search query too short', { query });
      return { 
        families: [], 
        total: 0, 
        page: 1, 
        limit, 
        hasMore: false 
      };
    }

    // Validate and sanitize pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);
    const offset = (validPage - 1) * validLimit;

    const sanitizedQuery = query
      .trim()
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .join(' & ');

    logger.info('Searching families with FTS', { 
      originalQuery: query, 
      sanitizedQuery,
      queryLength: query.length,
      tagFilters: tags,
      tagCount: tags.length,
      page: validPage,
      limit: validLimit,
      offset
    });

    try {
      // Execute search query with pagination
      const rows = await sql`
        SELECT 
          *,
          ts_rank(
            to_tsvector('english', 
              COALESCE(name, '') || ' ' || 
              COALESCE(description, '') || ' ' || 
              COALESCE(array_to_string(tags, ' '), '')
            ),
            plainto_tsquery('english', ${query})
          ) AS relevance,
          CASE 
            WHEN LOWER(name) LIKE LOWER(${'%' + query + '%'}) THEN 2.0
            ELSE 1.0
          END AS name_boost
        FROM families
        WHERE 
          (
            to_tsvector('english', 
              COALESCE(name, '') || ' ' || 
              COALESCE(description, '') || ' ' || 
              COALESCE(array_to_string(tags, ' '), '')
            ) @@ plainto_tsquery('english', ${query})
            OR ${query} ILIKE ANY(tags)
            OR name ILIKE ${'%' + query + '%'}
            OR description ILIKE ${'%' + query + '%'}
          )
          ${tags.length > 0 ? sql`AND tags @> ${tags}` : sql``}
        ORDER BY 
          (relevance * name_boost * LOG(downloads + 1)) DESC,
          downloads DESC
        LIMIT ${validLimit}
        OFFSET ${offset}
      `;

      // Get total count for pagination
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM families
        WHERE 
          (
            to_tsvector('english', 
              COALESCE(name, '') || ' ' || 
              COALESCE(description, '') || ' ' || 
              COALESCE(array_to_string(tags, ' '), '')
            ) @@ plainto_tsquery('english', ${query})
            OR ${query} ILIKE ANY(tags)
            OR name ILIKE ${'%' + query + '%'}
            OR description ILIKE ${'%' + query + '%'}
          )
          ${tags.length > 0 ? sql`AND tags @> ${tags}` : sql``}
      `;

      const total = Number(countResult[0]?.total || 0);
      const families = rows.map(dbRowToFamily);
      const hasMore = (validPage * validLimit) < total;

      logger.info('FTS search completed', { 
        query, 
        resultsCount: families.length,
        total,
        page: validPage,
        hasMore,
        tagsApplied: tags.length > 0
      });

      return {
        families,
        total,
        page: validPage,
        limit: validLimit,
        hasMore
      };

    } catch (ftsError) {
      // Fallback to simple ILIKE search if FTS fails
      logger.warn('FTS failed, using simple search fallback', { 
        query, 
        error: ftsError instanceof Error ? ftsError.message : 'Unknown',
        fallbackActive: true
      });

      const rows = await sql`
        SELECT * FROM families 
        WHERE 
          (
            name ILIKE ${'%' + query + '%'} 
            OR description ILIKE ${'%' + query + '%'}
            OR ${query} ILIKE ANY(tags)
          )
          ${tags.length > 0 ? sql`AND tags @> ${tags}` : sql``}
        ORDER BY 
          CASE 
            WHEN LOWER(name) LIKE LOWER(${'%' + query + '%'}) THEN 1
            WHEN LOWER(description) LIKE LOWER(${'%' + query + '%'}) THEN 2
            ELSE 3
          END,
          downloads DESC
        LIMIT ${validLimit}
        OFFSET ${offset}
      `;

      // Get total for fallback
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM families 
        WHERE 
          (
            name ILIKE ${'%' + query + '%'} 
            OR description ILIKE ${'%' + query + '%'}
            OR ${query} ILIKE ANY(tags)
          )
          ${tags.length > 0 ? sql`AND tags @> ${tags}` : sql``}
      `;

      const total = Number(countResult[0]?.total || 0);
      const families = rows.map(dbRowToFamily);
      const hasMore = (validPage * validLimit) < total;

      logger.info('Simple search completed', { 
        query, 
        resultsCount: families.length,
        total,
        page: validPage,
        hasMore,
        fallbackUsed: true,
        tagsApplied: tags.length > 0
      });

      return {
        families,
        total,
        page: validPage,
        limit: validLimit,
        hasMore
      };
    }

  } catch (error) {
    logger.error('Critical error in searchFamilies', { 
      query, 
      error: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
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

// ============================================
// MUTATIONS
// ============================================

/**
 * Update family data
 */
export async function updateFamily(
  slug: string,
  data: {
    name?: string;
    category?: string;
    description?: string;
    thumbnail_url?: string;
  }
): Promise<Family | null> {
  try {
    const { name, category, description, thumbnail_url } = data;

    const rows = await sql`
      UPDATE families
      SET 
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        thumbnail_url = COALESCE(${thumbnail_url}, thumbnail_url),
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
 * Delete family by slug
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
// ANALYTICS COUNTERS
// ============================================

/**
 * Increment download counter for family
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
 * Increment view counter for family
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
// STATISTICS
// ============================================

/**
 * Get most popular families by downloads
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
 * Get overall statistics
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

/**
 * Get all unique tags from all families
 * Used for populating tag filters in search UI
 * 
 * @returns Array of unique tag strings sorted alphabetically
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const rows = await sql`
      SELECT DISTINCT unnest(tags) as tag
      FROM families
      WHERE tags IS NOT NULL
      ORDER BY tag ASC
    `;
    
    return rows.map(row => row.tag);
  } catch (error) {
    logger.error('Error getting all tags', { error });
    return [];
  }
}