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