import "./globals.css";
import type { Metadata, Viewport } from "next";
import { jakarta } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://remixkit.in"
).replace(/\/$/, "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseHost: string | undefined;
try {
  supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
} catch (e) {
  supabaseHost = undefined;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "RemixKit",
  title: {
    default: "RemixKit — AI Image Editing Prompts & Image to Prompt Generator",
    template: "%s | RemixKit",
  },
  description:
    "Turn visual references into detailed AI prompts, explore curated image styles, and reframe images with RemixKit.",
  keywords: [
    "AI image prompts",
    "image to prompt generator",
    "Midjourney prompts",
    "Flux prompts",
    "Nano Banana prompts",
    "AI photo editing",
    "prompt library",
    "chatgpt image prompts",
    "AI image prompt generator",
    "AI prompts",
    "AI image editing prompts",
    "Reframe image editing",
    "AI image generator credits",
    "Razorpay image editing",
  ],
  authors: [{ name: "RemixKit Team" }],
  creator: "RemixKit",
  publisher: "RemixKit",
  category: "technology",
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "RemixKit — AI Image Editing Prompts & Generator",
    description:
      "Generate prompts from images, explore curated styles, and reframe visual details with RemixKit.",
    siteName: "RemixKit",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RemixKit — AI Image Editing Prompts & Generator",
    description:
      "Discover trending AI image editing prompts or generate prompts directly from your images.",
    images: [`${siteUrl}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable} data-scroll-behavior="smooth">
      <head>
        {supabaseHost && (
          <>
            <link
              rel="preconnect"
              href={`https://${supabaseHost}`}
              crossOrigin="anonymous"
            />
            <link rel="dns-prefetch" href={`https://${supabaseHost}`} />
          </>
        )}
        <link
          rel="preconnect"
          href="https://imagedelivery.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://imagedelivery.net" />
      </head>
      <body className={`${jakarta.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
