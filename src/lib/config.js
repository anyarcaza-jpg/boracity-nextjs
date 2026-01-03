// src/lib/config.js
/**
 * CONFIGURACIÓN CENTRALIZADA - Boracity
 * 
 * Este archivo centraliza todas las variables de entorno
 * para que sean fáciles de usar y mantener.
 * 
 * IMPORTANTE: Las variables con NEXT_PUBLIC_ son accesibles
 * desde el cliente (navegador), las demás solo en servidor.
 */

/**
 * Configuración de la aplicación
 * Lee las variables de entorno y proporciona valores por defecto
 */
export const config = {
  /**
   * URL de la API (para cuando conectes Strapi o tu backend)
   * Actualmente apunta a localhost, pero cambiará en producción
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  /**
   * URL del sitio web (para SEO, sitemap, Schema.org, etc.)
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  /**
   * Ambiente actual de ejecución
   */
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  /**
   * Configuración de Strapi CMS (futuro)
   */
  strapi: {
    url: process.env.STRAPI_API_URL || 'http://localhost:1337',
    apiKey: process.env.STRAPI_API_KEY || '',
  },
  
  /**
   * Configuración de Analytics (futuro)
   */
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || '',
  },
};

/**
 * Exportar por defecto para importación más limpia
 */
export default config;