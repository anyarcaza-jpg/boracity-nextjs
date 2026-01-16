'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FamilyImage } from '@/types';
import { compressImage, compressMultipleImages } from '@/lib/imageCompression';

function EditFamilyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');

  // Estados para thumbnail
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Estados para galería
  const [existingImages, setExistingImages] = useState<FamilyImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (!slug) {
      router.push('/admin/families');
      return;
    }

    async function loadFamily() {
      try {
        const response = await fetch(`/api/admin/family?slug=${slug}`);
        if (!response.ok) throw new Error('Family not found');
        
        const data = await response.json();
        setFamily(data.family);
        setFormData({
          name: data.family.name,
          category: data.family.category,
          description: data.family.description || '',
        });

        // Cargar galería existente
        if (data.family.id) {
          console.log('Loading gallery for family ID:', data.family.id);
          loadGalleryImages(data.family.id);
        } else {
          console.warn('No family ID found:', data.family);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load family');
        setLoading(false);
      }
    }

    loadFamily();
  }, [slug, router]);

  // ============================================
  // CARGAR GALERÍA EXISTENTE
  // ============================================
  const loadGalleryImages = async (familyId: string) => {
    try {
      console.log('Fetching images from API:', `/api/admin/families/${familyId}/images`);
      const response = await fetch(`/api/admin/families/${familyId}/images`);
      
      if (!response.ok) {
        console.error('API response not OK:', response.status);
        throw new Error('Failed to load images');
      }

      const data = await response.json();
      console.log('Images loaded:', data);
      setExistingImages(data.images || []);
    } catch (err) {
      console.error('Failed to load gallery images:', err);
    }
  };

  // ============================================
  // ELIMINAR IMAGEN EXISTENTE
  // ============================================
  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeletingImageId(imageId);

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      setError('Error deleting image');
    } finally {
      setDeletingImageId(null);
    }
  };

  // ============================================
  // CAMBIAR THUMBNAIL (CON COMPRESIÓN)
  // ============================================
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      const errorMsg = `"${file.name}" is not a valid image type. Only JPG, PNG, and WebP are allowed.`;
      setError(errorMsg);
      alert(errorMsg);
      e.target.value = '';
      return;
    }

    setCompressing(true);
    setError('');

    try {
      // ============================================
      // COMPRIMIR THUMBNAIL
      // ============================================
      console.log('🔄 Compressing new thumbnail...');
      const compressedFile = await compressImage(file);
      console.log('✅ Thumbnail compressed');

      setNewThumbnail(compressedFile);
      setNewThumbnailPreview(URL.createObjectURL(compressedFile));
    } catch (err: any) {
      console.error('Error compressing thumbnail:', err);
      setError('Failed to compress thumbnail');
    } finally {
      setCompressing(false);
    }
  };

  const uploadNewThumbnail = async () => {
    if (!newThumbnail) return null;

    setUploadingThumbnail(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', newThumbnail);
      formDataUpload.append('type', 'thumbnail');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload thumbnail');
      }

      const data = await response.json();
      return data.url;
    } catch (err: any) {
      console.error('Thumbnail upload error:', err);
      throw err;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // ============================================
  // AGREGAR NUEVAS IMÁGENES (CON COMPRESIÓN)
  // ============================================
  const handleNewGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_TOTAL = 6;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const currentTotal = existingImages.length + newGalleryFiles.length;

    // Validar cantidad total
    if (currentTotal + files.length > MAX_TOTAL) {
      setError(`Maximum ${MAX_TOTAL} images total. You can add ${MAX_TOTAL - currentTotal} more.`);
      return;
    }

    setCompressing(true);
    setError('');

    try {
      const filesToCompress: File[] = [];

      // Validar tipos primero
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar tipo
        if (!ALLOWED_TYPES.includes(file.type)) {
          const errorMsg = `"${file.name}" is not a valid image type`;
          setError(errorMsg);
          alert(errorMsg);
          setCompressing(false);
          return;
        }

        filesToCompress.push(file);
      }

      // ============================================
      // COMPRIMIR TODAS LAS IMÁGENES EN PARALELO
      // ============================================
      console.log(`🔄 Compressing ${filesToCompress.length} new gallery images...`);
      const compressedFiles = await compressMultipleImages(filesToCompress);
      console.log('✅ All new gallery images compressed');

      // Crear previews de las imágenes comprimidas
      const newPreviews: string[] = [];
      for (const compressedFile of compressedFiles) {
        newPreviews.push(URL.createObjectURL(compressedFile));
      }

      setNewGalleryFiles([...newGalleryFiles, ...compressedFiles]);
      setNewGalleryPreviews([...newGalleryPreviews, ...newPreviews]);
      setError('');

    } catch (err: any) {
      console.error('Error compressing gallery images:', err);
      setError('Failed to compress images. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    const newFiles = newGalleryFiles.filter((_, i) => i !== index);
    const newPreviews = newGalleryPreviews.filter((_, i) => i !== index);
    
    // Liberar memoria
    URL.revokeObjectURL(newGalleryPreviews[index]);
    
    setNewGalleryFiles(newFiles);
    setNewGalleryPreviews(newPreviews);
  };

  // ============================================
  // SUBIR NUEVAS IMÁGENES DE GALERÍA
  // ============================================
  const uploadNewGalleryImages = async (familyId: string) => {
    if (newGalleryFiles.length === 0) return;

    setUploadingGallery(true);

    try {
      const formDataGallery = new FormData();

      newGalleryFiles.forEach((file) => {
        formDataGallery.append('files', file);
      });

      formDataGallery.append('familyId', familyId);
      formDataGallery.append('markFirstAsPrimary', 'false');

      const response = await fetch('/api/admin/upload/images', {
        method: 'POST',
        body: formDataGallery,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload gallery images');
      }

      // Liberar memoria
      newGalleryPreviews.forEach(preview => URL.revokeObjectURL(preview));

      // Limpiar estados
      setNewGalleryFiles([]);
      setNewGalleryPreviews([]);

      // Recargar galería
      if (familyId) {
        await loadGalleryImages(familyId);
      }

    } catch (err: any) {
      console.error('Gallery upload error:', err);
      setError(err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // ============================================
  // SUBMIT PRINCIPAL
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setSaving(true);
    setError('');

    try {
      // 1. Subir nuevo thumbnail (si hay)
      let thumbnailUrl = family?.images?.thumbnail || '';
      if (newThumbnail) {
        const uploadedUrl = await uploadNewThumbnail();
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        }
      }

      // 2. Actualizar información básica
      const response = await fetch(`/api/admin/family?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          thumbnail_url: thumbnailUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update family');

      // 3. Si hay nuevas imágenes de galería, subirlas
      if (newGalleryFiles.length > 0 && family?.id) {
        await uploadNewGalleryImages(family.id);
      }

      // 4. Recargar la misma página para ver cambios
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && !family) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newGalleryFiles.length;
  const canAddMore = totalImages < 6;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Edit Family</h1>
            <button
              type="button"
              onClick={() => router.push('/admin/families')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              ← Back
            </button>
          </div>

          {/* BASIC INFO */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="furniture">Furniture</option>
                <option value="doors">Doors</option>
                <option value="windows">Windows</option>
                <option value="lighting">Lighting</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC</option>
                <option value="equipment">Equipment</option>
                <option value="landscaping">Landscaping</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* THUMBNAIL IMAGE */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Thumbnail Image</h2>

            {/* Current Thumbnail */}
            {family?.images?.thumbnail && !newThumbnailPreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Current Thumbnail:</p>
                <img
                  src={family.images.thumbnail}
                  alt="Current thumbnail"
                  className="w-48 h-48 object-cover rounded-lg border-2 border-gray-600"
                />
              </div>
            )}

            {/* New Thumbnail Preview */}
            {newThumbnailPreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">New Thumbnail (not saved yet):</p>
                <div className="relative inline-block">
                  <img
                    src={newThumbnailPreview}
                    alt="New thumbnail"
                    className="w-48 h-48 object-cover rounded-lg border-2 border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewThumbnail(null);
                      setNewThumbnailPreview(null);
                      if (newThumbnailPreview) {
                        URL.revokeObjectURL(newThumbnailPreview);
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Upload New */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {newThumbnailPreview ? 'Change Thumbnail' : 'Upload New Thumbnail'} (Optional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleThumbnailChange}
                disabled={uploadingThumbnail || compressing}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
              />
              {compressing && !uploadingGallery && (
                <p className="text-sm text-blue-400 mt-2">🔄 Compressing thumbnail...</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Images will be automatically compressed
              </p>
            </div>
          </div>

          {/* GALLERY MANAGEMENT */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Gallery Images ({totalImages}/6)
            </h2>

            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Current Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.altText || 'Gallery image'}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-700"
                      />
                      
                      {/* PRIMARY BADGE */}
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          ⭐ Primary
                        </div>
                      )}

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(image.id)}
                        disabled={deletingImageId === image.id}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        {deletingImageId === image.id ? '...' : '✕'}
                      </button>

                      {/* ORDER */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        #{image.orderIndex + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADD NEW IMAGES */}
            {canAddMore && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Add New Images</h3>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleNewGalleryFilesChange}
                  disabled={compressing}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 disabled:opacity-50"
                />
                {compressing && uploadingGallery === false && (
                  <p className="text-sm text-blue-400">🔄 Compressing images...</p>
                )}
                <p className="text-xs text-gray-500">
                  Images will be automatically compressed • {6 - totalImages} remaining
                </p>

                {/* NEW IMAGES PREVIEW */}
                {newGalleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {newGalleryPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border-2 border-green-500"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                          NEW
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewGalleryImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!canAddMore && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Maximum 6 images reached. Delete existing images to add new ones.
                </p>
              </div>
            )}
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* SUBMIT BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || uploadingGallery || compressing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
            >
              {saving ? (uploadingGallery ? 'Uploading...' : 'Saving...') : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/families')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditFamilyPage() {
  return (
    <Suspense fallback={
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <EditFamilyForm />
    </Suspense>
  );
}