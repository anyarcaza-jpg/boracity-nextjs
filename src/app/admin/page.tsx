import { sql } from '@/lib/neon';
import Link from 'next/link';

async function getStats() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_families,
        SUM(downloads) as total_downloads,
        SUM(views) as total_views,
        COUNT(CASE WHEN category = 'furniture' THEN 1 END) as furniture_count,
        COUNT(CASE WHEN category = 'doors' THEN 1 END) as doors_count,
        COUNT(CASE WHEN category = 'windows' THEN 1 END) as windows_count,
        COUNT(CASE WHEN category = 'lighting' THEN 1 END) as lighting_count
      FROM families
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total_families: 0,
      total_downloads: 0,
      total_views: 0,
      furniture_count: 0,
      doors_count: 0,
      windows_count: 0,
      lighting_count: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Boracity Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Families</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">
            {stats.total_families}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Downloads</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {Number(stats.total_downloads || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Views</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {Number(stats.total_views || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Families by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{stats.furniture_count}</p>
            <p className="text-sm text-gray-600 mt-1">Furniture</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{stats.doors_count}</p>
            <p className="text-sm text-gray-600 mt-1">Doors</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{stats.windows_count}</p>
            <p className="text-sm text-gray-600 mt-1">Windows</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{stats.lighting_count}</p>
            <p className="text-sm text-gray-600 mt-1">Lighting</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/families/new"
            className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            + Add New Family
          </Link>
          <Link
            href="/admin/families"
            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition font-medium"
          >
            Manage Families
          </Link>
        </div>
      </div>
    </div>
  );
}