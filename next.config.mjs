import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.wasabisys.com",
        pathname: "/dentapro/**",
      },
      {
        protocol: "https",
        hostname: "dentapro.s3.us-east-1.wasabisys.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    WASABI_BUCKET_NAME: process.env.WASABI_BUCKET_NAME,
    WASABI_ENDPOINT: process.env.WASABI_ENDPOINT,
    WASABI_ACCESS_KEY: process.env.WASABI_ACCESS_KEY,
    WASABI_SECRET_KEY: process.env.WASABI_SECRET_KEY,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
