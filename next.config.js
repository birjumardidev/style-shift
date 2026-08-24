const path = require("path");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseHost;
try {
  supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
} catch (e) {
  supabaseHost = undefined;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Deleted the deprecated 'domains' property to silence the security warning
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {}, 
};

module.exports = nextConfig;
