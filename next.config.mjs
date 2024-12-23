/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      }
    ],
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
      },
      {
        source: '/cadastros',
        destination: '/cadastros/fabricas',
        permanent: false
      }
    ]
  }
};

export default nextConfig;
