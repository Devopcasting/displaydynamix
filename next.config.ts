import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow cross-origin requests from network IPs during development
  allowedDevOrigins: [
    'localhost:9002',
    '127.0.0.1:9002',
    'localhost:3000',
    '127.0.0.1:3000',
    // Allow common private network IPs
    '192.168.1.*',
    '192.168.0.*',
    '10.0.0.*',
    '10.0.1.*',
    '172.16.0.*',
    '172.16.1.*',
    '172.17.0.*',
    '172.18.0.*',
    '172.19.0.*',
    '172.20.0.*',
    '172.21.0.*',
    '172.22.0.*',
    '172.23.0.*',
    '172.24.0.*',
    '172.25.0.*',
    '172.26.0.*',
    '172.27.0.*',
    '172.28.0.*',
    '172.29.0.*',
    '172.30.0.*',
    '172.31.0.*',
  ],
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Apply CORS headers to API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGINS || 'http://localhost:9002,http://127.0.0.1:9002,http://localhost:3000,http://127.0.0.1:3000,http://192.168.0.0/16,http://10.0.0.0/8,http://172.16.0.0/12,*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: '/api/media/serve/:path*',
      },
    ];
  },
};

export default nextConfig;
