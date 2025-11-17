/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
  // Disable Fast Refresh overlay for cleaner UX in development
  reactStrictMode: true,
};

export default nextConfig;
