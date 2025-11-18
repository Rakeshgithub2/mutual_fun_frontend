/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable development indicators (compiling, rendering messages)
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false, // Removes the "N" button indicator
    buildActivityPosition: "bottom-right",
  },
  // Disable strict mode to avoid React 19 hydration errors
  reactStrictMode: false,
  // Output standalone for better Vercel deployment
  output: "standalone",
};

export default nextConfig;
