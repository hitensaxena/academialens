/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    // This makes sure that path aliases in tsconfig.json work with webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  // Optional: Configure images if you're using Next.js Image component
  images: {
    domains: ['localhost'], // Add your image domains here
  },
};

module.exports = nextConfig;
