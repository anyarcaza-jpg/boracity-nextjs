// src/app/revit/[category]/page.tsx

import { isValidCategory } from '@/lib/validators';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFamiliesByCategory } from '@/lib/families';
import { CATEGORY_METADATA } from '@/data/models/family.model';
import FamilyCard from '@/components/FamilyCard';
import { CollectionPageSchema } from '@/components/SchemaOrg';
import type { FamilyCategory } from '@/types';

export async function generateMetadata({ params }: { params: { category: string } }) {
  const { category } = await params;
  
  return {
    title: `Free Revit ${category.charAt(0).toUpperCase() + category.slice(1)} Families | Boracity`,
    description: `Download free Revit ${category} families. Professional BIM content for architects and designers.`
  };
}

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const families = await getFamiliesByCategory(category);

  return (
    <>
      <CollectionPageSchema 
        category={category}
        families={families}
        url={`https://boracity.com/revit/${category}`}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/revit" className="hover:text-primary">Revit Families</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 capitalize">{category}</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 capitalize">
              {category} - Revit Families
            </h1>
            <p className="text-xl text-gray-600">
              Browse {families.length} professional {category} families for Revit
            </p>
          </div>
          
          {families.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {families.map(family => (
                <FamilyCard key={family.id} family={family} />
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
    </>
  );
}