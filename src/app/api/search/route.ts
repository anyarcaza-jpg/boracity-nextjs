// src/app/api/search/route.ts
// Version: 2.0.0 - Pagination Support for Infinite Scroll

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/ratelimit';
import { searchFamilies } from '@/lib/families';
import { validateSearch } from '@/lib/validators';
import { logger } from '@/lib/logger';

/**
 * API ENDPOINT: Search families with pagination
 * 
 * Rate Limit: 20 requests/min
 * 
 * Usage:
 * GET /api/search?q=chair
 * GET /api/search?q=chair&page=2&limit=20
 * GET /api/search?q=chair&tags=modern,wooden&page=1&limit=20
 * 
 * Query Parameters:
 * - q (required): Search query (2-100 characters)
 * - tags (optional): Comma-separated tags
 * - page (optional): Page number (default: 1)
 * - limit (optional): Results per page (default: 20, max: 100)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [...families],
 *   "pagination": {
 *     "total": 150,
 *     "page": 1,
 *     "limit": 20,
 *     "hasMore": true,
 *     "totalPages": 8
 *   },
 *   "query": "chair",
 *   "tags": ["modern"]
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(request);

  try {
    // ==========================================
    // 1. RATE LIMITING (20 searches/min)
    // ==========================================
    const rateLimitResult = await rateLimit(request, 'search');
    
    if (!rateLimitResult.allowed) {
      logger.warn('Search rate limit exceeded', { ip });
      return rateLimitResult.response!;
    }

    // ==========================================
    // 2. EXTRACT & VALIDATE PARAMETERS
    // ==========================================
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const tagsParam = searchParams.get('tags');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    // Verify required parameter 'q'
    if (!query) {
      logger.warn('Search query missing', { ip });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Query parameter "q" is required',
          example: '/api/search?q=chair&page=1&limit=20'
        },
        { status: 400 }
      );
    }

    // Process tags (comma-separated)
    const tags = tagsParam 
      ? tagsParam.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    const limit = Math.min(
      Math.max(1, parseInt(limitParam || '20', 10) || 20),
      100 // Max 100 per page
    );

    // Validate search query with Zod (minimum 2 characters)
    const validation = validateSearch(query);
    
    if (!validation.success) {
      logger.warn('Invalid search query', { ip, query, error: validation.error });
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          hint: 'Query must be 2-100 characters'
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 3. EXECUTE SEARCH WITH PAGINATION
    // ==========================================
    const result = await searchFamilies(validation.data, tags, page, limit);
    const duration = Date.now() - startTime;

    // Calculate total pages
    const totalPages = Math.ceil(result.total / limit);

    logger.info('Search executed', { 
      ip, 
      query: validation.data,
      tags,
      page,
      limit,
      resultsCount: result.families.length,
      total: result.total,
      hasMore: result.hasMore,
      durationMs: duration
    });

    // ==========================================
    // 4. SUCCESS RESPONSE WITH PAGINATION
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        data: result.families,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          hasMore: result.hasMore,
          totalPages
        },
        query: validation.data,
        tags: tags.length > 0 ? tags : undefined,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-Response-Time': `${duration}ms`,
          'X-Total-Results': result.total.toString(),
          'X-Current-Page': result.page.toString(),
        },
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Search API error', {
      ip,
      error: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      durationMs: duration,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}