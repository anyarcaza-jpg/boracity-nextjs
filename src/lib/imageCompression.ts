// src/lib/imageCompression.ts

import imageCompression from 'browser-image-compression';

/**
 * CONFIGURACIÓN DE COMPRESIÓN
 * 
 * Puedes ajustar estos valores según tus necesidades:
 * - minSizeToCompressKB: 0 = comprimir todo, 500 = solo si >500KB, 1024 = solo si >1MB
 * - maxSizeMB: tamaño máximo después de comprimir
 * - maxWidthOrHeight: resolución máxima (1920px = Full HD)
 * - initialQuality: calidad JPG (0.85 = 85%, imperceptible para el ojo humano)
 */
const COMPRESSION_CONFIG = {
  // Comprimir todas las imágenes (cambia a 500 o 1024 si prefieres)
  minSizeToCompressKB: 0,
  
  // Objetivo: 800KB máximo (deja margen bajo el límite de 1MB)
  maxSizeMB: 0.8,
  
  // Resolución máxima: Full HD (suficiente para web)
  maxWidthOrHeight: 1920,
  
  // Calidad: 85% (balance perfecto calidad/tamaño)
  initialQuality: 0.85,
  
  // Usar Web Worker para no bloquear la UI
  useWebWorker: true,
  
  // Formato de salida (JPG es más ligero que PNG)
  fileType: 'image/jpeg',
};

/**
 * Comprimir una imagen automáticamente
 * 
 * @param file - Archivo de imagen original
 * @returns Promise<File> - Archivo comprimido
 * 
 * @example
 * const compressedFile = await compressImage(originalFile);
 * console.log('Original:', originalFile.size, 'Compressed:', compressedFile.size);
 */
export async function compressImage(file: File): Promise<File> {
  try {
    // Calcular tamaño en KB
    const fileSizeKB = file.size / 1024;
    
    console.log('📸 Starting compression:', {
      fileName: file.name,
      originalSize: formatFileSize(file.size),
      originalSizeKB: fileSizeKB.toFixed(2) + ' KB',
    });

    // Si la imagen es muy pequeña, decidir si comprimir o no
    if (fileSizeKB < COMPRESSION_CONFIG.minSizeToCompressKB) {
      console.log('✅ Image is small enough, skipping compression');
      return file;
    }

    // Comprimir imagen
    const compressedFile = await imageCompression(file, {
      maxSizeMB: COMPRESSION_CONFIG.maxSizeMB,
      maxWidthOrHeight: COMPRESSION_CONFIG.maxWidthOrHeight,
      initialQuality: COMPRESSION_CONFIG.initialQuality,
      useWebWorker: COMPRESSION_CONFIG.useWebWorker,
      fileType: COMPRESSION_CONFIG.fileType,
    });

    // Calcular estadísticas
    const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
    
    console.log('✅ Compression complete:', {
      originalSize: formatFileSize(file.size),
      compressedSize: formatFileSize(compressedFile.size),
      savedSize: formatFileSize(file.size - compressedFile.size),
      compressionRatio: compressionRatio + '%',
    });

    // Retornar archivo comprimido con nombre original
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });

  } catch (error) {
    console.error('❌ Error compressing image:', error);
    
    // Si falla la compresión, retornar archivo original
    // Mejor subir imagen sin comprimir que fallar completamente
    console.warn('⚠️ Using original file due to compression error');
    return file;
  }
}

/**
 * Comprimir múltiples imágenes en paralelo
 * 
 * @param files - Array de archivos de imagen
 * @returns Promise<File[]> - Array de archivos comprimidos
 * 
 * @example
 * const compressedFiles = await compressMultipleImages(fileList);
 */
export async function compressMultipleImages(files: File[]): Promise<File[]> {
  try {
    console.log(`📸 Compressing ${files.length} images in parallel...`);
    
    // Comprimir todas las imágenes en paralelo (más rápido)
    const compressedFiles = await Promise.all(
      files.map(file => compressImage(file))
    );
    
    console.log('✅ All images compressed successfully');
    return compressedFiles;

  } catch (error) {
    console.error('❌ Error compressing multiple images:', error);
    
    // Si falla, retornar archivos originales
    return files;
  }
}

/**
 * Formatear tamaño de archivo para display
 * 
 * @param bytes - Tamaño en bytes
 * @returns string - Tamaño formateado (ej: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validar si un archivo es una imagen
 * 
 * @param file - Archivo a validar
 * @returns boolean - true si es imagen
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validar si una imagen necesita compresión
 * 
 * @param file - Archivo de imagen
 * @returns boolean - true si necesita compresión
 */
export function needsCompression(file: File): boolean {
  const fileSizeKB = file.size / 1024;
  return fileSizeKB >= COMPRESSION_CONFIG.minSizeToCompressKB;
}