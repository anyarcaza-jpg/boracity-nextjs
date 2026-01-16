'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { compressImage, compressMultipleImages } from '@/lib/imageCompression';

export default function NewFamilyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ rfa: false, thumbnail: false });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [compressing, setCompressing] = useState(false);
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
  // UPLOAD RFA Y THUMBNAIL (con compresión)
  // ============================================
  const handleFileUpload = async (file: File, type: 'rfa' | 'thumbnail') => {
    setUploading(prev => ({ ...prev, [type]: true }));
    setError('');

    try {
      // ============================================
      // COMPRIMIR THUMBNAIL ANTES DE SUBIR
      // ============================================
      if (type === 'thumbnail') {
        setCompressing(true);
        console.log('🔄 Compressing thumbnail...');
        file = await compressImage(file);
        console.log('✅ Thumbnail compressed');
        setCompressing(false);
      }

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
      setCompressing(false);
    }
  };

  // ============================================
  // MANEJO DE GALERÍA (CON COMPRESIÓN)
  // ============================================
  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILES = 6;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Validar cantidad
    if (galleryFiles.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed for gallery`);
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
          const errorMsg = `"${file.name}" is not a valid image type. Only JPG, PNG, and WebP are allowed.`;
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
      console.log(`🔄 Compressing ${filesToCompress.length} gallery images...`);
      const compressedFiles = await compressMultipleImages(filesToCompress);
      console.log('✅ All gallery images compressed');

      // Crear previews de las imágenes comprimidas
      const newPreviews: string[] = [];
      for (const compressedFile of compressedFiles) {
        newPreviews.push(URL.createObjectURL(compressedFile));
      }

      setGalleryFiles([...galleryFiles, ...compressedFiles]);
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
      setError('');

    } catch (err: any) {
      console.error('Error compressing gallery images:', err);
      setError('Failed to compress images. Please try again.');
    } finally {
      setCompressing(false);
    }
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

      // Agregar todas las imágenes (ya comprimidas)
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

      const data = await response.json();
      const familyId = data.family.id;

      console.log('Family created with ID:', familyId);

      // ============================================
      // PASO 2: SUBIR GALERÍA DE IMÁGENES (SI HAY)
      // ============================================
      if (galleryFiles.length > 0) {
        await uploadGalleryImages(familyId);
      }

      // ============================================
      // PASO 3: REDIRECT AL LISTADO
      // ============================================
      router.push('/admin/families');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create family');
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Create New Family</h1>
          <Link
            href="/admin/families"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back
          </Link>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Modern Office Chair"
            />
          </div>

          {/* Slug (auto-generated) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug (auto-generated)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 focus:outline-none"
              placeholder="modern-office-chair"
              readOnly
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe this Revit family..."
            />
          </div>

          {/* Revit Version */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Revit Version
            </label>
            <select
              name="revit_version"
              value={formData.revit_version}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>

          {/* RFA File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              RFA File *
            </label>
            <input
              type="file"
              accept=".rfa"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFiles({ ...files, rfa: file });
                  handleFileUpload(file, 'rfa');
                }
              }}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {uploading.rfa && (
              <p className="text-sm text-blue-400 mt-2">Uploading RFA file...</p>
            )}
            {formData.rfa_url && (
              <p className="text-sm text-green-400 mt-2">✓ RFA uploaded successfully</p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFiles({ ...files, thumbnail: file });
                  handleFileUpload(file, 'thumbnail');
                }
              }}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {compressing && !uploadingGallery && (
              <p className="text-sm text-blue-400 mt-2">🔄 Compressing image...</p>
            )}
            {uploading.thumbnail && (
              <p className="text-sm text-blue-400 mt-2">Uploading thumbnail...</p>
            )}
            {formData.thumbnail_url && (
              <div className="mt-4">
                <p className="text-sm text-green-400 mb-2">✓ Thumbnail uploaded</p>
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                />
              </div>
            )}
          </div>

          {/* Gallery Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gallery Images (Optional, max 6)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryFilesChange}
              disabled={galleryFiles.length >= 6}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {compressing && uploadingGallery === false && (
              <p className="text-sm text-blue-400 mt-2">🔄 Compressing gallery images...</p>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Images will be automatically compressed. Current: {galleryFiles.length}/6
            </p>

            {/* Gallery Previews */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading.rfa || uploading.thumbnail || compressing}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : 'Create Family'}
            </button>
            <Link
              href="/admin/families"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg text-center transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}