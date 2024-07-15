/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        worker_threads: false,
        module: false,
      };
    }

    return config;
  },
};

export default nextConfig;
