/**
 * ImageKit Helper - Optimización de imágenes
 * Genera URLs optimizadas con transformaciones automáticas
 */

// Tu ImageKit ID
const IMAGEKIT_ID = 'nbqxh22tq';
const IMAGEKIT_BASE_URL = `https://ik.imagekit.io/${IMAGEKIT_ID}`;

/**
 * Opciones de transformación de ImageKit
 */
interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  blur?: number;
}

/**
 * Genera URL optimizada de ImageKit
 * 
 * @example
 * getImageKitUrl('bar-chair.png', 'furniture', { width: 800, quality: 80 })
 * // Returns: https://ik.imagekit.io/nbqxh22tq/revit/furniture/bar-chair.png?tr=w-800,q-80,f-auto
 */
export function getImageKitUrl(
  filename: string,
  category: 'furniture' | 'doors' | 'windows' | 'lighting',
  options: ImageKitTransformOptions = {}
): string {
  // Opciones por defecto
  const defaultOptions: ImageKitTransformOptions = {
    quality: 85,
    format: 'auto', // ImageKit elige el mejor formato
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Construir path
  const path = `/revit/${category}/${filename}`;
  const fullUrl = `${IMAGEKIT_BASE_URL}${path}`;

  // Construir transformaciones
  const transformations: string[] = [];
  
  if (finalOptions.width) transformations.push(`w-${finalOptions.width}`);
  if (finalOptions.height) transformations.push(`h-${finalOptions.height}`);
  if (finalOptions.quality) transformations.push(`q-${finalOptions.quality}`);
  if (finalOptions.format) transformations.push(`f-${finalOptions.format}`);
  if (finalOptions.blur) transformations.push(`bl-${finalOptions.blur}`);

  // Si hay transformaciones, agregarlas a la URL
  if (transformations.length > 0) {
    return `${fullUrl}?tr=${transformations.join(',')}`;
  }

  return fullUrl;
}

/**
 * Genera URL para thumbnail (preview pequeño)
 */
export function getThumbnailUrl(
  filename: string,
  category: 'furniture' | 'doors' | 'windows' | 'lighting'
): string {
  return getImageKitUrl(filename, category, {
    width: 400,
    quality: 80,
    format: 'auto'
  });
}

/**
 * Genera URL para imagen de detalle (página individual)
 */
export function getDetailUrl(
  filename: string,
  category: 'furniture' | 'doors' | 'windows' | 'lighting'
): string {
  return getImageKitUrl(filename, category, {
    width: 1200,
    quality: 85,
    format: 'auto'
  });
}

/**
 * Genera URL para placeholder blur (carga rápida)
 */
export function getPlaceholderUrl(
  filename: string,
  category: 'furniture' | 'doors' | 'windows' | 'lighting'
): string {
  return getImageKitUrl(filename, category, {
    width: 20,
    quality: 30,
    blur: 10,
    format: 'auto'
  });
}

/**
 * Verifica si una URL es de ImageKit
 */
export function isImageKitUrl(url: string): boolean {
  return url.includes('ik.imagekit.io');
}

/**
 * Extrae el filename de una URL de ImageKit
 */
export function getFilenameFromUrl(url: string): string | null {
  if (!isImageKitUrl(url)) return null;
  
  const parts = url.split('/');
  const filenameWithParams = parts[parts.length - 1];
  const filename = filenameWithParams.split('?')[0];
  
  return filename;
}