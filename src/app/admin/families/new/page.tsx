'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewFamilyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ rfa: false, thumbnail: false });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'furniture',
    description: '',
    revit_version: '2024',
    rfa_url: '',
    thumbnail_url: '',
    file_size: 0,
  });

  const [files, setFiles] = useState({
    rfa: null as File | null,
    thumbnail: null as File | null,
  });

  // Estado para las imágenes de galería (archivos seleccionados, no subidos aún)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // ============================================
  // UPLOAD RFA Y THUMBNAIL (igual que antes)
  // ============================================
  const handleFileUpload = async (file: File, type: 'rfa' | 'thumbnail') => {
    setUploading(prev => ({ ...prev, [type]: true }));
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();

      if (type === 'rfa') {
        setFormData(prev => ({
          ...prev,
          rfa_url: data.url,
          file_size: data.fileSize,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: data.url,
        }));
      }

      setUploading(prev => ({ ...prev, [type]: false }));
    } catch (err: any) {
      setError(err.message);
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  // ============================================
  // MANEJO DE GALERÍA (SOLO PREVIEW, NO UPLOAD)
  // ============================================
  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILES = 6;
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Validar cantidad
    if (galleryFiles.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed for gallery`);
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tipo
      if (!ALLOWED_TYPES.includes(file.type)) {
        const errorMsg = `"${file.name}" is not a valid image type. Only JPG, PNG, and WebP are allowed.`;
        setError(errorMsg);
        alert(errorMsg); // Alert adicional
        return;
      }

      // Validar tamaño
      if (file.size > MAX_SIZE) {
        const errorMsg = `"${file.name}" is too large. Maximum 1MB per image (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
        setError(errorMsg);
        alert(errorMsg); // Alert adicional para que sea más visible
        return;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setGalleryFiles([...galleryFiles, ...newFiles]);
    setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    setError('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    
    // Liberar memoria del preview
    URL.revokeObjectURL(galleryPreviews[index]);
    
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  // ============================================
  // SUBIR GALERÍA DE IMÁGENES (CON FAMILY ID)
  // ============================================
  const uploadGalleryImages = async (familyId: string) => {
    if (galleryFiles.length === 0) return;

    setUploadingGallery(true);

    try {
      const formDataGallery = new FormData();

      // Agregar todas las imágenes
      galleryFiles.forEach((file) => {
        formDataGallery.append('files', file);
      });

      // Agregar family ID
      formDataGallery.append('familyId', familyId);
      formDataGallery.append('markFirstAsPrimary', 'false'); // El thumbnail ya es primary

      const response = await fetch('/api/admin/upload/images', {
        method: 'POST',
        body: formDataGallery,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload gallery images');
      }

      const data = await response.json();
      console.log('Gallery images uploaded:', data);

      // Liberar memoria de los previews
      galleryPreviews.forEach(preview => URL.revokeObjectURL(preview));

    } catch (err: any) {
      console.error('Gallery upload error:', err);
      // No bloqueamos el flujo si falla la galería
      // La familia ya está creada
    } finally {
      setUploadingGallery(false);
    }
  };

  // ============================================
  // SUBMIT PRINCIPAL
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.rfa_url || !formData.thumbnail_url) {
      setError('Please upload both RFA file and thumbnail');
      return;
    }

    setLoading(true);

    try {
      // ============================================
      // PASO 1: CREAR LA FAMILIA EN LA BASE DE DATOS
      // ============================================
      const response = await fetch('/api/admin/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create family');
      }

      const familyData = await response.json();
      const familyId = familyData.family?.id;

      if (!familyId) {
        throw new Error('Family created but no ID returned');
      }

      console.log('Family created with ID:', familyId);

      // ============================================
      // PASO 2: SUBIR GALERÍA DE IMÁGENES (SI HAY)
      // ============================================
      if (galleryFiles.length > 0) {
        await uploadGalleryImages(familyId);
      }

      // ============================================
      // PASO 3: REDIRIGIR AL LISTADO
      // ============================================
      router.push('/admin/families');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mb-8">
        <Link href="/admin/families" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Families
        </Link>
        <h1 className="text-3xl font-bold text-white">Add New Family</h1>
        <p className="text-gray-400 mt-1">Create a new Revit family</p>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* FAMILY NAME */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Family Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Modern Office Chair"
            />
          </div>

          {/* SLUG */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
              Slug * (auto-generated)
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="modern-office-chair"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="furniture">Furniture</option>
              <option value="doors">Doors</option>
              <option value="windows">Windows</option>
              <option value="lighting">Lighting</option>
            </select>
          </div>

          {/* REVIT VERSION */}
          <div>
            <label htmlFor="revit_version" className="block text-sm font-medium text-gray-300 mb-2">
              Revit Version *
            </label>
            <input
              type="text"
              id="revit_version"
              required
              value={formData.revit_version}
              onChange={(e) => setFormData(prev => ({ ...prev, revit_version: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2024"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A modern office chair with ergonomic design..."
            />
          </div>

          {/* RFA FILE */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              RFA File * (.rfa only)
            </label>
            <input
              type="file"
              accept=".rfa"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFiles(prev => ({ ...prev, rfa: file }));
                  handleFileUpload(file, 'rfa');
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              disabled={uploading.rfa}
            />
            {uploading.rfa && <p className="text-sm text-blue-400 mt-2">Uploading RFA file...</p>}
            {formData.rfa_url && <p className="text-sm text-green-400 mt-2">✓ RFA uploaded successfully</p>}
          </div>

          {/* THUMBNAIL IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail Image * (PNG, JPG, WebP - Max 1MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Validaciones
                  const MAX_SIZE = 1 * 1024 * 1024; // 1MB
                  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

                  // Validar tipo
                  if (!ALLOWED_TYPES.includes(file.type)) {
                    const errorMsg = `"${file.name}" is not a valid image type. Only JPG, PNG, and WebP are allowed.`;
                    setError(errorMsg);
                    alert(errorMsg);
                    e.target.value = ''; // Limpiar input
                    return;
                  }

                  // Validar tamaño
                  if (file.size > MAX_SIZE) {
                    const errorMsg = `"${file.name}" is too large. Maximum 1MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
                    setError(errorMsg);
                    alert(errorMsg);
                    e.target.value = ''; // Limpiar input
                    return;
                  }

                  setFiles(prev => ({ ...prev, thumbnail: file }));
                  handleFileUpload(file, 'thumbnail');
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              disabled={uploading.thumbnail}
            />
            {uploading.thumbnail && <p className="text-sm text-blue-400 mt-2">Uploading thumbnail...</p>}
            {formData.thumbnail_url && <p className="text-sm text-green-400 mt-2">✓ Thumbnail uploaded successfully</p>}
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Gallery Images (Optional)</h3>
            <p className="text-sm text-gray-400 mb-4">
              Add up to 6 additional images for the gallery (Max 1MB each)
            </p>
          </div>

          {/* GALLERY UPLOADER - SIMPLE VERSION */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <div className="space-y-4">
              {/* INPUT */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Gallery Images ({galleryFiles.length}/6)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleGalleryFilesChange}
                  disabled={galleryFiles.length >= 6}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, WebP • Max 1MB each • Up to 6 images
                </p>
              </div>

              {/* PREVIEWS */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* INFO */}
              {galleryFiles.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                  <p className="text-blue-400 text-sm">
                    ℹ️ {galleryFiles.length} image(s) will be uploaded after creating the family
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
            <Link 
              href="/admin/families" 
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploading.rfa || uploading.thumbnail || uploadingGallery}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
            >
              {loading ? (uploadingGallery ? 'Uploading gallery...' : 'Creating...') : 'Create Family'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}