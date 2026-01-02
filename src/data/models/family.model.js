/**
 * FAMILY MODEL - Boracity
 * Definición de la estructura de datos para familias de Revit
 * 
 * Este modelo sirve como:
 * 1. Documentación de qué datos necesitamos
 * 2. Base para validación futura
 * 3. Referencia para el equipo de desarrollo
 */

/**
 * Categorías principales de familias
 * Estas coinciden con las categorías de Revit
 */
export const FAMILY_CATEGORIES = {
  FURNITURE: 'furniture',
  DOORS: 'doors',
  WINDOWS: 'windows',
  LIGHTING: 'lighting',
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  STRUCTURAL: 'structural',
  SITE: 'site',
  SPECIALTY: 'specialty'
};

/**
 * Versiones de Revit soportadas
 */
export const REVIT_VERSIONS = [
  '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'
];

/**
 * Estructura de una Familia de Revit
 * 
 * @typedef {Object} Family
 * @property {string} id - ID único (slug-friendly para URLs)
 * @property {string} name - Nombre de la familia
 * @property {string} category - Categoría (usar FAMILY_CATEGORIES)
 * @property {string} description - Descripción completa
 * @property {Object} images - Imágenes de la familia
 * @property {string} images.thumbnail - Imagen principal (400x300)
 * @property {string[]} images.gallery - Galería de imágenes adicionales
 * @property {Object} file - Información del archivo
 * @property {string} file.size - Tamaño (ej: "245 KB")
 * @property {string[]} file.revitVersions - Versiones compatibles
 * @property {string} file.downloadUrl - URL de descarga
 * @property {Object} metadata - Metadatos SEO y adicionales
 * @property {string[]} metadata.tags - Tags para búsqueda
 * @property {string} metadata.author - Autor/creador
 * @property {Date} metadata.uploadDate - Fecha de subida
 * @property {number} metadata.downloads - Contador de descargas
 * @property {number} metadata.views - Contador de vistas
 * @property {Object} seo - Datos específicos para SEO
 * @property {string} seo.title - Título SEO (55-60 chars)
 * @property {string} seo.description - Meta descripción (150-160 chars)
 * @property {string[]} seo.keywords - Palabras clave
 */

/**
 * Función helper para validar estructura de familia
 * (Usaremos esto más adelante para validar datos de la API)
 */
export function validateFamily(family) {
  const required = ['id', 'name', 'category', 'description'];
  
  for (const field of required) {
    if (!family[field]) {
      throw new Error(`Campo requerido faltante: ${field}`);
    }
  }
  
  return true;
}

/**
 * Función helper para generar slug desde nombre
 */
export function generateFamilySlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos
    .replace(/[^\w\s-]/g, '') // Quita caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .trim();
}