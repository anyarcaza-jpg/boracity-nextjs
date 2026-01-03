// src/app/page.js
import Link from 'next/link';
import { getAllFamilies, getFamiliesStats } from '@/lib/families';

export const metadata = {
  title: 'Boracity - Free Revit Families, SketchUp Models & 3D Assets',
  description: 'Download 10,000+ professional Revit families, SketchUp models, D5 Render assets & textures. Free for students & architects.',
  keywords: ['revit families', 'bim', 'sketchup models', 'd5 render', 'textures'],
};

export default async function HomePage() {
  const stats = await getFamiliesStats();
  const families = await getAllFamilies();
  const recentFamilies = families.slice(0, 6); // Últimas 6

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Free Revit Families & 3D Assets for Architects
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Download {stats.totalFamilies}+ professional BIM families, SketchUp models, 
            D5 Render assets & textures. Free for students.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search families (e.g., office chair, door, window...)"
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-lg"
              />
              <button className="absolute right-2 top-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">
                {stats.totalFamilies}+
              </div>
              <div className="text-gray-600 mt-1">Families</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">
                {stats.totalDownloads.toLocaleString()}+
              </div>
              <div className="text-gray-600 mt-1">Downloads</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">
                {stats.categoriesCount}
              </div>
              <div className="text-gray-600 mt-1">Categories</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-gray-600 mt-1">Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect BIM content for your project
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Furniture', 'Doors', 'Windows', 'Lighting'].map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="group bg-gray-50 rounded-xl p-8 text-center hover:bg-primary hover:shadow-xl transition-all"
              >
                <i className={`fas fa-${getCategoryIcon(category)} text-4xl text-primary group-hover:text-white mb-4`}></i>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white">
                  {category}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-white/80 mt-2">
                  {getCategoryCount(category, families)} families
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Families */}
      <section className="py-16 bg-gray-50" id="explore">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recently Added
            </h2>
            <Link href="/families" className="text-primary hover:underline font-semibold">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFamilies.map((family) => (
              <Link
                key={family.id}
                href={`/family/${family.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center">
                  <img
                    src={family.images?.thumbnail || 'https://via.placeholder.com/400x300/FF4500/ffffff'}
                    alt={family.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary">
                    {family.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-download text-primary"></i>
                      {family.metadata?.downloads || 0}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      {family.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of architects downloading professional BIM content every day
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all">
              Browse All Families
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Sign Up Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper functions
function getCategoryIcon(category) {
  const icons = {
    'Furniture': 'couch',
    'Doors': 'door-open',
    'Windows': 'window-maximize',
    'Lighting': 'lightbulb'
  };
  return icons[category] || 'cube';
}

function getCategoryCount(category, families) {
  return families.filter(f => 
    f.category.toLowerCase() === category.toLowerCase()
  ).length;
}