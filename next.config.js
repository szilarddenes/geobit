/** @type {import("next").NextConfig} */
const nextConfig = {
  // Custom webpack config
  webpack: (config, { dev, isServer }) => {
    // Add any custom webpack config here

    return config;
  },
}

module.exports = nextConfig
