// src/app/api/admin/families/[id]/images/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getImagesByFamilyId } from '@/lib/db/images';

/**
 * GET /api/admin/families/[id]/images
 * Obtener todas las imágenes de una familia
 */
export async function GET(
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
    const { id: familyId } = await params;

    if (!familyId) {
      return NextResponse.json(
        { error: 'Family ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching images for family ID:', familyId);

    // Obtener imágenes de la base de datos
    const images = await getImagesByFamilyId(familyId);

    console.log('Images found:', images.length);

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });

  } catch (error) {
    console.error('Error getting family images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}