import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "i.pinimg.com",
      "picsum.photos",
      "images.unsplash.com",
      "cdn.midjourney.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
