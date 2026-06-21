/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@1-blue/ui", "@1-blue/core", "@1-blue/legal", "@1-blue/libs"],
  images: { unoptimized: true },
};

export default nextConfig;
