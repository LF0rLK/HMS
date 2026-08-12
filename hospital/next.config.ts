import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Surface the API URL to the browser bundle.
  // Set NEXT_PUBLIC_API_URL in Vercel environment variables.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  },
};

export default nextConfig;
