// src/middleware.js
import { NextResponse } from 'next/server';

/**
 * MIDDLEWARE - Redirects 301 para URLs antiguas
 * 
 * Este middleware intercepta todas las URLs que coincidan con el patrón /family/:id
 * y las redirige a la nueva estructura /revit/:category/:slug
 * 
 * Por qué es importante:
 * - Mantiene el SEO de URLs antiguas ya indexadas por Google
 * - Redirect 301 = permanente (le dice a Google que actualice sus índices)
 * - Evita errores 404 para usuarios con links antiguos
 */

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Solo procesar URLs que empiecen con /family/
  if (pathname.startsWith('/family/')) {
    try {
      // Extraer el ID de la URL antigua
      // Ejemplo: /family/fam_001 → extraemos 'fam_001'
      const oldId = pathname.replace('/family/', '');
      
      // Importar dinámicamente los datos para obtener la familia
      const { mockFamilies } = await import('@/data/mock/families.mock');
      
      // Buscar la familia por su ID
      const family = mockFamilies.find(f => f.id === oldId);
      
      if (family) {
        // Si encontramos la familia, construir la nueva URL
        const newUrl = `/revit/${family.category}/${family.slug}`;
        
        // Crear la URL completa (con dominio)
        const redirectUrl = new URL(newUrl, request.url);
        
        // Retornar redirect 301 (permanente)
        return NextResponse.redirect(redirectUrl, {
          status: 301, // 301 = Moved Permanently (SEO friendly)
        });
      }
      
      // Si no encontramos la familia, dejar que Next.js maneje el 404
      // No hacemos nada aquí, Next.js mostrará la página not-found.js
      
    } catch (error) {
      console.error('Error in middleware redirect:', error);
      // En caso de error, continuar normal
    }
  }
  
  // Para todas las demás URLs, continuar normal
  return NextResponse.next();
}

/**
 * Config: Define qué URLs debe interceptar este middleware
 * 
 * matcher: Solo URLs que empiecen con /family/
 * Esto evita que el middleware se ejecute en TODAS las requests
 * (mejora el performance)
 */
export const config = {
  matcher: '/family/:path*',
};