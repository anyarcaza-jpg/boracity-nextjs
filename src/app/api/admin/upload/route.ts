// API para subir archivos (RFA y thumbnails)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2/upload';
import { uploadToImageKit } from '@/lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'rfa' o 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (type === 'rfa') {
      if (!file.name.endsWith('.rfa')) {
        return NextResponse.json(
          { error: 'File must be a .rfa file' },
          { status: 400 }
        );
      }
      
      // Subir a R2
      const url = await uploadToR2(file, 'rfa-files');
      
      return NextResponse.json({
        success: true,
        url,
        fileName: file.name,
        fileSize: file.size,
      });
      
    } else if (type === 'thumbnail') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File must be an image' },
          { status: 400 }
        );
      }
      
      // Subir a ImageKit
      const url = await uploadToImageKit(file, 'thumbnails');
      
      return NextResponse.json({
        success: true,
        url,
        fileName: file.name,
      });
      
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "rfa" or "thumbnail"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}