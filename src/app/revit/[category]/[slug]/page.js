import { getFamilyBySlug, getRelatedFamilies } from '@/lib/families';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
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

export default async function FamilyDetailPage({ params }) {
  const { category, slug } = await params;
  const family = await getFamilyBySlug(category, slug);
  
  if (!family) {
    notFound();
  }
  
  const relatedFamilies = await getRelatedFamilies(family.id, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/revit" className="hover:text-primary">Revit</Link>
          <span className="mx-2">/</span>
          <Link href={`/revit/${category}`} className="hover:text-primary capitalize">{category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{family.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
          <div>
            <img src={family.images.thumbnail} alt={family.name} className="w-full rounded-lg" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{family.name}</h1>
            <p className="text-gray-600 mb-6">{family.description}</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">File Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium">{family.file.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-medium">{family.metadata.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{category}</span>
                </div>
              </div>
            </div>

            <a href={family.file.downloadUrl} className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-4 rounded-lg transition-colors">
              Download Revit Family
            </a>
          </div>
        </div>

        {relatedFamilies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Families</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFamilies.map(related => (
                <Link key={related.id} href={`/revit/${related.category}/${related.id}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <img src={related.images.thumbnail} alt={related.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{related.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}