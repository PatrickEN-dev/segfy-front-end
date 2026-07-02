/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    const target = (
      process.env.SEGFY_API_URL ?? "http://localhost:5000"
    ).replace(/\/$/, "");
    return [
      { source: "/api/segfy/:path*", destination: `${target}/api/v1/:path*` },
      { source: "/api/segfy-health", destination: `${target}/health` },
    ];
  },
};

export default nextConfig;
