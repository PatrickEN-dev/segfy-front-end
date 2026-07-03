/** @type {import('next').NextConfig} */
const DEFAULT_DEV_TARGET = "http://localhost:5000";

function resolveApiTarget() {
  const raw = process.env.SEGFY_API_URL?.trim();

  if (raw) {
    if (!/^https?:\/\//i.test(raw)) {
      throw new Error(
        `SEGFY_API_URL deve começar com http:// ou https:// (recebido: "${raw}").`,
      );
    }
    return raw.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SEGFY_API_URL não está definida. Configure a variável de ambiente no Vercel (Project Settings, Environment Variables) apontando para a URL pública do backend (ex.: https://<seu-app>.onrender.com).",
    );
  }

  return DEFAULT_DEV_TARGET;
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    const target = resolveApiTarget();
    return [
      { source: "/api/segfy/:path*", destination: `${target}/api/v1/:path*` },
      { source: "/api/segfy-health", destination: `${target}/health` },
    ];
  },
};

export default nextConfig;
