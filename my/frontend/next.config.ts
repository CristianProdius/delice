import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.delice.my',
      },
      {
        protocol: 'https',
        hostname: 'cdn.delice.my',
      },
    ],
    qualities: [50, 75, 90, 100],
  },
};

export default withNextIntl(nextConfig);
