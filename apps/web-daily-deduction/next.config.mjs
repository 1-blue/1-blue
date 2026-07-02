/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@1-blue/ui",
    "@1-blue/legal",
    "@1-blue/seo",
    "@1-blue/libs",
    "@1-blue/database",
    "@1-blue/api-client",
  ],
};

export default nextConfig;
