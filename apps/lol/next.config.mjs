import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@1-blue/ui"],
  images: {
    remotePatterns: [
      {
        hostname: "ddragon.leagueoflegends.com",
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);

export default pwaConfig;
