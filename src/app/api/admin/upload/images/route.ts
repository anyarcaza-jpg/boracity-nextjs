// src/app/api/admin/upload/images/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToImageKit } from '@/lib/imagekit';
import { createImages } from '@/lib/db/images';
import { logger } from '@/lib/logger';
import type { CreateFamilyImageInput } from '@/types';
import { revalidatePath } from 'next/cache'; // ← NUEVO
import { sql } from '@/lib/neon'; // ← NUEVO

/**
 * API ROUTE - UPLOAD MÚLTIPLE DE IMÁGENES
 * 
 * POST /api/admin/upload/images
 * 
 * Recibe múltiples archivos y los sube a ImageKit.
 * Máximo 6 imágenes por familia.
 */

// Configuración de Next.js para recibir archivos grandes
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // PASO 1: VERIFICAR AUTENTICACIÓN
    // ============================================
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      logger.warn('Unauthorized upload attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // ============================================
    // PASO 2: RECIBIR Y VALIDAR DATOS
    // ============================================
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const familyId = formData.get('familyId') as string;
    const markFirstAsPrimary = formData.get('markFirstAsPrimary') === 'true';

    // Validar que se envió family_id
    if (!familyId) {
      logger.warn('No family ID provided');
      return NextResponse.json(
        { error: 'Family ID is required' },
        { status: 400 }
      );
    }

    // Validar que se enviaron archivos
    if (!files || files.length === 0) {
      logger.warn('No files provided');
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validar límite de 6 imágenes
    if (files.length > 6) {
      logger.warn('Too many files', { count: files.length });
      return NextResponse.json(
        { error: 'Maximum 6 images allowed per family' },
        { status: 400 }
      );
    }

    // ============================================
    // PASO 3: VALIDAR CADA ARCHIVO
    // ============================================
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB por imagen
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tipo
      if (!ALLOWED_TYPES.includes(file.type)) {
        logger.warn('Invalid file type', { type: file.type, fileName: file.name });
        return NextResponse.json(
          { 
            error: `Invalid file type for "${file.name}". Allowed: JPG, PNG, WebP`,
            fileName: file.name,
          },
          { status: 400 }
        );
      }

      // Validar tamaño
      if (file.size > MAX_FILE_SIZE) {
        logger.warn('File too large', { size: file.size, fileName: file.name });
        return NextResponse.json(
          { 
            error: `File "${file.name}" is too large. Maximum 1MB per image`,
            fileName: file.name,
          },
          { status: 400 }
        );
      }
    }

    // ============================================
    // PASO 4: SUBIR IMÁGENES A IMAGEKIT
    // ============================================
    logger.info('Uploading images to ImageKit', { 
      familyId, 
      count: files.length 
    });

    const uploadedImages: CreateFamilyImageInput[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Subir imagen original a ImageKit
        const imageUrl = await uploadToImageKit(file, 'gallery');

        // Generar URL del thumbnail (400px) usando transformación de ImageKit
        const thumbnailUrl = imageUrl.includes('ik.imagekit.io')
          ? `${imageUrl.split('?')[0]}?tr=w-400,h-300,q-80,f-webp`
          : imageUrl;

        // Generar alt text automático (puedes mejorar esto)
        const altText = `Gallery image ${i + 1}`;

        uploadedImages.push({
          familyId,
          imageUrl,
          thumbnailUrl,
          isPrimary: markFirstAsPrimary && i === 0, // Solo la primera es primary
          orderIndex: i,
          altText,
        });

        logger.info('Image uploaded', { 
          fileName: file.name, 
          imageUrl,
          orderIndex: i 
        });

      } catch (uploadError) {
        logger.error('Error uploading image to ImageKit', { 
          fileName: file.name, 
          error: uploadError 
        });
        
        return NextResponse.json(
          { 
            error: `Failed to upload "${file.name}" to ImageKit`,
            fileName: file.name,
          },
          { status: 500 }
        );
      }
    }

    // ============================================
    // PASO 5: GUARDAR EN BASE DE DATOS
    // ============================================
    logger.info('Saving images to database', { familyId, count: uploadedImages.length });

    const savedImages = await createImages(uploadedImages);

    if (savedImages.length === 0) {
      logger.error('Failed to save images to database', { familyId });
      return NextResponse.json(
        { error: 'Failed to save images to database' },
        { status: 500 }
      );
    }

    // ============================================
    // REVALIDACIÓN DE CACHE (NUEVO)
    // ============================================
    try {
      // Obtener category y slug de la familia
      const familyData = await sql`
        SELECT category, slug 
        FROM families 
        WHERE id = ${familyId}
      `;

      // Si encontramos la familia, invalidar su página de detalle
      if (familyData.length > 0) {
        const { category, slug } = familyData[0];
        
        logger.info('Revalidating family page', { category, slug });
        
        // Invalidar cache de la página de detalle
        revalidatePath(`/revit/${category}/${slug}`);
      }
    } catch (revalidateError) {
      // No fallar si la revalidación falla, solo loggear
      logger.warn('Failed to revalidate cache', { error: revalidateError });
    }

    // ============================================
    // PASO 6: RESPONDER CON ÉXITO
    // ============================================
    logger.info('Images uploaded successfully', { 
      familyId, 
      count: savedImages.length 
    });

    return NextResponse.json({
      success: true,
      message: `${savedImages.length} image(s) uploaded successfully`,
      images: savedImages.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        thumbnailUrl: img.thumbnailUrl,
        isPrimary: img.isPrimary,
        orderIndex: img.orderIndex,
      })),
      count: savedImages.length,
    });

  } catch (error) {
    logger.error('Unexpected error in images upload', { error });
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}