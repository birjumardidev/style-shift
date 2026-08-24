import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  {
    slug: "change-background",
    title: "Change Background",
    description:
      "AI prompts for swapping backgrounds, including office, beach, and sunset sky edits.",
    emoji: "🌅",
    color: "from-sky-50 to-blue-50",
    accent: "bg-sky-100 text-sky-700",
    pages: [
      { title: "Office Background", href: "/prompts/change-background/office" },
      { title: "Beach Background", href: "/prompts/change-background/beach" },
      { title: "Sunset Sky Background", href: "/prompts/change-background/sunset-sky" },
    ],
  },
  {
    slug: "portrait-enhancement",
    title: "Portrait Enhancement",
    description:
      "AI prompts for headshots, sharpening portraits, and magazine-style image edits.",
    emoji: "✨",
    color: "from-violet-50 to-fuchsia-50",
    accent: "bg-violet-100 text-violet-700",
    pages: [
      { title: "Professional Headshot", href: "/prompts/portrait-enhancement/professional-headshot" },
      { title: "Sharpen Blurry Portrait", href: "/prompts/portrait-enhancement/sharpen-blurry-portrait" },
      { title: "Magazine Cover Look", href: "/prompts/portrait-enhancement/magazine-cover" },
    ],
  },
  {
    slug: "remove-elements",
    title: "Remove Elements",
    description: "AI prompts for removing people, watermarks, and unwanted objects.",
    emoji: "🧹",
    color: "from-rose-50 to-pink-50",
    accent: "bg-rose-100 text-rose-700",
    pages: [
      { title: "Remove People", href: "/prompts/remove-elements/remove-people" },
      { title: "Remove Watermark", href: "/prompts/remove-elements/remove-watermark" },
    ],
  },
  {
    slug: "creative-mood",
    title: "Creative Mood",
    description: "AI prompts for cinematic color, mood lighting, and dramatic photo edits.",
    emoji: "🎬",
    color: "from-amber-50 to-orange-50",
    accent: "bg-amber-100 text-amber-700",
    pages: [
      { title: "Cinematic Look", href: "/prompts/creative-mood/cinematic-look" },
      { title: "Add Mood Lighting", href: "/prompts/creative-mood/add-mood-lighting" },
    ],
  },
];

export const metadata = {
  title: "AI Image Prompt Categories | RemixKit",
  description:
    "Browse the best AI image editing prompt categories for background swaps, portrait enhancements, object removal, and cinematic mood edits.",
};

export default function PromptCategories() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-6xl xl:max-w-7xl lg:px-8 lg:py-24">
      {/* Header */}
      <div className="mb-12 lg:mb-16">
        <p className="section-label lg:text-sm">
          <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          Prompt Categories
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          AI Image Editing Prompts for Photo Retouching
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-500 lg:text-xl lg:leading-8 lg:max-w-3xl">
          Fast, ready-to-copy AI prompt pages for everyday photo editing tasks
          like background changes, headshots, and cinematic effects.
        </p>
      </div>

      {/* Category grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:gap-8">
        {categories.map((category) => (
          <section
            key={category.slug}
            className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br ${category.color} p-7 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 lg:rounded-3xl lg:p-9 xl:p-10`}
          >
            {/* Category badge */}
            <div className="mb-4 flex items-center justify-between lg:mb-6">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold lg:px-3.5 lg:py-1.5 lg:text-sm ${category.accent}`}>
                <span>{category.emoji}</span>
                {category.title}
              </span>
            </div>

            <p className="text-sm leading-6 text-neutral-600 lg:text-base lg:leading-7">
              {category.description}
            </p>

            {/* Links */}
            <div className="mt-5 space-y-2.5 lg:mt-7 lg:space-y-3">
              {category.pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-between rounded-xl border border-neutral-200/70 bg-white px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm transition-all duration-200 hover:border-violet-200 hover:bg-white hover:shadow hover:text-violet-700 lg:px-5 lg:py-4 lg:text-base lg:rounded-2xl"
                >
                  <span>{page.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 lg:h-4 lg:w-4" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
