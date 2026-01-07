// src/app/revit/[category]/[slug]/page.tsx

import OptimizedImage from '@/components/OptimizedImage';
import { isValidCategory } from '@/lib/validators';
import Link from 'next/link';
import { getFamilyBySlug, getRelatedFamilies } from '@/lib/families';
import { CATEGORY_METADATA } from '@/data/models/family.model';
import FamilyCard from '@/components/FamilyCard';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import { notFound } from 'next/navigation';
import { File, Download, Eye, User } from 'lucide-react';

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    return { title: 'Category Not Found | Boracity' };
  }

  const family = await getFamilyBySlug(category, slug);
  
  if (!family) {
    return { title: 'Family Not Found | Boracity' };
  }
  
  return {
    title: family.seo.title,
    description: family.seo.description,
    keywords: family.seo.keywords.join(', ')
  };
}

export default async function FamilyDetailPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = await params;
  
  if (!isValidCategory(category)) {
    notFound();
  }

  const family = await getFamilyBySlug(category, slug);
  
  if (!family) {
    notFound();
  }

  const relatedFamilies = await getRelatedFamilies(family.id, 3);
  const baseUrl = 'https://boracity.com';
  const currentUrl = `${baseUrl}/revit/${category}/${slug}`;

  // Breadcrumb data - CORREGIDO: URLs relativas
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Revit Families', url: '/revit' },
    { name: CATEGORY_METADATA[category]?.name || category, url: `/revit/${category}` },
    { name: family.name, url: currentUrl }
  ];

  return (
    <>
      <ProductSchema family={family} url={currentUrl} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <li key={item.url} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-400">/</span>}
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-900 font-medium">{item.name}</span>
                  ) : (
                    <Link href={item.url} className="text-gray-600 hover:text-primary">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src={family.images.thumbnail}
                  category={family.category}
                  variant="detail"
                  alt={family.name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Link 
                  href={`/revit/${family.category}`}
                  className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary/20 transition-colors"
                >
                  {CATEGORY_METADATA[family.category]?.name || family.category}
                </Link>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                {family.name}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                {family.description}
              </p>

              <div className="flex items-center gap-6 py-4 border-y">
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{family.metadata.downloads.toLocaleString()}</span>
                  <span className="text-sm">downloads</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{family.metadata.views.toLocaleString()}</span>
                  <span className="text-sm">views</span>
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                <Download className="w-6 h-6" />
                Download Family (.rfa)
              </button>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <File className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">File Size</div>
                    <div className="text-gray-600">{family.file.size}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Author</div>
                    <div className="text-gray-600">{family.metadata.author}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedFamilies.length > 0 && (
            <section className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Families
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedFamilies.map((related) => (
                  <FamilyCard key={related.id} family={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}