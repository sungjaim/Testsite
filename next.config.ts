import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "/" has no page of its own: send visitors to the default language.
  async redirects() {
    return [{ source: "/", destination: "/ko", permanent: false }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
