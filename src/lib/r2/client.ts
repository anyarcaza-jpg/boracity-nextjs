// src/lib/r2/client.ts

import { S3Client } from '@aws-sdk/client-s3';

/**
 * CLOUDFLARE R2 CLIENT
 * 
 * ¿Por qué usamos AWS SDK si es Cloudflare?
 * - R2 es compatible con S3 API (mismas funciones)
 * - Usamos las librerías de AWS pero apuntamos a R2
 * - Cloudflare lo hace así para compatibilidad
 */

// Validar que existan las credenciales
if (!process.env.R2_ACCOUNT_ID) {
  throw new Error('❌ R2_ACCOUNT_ID no configurado en .env.local');
}

if (!process.env.R2_ACCESS_KEY_ID) {
  throw new Error('❌ R2_ACCESS_KEY_ID no configurado en .env.local');
}

if (!process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error('❌ R2_SECRET_ACCESS_KEY no configurado en .env.local');
}

/**
 * Cliente S3 configurado para Cloudflare R2
 * 
 * Endpoint format: https://{account_id}.r2.cloudflarestorage.com
 */
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Nombre del bucket (configurado en .env.local)
 */
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'boracity-files';