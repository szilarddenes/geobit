/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure only App Router is used
  appDir: true,
  
  // Disable Pages Router for conflicting routes
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],
  
  // Don't use pages that conflict with app directory
  experimental: {
    // Warn about duplicate routes at build time
    strictRouteNamespaces: true,
  },
  
  // Redirect any attempts to access /pages/admin to /app/admin
  async redirects() {
    return [
      {
        source: '/pages/admin',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/pages/admin/:path*',
        destination: '/admin/:path*',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig
