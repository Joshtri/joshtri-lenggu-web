import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    disableStaticImages: true,
    remotePatterns:[
      {
        protocol: 'https',
        hostname: '**',
      },
    ]
  }
};

export default nextConfig;
