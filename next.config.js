/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    cacheComponents: false,
  },
};

module.exports = nextConfig;
