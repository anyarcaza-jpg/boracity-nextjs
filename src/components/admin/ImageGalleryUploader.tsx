// src/components/admin/ImageGalleryUploader.tsx
'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Star, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
  orderIndex: number;
}

interface ImageGalleryUploaderProps {
  familyId?: string;
  onImagesUploaded?: (images: any[]) => void;
  maxImages?: number;
  existingImages?: any[];
}

export default function ImageGalleryUploader({
  familyId,
  onImagesUploaded,
  maxImages = 6,
  existingImages = [],
}: ImageGalleryUploaderProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constantes de validación
 const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // ============================================
  // VALIDACIÓN DE ARCHIVOS
  // ============================================
  const validateFile = (file: File): string | null => {
    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `"${file.name}" is not a valid image type. Use JPG, PNG or WebP.`;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" is too large. Maximum 5MB per image.`;
    }

    return null;
  };

  // ============================================
  // MANEJO DE ARCHIVOS
  // ============================================
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');

    // Validar límite total
    const currentCount = images.length + existingImages.length;
    const newCount = currentCount + files.length;

    if (newCount > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can add ${maxImages - currentCount} more.`);
      return;
    }

    const newImages: ImagePreview[] = [];
    const filesArray = Array.from(files);

    // Validar y procesar cada archivo
    for (const file of filesArray) {
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      // Crear preview
      const preview = URL.createObjectURL(file);
      const isPrimary = images.length === 0 && existingImages.length === 0; // Primera imagen es primary

      newImages.push({
        file,
        preview,
        isPrimary,
        orderIndex: images.length + newImages.length,
      });
    }

    setImages([...images, ...newImages]);
  };

  // ============================================
  // DRAG & DROP HANDLERS
  // ============================================
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // ============================================
  // CLICK TO UPLOAD
  // ============================================
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // ============================================
  // ELIMINAR IMAGEN
  // ============================================
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // Si eliminamos la imagen primary, hacer primary la primera
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    // Reindexar
    newImages.forEach((img, i) => {
      img.orderIndex = i;
    });

    setImages(newImages);
    setError('');
  };

  // ============================================
  // MARCAR COMO PRIMARY
  // ============================================
  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

  // ============================================
  // REORDENAR IMÁGENES (DRAG TO REORDER)
  // ============================================
  const handleDragStartReorder = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDropReorder = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));

    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[dragIndex];

    // Remover de posición original
    newImages.splice(dragIndex, 1);
    
    // Insertar en nueva posición
    newImages.splice(dropIndex, 0, draggedImage);

    // Reindexar
    newImages.forEach((img, i) => {
      img.orderIndex = i;
    });

    setImages(newImages);
  };

  // ============================================
  // UPLOAD A API
  // ============================================
  const handleUpload = async () => {
    if (images.length === 0) {
      setError('No images to upload');
      return;
    }

    if (!familyId) {
      setError('Family ID is required');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Agregar todas las imágenes
      images.forEach((img) => {
        formData.append('files', img.file);
      });

      // Agregar family ID
      formData.append('familyId', familyId);

      // Marcar primera como primary
      const hasPrimary = images.some(img => img.isPrimary);
      formData.append('markFirstAsPrimary', hasPrimary ? 'true' : 'false');

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/admin/upload/images', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();

      // Callback con las imágenes subidas
      if (onImagesUploaded) {
        onImagesUploaded(data.images);
      }

      // Limpiar previews
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setUploadProgress(0);

    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  const currentTotal = images.length + existingImages.length;
  const canAddMore = currentTotal < maxImages;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Gallery Images ({currentTotal}/{maxImages})
        </label>
        {images.length > 0 && !uploading && (
          <button
            onClick={handleUpload}
            disabled={!familyId}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Upload {images.length} image{images.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* DRAG & DROP ZONE */}
      {canAddMore && !uploading && (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
            }
          `}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
          <p className="text-gray-300 font-medium mb-2">
            {isDragging ? 'Drop images here' : 'Drag & drop images here'}
          </p>
          <p className="text-sm text-gray-400">
            or click to browse ({maxImages - currentTotal} remaining)
          </p>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, WebP • Max 1MB each
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* UPLOAD PROGRESS */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Uploading images...</span>
            <span className="text-gray-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* PREVIEW GRID */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Preview (drag to reorder):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStartReorder(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropReorder(e, index)}
                className="relative group cursor-move bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-primary transition-all"
              >
                {/* PRIMARY BADGE */}
                {img.isPrimary && (
                  <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Primary
                  </div>
                )}

                {/* IMAGE */}
                <div className="relative aspect-square">
                  <Image
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* OVERLAY CON CONTROLES */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {/* BOTÓN DELETE */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>

                  {/* BOTÓN SET PRIMARY */}
                  {!img.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(index)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      Set Primary
                    </button>
                  )}
                </div>

                {/* ORDER NUMBER */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HELPER TEXT */}
      {images.length === 0 && existingImages.length === 0 && !uploading && (
        <p className="text-sm text-gray-500 text-center">
          No images yet. Upload up to {maxImages} images for the gallery.
        </p>
      )}
    </div>
  );
}