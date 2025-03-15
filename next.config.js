/** @type {import("next").NextConfig} */
const nextConfig = {
  // Transpile Firebase modules
  transpilePackages: ['firebase'],

  // React Strict Mode - helps identify issues
  reactStrictMode: true,

  // Allow domain imports for Firebase
  experimental: {
    esmExternals: 'loose',
  },

  // Temporarily disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Temporarily disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig
