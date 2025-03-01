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
        hostname: 'pub-d585d94603de45d289b5d891f8c5d079.r2.dev'
      }
    ]
  }
}

export default nextConfig
