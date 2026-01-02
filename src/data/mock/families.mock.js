/**
 * MOCK DATA - Familias de Revit para desarrollo
 * Estos datos simulan lo que vendrá de la API
 * Representan familias reales y profesionales
 */

import { FAMILY_CATEGORIES, REVIT_VERSIONS } from '../models/family.model.js';

/**
 * Datos mock de familias de Revit
 * Cada objeto representa una familia completa con todos sus datos
 */
export const mockFamilies = [
  // ============================================
  // FURNITURE - Muebles
  // ============================================
  {
    id: 'modern-office-chair-ergonomic',
    name: 'Modern Office Chair - Ergonomic',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'High-quality ergonomic office chair with adjustable height, lumbar support, and armrests. Perfect for modern office spaces and coworking environments. Features breathable mesh back and comfortable cushioned seat. Fully parametric with multiple finish options.',
    images: {
      thumbnail: '/images/families/furniture/office-chair-thumb.jpg',
      gallery: [
        '/images/families/furniture/office-chair-1.jpg',
        '/images/families/furniture/office-chair-2.jpg',
        '/images/families/furniture/office-chair-3.jpg'
      ]
    },
    file: {
      size: '245 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1], REVIT_VERSIONS[2]], // 2025, 2024, 2023
      downloadUrl: '/downloads/modern-office-chair-ergonomic.rfa'
    },
    metadata: {
      tags: ['office', 'chair', 'furniture', 'ergonomic', 'modern', 'workspace', 'seating'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-15'),
      downloads: 1247,
      views: 3891
    },
    seo: {
      title: 'Modern Ergonomic Office Chair - Free Revit Family',
      description: 'Download free high-quality ergonomic office chair Revit family. Fully parametric with adjustable height, lumbar support. Compatible with Revit 2023-2025.',
      keywords: ['office chair revit family', 'ergonomic chair bim', 'modern office furniture', 'revit seating', 'workspace furniture']
    }
  },
  
  {
    id: 'conference-table-rectangular-8-person',
    name: 'Conference Table - Rectangular 8 Person',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'Professional conference table designed for 8 people. Features cable management system, premium wood finish options, and modular design. Ideal for meeting rooms, boardrooms, and collaborative spaces. Includes parametric dimensions for custom sizing.',
    images: {
      thumbnail: '/images/families/furniture/conference-table-thumb.jpg',
      gallery: [
        '/images/families/furniture/conference-table-1.jpg',
        '/images/families/furniture/conference-table-2.jpg'
      ]
    },
    file: {
      size: '312 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1], REVIT_VERSIONS[2], REVIT_VERSIONS[3]], // 2025-2022
      downloadUrl: '/downloads/conference-table-rectangular-8-person.rfa'
    },
    metadata: {
      tags: ['conference', 'table', 'furniture', 'meeting room', 'boardroom', 'office', '8 person'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-01'),
      downloads: 892,
      views: 2134
    },
    seo: {
      title: '8-Person Conference Table - Free Revit Family Download',
      description: 'Professional rectangular conference table for 8 people. Free Revit family with cable management and parametric sizing. Perfect for meeting rooms and offices.',
      keywords: ['conference table revit', 'meeting table bim', 'boardroom furniture', '8 person table', 'office furniture revit']
    }
  },

  {
    id: 'modern-sofa-3-seater-fabric',
    name: 'Modern Sofa - 3 Seater Fabric',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'Contemporary 3-seater sofa with clean lines and comfortable cushioning. Features multiple fabric and color options through parameters. Ideal for residential living rooms, office lounges, and hospitality projects. High-detail model with realistic materials.',
    images: {
      thumbnail: '/images/families/furniture/sofa-3seater-thumb.jpg',
      gallery: [
        '/images/families/furniture/sofa-3seater-1.jpg',
        '/images/families/furniture/sofa-3seater-2.jpg',
        '/images/families/furniture/sofa-3seater-3.jpg'
      ]
    },
    file: {
      size: '428 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1], REVIT_VERSIONS[2]], // 2025-2023
      downloadUrl: '/downloads/modern-sofa-3-seater-fabric.rfa'
    },
    metadata: {
      tags: ['sofa', 'furniture', 'living room', '3 seater', 'modern', 'residential', 'lounge', 'hospitality'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-20'),
      downloads: 1567,
      views: 4203
    },
    seo: {
      title: 'Modern 3-Seater Sofa - Free Revit Family for Living Rooms',
      description: 'Download free modern 3-seater sofa Revit family. Multiple fabric options, parametric design. Perfect for residential and hospitality projects.',
      keywords: ['sofa revit family', '3 seater sofa bim', 'living room furniture', 'modern sofa revit', 'residential furniture']
    }
  },

  // ============================================
  // DOORS - Puertas
  // ============================================
  {
    id: 'single-flush-door-wood-36x80',
    name: 'Single Flush Door - Wood 36"x80"',
    category: FAMILY_CATEGORIES.DOORS,
    description: 'Standard single flush door with wood finish. Parametric family with adjustable dimensions, swing direction, and hardware options. Includes door frame, casing, and handles. Suitable for residential and commercial interior applications.',
    images: {
      thumbnail: '/images/families/doors/flush-door-thumb.jpg',
      gallery: [
        '/images/families/doors/flush-door-1.jpg',
        '/images/families/doors/flush-door-2.jpg'
      ]
    },
    file: {
      size: '189 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 5), // 2025-2021
      downloadUrl: '/downloads/single-flush-door-wood-36x80.rfa'
    },
    metadata: {
      tags: ['door', 'single door', 'flush door', 'wood door', 'interior', 'residential', 'commercial'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-10'),
      downloads: 2134,
      views: 5678
    },
    seo: {
      title: 'Single Flush Wood Door 36"x80" - Free Revit Family',
      description: 'Download free parametric single flush door Revit family. Adjustable dimensions and swing direction. Perfect for residential and commercial interiors.',
      keywords: ['wood door revit', 'flush door family', 'single door bim', 'interior door revit', 'parametric door']
    }
  },

  {
    id: 'double-glass-door-aluminum-frame-72x84',
    name: 'Double Glass Door - Aluminum Frame 72"x84"',
    category: FAMILY_CATEGORIES.DOORS,
    description: 'Modern double glass door with sleek aluminum frame. Perfect for office entrances, commercial buildings, and contemporary residential projects. Features full-height glazing, panic hardware, and accessibility compliance. Parametric width and height adjustments.',
    images: {
      thumbnail: '/images/families/doors/glass-door-double-thumb.jpg',
      gallery: [
        '/images/families/doors/glass-door-double-1.jpg',
        '/images/families/doors/glass-door-double-2.jpg',
        '/images/families/doors/glass-door-double-3.jpg'
      ]
    },
    file: {
      size: '367 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 4), // 2025-2022
      downloadUrl: '/downloads/double-glass-door-aluminum-frame-72x84.rfa'
    },
    metadata: {
      tags: ['door', 'double door', 'glass door', 'aluminum', 'commercial', 'entrance', 'modern', 'accessibility'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-05'),
      downloads: 1456,
      views: 3421
    },
    seo: {
      title: 'Double Glass Aluminum Door 72"x84" - Free Revit Family',
      description: 'Modern double glass door with aluminum frame. Free Revit family for commercial entrances. ADA compliant with panic hardware options.',
      keywords: ['glass door revit', 'double door bim', 'aluminum door family', 'commercial entrance', 'modern door revit']
    }
  },

  // ============================================
  // WINDOWS - Ventanas
  // ============================================
  {
    id: 'casement-window-single-hung-36x48',
    name: 'Casement Window - Single Hung 36"x48"',
    category: FAMILY_CATEGORIES.WINDOWS,
    description: 'Energy-efficient single-hung casement window with vinyl frame. Features double-pane glazing, weather stripping, and easy operation. Parametric design allows custom sizing and configuration. Includes detailed trim and sill components.',
    images: {
      thumbnail: '/images/families/windows/casement-window-thumb.jpg',
      gallery: [
        '/images/families/windows/casement-window-1.jpg',
        '/images/families/windows/casement-window-2.jpg'
      ]
    },
    file: {
      size: '278 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 6), // 2025-2020
      downloadUrl: '/downloads/casement-window-single-hung-36x48.rfa'
    },
    metadata: {
      tags: ['window', 'casement', 'single hung', 'vinyl', 'residential', 'energy efficient', 'double pane'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-25'),
      downloads: 1789,
      views: 4234
    },
    seo: {
      title: 'Single Hung Casement Window 36"x48" - Free Revit Family',
      description: 'Energy-efficient single-hung casement window Revit family. Double-pane glazing, parametric sizing. Free download for residential projects.',
      keywords: ['casement window revit', 'single hung window bim', 'vinyl window family', 'residential window', 'energy efficient window']
    }
  },

  {
    id: 'sliding-window-aluminum-60x36-commercial',
    name: 'Sliding Window - Aluminum 60"x36" Commercial',
    category: FAMILY_CATEGORIES.WINDOWS,
    description: 'Commercial-grade sliding window with thermally-broken aluminum frame. Designed for office buildings and commercial applications. Features high-performance glazing, smooth sliding operation, and multiple color finishes. Meets commercial building codes.',
    images: {
      thumbnail: '/images/families/windows/sliding-window-thumb.jpg',
      gallery: [
        '/images/families/windows/sliding-window-1.jpg',
        '/images/families/windows/sliding-window-2.jpg'
      ]
    },
    file: {
      size: '321 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 4), // 2025-2022
      downloadUrl: '/downloads/sliding-window-aluminum-60x36-commercial.rfa'
    },
    metadata: {
      tags: ['window', 'sliding', 'aluminum', 'commercial', 'office', 'thermally broken', 'high performance'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-10'),
      downloads: 934,
      views: 2156
    },
    seo: {
      title: 'Commercial Sliding Window 60"x36" - Free Revit Family',
      description: 'Commercial-grade aluminum sliding window for office buildings. Thermally-broken frame, high-performance glazing. Free Revit family download.',
      keywords: ['sliding window revit', 'commercial window bim', 'aluminum window family', 'office building window', 'thermally broken window']
    }
  },

  // ============================================
  // LIGHTING - Iluminación
  // ============================================
  {
    id: 'led-recessed-downlight-6inch-retrofit',
    name: 'LED Recessed Downlight - 6" Retrofit',
    category: FAMILY_CATEGORIES.LIGHTING,
    description: 'Energy-efficient 6-inch LED recessed downlight perfect for retrofit applications. Features adjustable color temperature (2700K-5000K), dimmable driver, and high CRI. Ideal for residential and commercial spaces. Includes photometric data for lighting calculations.',
    images: {
      thumbnail: '/images/families/lighting/led-downlight-thumb.jpg',
      gallery: [
        '/images/families/lighting/led-downlight-1.jpg',
        '/images/families/lighting/led-downlight-2.jpg'
      ]
    },
    file: {
      size: '156 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 5), // 2025-2021
      downloadUrl: '/downloads/led-recessed-downlight-6inch-retrofit.rfa'
    },
    metadata: {
      tags: ['lighting', 'LED', 'recessed', 'downlight', 'retrofit', 'energy efficient', 'dimmable', '6 inch'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-30'),
      downloads: 2456,
      views: 6123
    },
    seo: {
      title: '6" LED Recessed Downlight - Free Revit Family with IES',
      description: 'Energy-efficient 6-inch LED downlight Revit family. Includes photometric data, adjustable CCT, dimmable. Free download for residential and commercial.',
      keywords: ['LED downlight revit', 'recessed lighting bim', '6 inch downlight family', 'retrofit lighting', 'energy efficient lighting']
    }
  },

  {
    id: 'pendant-light-modern-geometric-industrial',
    name: 'Pendant Light - Modern Geometric Industrial',
    category: FAMILY_CATEGORIES.LIGHTING,
    description: 'Contemporary geometric pendant light with industrial aesthetic. Features matte black finish, exposed bulb design, and adjustable cable length. Perfect for kitchen islands, dining areas, and commercial spaces. Multiple size options available through parameters.',
    images: {
      thumbnail: '/images/families/lighting/pendant-geometric-thumb.jpg',
      gallery: [
        '/images/families/lighting/pendant-geometric-1.jpg',
        '/images/families/lighting/pendant-geometric-2.jpg',
        '/images/families/lighting/pendant-geometric-3.jpg'
      ]
    },
    file: {
      size: '234 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 4), // 2025-2022
      downloadUrl: '/downloads/pendant-light-modern-geometric-industrial.rfa'
    },
    metadata: {
      tags: ['lighting', 'pendant', 'modern', 'geometric', 'industrial', 'kitchen', 'dining', 'decorative'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-15'),
      downloads: 1678,
      views: 3892
    },
    seo: {
      title: 'Modern Geometric Pendant Light - Free Revit Family',
      description: 'Industrial geometric pendant light Revit family. Adjustable cable length, multiple sizes. Perfect for kitchens and dining areas. Free download.',
      keywords: ['pendant light revit', 'geometric lighting bim', 'industrial light family', 'kitchen lighting', 'modern pendant revit']
    }
  }
];

/**
 * Función para obtener todas las familias
 * (En el futuro, esto será una llamada a la API)
 */
export function getAllFamilies() {
  return mockFamilies;
}

/**
 * Función para obtener una familia por ID
 */
export function getFamilyById(id) {
  return mockFamilies.find(family => family.id === id);
}

/**
 * Función para obtener familias por categoría
 */
export function getFamiliesByCategory(category) {
  return mockFamilies.filter(family => family.category === category);
}

/**
 * Función para buscar familias por término
 */
export function searchFamilies(searchTerm) {
  const term = searchTerm.toLowerCase();
  return mockFamilies.filter(family => 
    family.name.toLowerCase().includes(term) ||
    family.description.toLowerCase().includes(term) ||
    family.metadata.tags.some(tag => tag.toLowerCase().includes(term))
  );
}