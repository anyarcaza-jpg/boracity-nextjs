// src/app/revit/[category]/[slug]/page.tsx
import Link from 'next/link';
import { getFamilyBySlug, getRelatedFamilies } from '@/lib/families';
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
  const relatedFamilies = await getRelatedFamilies(family.id, 4);
  const baseUrl = 'https://boracity.com';
  const currentUrl = `${baseUrl}/revit/${category}/${slug}`;
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Revit Families', url: '/revit' },
    { name: CATEGORY_METADATA[category]?.name || category, url: `/revit/${category}` },
    { name: family.name, url: currentUrl }
  ];
  const galleryImages = [
    family.images.thumbnail,
    `https://via.placeholder.com/800x600/FF4500/ffffff?text=Image+2`,
    `https://via.placeholder.com/800x600/E63E00/ffffff?text=Image+3`,
    `https://via.placeholder.com/800x600/FF6B35/ffffff?text=Image+4`,
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
              <UserInfo
                author={{ name: family.metadata.author }}
                initialStats={{
                  likes: family.metadata.downloads,
                  isLiked: false,
                  isSaved: false,
                  isFollowing: false,
                }}
              />
              <div>
                <Link 
                  href={`/revit/${family.category}`}
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  {CATEGORY_METADATA[family.category]?.name || family.category}
                </Link>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {family.name}
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                {family.description}
              </p>
              <MetadataStats
                stats={{
                  likes: 225,
                  downloads: family.metadata.downloads,
                  views: family.metadata.views,
                  collections: 31,
                }}
              />
              <DownloadButton
                fileName={`${family.id}.rfa`}
                fileSize={family.file.size}
                downloadUrl={family.file.downloadUrl}
              />
              {/* TAGS */}
{family.metadata.tags && family.metadata.tags.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {family.metadata.tags.slice(0, 6).map((tag) => (
      <span
        key={tag}
        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-pointer"
      >
        {tag}
      </span>
    ))}
  </div>
)}

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-gray-200/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">File Size</span>
                    <span className="font-semibold text-gray-900">{family.file.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Author</span>
                    <span className="font-semibold text-gray-900">{family.metadata.author}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Revit Versions</span>
                    <span className="font-semibold text-gray-900">
                      {family.file.revitVersions[0]} - {family.file.revitVersions[family.file.revitVersions.length - 1]}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Upload Date</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(family.metadata.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {relatedFamilies.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Families
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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