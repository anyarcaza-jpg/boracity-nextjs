/**
 * OptimizedImage Component
 * Componente wrapper para Next.js Image con optimizaciones de ImageKit
 */

import Image from 'next/image';
import { getImageKitUrl, getThumbnailUrl, getDetailUrl, isImageKitUrl } from '@/lib/imagekit';

interface OptimizedImageProps {
  // Imagen de ImageKit o URL completa
  src?: string;
  category?: 'furniture' | 'doors' | 'windows' | 'lighting';
  
  // O URL completa (para imágenes locales o externas)
  fullUrl?: string;
  
  // Props comunes
  alt: string;
  
  // Tipo de imagen (afecta el tamaño)
  variant?: 'thumbnail' | 'detail' | 'gallery' | 'hero';
  
  // Opciones de Next.js Image
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  
  // Overrides de tamaño
  width?: number;
  height?: number;
  quality?: number;
}

export default function OptimizedImage({
  src,
  category,
  fullUrl,
  alt,
  variant = 'thumbnail',
  priority = false,
  className = '',
  fill = false,
  sizes,
  width,
  height,
  quality,
}: OptimizedImageProps) {
  // Determinar la URL final
  let finalUrl: string;
  let finalWidth: number;
  let finalHeight: number;

  // Si se proporciona fullUrl directamente
  if (fullUrl) {
    finalUrl = fullUrl;
    finalWidth = width || 800;
    finalHeight = height || 600;
  }
  // Si src ya es una URL completa (empieza con http o /)
  else if (src && (src.startsWith('http') || src.startsWith('/'))) {
    finalUrl = src;
    finalWidth = width || 400;
    finalHeight = height || 300;
  }
  // Si es imagen de ImageKit (filename solamente)
  else if (src && category) {
    // Determinar tamaño según variant
    switch (variant) {
      case 'thumbnail':
        finalUrl = getThumbnailUrl(src, category);
        finalWidth = width || 400;
        finalHeight = height || 300;
        break;
      
      case 'detail':
        finalUrl = getDetailUrl(src, category);
        finalWidth = width || 1200;
        finalHeight = height || 900;
        break;
      
      case 'gallery':
        finalUrl = getImageKitUrl(src, category, { 
          width: width || 600, 
          quality: quality || 85 
        });
        finalWidth = width || 600;
        finalHeight = height || 450;
        break;
      
      case 'hero':
        finalUrl = getImageKitUrl(src, category, { 
          width: width || 1920, 
          quality: quality || 90 
        });
        finalWidth = width || 1920;
        finalHeight = height || 1080;
        break;
      
      default:
        finalUrl = getThumbnailUrl(src, category);
        finalWidth = width || 400;
        finalHeight = height || 300;
    }
  }
  // Fallback si faltan parámetros
  else {
    console.warn('OptimizedImage: Debes proporcionar (src + category) o fullUrl');
    finalUrl = '/images/placeholder.jpg';
    finalWidth = width || 800;
    finalHeight = height || 600;
  }

  // Configuración de lazy loading
  const loading = priority ? 'eager' : 'lazy';

  // Si usa fill prop
  if (fill) {
    return (
      <Image
        src={finalUrl}
        alt={alt}
        fill
        className={className}
        sizes={sizes || '100vw'}
        priority={priority}
        quality={quality || 85}
      />
    );
  }

  // Imagen con dimensiones fijas
  return (
    <Image
      src={finalUrl}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={className}
      loading={loading}
      priority={priority}
      quality={quality || 85}
      sizes={sizes}
    />
  );
}