import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFamilyById, getRelatedFamilies } from '@/lib/families';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const family = await getFamilyById(resolvedParams.id);
  
  if (!family) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${family.name} - Free Revit Family | Boracity`,
    description: family.seo?.description || `Download ${family.name} Revit family. ${family.description}`,
    keywords: family.seo?.keywords || [family.category, 'revit family', 'bim', 'free download'],
  };
}

export default async function FamilyPage({ params }) {
  const resolvedParams = await params;
  const family = await getFamilyById(resolvedParams.id);
  
  if (!family) {
    notFound();
  }

  const relatedFamilies = await getRelatedFamilies(family.id, 4);

  return (
    <>
      <div className="min-h-screen pb-16">
        {/* Breadcrumbs */}
        <nav className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-primary hover:underline">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/families" className="text-primary hover:underline">Families</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">{family.name}</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="bg-gray-50 rounded-xl p-8">
              <img 
                src={family.images?.thumbnail || 'https://via.placeholder.com/800x600/FF4500/ffffff?text=BIM'} 
                alt={family.name}
                className="w-full rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                {family.name}
              </h1>

              <div className="flex gap-3">
                <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full uppercase">
                  Free
                </span>
                <span className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full uppercase">
                  {family.category}
                </span>
              </div>

              <p className="text-lg text-gray-600">
                {family.description}
              </p>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-download text-primary text-xl w-6"></i>
                  <span className="text-gray-700 font-medium">
                    {family.metadata?.downloads?.toLocaleString() || 0} downloads
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-file text-primary text-xl w-6"></i>
                  <span className="text-gray-700 font-medium">
                    {family.file?.size || 'N/A'}
                  </span>
                </div>
              </div>

              <button className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-all">
                <i className="fas fa-download mr-3"></i>
                Download Family
              </button>
            </div>
          </div>

          {/* Related Families */}
          {relatedFamilies.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Families
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedFamilies.map((related) => (
                  <Link
                    key={related.id}
                    href={`/family/${related.id}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="bg-gray-100 aspect-[4/3]">
                      <img
                        src={related.images?.thumbnail || 'https://via.placeholder.com/400x300'}
                        alt={related.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {related.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}