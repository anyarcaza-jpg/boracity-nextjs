/**
 * REVIT LANDING PAGE
 * URL: /revit
 * 
 * Página principal de la sección Revit
 * Muestra categorías y familias destacadas
 */

import { ItemListSchema } from '@/components/SchemaOrg';

export const metadata = {
  title: 'Free Revit Families - Download BIM Content | Boracity',
  description: 'Download free Revit families for architecture and design. Furniture, doors, windows, lighting and more. Professional BIM content for Revit 2025, 2024, 2023.',
  keywords: ['free revit families', 'revit download', 'bim families', 'revit furniture', 'revit content']
};

export default function RevitPage() {
  // Datos de categorías para el schema
  const categories = [
    {
      name: 'Furniture',
      url: 'https://boracity.com/revit/furniture',
      description: 'Chairs, desks, tables and office furniture Revit families'
    },
    {
      name: 'Doors',
      url: 'https://boracity.com/revit/doors',
      description: 'Entrance, interior and commercial door Revit families'
    },
    {
      name: 'Windows',
      url: 'https://boracity.com/revit/windows',
      description: 'Fixed, sliding and casement window Revit families'
    },
    {
      name: 'Lighting',
      url: 'https://boracity.com/revit/lighting',
      description: 'LED, pendant and recessed lighting Revit families'
    }
  ];

  return (
    <>
      {/* Schema.org structured data */}
      <ItemListSchema 
        items={categories}
        title="Free Revit Families by Category"
        description="Browse our collection of professional Revit families organized by category"
        url="https://boracity.com/revit"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Free Revit Families
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Professional BIM content for architects and designers. Download high-quality Revit families for free.
            </p>
            <div className="flex gap-4 justify-center">
              <span className="bg-white text-primary px-6 py-2 rounded-full font-semibold">
                10,000+ Families
              </span>
              <span className="bg-white text-primary px-6 py-2 rounded-full font-semibold">
                Always Free
              </span>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Furniture */}
            <a 
              href="/revit/furniture" 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="text-5xl mb-4">🪑</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                Furniture
              </h3>
              <p className="text-gray-600 mt-2">Chairs, desks, tables</p>
            </a>

            {/* Doors */}
            <a 
              href="/revit/doors" 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="text-5xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                Doors
              </h3>
              <p className="text-gray-600 mt-2">Entrance, interior doors</p>
            </a>

            {/* Windows */}
            <a 
              href="/revit/windows" 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="text-5xl mb-4">🪟</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                Windows
              </h3>
              <p className="text-gray-600 mt-2">Fixed, sliding windows</p>
            </a>

            {/* Lighting */}
            <a 
              href="/revit/lighting" 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                Lighting
              </h3>
              <p className="text-gray-600 mt-2">Fixtures, lamps</p>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}