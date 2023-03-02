/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.scdn.co", "mosaic.scdn.co", "charts-images.scdn.co"],
  },
};

module.exports = nextConfig;
