import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        port: '',
      },
          {
        protocol: 'https',
        hostname: 'static.finnhub.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'static2.finnhub.io',
        port: '',
      },
    ]
  }
};

export default nextConfig;
