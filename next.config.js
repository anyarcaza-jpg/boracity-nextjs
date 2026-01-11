// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',  // ← AGREGAR ESTA LÍNEA
      },
    ],
  },
}

module.exports = nextConfig