/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 70000,
      };
      config.cache = {
        type: "filesystem",
      };
      config.parallelism = 5;
    }
    return config;
  },
  swcMinify: true,
  reactStrictMode:false,
};

export default nextConfig;
