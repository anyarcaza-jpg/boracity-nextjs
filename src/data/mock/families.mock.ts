import type { Family, FamilyCategory } from '@/types';
import { FAMILY_CATEGORIES, REVIT_VERSIONS } from '../models/family.model';

const IMAGEKIT_BASE = 'https://ik.imagekit.io/nbqxh22tq/revit';

export const mockFamilies = [
  {
    id: 'fam_001',
    slug: 'bar-chair-modern',
    name: 'ALUNVA Bar Chair - Modern Design',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'Modern bar chair with sleek design, perfect for kitchen islands and high counters.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/furniture/bar-chair.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.FURNITURE,
      gallery: []
    },
    file: {
      size: '245 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1], REVIT_VERSIONS[2]],
      downloadUrl: '/downloads/bar-chair-modern.rfa'
    },
    metadata: {
      tags: ['bar', 'chair', 'furniture', 'modern', 'kitchen'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-15'),
      downloads: 1247,
      views: 3891
    },
    seo: {
      title: 'Modern Bar Chair - Free Revit Family | Boracity',
      description: 'Download free modern bar chair Revit family.',
      keywords: ['bar chair revit family', 'modern bar stool bim']
    }
  },
  {
    id: 'fam_002',
    slug: 'armchair-ottoman-set',
    name: 'Armchair 78 with Ottoman',
    category: FAMILY_CATEGORIES.FURNITURE,
    description: 'Elegant armchair with matching ottoman, perfect for living rooms.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/furniture/armchair-ottoman.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.FURNITURE,
      gallery: []
    },
    file: {
      size: '312 KB',
      revitVersions: [REVIT_VERSIONS[0], REVIT_VERSIONS[1]],
      downloadUrl: '/downloads/armchair-ottoman-set.rfa'
    },
    metadata: {
      tags: ['armchair', 'ottoman', 'furniture', 'living room'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-01'),
      downloads: 892,
      views: 2134
    },
    seo: {
      title: 'Armchair with Ottoman - Free Revit Family',
      description: 'Elegant armchair set for living rooms.',
      keywords: ['armchair revit family', 'ottoman']
    }
  },
  {
    id: 'fam_003',
    slug: 'exterior-door-two-lite',
    name: 'Exterior Door - Two Lite',
    category: FAMILY_CATEGORIES.DOORS,
    description: 'Exterior door with two glass lites for natural light.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/doors/exterior-door-two-lite.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.DOORS,
      gallery: []
    },
    file: {
      size: '189 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 3),
      downloadUrl: '/downloads/exterior-door-two-lite.rfa'
    },
    metadata: {
      tags: ['door', 'exterior', 'glass', 'two lite'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-10'),
      downloads: 2134,
      views: 5678
    },
    seo: {
      title: 'Exterior Two Lite Door - Free Revit Family',
      description: 'Download free exterior door with glass lites.',
      keywords: ['exterior door revit', 'two lite door']
    }
  },
  {
    id: 'fam_004',
    slug: 'exterior-door-glass-wood',
    name: 'Exterior Glass Wood Door',
    category: FAMILY_CATEGORIES.DOORS,
    description: 'Modern exterior door with glass and wood cladding.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/doors/exterior-door-glass-wood.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.DOORS,
      gallery: []
    },
    file: {
      size: '367 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 3),
      downloadUrl: '/downloads/exterior-door-glass-wood.rfa'
    },
    metadata: {
      tags: ['door', 'exterior', 'glass', 'wood'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-05'),
      downloads: 1456,
      views: 3421
    },
    seo: {
      title: 'Glass Wood Door - Free Revit Family',
      description: 'Modern exterior door with glass and wood.',
      keywords: ['glass door revit', 'wood door']
    }
  },
  {
    id: 'fam_005',
    slug: 'awning-window-triple',
    name: 'Awning Window - Triple Vertical',
    category: FAMILY_CATEGORIES.WINDOWS,
    description: 'Triple vertical awning window for maximum ventilation.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/windows/awning-window-triple.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.WINDOWS,
      gallery: []
    },
    file: {
      size: '278 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 3),
      downloadUrl: '/downloads/awning-window-triple.rfa'
    },
    metadata: {
      tags: ['window', 'awning', 'triple', 'vertical'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-25'),
      downloads: 1789,
      views: 4234
    },
    seo: {
      title: 'Triple Awning Window - Free Revit Family',
      description: 'Energy-efficient triple awning window.',
      keywords: ['awning window revit', 'triple window']
    }
  },
  {
    id: 'fam_006',
    slug: 'casement-window-double',
    name: 'Casement Window - Double',
    category: FAMILY_CATEGORIES.WINDOWS,
    description: 'Double casement window with excellent ventilation.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/windows/casement-window-double.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.WINDOWS,
      gallery: []
    },
    file: {
      size: '321 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 3),
      downloadUrl: '/downloads/casement-window-double.rfa'
    },
    metadata: {
      tags: ['window', 'casement', 'double'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-10'),
      downloads: 934,
      views: 2156
    },
    seo: {
      title: 'Double Casement Window - Free Revit Family',
      description: 'Double casement window for residential projects.',
      keywords: ['casement window revit', 'double window']
    }
  },
  {
    id: 'fam_007',
    slug: 'ceiling-lamp-modern',
    name: 'Ceiling Lamp - Modern Pendant',
    category: FAMILY_CATEGORIES.LIGHTING,
    description: 'Contemporary ceiling pendant lamp with elegant design.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/lighting/ceiling-lamp.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.LIGHTING,
      gallery: []
    },
    file: {
      size: '156 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 3),
      downloadUrl: '/downloads/ceiling-lamp-modern.rfa'
    },
    metadata: {
      tags: ['lighting', 'pendant', 'ceiling', 'modern'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-01-30'),
      downloads: 2456,
      views: 6123
    },
    seo: {
      title: 'Modern Ceiling Pendant Lamp - Free Revit Family',
      description: 'Contemporary pendant ceiling lamp.',
      keywords: ['pendant lamp revit', 'ceiling light']
    }
  },
  {
    id: 'fam_008',
    slug: 'ceiling-fan-light',
    name: 'Ceiling Fan with Integrated Light',
    category: FAMILY_CATEGORIES.LIGHTING,
    description: 'Ceiling fan with integrated lighting fixture.',
    images: {
      thumbnail: `${IMAGEKIT_BASE}/lighting/ceiling-fan.png?tr=w-400,q-80,f-auto`,
      category: FAMILY_CATEGORIES.LIGHTING,
      gallery: []
    },
    file: {
      size: '234 KB',
      revitVersions: REVIT_VERSIONS.slice(0, 3),
      downloadUrl: '/downloads/ceiling-fan-light.rfa'
    },
    metadata: {
      tags: ['lighting', 'ceiling fan', 'fan', 'LED'],
      author: 'Boracity Team',
      uploadDate: new Date('2024-02-15'),
      downloads: 1678,
      views: 3892
    },
    seo: {
      title: 'Ceiling Fan with Light - Free Revit Family',
      description: 'Fan with integrated LED lighting.',
      keywords: ['ceiling fan revit', 'fan with light']
    }
  }
];

export function getAllFamilies() {
  return mockFamilies;
}

export function getFamilyById(id: string): Family | null {
  return mockFamilies.find(f => f.id === id) || null;
}

export function getFamiliesByCategory(category: FamilyCategory): Family[] {
  return mockFamilies.filter(family => family.category === category);
}

export function searchFamilies(searchTerm: string): Family[] {
  const term = searchTerm.toLowerCase();
  return mockFamilies.filter(family => 
    family.name.toLowerCase().includes(term) ||
    family.description.toLowerCase().includes(term) ||
    family.metadata.tags.some(tag => tag.toLowerCase().includes(term))
  );
}