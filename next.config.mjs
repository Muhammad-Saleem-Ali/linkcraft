/** @type {import('next').NextConfig} */
const nextConfig = {
  // If an external backend is explicitly provided via BACKEND_INTERNAL_URL, proxy to it.
  // Otherwise, all /api/* and /r/* routes are handled directly by native Next.js route handlers!
  async rewrites() {
    if (!process.env.BACKEND_INTERNAL_URL) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_INTERNAL_URL}/api/:path*`,
      },
      {
        source: "/r/:slug",
        destination: `${process.env.BACKEND_INTERNAL_URL}/r/:slug`,
      },
    ];
  },
};

export default nextConfig;
