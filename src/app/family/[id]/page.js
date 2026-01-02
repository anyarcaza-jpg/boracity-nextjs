import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const family = await getFamily(resolvedParams.id);
  
  if (!family) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${family.name} - Free Revit Family | Boracity`,
    description: `Download ${family.name} Revit family for architecture projects.`,
  };
}

export default async function FamilyPage({ params }) {
  const resolvedParams = await params;
  const family = await getFamily(resolvedParams.id);
  
  if (!family) {
    notFound();
  }
  
  return (
    <div className="pb-16">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-primary hover:underline">Home</a>
            <span className="text-gray-400">/</span>
            <a href="/" className="text-primary hover:underline">Families</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{family.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
            <img 
              src={family.image} 
              alt={family.name}
              className="max-w-full h-auto rounded-lg"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {family.name}
            </h1>

            {/* Badges */}
            <div className="flex gap-3 flex-wrap">
              <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full uppercase tracking-wide">
                Free
              </span>
              <span className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full uppercase tracking-wide">
                {family.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              Professional {family.category} Revit family for architecture projects. 
              High-quality BIM content compatible with Revit 2020-2024.
            </p>

            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-download text-primary text-xl w-6"></i>
                <span className="text-gray-700 font-medium">
                  {family.downloads.toLocaleString()} downloads
                </span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-file text-primary text-xl w-6"></i>
                <span className="text-gray-700 font-medium">{family.fileSize}</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-primary text-xl w-6"></i>
                <span className="text-gray-700 font-medium">
                  Revit {family.revitVersion}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-900 min-w-[100px]">Category:</span>
                <span className="text-gray-600">{family.category}</span>
              </div>
            </div>

            {/* Download Button */}
            <button className="w-full lg:w-auto px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3">
              <i className="fas fa-download text-xl"></i>
              Download Family
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getFamily(id) {
  const families = [
    {
      id: '1',
      name: 'Modern Executive Chair',
      category: 'Furniture',
      image: 'https://via.placeholder.com/800x600/FF4500/ffffff?text=Executive+Chair',
      downloads: 1543,
      fileSize: '2.5MB',
      revitVersion: '2020-2024',
    },
    {
      id: '2',
      name: 'Contemporary Office Desk',
      category: 'Furniture',
      image: 'https://via.placeholder.com/800x600/FF4500/ffffff?text=Office+Desk',
      downloads: 2103,
      fileSize: '3.1MB',
      revitVersion: '2020-2024',
    },
    {
      id: '3',
      name: 'Glass Entrance Door',
      category: 'Doors',
      image: 'https://via.placeholder.com/800x600/FF4500/ffffff?text=Glass+Door',
      downloads: 987,
      fileSize: '1.8MB',
      revitVersion: '2020-2024',
    },
  ];
  
  return families.find(f => f.id === id);
}