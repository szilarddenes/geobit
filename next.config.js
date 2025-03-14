/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure only App Router is used
  appDir: true,
  
  // Exclude certain pages directory paths that conflict with app directory
  // This prevents the conflict between src/pages/admin and src/app/admin
  excludeDefaultMomentLocales: true,
  
  // Configure routing
  async rewrites() {
    return [
      // Prioritize app router for admin routes
      {
        source: '/admin',
        destination: '/app/admin',
      },
      {
        source: '/admin/:path*',
        destination: '/app/admin/:path*',
      }
    ];
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
  
  // Only allow builds if there aren't conflicting routes
  onDemandEntries: {
    // Keep pages in memory longer during development
    maxInactiveAge: 300 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  },
  
  // Custom webpack config
  webpack: (config, { dev, isServer }) => {
    // Add any custom webpack config here

    return config;
  },
}

module.exports = nextConfig
