// src/lib/db/adapters.ts

import type { Family, FamilyCategory } from '@/types';

/**
 * ADAPTER LAYER - Conversión DB ↔ Frontend
 * 
 * ¿Por qué necesitamos esto?
 * 
 * DATABASE (flat structure):
 *   { thumbnail_url: "...", file_url: "...", downloads: 123 }
 * 
 * FRONTEND (nested structure):
 *   { images: { thumbnail: "..." }, file: { downloadUrl: "..." } }
 * 
 * El adapter traduce entre ambos formatos sin romper el código existente.
 */

// ============================================
// TIPOS DE BASE DE DATOS
// ============================================

/**
 * Row tal como viene de PostgreSQL
 * (estructura flat/plana)
 */
export interface FamilyRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  thumbnail_url: string;
  file_url: string;
  file_size: string;
  downloads: number;
  views: number;
  author: string;
  tags: string[];
  revit_versions: string[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Convierte un registro de la base de datos al formato que espera el frontend
 * 
 * ¿Por qué necesitamos esto?
 * - La DB tiene estructura "flat" (todos los campos al mismo nivel)
 * - El frontend espera estructura "nested" (objetos anidados)
 * - Este adapter traduce entre ambos formatos
 * 
 * Ejemplo:
 * DB tiene: thumbnail_url, file_url, downloads
 * Frontend espera: { images: { thumbnail }, file: { url }, metadata: { downloads } }
 */

export function dbRowToFamily(row: any): Family {
  return {
    id: row.id, // ✅ UUID real de la base de datos
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description || '',
    
    images: {
      thumbnail: row.thumbnail_url || '',
      category: row.category,
      gallery: [], // Se llena desde family_images en página de detalle
    },
    
    file: {
      size: row.file_size || '0 KB',
      revitVersions: row.revit_versions || ['2025', '2024', '2023'],
      downloadUrl: row.file_url || '',
    },
    
    metadata: {
      tags: row.tags || [],
      author: row.author || 'Boracity Team',
      uploadDate: new Date(row.created_at),
      downloads: row.downloads || 0,
      views: row.views || 0,
    },
    
    seo: {
      title: `${row.name} - Free Revit Family | Boracity`,
      description: row.description || '',
      keywords: row.tags || [],
    },
  };
}