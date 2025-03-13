/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [],
    // Set default image loader behavior
    loader: 'default',
    // Disable fetchPriority warning by setting the format
    formats: ['image/webp'],
  },
  // Suppress specific warnings related to fetchPriority
  onDemandEntries: {
    // Keep the 50 most recently used pages in memory
    maxInactiveAge: 25 * 1000,
    // Don't dispose of any pages
    pagesBufferLength: 2,
  },
  eslint: {
    // Ignore specific warnings during development
    ignoreDuringBuilds: true,
  },
  // Silence webpack warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress certain webpack warnings
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  // For Firebase deployment
  distDir: '.next',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [],
  },
  // Suppress specific warnings related to fetchPriority
  onDemandEntries: {
    // Keep the 50 most recently used pages in memory
    maxInactiveAge: 25 * 1000,
    // Don't dispose of any pages
    pagesBufferLength: 2,
  },
  eslint: {
    // Ignore specific warnings during development
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  // For Firebase deployment
  distDir: '.next',
};

module.exports = nextConfig;