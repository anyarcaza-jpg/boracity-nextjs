'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewFamilyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ rfa: false, thumbnail: false });
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

  const handleFileUpload = async (file: File, type: 'rfa' | 'thumbnail') => {
    setUploading(prev => ({ ...prev, [type]: true }));
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.rfa_url || !formData.thumbnail_url) {
      setError('Please upload both RFA file and thumbnail');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create family');
      }

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
    <div>
      <div className="mb-8">
        <Link href="/admin/families" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Families
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Family</h1>
        <p className="text-gray-600 mt-1">Create a new Revit family</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Family Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Modern Office Chair"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug * (auto-generated)
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="modern-office-chair"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="furniture">Furniture</option>
              <option value="doors">Doors</option>
              <option value="windows">Windows</option>
              <option value="lighting">Lighting</option>
            </select>
          </div>

          <div>
            <label htmlFor="revit_version" className="block text-sm font-medium text-gray-700 mb-2">
              Revit Version *
            </label>
            <input
              type="text"
              id="revit_version"
              required
              value={formData.revit_version}
              onChange={(e) => setFormData(prev => ({ ...prev, revit_version: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2024"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A modern office chair with ergonomic design..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              disabled={uploading.rfa}
            />
            {uploading.rfa && <p className="text-sm text-blue-600 mt-2">Uploading RFA file...</p>}
            {formData.rfa_url && <p className="text-sm text-green-600 mt-2">✓ RFA uploaded successfully</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image * (PNG, JPG, WebP)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFiles(prev => ({ ...prev, thumbnail: file }));
                  handleFileUpload(file, 'thumbnail');
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              disabled={uploading.thumbnail}
            />
            {uploading.thumbnail && <p className="text-sm text-blue-600 mt-2">Uploading thumbnail...</p>}
            {formData.thumbnail_url && <p className="text-sm text-green-600 mt-2">✓ Thumbnail uploaded successfully</p>}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link href="/admin/families" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploading.rfa || uploading.thumbnail}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {loading ? 'Creating...' : 'Create Family'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}