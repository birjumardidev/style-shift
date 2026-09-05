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
  allowedDevOrigins: ["192.168.1.5"],
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://va.vercel-scripts.com https://vercel.live; connect-src 'self' https://*.supabase.co https://fal.run https://api.razorpay.com https://vitals.vercel-insights.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; frame-src https://api.razorpay.com https://checkout.razorpay.com; font-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
  turbopack: {},
};

module.exports = nextConfig;
