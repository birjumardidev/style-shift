import Link from "next/link";
import { ArrowLeft, ArrowRight, Copy, Sparkles } from "lucide-react";

export const metadata = {
  title: "AI Prompt to Replace Background with Beach | RemixKit",
  description:
    "Copy this AI prompt to transform any photo background into a tropical beach scene.",
};

const promptText = `Replace the background with a bright beach scene. Keep the subject in focus, include soft sand, ocean waves, palm trees, and warm golden hour light.`;

export default function BeachPromptPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:max-w-5xl xl:max-w-6xl lg:px-8 lg:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-400 sm:text-sm lg:mb-10">
        <Link href="/prompts" className="flex items-center gap-1.5 transition hover:text-neutral-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Prompt Categories
        </Link>
        <span>/</span>
        <span className="text-neutral-600">Beach Background</span>
      </nav>

      <article className="space-y-8 lg:space-y-10">
        {/* Header */}
        <header>
          <p className="section-label lg:text-sm">
            <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            AI Image Prompt
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            AI Prompt to Replace Background with Beach
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-500 lg:text-xl lg:leading-8 lg:max-w-3xl">
            Use a ready-made prompt that turns any portrait or product photo
            into a realistic beach setting.
          </p>
        </header>

        {/* Prompt box */}
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-fuchsia-50/30 shadow-sm lg:rounded-3xl">
          <div className="flex items-center justify-between border-b border-violet-100/70 px-6 py-4 lg:px-8 lg:py-5">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-600 lg:text-sm">Prompt</p>
            <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm lg:px-4 lg:py-2 lg:text-sm">
              <Copy className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
              Copy to use
            </div>
          </div>
          <pre className="px-6 py-5 text-sm leading-7 text-neutral-700 whitespace-pre-wrap break-words font-sans lg:px-8 lg:py-7 lg:text-lg lg:leading-8">
            {promptText}
          </pre>
        </section>

        {/* Why it works */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">Why this prompt works</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-500 lg:text-base lg:leading-8 xl:text-lg">
            It tells the model to preserve the original subject while adding
            specific beach details like sand, waves, and palm trees. The warm
            golden hour lighting reduces harshness and makes the transition
            appear natural.
          </p>
        </section>

        {/* How to use */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">How to use this prompt</h2>
          <ol className="mt-4 space-y-3 lg:space-y-4">
            {[
              "Paste the prompt into your AI editor.",
              "Upload the photo and choose a clear, high-resolution result.",
              "Select a style such as realistic, travel, or lifestyle.",
              "Run the edit and verify the subject blends with the beach scene.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-500 leading-6 lg:text-base lg:leading-7">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 lg:h-7 lg:w-7 lg:text-sm">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Best settings */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">Best settings for beach background edits</h2>
          <ul className="mt-4 space-y-2.5 lg:space-y-3">
            {[
              "Model: realistic or travel photography",
              "Resolution: 1920x1080 or higher",
              "Lighting: warm golden hour",
              "Composition: clear horizon and natural shadowing",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-neutral-500 lg:text-base">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 lg:h-2 lg:w-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Example result */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-xl font-bold text-neutral-900 lg:text-2xl">Example result</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-500 lg:text-base lg:leading-8 xl:text-lg">
            The final output should look like the subject was photographed at
            the beach, with soft sand and ocean depth behind them, while keeping
            skin tones and details intact.
          </p>
        </section>

        {/* Related prompts */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-8 xl:p-9">
          <h2 className="text-lg font-bold text-neutral-900 lg:text-xl">Related prompts</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:gap-4">
            {[
              { href: "/prompts/change-background/office", label: "AI prompt to change background to office" },
              { href: "/prompts/change-background/sunset-sky", label: "AI prompt to change sky to sunset" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-800 transition-all hover:border-violet-200 hover:bg-white hover:text-violet-700 hover:shadow-sm lg:px-5 lg:py-4 lg:text-base lg:rounded-2xl"
              >
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
