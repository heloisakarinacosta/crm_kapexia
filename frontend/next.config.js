/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // swcMinify: true, // Removido pois não é reconhecido/necessário no Next.js 15+
  reactStrictMode: false,
};

module.exports = nextConfig;

