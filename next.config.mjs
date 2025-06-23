import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zhkodokuheeoalcrlems.supabase.co", // Domen Supabase
        pathname: "/storage/v1/object/public/uploads/**", // Allowed path
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
