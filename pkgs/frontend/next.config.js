/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでのビルド時に 'fs', 'net', そして 'tls' モジュールを空のオブジェクトとして扱う
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        ...config.resolve.fallback
      };
    }

    return config;
  },
};

module.exports = nextConfig;
