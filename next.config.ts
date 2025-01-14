import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // diabled eslint in build
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig
