// src/app/api/admin/images/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteImage } from '@/lib/db/images';
import { revalidatePath } from 'next/cache'; // ← NUEVO
import { sql } from '@/lib/neon'; // ← NUEVO

/**
 * DELETE /api/admin/images/[id]
 * Eliminar una imagen de la galería
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params (Next.js 15)
    const { id: imageId } = await params;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting image:', imageId);

    // ============================================
    // OBTENER DATOS DE LA FAMILIA (ANTES DE ELIMINAR)
    // ============================================
    try {
      // Query para obtener category y slug de la familia
      // IMPORTANTE: Hacerlo ANTES de eliminar la imagen
      const familyData = await sql`
        SELECT f.category, f.slug 
        FROM family_images fi 
        JOIN families f ON fi.family_id = f.id 
        WHERE fi.id = ${imageId}
      `;

      // Eliminar imagen de la base de datos
      const success = await deleteImage(imageId);

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to delete image or image not found' },
          { status: 404 }
        );
      }

      console.log('Image deleted successfully:', imageId);

      // ============================================
      // REVALIDACIÓN DE CACHE (NUEVO)
      // ============================================
      // Si encontramos la familia, invalidar su página de detalle
      if (familyData.length > 0) {
        const { category, slug } = familyData[0];
        
        console.log('Revalidating family page after image deletion:', { category, slug });
        
        // Invalidar cache de la página de detalle
        revalidatePath(`/revit/${category}/${slug}`);
      }

    } catch (revalidateError) {
      // Si falla la revalidación, no hacer fallar toda la operación
      console.warn('Failed to revalidate cache after deletion:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}