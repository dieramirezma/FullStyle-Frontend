import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // diabled eslint in build
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com' // <--- Agrega el dominio aquí
      }
    ]
  }
}

export default nextConfig
