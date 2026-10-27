const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/r/:slug",
        destination: `${BACKEND_URL}/r/:slug`,
      },
    ];
  },
};

export default nextConfig;
