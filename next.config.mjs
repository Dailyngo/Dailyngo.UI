/** @type {import('next').NextConfig} */
import dotenv from "dotenv";
import withPWA from 'next-pwa';
dotenv.config({ path: "./.env" });

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})({
  reactStrictMode: false,
  compress: true,
  output: undefined,
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
});

export default nextConfig;
