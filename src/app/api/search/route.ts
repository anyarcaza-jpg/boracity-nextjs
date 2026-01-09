// src/app/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/ratelimit';
import { searchFamilies } from '@/lib/families';
import { validateSearch } from '@/lib/validators';
import { logger } from '@/lib/logger';

/**
 * API ENDPOINT: Search families
 * 
 * Rate Limit: 20 requests/min
 * 
 * Usage:
 * GET /api/search?q=chair
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [...families],
 *   "count": 5,
 *   "query": "chair"
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(request);

  try {
    // ==========================================
    // 1. RATE LIMITING (20 búsquedas/min)
    // ==========================================
    const rateLimitResult = await rateLimit(request, 'search');
    
    if (!rateLimitResult.allowed) {
      logger.warn('Search rate limit exceeded', { ip });
      return rateLimitResult.response!;
    }

    // ==========================================
    // 2. VALIDAR PARÁMETROS
    // ==========================================
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // Verificar que exista el parámetro 'q'
    if (!query) {
      logger.warn('Search query missing', { ip });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Query parameter "q" is required',
          example: '/api/search?q=chair'
        },
        { status: 400 }
      );
    }

    // Validar con Zod (mínimo 2 caracteres)
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
    // 3. EJECUTAR BÚSQUEDA
    // ==========================================
    const results = await searchFamilies(validation.data);
    const duration = Date.now() - startTime;

    logger.info('Search executed', { 
      ip, 
      query: validation.data, 
      resultsCount: results.length,
      durationMs: duration
    });

    // ==========================================
    // 4. RESPUESTA EXITOSA
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        data: results,
        count: results.length,
        query: validation.data,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-Response-Time': `${duration}ms`,
        },
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Search API error', {
      ip,
      error: error instanceof Error ? error.message : 'Unknown',
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