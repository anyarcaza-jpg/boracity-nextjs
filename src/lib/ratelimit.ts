// src/lib/ratelimit.ts

/**
 * RATE LIMITING EN MEMORIA
 * 
 * Este sistema limita cuántas requests puede hacer un usuario por minuto.
 * Usa memoria local (Map), no requiere Redis ni servicios externos.
 */

import { logger } from './logger';

// ============================================
// CONFIGURACIÓN DE LÍMITES
// ============================================


// Límites por tipo de acción
export const RATE_LIMIT_CONFIGS = {
  // API general
  api: {
    windowMs: 60 * 1000,     // 1 minuto
    maxRequests: 60,         // 60 requests/min
    message: 'Too many requests. Please try again in a minute.',
  },
  // Búsquedas
  search: {
    windowMs: 60 * 1000,     // 1 minuto
    maxRequests: 20,         // 20 búsquedas/min
    message: 'Too many search requests. Please try again in a minute.',
  },
  // Descargas
  download: {
    windowMs: 60 * 1000,     // 1 minuto
    maxRequests: 15,         // 15 descargas/min ✅
    message: 'Download limit reached. Please try again in a minute.',
  },
  // Formularios
  form: {
    windowMs: 60 * 1000,     // 1 minuto
    maxRequests: 3,          // 3 envíos/min
    message: 'Too many form submissions. Please try again in a minute.',
  },
} as const;

// ============================================
// STORAGE EN MEMORIA (Map)
// ============================================

interface RequestRecord {
  count: number;      // Cuántas requests ha hecho
  resetTime: number;  // Cuándo se resetea (timestamp)
}

// Map principal: IP -> Map de tipo -> record
const requestStore = new Map<string, Map<string, RequestRecord>>();

// Limpieza automática cada 5 minutos (elimina registros antiguos)
setInterval(() => {
  const now = Date.now();
  for (const [ip, typeMap] of requestStore.entries()) {
    for (const [type, record] of typeMap.entries()) {
      if (now > record.resetTime) {
        typeMap.delete(type);  // Eliminar registro expirado
      }
    }
    if (typeMap.size === 0) {
      requestStore.delete(ip);  // Eliminar IP sin registros
    }
  }
  logger.debug('Rate limit cleanup ejecutado', { 
    remainingIPs: requestStore.size 
  });
}, 5 * 60 * 1000);

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Obtiene la IP del cliente de forma segura
 */
export function getClientIp(request: Request): string {
  // Prioridad: X-Forwarded-For (proxy/CDN) > X-Real-IP > fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback para desarrollo local
  return 'anonymous';
}

/**
 * Verifica si una request está dentro del límite
 * 
 * @param identifier - IP del usuario
 * @param type - Tipo de acción (api, search, download, form)
 * @returns Objeto con: allowed, remaining, resetTime, limit
 */
export function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMIT_CONFIGS = 'api'
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
} {
  const config = RATE_LIMIT_CONFIGS[type];
  const now = Date.now();

  // Obtener o crear el map de tipos para esta IP
  let typeMap = requestStore.get(identifier);
  if (!typeMap) {
    typeMap = new Map();
    requestStore.set(identifier, typeMap);
  }

  // Obtener o crear el record para este tipo
  let record = typeMap.get(type);
  
  // Si no existe o ya expiró, crear uno nuevo
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    typeMap.set(type, record);
  }

  // Incrementar contador
  record.count++;

  // Verificar si excedió el límite
  const allowed = record.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);

  // Loguear si se excede el límite
  if (!allowed) {
    logger.warn('Rate limit excedido', {
      identifier,
      type,
      count: record.count,
      limit: config.maxRequests,
    });
  }

  return {
    allowed,
    remaining,
    resetTime: record.resetTime,
    limit: config.maxRequests,
  };
}

/**
 * Helper para usar en API routes
 * Verifica rate limit y retorna response de error si excede
 * 
 * @example
 * export async function GET(request: Request) {
 *   const result = await rateLimit(request, 'search');
 *   if (!result.allowed) {
 *     return result.response;
 *   }
 *   // Tu código aquí...
 * }
 */
export async function rateLimit(
  request: Request,
  type: keyof typeof RATE_LIMIT_CONFIGS = 'api'
): Promise<{
  allowed: boolean;
  remaining: number;
  response?: Response;
}> {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, type);

  if (!result.allowed) {
    const config = RATE_LIMIT_CONFIGS[type];
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

    return {
      allowed: false,
      remaining: 0,
      response: new Response(
        JSON.stringify({
          error: config.message || 'Demasiadas solicitudes',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      ),
    };
  }

  return {
    allowed: true,
    remaining: result.remaining,
  };
}

/**
 * Obtiene estadísticas del rate limiter (útil para debugging)
 */
export function getRateLimitStats(): {
  totalIPs: number;
  totalRecords: number;
} {
  let totalRecords = 0;
  for (const typeMap of requestStore.values()) {
    totalRecords += typeMap.size;
  }
  
  return {
    totalIPs: requestStore.size,
    totalRecords,
  };
}