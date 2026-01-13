// Cliente para ImageKit
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadToImageKit(file: File, folder: string = 'families'): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const result = await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
      folder: folder,
    });

    return result.url;
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Failed to upload image to ImageKit');
  }
}

/**
 * Genera URL de ImageKit con transformaciones
 * @param filename - Nombre del archivo o path
 * @param category - Categoría (furniture, doors, windows, lighting)
 * @param transformations - Transformaciones opcionales
 */
export function getImageKitUrl(
  filename: string,
  category: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  if (!urlEndpoint) {
    return filename;
  }

  // Si ya es una URL completa, retornarla
  if (filename.startsWith('http')) {
    return filename;
  }

  // Construir path: /category/filename
  const path = filename.startsWith('/') ? filename : `/${category}/${filename}`;

  // Construir transformaciones
  const params: string[] = [];
  if (transformations?.width) params.push(`w-${transformations.width}`);
  if (transformations?.height) params.push(`h-${transformations.height}`);
  if (transformations?.quality) params.push(`q-${transformations.quality}`);
  if (transformations?.format) params.push(`f-${transformations.format}`);

  const transformationString = params.length > 0 ? `tr:${params.join(',')}` : '';

  return transformationString
    ? `${urlEndpoint}/${transformationString}${path}`
    : `${urlEndpoint}${path}`;
}

/**
 * Genera URL para thumbnail (400px)
 */
export function getThumbnailUrl(filename: string, category: string): string {
  return getImageKitUrl(filename, category, {
    width: 400,
    quality: 80,
    format: 'webp',
  });
}

/**
 * Genera URL para vista de detalle (1200px)
 */
export function getDetailUrl(filename: string, category: string): string {
  return getImageKitUrl(filename, category, {
    width: 1200,
    quality: 90,
    format: 'webp',
  });
}

/**
 * Verifica si una URL es de ImageKit
 */
export function isImageKitUrl(url: string): boolean {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  return urlEndpoint ? url.includes(urlEndpoint) : false;
}

export { imagekit };