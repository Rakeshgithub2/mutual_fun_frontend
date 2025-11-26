/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable ALL development indicators (compiling, rendering messages, N button)
  devIndicators: false,
  // Disable Fast Refresh overlay for cleaner UX in development
  reactStrictMode: true,
};

export default nextConfig;
