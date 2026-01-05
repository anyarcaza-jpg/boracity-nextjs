// src/lib/config.ts

/**
 * CONFIGURACIÓN GLOBAL - BORACITY
 * Variables de entorno y configuración centralizada
 */

interface Config {
  apiUrl: string;
  siteUrl: string;
  siteName: string;
  environment: 'development' | 'production' | 'test';
}

export const config: Config = {
  // URL de la API (cuando conectes tu backend)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // URL del sitio (para SEO y Schema.org)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://boracity.com',
  
  // Nombre del sitio
  siteName: 'Boracity',
  
  // Ambiente actual
  environment: (process.env.NODE_ENV as Config['environment']) || 'development',
};