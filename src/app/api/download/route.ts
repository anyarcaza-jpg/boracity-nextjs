// src/app/api/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/ratelimit';
import { getFamilyById } from '@/lib/families';
import { validateFamilyId } from '@/lib/validators';
import { logger } from '@/lib/logger';

/**
 * API ENDPOINT: Register download
 * 
 * Rate Limit: 15 downloads/min
 * 
 * Usage:
 * POST /api/download
 * Body: { "familyId": "modern-office-chair" }
 * 
 * Response:
 * {
 *   "success": true,
 *   "downloadUrl": "/downloads/...",
 *   "family": { id, name, size, ... }
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(request);

  try {
    // ==========================================
    // 1. RATE LIMITING (15 descargas/min)
    // ==========================================
    const rateLimitResult = await rateLimit(request, 'download');
    
    if (!rateLimitResult.allowed) {
      logger.warn('Download rate limit exceeded', { ip });
      return rateLimitResult.response!;
    }

    // ==========================================
    // 2. VALIDAR BODY
    // ==========================================
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON body' 
        },
        { status: 400 }
      );
    }

    const { familyId } = body;

    // Verificar que exista familyId
    if (!familyId) {
      logger.warn('Download request missing familyId', { ip });
      return NextResponse.json(
        { 
          success: false, 
          error: 'familyId is required in request body',
          example: { familyId: 'modern-office-chair' }
        },
        { status: 400 }
      );
    }

    // Validar con Zod
    const validation = validateFamilyId(familyId);
    
    if (!validation.success) {
      logger.warn('Invalid familyId for download', { 
        ip, 
        familyId, 
        error: validation.error 
      });
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error 
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 3. BUSCAR FAMILIA
    // ==========================================
    const family = await getFamilyById(validation.data);

    if (!family) {
      logger.warn('Family not found for download', { 
        ip, 
        familyId: validation.data 
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Family not found' 
        },
        { status: 404 }
      );
    }

    // ==========================================
    // 4. REGISTRAR DESCARGA
    // ==========================================
    // TODO: Cuando tengas base de datos:
    // - Incrementar contador de descargas
    // - Guardar registro (IP, timestamp, familyId)
    // - Enviar evento a analytics
    
    const duration = Date.now() - startTime;

    logger.info('Download registered', { 
      ip, 
      familyId: validation.data,
      familyName: family.name,
      durationMs: duration
    });

    // ==========================================
    // 5. RESPUESTA EXITOSA
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        downloadUrl: family.file.downloadUrl,
        family: {
          id: family.id,
          name: family.name,
          category: family.category,
          size: family.file.size,
          versions: family.file.revitVersions,
        },
        message: 'Download ready',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '15',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-Response-Time': `${duration}ms`,
        },
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Download API error', {
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