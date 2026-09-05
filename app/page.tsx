import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  ImageIcon,
  Layers,
  Palette,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomePromptPreview } from "@/components/home-prompt-preview";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-violet-500 selection:text-white">
      <SiteHeader />

      <main id="main-content">
        {/* ── 1. Hero Section ───────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden border-b border-neutral-100">
          {/* Mesh gradient background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.14) 0%, transparent 65%),
                radial-gradient(ellipse 40% 40% at 85% 30%, rgba(168,85,247,0.10) 0%, transparent 60%),
                radial-gradient(ellipse 40% 50% at 15% 60%, rgba(236,72,153,0.08) 0%, transparent 60%)
              `,
            }}
          />
          {/* Subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />

          <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:pb-32 lg:pt-20">
            <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
              {/* Badge */}
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-violet-700 shadow-sm lg:px-4.5 lg:py-2 lg:text-sm">
                <span className="relative flex h-2 w-2 lg:h-2.5 lg:w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600 lg:h-2.5 lg:w-2.5" />
                </span>
                One toolkit, two ways to create
              </div>

              {/* Headline */}
              <h1 className="animate-fade-up animate-fade-up-delay-1 mt-7 text-[2.75rem] font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5rem]">
                The creative shortcut for{" "}
                <span className="gradient-text">better prompts.</span>
              </h1>

              {/* Subheading */}
              <p className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-500 sm:text-lg lg:max-w-2xl lg:text-xl lg:leading-8 xl:max-w-3xl xl:text-2xl xl:leading-9">
                Generate a detailed prompt from any visual reference, or
                discover a look you love and copy it instantly.
              </p>

              {/* CTAs */}
              <div className="animate-fade-up animate-fade-up-delay-3 mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:mt-12 lg:gap-4">
                <Link
                  href="/generate"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all duration-200 hover:bg-neutral-700 hover:shadow-neutral-900/30 active:scale-[0.98] lg:px-8 lg:py-4 lg:text-base lg:font-bold"
                >
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                  Generate from image
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] lg:px-8 lg:py-4 lg:text-base lg:font-bold"
                >
                  <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                  Explore prompt library
                </Link>
                <Link
                  href="/reframe"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] lg:px-8 lg:py-4 lg:text-base lg:font-bold"
                >
                  <Wand2 className="h-4 w-4 lg:h-5 lg:w-5" />
                  Try Reframe
                </Link>
              </div>
            </div>

            {/* Feature Cards Grid (Two balanced pathways) */}
            <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:gap-6 md:grid-cols-2 lg:mt-20 lg:max-w-none lg:gap-8">
              {/* Card 1: Image to prompt (Dark card) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl shadow-neutral-900/30 transition-all duration-300 hover:shadow-neutral-900/40 sm:p-8 lg:rounded-[2rem] lg:p-10 xl:p-12">
                {/* Glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl transition-all duration-500 group-hover:bg-violet-600/30 lg:h-64 lg:w-64"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 lg:h-12 lg:w-12 lg:rounded-2xl">
                      <Wand2 className="h-5 w-5 text-violet-300 lg:h-6 lg:w-6" />
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.18em] text-neutral-300 lg:px-3.5 lg:py-1.5 lg:text-xs">
                      Image to prompt
                    </span>
                  </div>
                  <div className="mt-8 lg:mt-10">
                    <h2 className="text-xl font-bold leading-[1.25] tracking-tight text-white sm:text-2xl lg:text-3xl xl:text-[2.1rem]">
                      Your reference, translated into a creative direction.
                    </h2>
                    <p className="mt-2.5 text-xs leading-5 text-neutral-400 sm:text-sm lg:text-base lg:leading-7 xl:text-lg">
                      Extract precise visual parameters directly from your
                      favorite photos.
                    </p>
                    <div className="mt-6 space-y-3 lg:mt-8">
                      {[
                        "Pose & framing",
                        "Lighting & vibe",
                        "Outfit & styling",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl bg-white/8 px-3.5 py-2 text-xs font-medium text-neutral-200 ring-1 ring-white/10 sm:text-sm lg:px-4 lg:py-3 lg:text-base"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-violet-400 lg:h-4.5 lg:w-4.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mt-8 pt-4 border-t border-white/10 lg:mt-10 lg:pt-6">
                  <Link
                    href="/generate"
                    className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 transition-colors hover:text-violet-300 lg:text-base xl:text-lg"
                  >
                    Open prompt generator{" "}
                    <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Prompt library (Light / Glass card) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/50 transition-all duration-300 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-100/50 sm:p-8 lg:rounded-[2rem] lg:p-10 xl:p-12">
                {/* Subtle soft glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-100/60 blur-3xl transition-all duration-500 group-hover:bg-violet-200/60 lg:h-64 lg:w-64"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-200 lg:h-12 lg:w-12 lg:rounded-2xl">
                      <Search className="h-5 w-5 lg:h-6 lg:w-6" />
                    </span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[.18em] text-neutral-600 lg:px-3.5 lg:py-1.5 lg:text-xs">
                      Prompt Library
                    </span>
                  </div>
                  <div className="mt-8 lg:mt-10">
                    <h2 className="text-xl font-bold leading-[1.25] tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl xl:text-[2.1rem]">
                      Hand-curated styles, ready to copy and paste.
                    </h2>
                    <p className="mt-2.5 text-xs leading-5 text-neutral-500 sm:text-sm lg:text-base lg:leading-7 xl:text-lg">
                      Explore trending aesthetic templates crafted for instant
                      AI image generation.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5 lg:mt-8 lg:gap-3">
                      {[
                        { emoji: "🎬", label: "Cinematic" },
                        { emoji: "🌅", label: "Golden Hour" },
                        { emoji: "🎞️", label: "A24 Poster" },
                        { emoji: "🎨", label: "Cartoon/Chibi" },
                        { emoji: "📰", label: "Editorial" },
                        { emoji: "🕰️", label: "Vintage" },
                      ].map((cat) => (
                        <span
                          key={cat.label}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-900 sm:text-sm lg:px-3.5 lg:py-2 lg:text-sm"
                        >
                          <span>{cat.emoji}</span>
                          {cat.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mt-8 pt-4 border-t border-neutral-100 lg:mt-10 lg:pt-6">
                  <Link
                    href="/library"
                    className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition-colors hover:text-violet-900 lg:text-base xl:text-lg"
                  >
                    Browse full library{" "}
                    <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Stats / Social Proof Strip ──────────────────── */}
        <section className="border-b border-neutral-100 bg-neutral-50/60">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:py-12">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              {[
                {
                  icon: <Layers className="h-4 w-4 lg:h-5 lg:w-5" />,
                  value: "7+",
                  label: "Prompt categories",
                },
                {
                  icon: <Zap className="h-4 w-4 lg:h-5 lg:w-5" />,
                  value: "Instant",
                  label: "1-click prompt copying",
                },
                {
                  icon: <Star className="h-4 w-4 lg:h-5 lg:w-5" />,
                  value: "Curated",
                  label: "Hand-tested formulas",
                },
                {
                  icon: <ImageIcon className="h-4 w-4 lg:h-5 lg:w-5" />,
                  value: "AI-ready",
                  label: "Midjourney, Flux & DALL-E",
                },
              ].map(({ icon, value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm transition-all hover:border-neutral-300 hover:shadow lg:rounded-3xl lg:p-7 xl:p-8 lg:gap-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 lg:h-12 lg:w-12 lg:rounded-2xl">
                    {icon}
                  </span>
                  <p className="text-lg font-bold text-neutral-900 lg:text-2xl xl:text-3xl">
                    {value}
                  </p>
                  <p className="text-xs text-neutral-500 sm:text-sm lg:text-base">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Latest Prompts Preview ───────────────────────── */}
        <HomePromptPreview />

        {/* ── 4. Explore by Category Section ──────────────────── */}
        <section className="border-t border-neutral-100 bg-neutral-50/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:py-28">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="section-label lg:text-sm">
                  <Layers className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  Category Directory
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Browse prompts by creative goal.
                </h2>
                <p className="mt-2 text-sm text-neutral-500 sm:text-base lg:text-lg xl:text-xl lg:mt-3 max-w-2xl lg:max-w-3xl">
                  Specialized prompt formulas crafted for specific photo
                  retouching and styling workflows.
                </p>
              </div>
              <Link
                href="/prompts"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow lg:px-5 lg:py-2.5 lg:text-base"
              >
                View all categories
                <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6 xl:gap-8">
              {[
                {
                  title: "Change Background",
                  desc: "Swap environments with realistic lighting, shadows, and perspective.",
                  emoji: "🌅",
                  href: "/prompts/change-background/office",
                  accent: "from-sky-50 to-blue-50 border-sky-100 text-sky-700",
                },
                {
                  title: "Portrait Enhancement",
                  desc: "Professional headshots, magazine covers, and studio portrait looks.",
                  emoji: "✨",
                  href: "/prompts/portrait-enhancement/professional-headshot",
                  accent:
                    "from-violet-50 to-fuchsia-50 border-violet-100 text-violet-700",
                },
                {
                  title: "Remove Elements",
                  desc: "Clean up unwanted objects, passersby, and watermarks seamlessly.",
                  emoji: "🧹",
                  href: "/prompts/remove-elements/remove-people",
                  accent:
                    "from-rose-50 to-pink-50 border-rose-100 text-rose-700",
                },
                {
                  title: "Creative Mood",
                  desc: "Cinematic color grades, moody atmospheric lighting, and film grain.",
                  emoji: "🎬",
                  href: "/prompts/creative-mood/cinematic-look",
                  accent:
                    "from-amber-50 to-orange-50 border-amber-100 text-amber-700",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md lg:rounded-3xl lg:p-8 xl:p-9 ${item.accent}`}
                >
                  <div>
                    <span className="text-3xl lg:text-4xl">{item.emoji}</span>
                    <h3 className="mt-4 text-base font-bold text-neutral-900 group-hover:text-neutral-950 lg:text-xl xl:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-neutral-600 sm:text-sm lg:text-sm xl:text-base lg:leading-6">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1 lg:text-sm xl:text-base">
                    <span>Explore prompts</span>
                    <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. How It Works ─────────────────────────────────── */}
        <section className="border-t border-neutral-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:py-28">
            <div className="mb-12 text-center lg:mb-16">
              <p className="section-label lg:text-sm">
                <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                How it works
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Two tools. Zero friction.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-500 sm:text-base lg:max-w-2xl lg:text-lg xl:text-xl lg:mt-4">
                Go from a rough visual idea to a production-ready AI image
                prompt in under 10 seconds.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  step: "01",
                  icon: (
                    <ImageIcon className="h-5 w-5 text-violet-600 lg:h-6 lg:w-6" />
                  ),
                  title: "Upload a reference",
                  desc: "Drop any reference photo. RemixKit analyzes composition, lighting, subject, and style elements.",
                },
                {
                  step: "02",
                  icon: (
                    <Wand2 className="h-5 w-5 text-violet-600 lg:h-6 lg:w-6" />
                  ),
                  title: "Generate or choose",
                  desc: "Select which features to preserve (pose, lighting, outfit) or pick a curated template from the library.",
                },
                {
                  step: "03",
                  icon: (
                    <Copy className="h-5 w-5 text-violet-600 lg:h-6 lg:w-6" />
                  ),
                  title: "Copy and create",
                  desc: "Copy the optimized prompt straight into Midjourney, Flux, DALL-E 3, or Stable Diffusion.",
                },
              ].map(({ step, icon, title, desc }) => (
                <div
                  key={step}
                  className="group relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md lg:rounded-3xl lg:p-8 xl:p-10"
                >
                  <div className="mb-4 flex items-center justify-between lg:mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 transition-colors group-hover:bg-violet-100 lg:h-12 lg:w-12 lg:rounded-2xl">
                      {icon}
                    </span>
                    <span className="text-3xl font-black text-neutral-200 transition-colors group-hover:text-violet-200 lg:text-4xl xl:text-5xl">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 lg:text-xl xl:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500 lg:text-base lg:leading-7 xl:text-lg">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Capabilities & Compatibility ─────────────────── */}
        <section className="border-t border-neutral-100 bg-neutral-50/50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:py-28">
            <div className="mb-12 text-center lg:mb-16">
              <p className="section-label lg:text-sm">
                <Zap className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                Why RemixKit
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                Built for modern AI image workflows.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:rounded-3xl lg:p-8 xl:p-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 lg:h-12 lg:w-12 lg:rounded-2xl">
                  <Sliders className="h-5 w-5 lg:h-6 lg:w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-neutral-900 lg:text-xl xl:text-2xl">
                  Targeted Parameter Control
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500 lg:text-base lg:leading-7 xl:text-lg">
                  Isolate specific visual attributes like lighting color, camera
                  focal length, or garment textures without contaminating other
                  details.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:rounded-3xl lg:p-8 xl:p-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 lg:h-12 lg:w-12 lg:rounded-2xl">
                  <Cpu className="h-5 w-5 lg:h-6 lg:w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-neutral-900 lg:text-xl xl:text-2xl">
                  Universal Model Support
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500 lg:text-base lg:leading-7 xl:text-lg">
                  Syntax designed to generate consistent outputs across
                  Midjourney v6, Flux.1 Schnell/Dev, DALL-E 3, and SDXL.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:rounded-3xl lg:p-8 xl:p-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 lg:h-12 lg:w-12 lg:rounded-2xl">
                  <ShieldCheck className="h-5 w-5 lg:h-6 lg:w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-neutral-900 lg:text-xl xl:text-2xl">
                  Zero Friction, 100% Free
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500 lg:text-base lg:leading-7 xl:text-lg">
                  No paywalls, subscriptions, or login obstacles for copying
                  prompts and discovering new creative directions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Bottom CTA ───────────────────────────────────── */}
        <section className="border-t border-neutral-100 bg-neutral-950 text-white">
          <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-20 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:py-28">
            {/* Glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl lg:h-96 lg:w-96"
            />
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-violet-400 lg:px-4.5 lg:py-2 lg:text-sm">
                <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                Built for the next idea
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                Start creating in seconds.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-400 sm:text-lg lg:max-w-2xl lg:text-xl xl:text-2xl">
                A focused space for the two moments that slow creative work
                down: finding the right words and finding the right reference.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-10 lg:gap-4">
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 active:scale-[0.98] lg:px-8 lg:py-4 lg:text-base lg:font-bold"
                >
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                  Generate from image
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/12 active:scale-[0.98] lg:px-8 lg:py-4 lg:text-base lg:font-bold"
                >
                  Browse library
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
