// src/app/api/admin/images/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteImage } from '@/lib/db/images';

/**
 * DELETE /api/admin/images/[id]
 * Eliminar una imagen de la galería
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
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

    // Extraer el ID directamente del context
    const imageId = context.params.id;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting image:', imageId);

    // Eliminar imagen de la base de datos
    const success = await deleteImage(imageId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete image or image not found' },
        { status: 404 }
      );
    }

    console.log('Image deleted successfully:', imageId);

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