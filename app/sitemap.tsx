import { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.remixkit.in"
).replace(/\/$/, "");

const publicPages = [
  "",
  "prompts",
  "library",
  "generate",
  "reframe",
  "credits",
  "terms",
  "privacy",
  "refund-policy",
  "contact",
];

const promptPages = [
  "change-background/office",
  "change-background/beach",
  "change-background/sunset-sky",
  "portrait-enhancement/professional-headshot",
  "portrait-enhancement/sharpen-blurry-portrait",
  "portrait-enhancement/magazine-cover",
  "remove-elements/remove-people",
  "remove-elements/remove-watermark",
  "creative-mood/cinematic-look",
  "creative-mood/add-mood-lighting",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Root & Static Pages
  const staticUrls = publicPages.map((path) => ({
    url: path ? `${siteUrl}/${path}` : siteUrl,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  // Individual prompt pages
  const promptUrls = promptPages.map((path) => ({
    url: `${siteUrl}/prompts/${path}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...promptUrls];
}
