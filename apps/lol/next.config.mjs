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

export default nextConfig;
