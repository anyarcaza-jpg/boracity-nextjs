// src/lib/families.js
import { config } from './config'; // ← AGREGAR ESTA LÍNEA


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
 * 
 * FUTURO (con API):
 * const response = await fetch('/api/families');
 * return response.json();
 */
export async function getAllFamilies() {
  try {
    // Por ahora usamos datos mock
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
 * 
 * FUTURO (con API):
 * const response = await fetch(`/api/families/${id}`);
 * return response.json();
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
 * 
 * FUTURO (con API):
 * const response = await fetch(`/api/families?category=${category}`);
 * return response.json();
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
 * 
 * FUTURO (con API):
 * const response = await fetch(`/api/families/search?q=${searchTerm}`);
 * return response.json();
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
 * Útil para mostrar en homepage o dashboard
 * 
 * @returns {Promise<Object>} - Estadísticas del sitio
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
      .slice(0, 6) // Últimas 6 familias
  };
  
  return Promise.resolve(stats);
}

/**
 * Obtiene las familias más populares
 * 
 * @param {number} limit - Cantidad de familias a retornar
 * @returns {Promise<Array>} - Array de familias más descargadas
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
 * Útil para "Te puede interesar" en páginas de detalle
 * 
 * @param {string} familyId - ID de la familia actual
 * @param {number} limit - Cantidad de familias a retornar
 * @returns {Promise<Array>} - Array de familias relacionadas
 */
export async function getRelatedFamilies(familyId, limit = 4) {
  const currentFamily = getMockFamilyById(familyId);
  if (!currentFamily) {
    return Promise.resolve([]);
  }
  
  const families = getMockFamiliesByCategory(currentFamily.category);
  const related = families
    .filter(f => f.id !== familyId) // Excluir la familia actual
    .slice(0, limit);
  
  return Promise.resolve(related);
}