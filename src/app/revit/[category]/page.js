/**
 * CATEGORY PAGE
 * URL: /revit/[category]
 * Example: /revit/furniture
 */

import { getFamiliesByCategory } from '@/lib/families';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { category } = await params;
  
  return {
    title: `Free Revit ${category.charAt(0).toUpperCase() + category.slice(1)} Families | Boracity`,
    description: `Download free Revit ${category} families. Professional BIM content for architects and designers.`
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const families = await getFamiliesByCategory(category);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/revit" className="hover:text-primary">Revit</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 capitalize">{category}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 capitalize">
            {category} - Revit Families
          </h1>
          <p className="text-xl text-gray-600">
            Browse {families.length} professional {category} families for Revit
          </p>
        </div>
        
        {/* Families Grid */}
        {families.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {families.map(family => (
              <Link
                key={family.id}
                href={`/revit/${category}/${family.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={family.images.thumbnail} 
                    alt={family.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {family.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {family.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>📥 {family.metadata.downloads.toLocaleString()}</span>
                    <span>{family.file.size}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">
              No families found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}