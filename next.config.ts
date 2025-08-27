import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',               // gera sw.js e workbox-* em /public
  disable: process.env.NODE_ENV === 'development',
  register: true,               // registra SW automaticamente
  skipWaiting: true,            // ativa nova versão mais rápido
  cacheOnFrontEndNav: true,     // melhora navegação client
});
module.exports = withPWA({
  reactStrictMode: true,
});


export default nextConfig;
