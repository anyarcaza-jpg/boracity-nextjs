// src/types/index.ts

/**
 * TIPOS GLOBALES - BORACITY
 * Todos los tipos TypeScript del proyecto
 */

// ============================================
// CATEGORÍAS
// ============================================

export type FamilyCategory = 
  | 'furniture' 
  | 'doors' 
  | 'windows' 
  | 'lighting';

export type ProductType = 
  | 'revit' 
  | 'sketchup' 
  | 'd5render' 
  | 'textures';

// ============================================
// FAMILY - Modelo principal
// ============================================

export interface Family {
  id: string;
  slug: string;
  name: string;
  category: FamilyCategory;
  description: string;
  images: FamilyImages;
  file: FamilyFile;
  metadata: FamilyMetadata;
  seo: FamilySEO;
}

export interface FamilyImages {
  thumbnail: string;
  gallery: string[];
}

export interface FamilyFile {
  size: string;
  revitVersions: string[];
  downloadUrl: string;
}

export interface FamilyMetadata {
  tags: string[];
  author: string;
  uploadDate: Date;
  downloads: number;
  views: number;
}

export interface FamilySEO {
  title: string;
  description: string;
  keywords: string[];
}

// ============================================
// STATS - Estadísticas
// ============================================

export interface FamilyStats {
  totalFamilies: number;
  totalDownloads: number;
  totalViews: number;
  categoriesCount: number;
  recentlyAdded: Family[];
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = Promise<T>;

// ============================================
// API RESPONSE (para cuando conectes tu API)
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}