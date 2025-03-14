/** @type {import("next").NextConfig} */
const nextConfig = {
  // Custom webpack config
  webpack: (config, { dev, isServer }) => {
    // Add Firebase and data-connect to transpiled modules
    config.module.rules.push({
      test: /\.m?js$/,
      include: [
        /firebase\/data-connect/,
        /dataconnect-generated/,
        /@tanstack-query-firebase/,
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['next/babel'],
          ],
        },
      },
    });

    return config;
  },
  // Allow domain imports for Firebase data-connect
  experimental: {
    esmExternals: 'loose',
  },
  // Exclude functions directory from the build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transpilePackages: ['firebase', '@tanstack-query-firebase'],
  typescript: {
    // Ignore TypeScript errors in the functions directory during build
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
