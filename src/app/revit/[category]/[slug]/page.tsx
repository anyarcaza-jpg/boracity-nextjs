import { isValidCategory } from '@/lib/validators';
import Link from 'next/link';
import { getFamilyBySlug, getRelatedFamilies } from '@/lib/families';
import { CATEGORY_METADATA } from '@/data/models/family.model';
import FamilyCard from '@/components/FamilyCard';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = await params;

  // Validar categoría
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
  // Validar categoría
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

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Revit', url: `${baseUrl}/revit` },
    { name: CATEGORY_METADATA[category]?.name || category, url: `${baseUrl}/revit/${category}` },
    { name: family.name, url: currentUrl }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Schema.org structured data */}
      <ProductSchema family={family} url={currentUrl} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/revit" className="hover:text-primary">Revit</Link>
          <span className="mx-2">/</span>
          <Link href={`/revit/${category}`} className="hover:text-primary capitalize">
            {CATEGORY_METADATA[category]?.name || category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{family.name}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
          {/* Image Section */}
          <div>
            <img 
              src={family.images.thumbnail} 
              alt={family.name} 
              className="w-full rounded-lg shadow-sm"
            />
            
            {/* Image Gallery */}
            {family.images.gallery && family.images.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {family.images.gallery.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`${family.name} - View ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase mb-4">
              {CATEGORY_METADATA[category]?.name || category}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{family.name}</h1>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{family.description}</p>

            {/* File Information */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">File Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-file text-primary"></i>
                    File Size:
                  </span>
                  <span className="font-medium">{family.file.size}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-download text-primary"></i>
                    Downloads:
                  </span>
                  <span className="font-medium">{family.metadata.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-eye text-primary"></i>
                    Views:
                  </span>
                  <span className="font-medium">{family.metadata.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-user text-primary"></i>
                    Author:
                  </span>
                  <span className="font-medium">{family.metadata.author}</span>
                </div>
              </div>
            </div>

            {/* Revit Versions */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Compatible Revit Versions:</h4>
              <div className="flex flex-wrap gap-2">
                {family.file.revitVersions.map((version) => (
                  <span 
                    key={version}
                    className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-md text-xs font-medium"
                  >
                    Revit {version}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {family.metadata.tags && family.metadata.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {family.metadata.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <a 
              href={family.file.downloadUrl} 
              className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              <i className="fas fa-download mr-2"></i>
              Download Revit Family
            </a>
          </div>
        </div>

        {/* Related Families */}
        {relatedFamilies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Families</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFamilies.map(related => (
                <FamilyCard key={related.id} family={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}