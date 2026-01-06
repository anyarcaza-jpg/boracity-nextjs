import type { Family, FamilyCategory } from '@/types';
/**
 * MOCK DATA - Familias de Revit para desarrollo
 * Estos datos simulan lo que vendrá de la API
 * Representan familias reales y profesionales
 * 
 * ✅ ACTUALIZADO: Usando imágenes reales de ImageKit
 */

import { FAMILY_CATEGORIES, REVIT_VERSIONS } from '../models/family.model';

/**
 * Datos mock de familias de Revit
 * Cada objeto representa una familia completa con todos sus datos
 */
export const mockFamilies = [
  // ============================================
  // FURNITURE - Muebles (2 familias reales)
  // ============================================
  {
    id: 'fam_001',
    slug: 'bar-chair-modern',
    name: 'ALUNVA Bar Chair - Modern Design',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'Modern bar chair with sleek design, perfect for kitchen islands and high counters. Features adjustable height, comfortable seating, and contemporary aesthetic. Fully parametric with multiple finish options.',
    images: {
      thumbnail: 'bar-chair.png',
      category: FAMILY_CATEGORIES.FURNITURE,
      gallery: []
    },
    file: {
      size: '245 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1], REVIT_VERSIONS[2]], // 2025, 2024, 2023
      downloadUrl: '/downloads/bar-chair-modern.rfa'
    },
    metadata: {
      tags: ['bar', 'chair', 'furniture', 'modern', 'kitchen', 'counter', 'seating'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-15'),
      downloads: 1247,
      views: 3891
    },
    seo: {
      title: 'Modern Bar Chair - Free Revit Family | Boracity',
      description: 'Download free modern bar chair Revit family. Perfect for kitchen islands and counters. Fully parametric. Compatible with Revit 2023-2025.',
      keywords: ['bar chair revit family', 'modern bar stool bim', 'kitchen furniture', 'revit seating', 'counter chair']
    }
  },
  
  {
    id: 'fam_002',
    slug: 'armchair-ottoman-set',
    name: 'Armchair 78 with Ottoman - Living Room Set',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'Elegant armchair with matching ottoman, perfect for living rooms and lounges. Features comfortable cushioning, premium fabric options, and classic design. Ideal for residential and hospitality projects.',
    images: {
      thumbnail: 'armchair-ottoman.png',
      category: FAMILY_CATEGORIES.FURNITURE,
      gallery: []
    },
    file: {
      size: '312 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1], REVIT_VERSIONS[2], REVIT_VERSIONS[3]], // 2025-2022
      downloadUrl: '/downloads/armchair-ottoman-set.rfa'
    },
    metadata: {
      tags: ['armchair', 'ottoman', 'furniture', 'living room', 'lounge', 'residential', 'hospitality'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-01'),
      downloads: 892,
      views: 2134
    },
    seo: {
      title: 'Armchair with Ottoman - Free Revit Family | Living Room',
      description: 'Elegant armchair and ottoman set Revit family. Perfect for living rooms and lounges. Free download with multiple fabric options.',
      keywords: ['armchair revit family', 'ottoman bim', 'living room furniture', 'lounge chair revit', 'residential furniture']
    }
  },

  // ============================================
  // DOORS - Puertas (2 familias reales)
  // ============================================
  {
    id: 'fam_003',
    slug: 'exterior-door-two-lite-single',
    name: 'Exterior Door - Two Lite Single',
    category: FAMILY_CATEGORIES.DOORS,
    description: 'Exterior single door with two glass lites for natural light. Perfect for residential entrances, back doors, and patio access. Features weather stripping, insulated core, and multiple finish options.',
    images: {
      thumbnail: 'exterior-door-two-lite.png',
      category: FAMILY_CATEGORIES.DOORS,
      gallery: []
    },
    file: {
      size: '189 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 5), // 2025-2021
      downloadUrl: '/downloads/exterior-door-two-lite-single.rfa'
    },
    metadata: {
      tags: ['door', 'exterior', 'single door', 'two lite', 'glass', 'residential', 'entry'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-10'),
      downloads: 2134,
      views: 5678
    },
    seo: {
      title: 'Exterior Two Lite Door - Free Revit Family | Single Entry',
      description: 'Download free exterior single door with two glass lites. Perfect for residential entrances. Parametric Revit family with weather sealing.',
      keywords: ['exterior door revit', 'two lite door family', 'entry door bim', 'residential door', 'glass door revit']
    }
  },

  {
    id: 'fam_004',
    slug: 'exterior-door-glass-wood-clad',
    name: 'Exterior Entry Door - Half Glass Wood Clad',
    category: FAMILY_CATEGORIES.DOORS,
    description: 'Modern exterior entry door with half glass panel and wood cladding. Combines natural aesthetics with functionality. Features energy-efficient glazing, solid wood construction, and contemporary design.',
    images: {
      thumbnail: 'exterior-door-glass-wood.png',
      category: FAMILY_CATEGORIES.DOORS,
      gallery: []
    },
    file: {
      size: '367 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 4), // 2025-2022
      downloadUrl: '/downloads/exterior-door-glass-wood-clad.rfa'
    },
    metadata: {
      tags: ['door', 'exterior', 'glass', 'wood', 'entry', 'modern', 'residential'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-05'),
      downloads: 1456,
      views: 3421
    },
    seo: {
      title: 'Exterior Glass Wood Door - Free Revit Family | Modern Entry',
      description: 'Modern exterior entry door with half glass and wood cladding. Energy-efficient, contemporary design. Free Revit family download.',
      keywords: ['glass wood door revit', 'exterior entry door bim', 'modern door family', 'residential entrance', 'wood clad door']
    }
  },

  // ============================================
  // WINDOWS - Ventanas (2 familias reales)
  // ============================================
  {
    id: 'fam_005',
    slug: 'awning-window-triple-vertical',
    name: 'Awning Window - Triple Vertical Configuration',
    category: FAMILY_CATEGORIES.WINDOWS,
    description: 'Triple vertical awning window configuration for maximum ventilation and natural light. Features energy-efficient glazing, smooth operation, and modern aesthetic. Perfect for contemporary residential projects.',
    images: {
      thumbnail: 'awning-window-triple.png',
      category: FAMILY_CATEGORIES.WINDOWS,
      gallery: []
    },
    file: {
      size: '278 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 6), // 2025-2020
      downloadUrl: '/downloads/awning-window-triple-vertical.rfa'
    },
    metadata: {
      tags: ['window', 'awning', 'triple', 'vertical', 'residential', 'energy efficient', 'modern'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-25'),
      downloads: 1789,
      views: 4234
    },
    seo: {
      title: 'Triple Awning Window - Free Revit Family | Vertical Config',
      description: 'Energy-efficient triple vertical awning window Revit family. Perfect for modern homes. Free download with parametric sizing.',
      keywords: ['awning window revit', 'triple window bim', 'vertical window family', 'residential window', 'energy efficient window']
    }
  },

  {
    id: 'fam_006',
    slug: 'casement-window-double-sidelight',
    name: 'Casement Window - Double with Sidelight',
    category: FAMILY_CATEGORIES.WINDOWS,
    description: 'Double casement window with fixed sidelight panel. Provides excellent ventilation and views while maintaining energy efficiency. Features high-performance glazing and durable construction.',
    images: {
      thumbnail: 'casement-window-double.png',
      category: FAMILY_CATEGORIES.WINDOWS,
      gallery: []
    },
    file: {
      size: '321 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 4), // 2025-2022
      downloadUrl: '/downloads/casement-window-double-sidelight.rfa'
    },
    metadata: {
      tags: ['window', 'casement', 'double', 'sidelight', 'residential', 'ventilation', 'modern'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-10'),
      downloads: 934,
      views: 2156
    },
    seo: {
      title: 'Double Casement Window with Sidelight - Free Revit Family',
      description: 'Double casement window with sidelight panel. Energy-efficient, excellent ventilation. Free Revit family for residential projects.',
      keywords: ['casement window revit', 'double window bim', 'sidelight window family', 'residential window', 'ventilation window']
    }
  },

  // ============================================
  // LIGHTING - Iluminación (2 familias reales)
  // ============================================
  {
    id: 'fam_007',
    slug: 'ceiling-lamp-modern-pendant',
    name: 'Ceiling Lamp - Modern Pendant',
    category: FAMILY_CATEGORIES.LIGHTING,
    description: 'Contemporary ceiling pendant lamp with elegant design. Perfect for dining rooms, living areas, and commercial spaces. Features adjustable cable length and multiple finish options.',
    images: {
      thumbnail: 'ceiling-lamp.png',
      category: FAMILY_CATEGORIES.LIGHTING,
      gallery: []
    },
    file: {
      size: '156 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 5), // 2025-2021
      downloadUrl: '/downloads/ceiling-lamp-modern-pendant.rfa'
    },
    metadata: {
      tags: ['lighting', 'pendant', 'ceiling', 'modern', 'dining', 'decorative', 'residential'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-30'),
      downloads: 2456,
      views: 6123
    },
    seo: {
      title: 'Modern Ceiling Pendant Lamp - Free Revit Family',
      description: 'Contemporary pendant ceiling lamp Revit family. Adjustable height, multiple finishes. Perfect for dining and living areas. Free download.',
      keywords: ['pendant lamp revit', 'ceiling light bim', 'modern lighting family', 'dining room light', 'decorative pendant']
    }
  },

  {
    id: 'fam_008',
    slug: 'ceiling-fan-with-light',
    name: 'Ceiling Fan with Integrated Light',
    category: FAMILY_CATEGORIES.LIGHTING,
    description: 'Ceiling fan with integrated lighting fixture. Combines air circulation with illumination. Features reversible motor, multiple speed settings, and energy-efficient LED lights. Perfect for residential and commercial spaces.',
    images: {
      thumbnail: 'ceiling-fan.png',
      category: FAMILY_CATEGORIES.LIGHTING,
      gallery: []
    },
    file: {
      size: '234 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 4), // 2025-2022
      downloadUrl: '/downloads/ceiling-fan-with-light.rfa'
    },
    metadata: {
      tags: ['lighting', 'ceiling fan', 'fan', 'LED', 'residential', 'commercial', 'ventilation'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-15'),
      downloads: 1678,
      views: 3892
    },
    seo: {
      title: 'Ceiling Fan with Light - Free Revit Family | LED Integrated',
      description: 'Ceiling fan with integrated LED lighting Revit family. Energy-efficient, multiple speeds. Free download for residential and commercial.',
      keywords: ['ceiling fan revit', 'fan with light bim', 'LED fan family', 'residential fan', 'ventilation lighting']
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
export function getFamilyById(id: string): Family | null {
  return mockFamilies.find(f => f.id === id) || null;
}

/**
 * Función para obtener familias por categoría
 */
export function getFamiliesByCategory(category: FamilyCategory): Family[] {
  return mockFamilies.filter(family => family.category === category);
}

/**
 * Función para buscar familias por término
 */
export function searchFamilies(searchTerm: string): Family[] {
  const term = searchTerm.toLowerCase();
  return mockFamilies.filter(family => 
    family.name.toLowerCase().includes(term) ||
    family.description.toLowerCase().includes(term) ||
    family.metadata.tags.some(tag => tag.toLowerCase().includes(term))
  );
}