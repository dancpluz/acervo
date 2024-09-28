/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/crm',
        destination: '/crm/propostas',
        permanent: false
      },
      {
        source: '/pedidos',
        destination: '/crm/pedidos',
        permanent: false
      },
      {
        source: '/propostas',
        destination: '/crm/propostas',
        permanent: false
      }
    ]
  }
};

export default nextConfig;
