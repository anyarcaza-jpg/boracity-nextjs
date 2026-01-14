// src/app/revit/[category]/[slug]/page.tsx
import Link from 'next/link';
import { getFamilyBySlug, getRelatedFamilies } from '@/lib/families';
import { getImagesByFamilyId } from '@/lib/db/images';
import { CATEGORY_METADATA } from '@/data/models/family.model';
import FamilyCard from '@/components/FamilyCard';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import { notFound } from 'next/navigation';
import { isValidCategory } from '@/lib/validators';
import { ImageGallery } from '@/components/detail/ImageGallery';
import { UserInfo } from '@/components/detail/UserInfo';
import { MetadataStats } from '@/components/detail/MetadataStats';
import { DownloadButton } from '@/components/detail/DownloadButton';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function FamilyDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  
  if (!isValidCategory(category)) {
    notFound();
  }
  
  const family = await getFamilyBySlug(category, slug);
  
  if (!family) {
    notFound();
  }

  // ============================================
  // CARGAR GALERÍA REAL DE LA BASE DE DATOS
  // ============================================
  const galleryImagesFromDB = await getImagesByFamilyId(family.id);
  
  // Construir array de URLs para la galería
  // Prioridad: 1. Imágenes de galería, 2. Thumbnail como fallback
  const galleryImages = galleryImagesFromDB.length > 0
    ? galleryImagesFromDB
        .sort((a, b) => a.orderIndex - b.orderIndex) // Ordenar por orderIndex
        .map(img => img.imageUrl) // Extraer solo las URLs
    : [family.images.thumbnail]; // Si no hay galería, usar solo el thumbnail
  
  const relatedFamilies = await getRelatedFamilies(family.slug, 4); // Usar slug en lugar de id
  const baseUrl = 'https://boracity.com';
  const currentUrl = `${baseUrl}/revit/${category}/${slug}`;
  
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
      <div className="min-h-screen bg-white">
        <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <li key={item.url} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-400">/</span>}
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-900 font-medium">{item.name}</span>
                  ) : (
                    <Link href={item.url} className="text-gray-600 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className="space-y-5">
              <ImageGallery images={galleryImages} alt={family.name} />
            </div>
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{family.name}</h1>
                <p className="text-gray-600 leading-relaxed mb-5">{family.description}</p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {CATEGORY_METADATA[category]?.name || category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    Revit {family.file.revitVersions[0] || '2024'}
                  </span>
                </div>
                <MetadataStats 
                  stats={{
                    likes: 0,
                    downloads: family.metadata.downloads,
                    views: family.metadata.views,
                  }}
                />
                <div className="mt-6">
                  <DownloadButton
                    fileName={`${slug}.rfa`}
                    fileSize={family.file.size}
                    downloadUrl={family.file.downloadUrl}
                  />
                </div>
              </div>
              <UserInfo 
                author={{
                  name: family.metadata.author,
                  avatar: undefined,
                }}
              />
            </div>
          </div>
          {relatedFamilies.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Families</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedFamilies.map((relatedFamily) => (
                  <FamilyCard key={relatedFamily.id} family={relatedFamily} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}