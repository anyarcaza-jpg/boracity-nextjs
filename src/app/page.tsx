'use client';
import type { Family } from '@/types';
import Link from 'next/link';
import FamilyCard from '@/components/FamilyCard';
import SearchAutocomplete from '@/components/search/SearchAutocomplete';
import { Download, CheckCircle, Rocket, Sofa, DoorOpen, Square, Lightbulb } from 'lucide-react';



export default function HomePage() {


  // ⚠️ Temporal: Stats hardcodeados (después lo arreglamos)
  const stats = {
    totalFamilies: 9,
    totalDownloads: 12500,
    categoriesCount: 4,
  };
  
  const recentFamilies: Family[] = [];

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
            <SearchAutocomplete />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Furniture */}
            <Link href="/revit/furniture" className="group bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sofa className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Furniture</h3>
                <p className="text-sm text-gray-600">Chairs, tables, desks & more</p>
              </div>
            </Link>

            {/* Doors */}
            <Link href="/revit/doors" className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DoorOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Doors</h3>
                <p className="text-sm text-gray-600">Interior & exterior doors</p>
              </div>
            </Link>

            {/* Windows */}
            <Link href="/revit/windows" className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Square className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Windows</h3>
                <p className="text-sm text-gray-600">Modern & traditional styles</p>
              </div>
            </Link>

            {/* Lighting */}
            <Link href="/revit/lighting" className="group bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lighting</h3>
                <p className="text-sm text-gray-600">Fixtures & luminaires</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          RECENT FAMILIES SECTION
          ======================================== */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Recently Added
            </h2>
            <p className="text-lg text-gray-600">
              Fresh content added this week
            </p>
          </div>

          {/* Grid de familias */}
          {recentFamilies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFamilies.map((family) => (
                <FamilyCard key={family.id} family={family} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No families available at the moment.</p>
            </div>
          )}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Free</h3>
              <p className="text-gray-600">All families are completely free to download and use in your projects</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">High Quality</h3>
              <p className="text-gray-600">Professional-grade BIM content created by experienced designers</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Downloads</h3>
              <p className="text-gray-600">Instant download with no registration required</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}