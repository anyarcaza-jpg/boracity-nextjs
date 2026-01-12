// src/lib/r2/download.ts

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME } from './client';
import { logger } from '@/lib/logger';

/**
 * GENERADOR DE URLs DE DESCARGA
 * 
 * ¿Por qué URLs firmadas (signed URLs)?
 * 
 * PROBLEMA:
 * - No podemos hacer públicos los archivos (cualquiera podría descargar)
 * - No podemos servir archivos desde Vercel (consumiría bandwidth caro)
 * 
 * SOLUCIÓN:
 * - Generar URLs temporales que expiran en 5 minutos
 * - El navegador descarga directo desde R2 (sin pasar por Vercel)
 * - Cada URL solo funciona una vez y expira rápido
 */

/**
 * Genera una URL firmada temporal para descargar un archivo de R2
 * 
 * @param category - Categoría de la familia (furniture, doors, etc)
 * @param slug - Slug de la familia (modern-bar-chair)
 * @param expiresIn - Segundos hasta que expire la URL (default: 300 = 5 minutos)
 * @returns URL firmada temporal
 * 
 * Ejemplo:
 * const url = await getDownloadUrl('furniture', 'modern-bar-chair');
 * // url = "https://r2.../furniture/modern-bar-chair.rfa?signature=..."
 */
export async function getDownloadUrl(
  category: string,
  slug: string,
  expiresIn: number = 300 // 5 minutos
): Promise<string> {
  try {
    // Construir la key del archivo en R2
    // Formato: category/slug.rfa
    // Ejemplo: furniture/modern-bar-chair.rfa
    const fileKey = `${category}/${slug}.rfa`;
    
    logger.info('Generating signed URL', { 
      bucket: R2_BUCKET_NAME, 
      fileKey, 
      expiresIn 
    });
    
    // Crear comando para obtener el objeto
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
    });
    
    // Generar URL firmada
    const signedUrl = await getSignedUrl(r2Client, command, {
      expiresIn, // URL expira después de X segundos
    });
    
    logger.info('Signed URL generated successfully', { fileKey });
    
    return signedUrl;
  } catch (error) {
    logger.error('Error generating signed URL', { 
      category, 
      slug, 
      error: error instanceof Error ? error.message : 'Unknown' 
    });
    
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Verifica si un archivo existe en R2
 * (útil antes de generar una URL de descarga)
 */
export async function fileExists(
  category: string,
  slug: string
): Promise<boolean> {
  try {
    const fileKey = `${category}/${slug}.rfa`;
    
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
    });
    
    await r2Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}