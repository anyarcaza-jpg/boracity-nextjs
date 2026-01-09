/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // OPTIMIZACIÓN DE IMÁGENES
  // ============================================
  images: {
    // CDNs permitidos (ImageKit + placeholders temporales)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Temporal - puedes remover después
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io', // ✅ Tu ImageKit CDN
      },
    ],
    
    // Formatos modernos (WebP/AVIF son más ligeros que JPG/PNG)
    formats: ['image/webp', 'image/avif'],
    
    // Tamaños para diferentes dispositivos (responsive)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Caché de imágenes optimizadas (1 año)
    minimumCacheTTL: 31536000,
    qualities: [75, 85, 90],
  },

  // ============================================
  // HEADERS DE CACHÉ
  // (Esto hace que el navegador guarde imágenes/fuentes por mucho tiempo)
  // ============================================
  async headers() {
    return [
      // 👇 BLOQUE NUEVO - Security headers
    {
      source: '/:path*',  // Aplica a TODAS las páginas
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
      key: 'X-Content-Type-Options',
      value: 'nosniff'
        },
        {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains; preload'
        },
        {
       key: 'Referrer-Policy',
       value: 'origin-when-cross-origin'
        },
        {
       key: 'Permissions-Policy',
       value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
        },
        {
       key: 'Content-Security-Policy',
       value: [
    "default-src 'self'",                    // Todo viene de tu dominio por defecto
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Scripts: tu dominio + Next.js necesita unsafe
    "style-src 'self' 'unsafe-inline'",      // CSS: tu dominio + Tailwind necesita inline
    "img-src 'self' data: https://ik.imagekit.io https://via.placeholder.com",  // Imágenes: tu dominio + CDNs
    "font-src 'self' data:",                 // Fuentes: tu dominio + data URLs
    "connect-src 'self' https://api.boracity.com",  // APIs: tu dominio + tu API futura
    "frame-ancestors 'none'",                // No permitir iframes (refuerza X-Frame-Options)
    "base-uri 'self'",                       // Tag <base> solo puede ser tu dominio
    "form-action 'self'"                     // Formularios solo pueden enviar a tu dominio
      ].join('; ')
       },
       {
       key: 'X-XSS-Protection',
       value: '1; mode=block'
}       
      ]
    },
      // Headers para imágenes
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Headers para fuentes
      {
        source: '/:all*(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig