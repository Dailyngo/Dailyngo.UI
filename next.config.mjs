/** @type {import('next').NextConfig} */
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  output: undefined,
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

};

export default nextConfig;
