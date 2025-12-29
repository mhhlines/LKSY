/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    GITHUB_OWNER: process.env.GITHUB_OWNER || 'mhhlines',
    GITHUB_REPO: process.env.GITHUB_REPO || 'LKSY',
  },
  images: {
    unoptimized: true, // Disable image optimization to avoid issues with static images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

