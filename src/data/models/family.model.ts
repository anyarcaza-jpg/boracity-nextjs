// src/data/models/family.model.ts

/**
 * FAMILY MODEL - BORACITY
 * Constantes y validaciones para el modelo Family
 */

import type { FamilyCategory } from '@/types';

// Categorías válidas
export const FAMILY_CATEGORIES: Record<string, FamilyCategory> = {
  FURNITURE: 'furniture',
  DOORS: 'doors',
  WINDOWS: 'windows',
  LIGHTING: 'lighting',
} as const;

// Lista de categorías (para iteración)
export const CATEGORY_LIST: FamilyCategory[] = [
  'furniture',
  'doors',
  'windows',
  'lighting',
];

// Metadata de categorías (para SEO y UI)
export const CATEGORY_METADATA: Record<FamilyCategory, { name: string; icon: string; description: string }> = {
  furniture: {
    name: 'Furniture',
    icon: 'fa-couch',
    description: 'Chairs, desks, tables and office furniture'
  },
  doors: {
    name: 'Doors',
    icon: 'fa-door-open',
    description: 'Interior and exterior doors'
  },
  windows: {
    name: 'Windows',
    icon: 'fa-window-maximize',
    description: 'Casement, sliding and fixed windows'
  },
  lighting: {
    name: 'Lighting',
    icon: 'fa-lightbulb',
    description: 'LED, recessed and pendant lights'
  },
};

// Versiones de Revit soportadas
export const REVIT_VERSIONS: string[] = [
  '2025',
  '2024', 
  '2023',
  '2022',
  '2021',
  '2020',
];