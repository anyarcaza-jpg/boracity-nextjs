// src/lib/families.js
import { config } from './config';

/**
 * FAMILIES SERVICE - Boracity
 * Capa de abstracción para obtener datos de familias
 * 
 * IMPORTANTE: Este archivo es el único que importa los datos mock
 * Cuando conectemos la API, solo modificaremos este archivo
 * y el resto del código seguirá funcionando sin cambios
 */

import { 
  getAllFamilies as getMockFamilies,
  getFamilyById as getMockFamilyById,
  getFamiliesByCategory as getMockFamiliesByCategory,
  searchFamilies as searchMockFamilies
} from '@/data/mock/families.mock';

/**
 * Obtiene todas las familias
 * 
 * @returns {Promise<Array>} - Array de familias
 */
export async function getAllFamilies() {
  try {
    const families = getMockFamilies();
    return families;
  } catch (error) {
    console.error('Error fetching families:', error);
    return [];
  }
}

/**
 * Obtiene una familia específica por su ID
 * 
 * @param {string} id - ID de la familia (slug)
 * @returns {Promise<Object|null>} - Familia encontrada o null
 */
export async function getFamilyById(id) {
  try {
    if (!id) throw new Error('ID is required');
    const family = getMockFamilyById(id);
    if (!family) throw new Error(`Family not found: ${id}`);
    return family;
  } catch (error) {
    console.error('Error fetching family:', error);
    return null;
  }
}

/**
 * Obtiene familias por categoría
 * 
 * @param {string} category - Categoría (usar FAMILY_CATEGORIES)
 * @returns {Promise<Array>} - Array de familias de esa categoría
 */
export async function getFamiliesByCategory(category) {
  try {
    if (!category) throw new Error('Category is required');
    const families = getMockFamiliesByCategory(category);
    return families;
  } catch (error) {
    console.error('Error fetching families by category:', error);
    return [];
  }
}

/**
 * Busca familias por término de búsqueda
 * 
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} - Array de familias que coinciden
 */
export async function searchFamilies(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }
    const results = searchMockFamilies(searchTerm);
    return results;
  } catch (error) {
    console.error('Error searching families:', error);
    return [];
  }
}

/**
 * Obtiene estadísticas generales
 */
export async function getFamiliesStats() {
  const families = getMockFamilies();
  
  const stats = {
    totalFamilies: families.length,
    totalDownloads: families.reduce((sum, f) => sum + f.metadata.downloads, 0),
    totalViews: families.reduce((sum, f) => sum + f.metadata.views, 0),
    categoriesCount: new Set(families.map(f => f.category)).size,
    recentlyAdded: families
      .sort((a, b) => b.metadata.uploadDate - a.metadata.uploadDate)
      .slice(0, 6)
  };
  
  return Promise.resolve(stats);
}

/**
 * Obtiene las familias más populares
 */
export async function getPopularFamilies(limit = 6) {
  const families = getMockFamilies();
  const popular = families
    .sort((a, b) => b.metadata.downloads - a.metadata.downloads)
    .slice(0, limit);
  
  return Promise.resolve(popular);
}

/**
 * Obtiene familias relacionadas (por categoría)
 */
export async function getRelatedFamilies(familyId, limit = 4) {
  const currentFamily = getMockFamilyById(familyId);
  if (!currentFamily) {
    return Promise.resolve([]);
  }
  
  const families = getMockFamiliesByCategory(currentFamily.category);
  const related = families
    .filter(f => f.id !== familyId)
    .slice(0, limit);
  
  return Promise.resolve(related);
}

/**
 * Obtiene una familia por categoría y slug
 * Nueva estructura: /revit/[category]/[slug]
 * 
 * @param {string} category - Categoría (furniture, doors, windows, lighting)
 * @param {string} slug - Slug de la familia
 * @returns {Promise<Object|null>} - Familia encontrada o null
 */
export async function getFamilyBySlug(category, slug) {
  try {
    if (!category || !slug) {
      throw new Error('Category and slug are required');
    }
    
    const families = getMockFamiliesByCategory(category);
    const family = families.find(f => f.slug === slug);
    
    if (!family) {
      console.warn(`Family not found: ${category}/${slug}`);
      return null;
    }
    
    return family;
  } catch (error) {
    console.error('Error fetching family by slug:', error);
    return null;
  }

}

/**
 * Obtiene una familia por su ID (para redirects)
 * Usada por el middleware para convertir URLs antiguas
 * 
 * @param {string} id - ID de la familia
 * @returns {Promise<Object|null>} - Familia con category y slug
 */
export async function getFamilyByIdForRedirect(id) {
  try {
    if (!id) {
      throw new Error('ID is required');
    }
    
    const families = getMockFamilies();
    const family = families.find(f => f.id === id);
    
    if (!family) {
      console.warn(`Family not found for redirect: ${id}`);
      return null;
    }
    
    // Retornar solo lo necesario para el redirect
    return {
      category: family.category,
      slug: family.slug
    };
  } catch (error) {
    console.error('Error fetching family for redirect:', error);
    return null;
  }
}
