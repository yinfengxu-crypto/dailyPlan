/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 是原生模块，不打包进 bundle
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
