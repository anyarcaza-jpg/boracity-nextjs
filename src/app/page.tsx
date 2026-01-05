import type { Family, FamilyCategory } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { getAllFamilies, getFamiliesStats } from '@/lib/families';
import FamilyCard from '@/components/FamilyCard';

export const metadata = {
  title: 'Boracity - Free Revit Families, SketchUp Models & 3D Assets',
  description: 'Download 10,000+ professional Revit families, SketchUp models, D5 Render assets & textures. Free for students & architects.',
  keywords: ['revit families', 'bim', 'sketchup models', 'd5 render', 'textures', 'architectural assets'],
};

export default async function HomePage() {
  const stats = await getFamiliesStats();
  const families = await getAllFamilies();
  const recentFamilies = stats.recentlyAdded || families.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Free Revit Families & 3D Assets
            <br />
            <span className="text-primary">for Architects</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Download {stats.totalFamilies}+ professional BIM families, SketchUp models, 
            D5 Render assets & textures. 100% free for students.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search families (e.g., office chair, door, window...)"
                className="w-full px-6 py-4 pr-32 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-base shadow-sm"
              />
              <button className="absolute right-2 top-2 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all">
                <i className="fas fa-search mr-2"></i>
                Search
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stats.totalFamilies}+
              </div>
              <div className="text-sm text-gray-600 font-medium">Families</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stats.totalDownloads.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600 font-medium">Downloads</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stats.categoriesCount}
              </div>
              <div className="text-sm text-gray-600 font-medium">Categories</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                100%
              </div>
              <div className="text-sm text-gray-600 font-medium">Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CATEGORIES SECTION
          ======================================== */}
      <section className="py-16 lg:py-20 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect BIM content for your architecture project
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Furniture', icon: 'fa-couch', count: getFamilyCountByCategory('furniture', families) },
              { name: 'Doors', icon: 'fa-door-open', count: getFamilyCountByCategory('doors', families) },
              { name: 'Windows', icon: 'fa-window-maximize', count: getFamilyCountByCategory('windows', families) },
              { name: 'Lighting', icon: 'fa-lightbulb', count: getFamilyCountByCategory('lighting', families) },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
                className="group bg-gray-50 rounded-xl p-6 sm:p-8 text-center hover:bg-primary hover:shadow-xl transition-all duration-300"
              >
                <i className={`fas ${category.icon} text-4xl sm:text-5xl text-primary group-hover:text-white mb-4 transition-colors`}></i>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors">
                  {category.count} families
                </p>
              </Link>
            ))}
          </div>

          {/* View All Categories Button */}
          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-3 text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              View All Categories
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          RECENT FAMILIES SECTION
          ======================================== */}
      <section className="py-16 lg:py-20 bg-gray-50" id="explore">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Recently Added
              </h2>
              <p className="text-gray-600">
                Latest professional BIM families
              </p>
            </div>
            <Link 
              href="/families" 
              className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              View All
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* Families Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {recentFamilies.map((family) => (
  <FamilyCard key={family.id} family={family} />
))}
          </div>

          {/* Mobile View All Button */}
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/families"
              className="inline-flex items-center gap-2 px-6 py-3 text-primary border-2 border-primary rounded-lg font-semibold"
            >
              View All Families
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Boracity?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional BIM resources designed for architects and designers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-download text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Free Downloads
              </h3>
              <p className="text-gray-600">
                All families are completely free. No hidden fees, no premium tiers. Just download and use.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check-circle text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Professional Quality
              </h3>
              <p className="text-gray-600">
                Every family is tested and optimized for Revit 2020-2025. Industry-standard quality.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-rocket text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Regular Updates
              </h3>
              <p className="text-gray-600">
                New families added weekly. SketchUp, D5 Render, and textures coming soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of architects downloading professional BIM content every day
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/families"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 hover:shadow-xl transition-all"
            >
              Browse All Families
            </Link>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Sign Up Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function
function getFamilyCountByCategory(category: FamilyCategory, families: Family[]): number {
  return families.filter((f: Family) => f.category === category).length;
}