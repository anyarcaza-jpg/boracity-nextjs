// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE - Redirects 301 para URLs antiguas
 * 
 * Este middleware intercepta todas las URLs que coincidan con el patrón /family/:id
 * y las redirige a la nueva estructura /revit/:category/:slug
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Solo procesar URLs que empiecen con /family/
  if (pathname.startsWith('/family/')) {
    try {
      // Extraer el ID de la URL antigua
      const oldId = pathname.replace('/family/', '');
      
      // Importar dinámicamente los datos
      const { mockFamilies } = await import('@/data/mock/families.mock');
      
      // Buscar la familia por su ID
      const family = mockFamilies.find(f => f.id === oldId);
      
      if (family) {
        // Construir la nueva URL
        const newUrl = `/revit/${family.category}/${family.slug}`;
        const redirectUrl = new URL(newUrl, request.url);
        
        // Retornar redirect 301 (permanente)
        return NextResponse.redirect(redirectUrl, {
          status: 301,
        });
      }
      
    } catch (error) {
      console.error('Error in middleware redirect:', error);
    }
  }
  
  // Para todas las demás URLs, continuar normal
  return NextResponse.next();
}

export const config = {
  matcher: '/family/:path*',
};