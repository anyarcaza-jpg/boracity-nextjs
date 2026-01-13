'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function EditFamilyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  // Cargar datos de la familia
  useEffect(() => {
    if (!slug) {
      router.push('/admin/families');
      return;
    }

    async function loadFamily() {
      try {
        const response = await fetch(`/api/admin/families/${slug}`);
        if (!response.ok) throw new Error('Family not found');
        
        const data = await response.json();
        setFamily(data.family);
        setFormData({
          name: data.family.name,
          category: data.family.category,
          description: data.family.description || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load family');
        setLoading(false);
      }
    }

    loadFamily();
  }, [slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/families/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update family');

      router.push('/admin/families');
      router.refresh();
    } catch (err) {
      setError('Failed to save changes');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && !family) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Family</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white"
            >
              <option value="furniture">Furniture</option>
              <option value="doors">Doors</option>
              <option value="windows">Windows</option>
              <option value="lighting">Lighting</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/families')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
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
    <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
      <EditFamilyForm />
    </Suspense>
  );
}