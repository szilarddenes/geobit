/** @type {import("next").NextConfig} */
const nextConfig = {
  // Next.js compiler settings
  swcMinify: true,

  // Transpile Firebase modules
  transpilePackages: ['firebase'],

  // React Strict Mode - helps identify issues
  reactStrictMode: true,

  // Allow domain imports for Firebase
  experimental: {
    esmExternals: 'loose',
  },

  // TypeScript settings
  typescript: {
    // Ignore TypeScript errors in the functions directory during build
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
