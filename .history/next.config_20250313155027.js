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