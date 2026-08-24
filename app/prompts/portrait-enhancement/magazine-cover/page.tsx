import Link from "next/link";
import { ArrowLeft, ArrowRight, Copy, Sparkles } from "lucide-react";

export const metadata = {
  title: "AI Prompt to Turn Photo into Magazine Cover | RemixKit",
  description:
    "Use this AI prompt to make a photo look like a glossy magazine cover with dramatic styling.",
};

const promptText = `Turn this photo into a polished magazine cover. Keep the subject prominent, add editorial lighting, soft shadow, and a stylish background with subtle text layout hints.`;

export default function MagazineCoverPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:max-w-5xl xl:max-w-6xl lg:px-8 lg:py-20">
      <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-400 sm:text-sm lg:mb-10">
        <Link href="/prompts" className="flex items-center gap-1.5 transition hover:text-neutral-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Prompt Categories
        </Link>
        <span>/</span>
        <span className="text-neutral-600">Magazine Cover</span>
      </nav>

      <article className="space-y-8 lg:space-y-10">
        <header>
          <p className="section-label lg:text-sm"><Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />AI Image Prompt</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            AI Prompt to Turn Photo into Magazine Cover
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-500 lg:text-xl lg:leading-8 lg:max-w-3xl">
            Copy this prompt to turn any portrait into a high-end magazine cover edit with editorial lighting and refined styling.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-fuchsia-50/30 shadow-sm lg:rounded-3xl">
          <div className="flex items-center justify-between border-b border-violet-100/70 px-6 py-4 lg:px-8 lg:py-5">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-600 lg:text-sm">Prompt</p>
            <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm lg:px-4 lg:py-2 lg:text-sm">
              <Copy className="h-3 w-3 lg:h-3.5 lg:w-3.5" />Copy to use
            </div>
          </div>
          <pre className="px-6 py-5 text-sm leading-7 text-neutral-700 whitespace-pre-wrap break-words font-sans lg:px-8 lg:py-7 lg:text-lg lg:leading-8">{promptText}</pre>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">Why this prompt works</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-500 lg:text-base lg:leading-8 xl:text-lg">
            It gives the AI clear editorial direction while preserving the subject&apos;s presence.
            Adding magazine-style lighting and subtle design details makes the result feel polished, not overdone.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">How to use this prompt</h2>
          <ol className="mt-4 space-y-3 lg:space-y-4">
            {["Paste the prompt into your AI editor.", "Upload a portrait with good face visibility.", "Select a photography or editorial style.", "Run the edit and check for strong lighting and a polished finish."].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-500 leading-6 lg:text-base lg:leading-7">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 lg:h-7 lg:w-7 lg:text-sm">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">Best settings for magazine cover edits</h2>
          <ul className="mt-4 space-y-2.5 lg:space-y-3">
            {["Model: editorial or fashion photography", "Resolution: 1080x1350 or 1200x1600", "Lighting: dramatic, high-contrast studio light", "Composition: subject centered with strong focal depth"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-neutral-500 lg:text-base">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 lg:h-2 lg:w-2" />{item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">Example result</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-500 lg:text-base lg:leading-8 xl:text-lg">
            The final image should appear like a stylish magazine cover with polished skin, moody
            lighting, and a subtle editorial backdrop. It should remain natural and not overly filtered.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-lg font-bold text-neutral-900 lg:text-xl">Related prompts</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:gap-4">
            {[
              { href: "/prompts/creative-mood/cinematic-look", label: "AI prompt to create cinematic photo" },
              { href: "/prompts/portrait-enhancement/professional-headshot", label: "AI prompt to make selfie look professional headshot" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-800 transition-all hover:border-violet-200 hover:bg-white hover:text-violet-700 hover:shadow-sm lg:px-5 lg:py-4 lg:text-base lg:rounded-2xl">
                <span>{label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 lg:h-4 lg:w-4" />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
