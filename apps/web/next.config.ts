import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "i.ibb.co"],
  },
  env: {
    NEXT_PUBLIC_HTTP_BACKEND: process.env.NEXT_PUBLIC_HTTP_BACKEND,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
};

export default nextConfig;
