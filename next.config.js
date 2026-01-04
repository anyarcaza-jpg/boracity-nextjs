/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Dominios permitidos para imágenes externas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Mock temporal (remover en producción)
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io', // ImageKit CDN
      },
    ],
    // Formatos modernos para mejor rendimiento
    formats: ['image/webp', 'image/avif'],
    // Tamaños optimizados para diferentes dispositivos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Tamaños para imágenes responsive
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Deshabilitar optimización para placeholder (temporal)
    unoptimized: true,
  },
}

module.exports = nextConfig