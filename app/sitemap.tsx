import { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://remixkit.in"
).replace(/\/$/, "");

const publicPages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "prompts", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "library", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "generate", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "reframe", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "credits", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "contact", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  {
    path: "refund-policy",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
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
  const staticUrls = publicPages.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${siteUrl}/${path}` : siteUrl,
    lastModified: currentDate,
    changeFrequency,
    priority,
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
