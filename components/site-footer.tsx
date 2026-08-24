import Link from "next/link";
import { Wand2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:max-w-7xl xl:max-w-[1380px] lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-md lg:h-9 lg:w-9">
                <Wand2 className="h-4 w-4 text-neutral-950 lg:h-5 lg:w-5" />
              </span>
              <span className="text-base font-bold text-white lg:text-lg">RemixKit</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-neutral-400 sm:text-sm lg:text-sm lg:leading-6">
              AI image editing prompts made practical. Generate prompts from reference photos or copy hand-crafted creative directions.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-neutral-400 sm:text-sm">All tools online</span>
            </div>
          </div>

          {/* Column 2: Tools */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-neutral-200 lg:text-sm">
              Tools
            </p>
            <ul className="mt-3 space-y-2.5 text-xs sm:text-sm lg:text-sm">
              <li>
                <Link href="/generate" className="transition hover:text-white">
                  Image to Prompt
                </Link>
              </li>
              <li>
                <Link href="/library" className="transition hover:text-white">
                  Prompt Library
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="transition hover:text-white">
                  Prompt Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-neutral-200 lg:text-sm">
              Categories
            </p>
            <ul className="mt-3 space-y-2.5 text-xs sm:text-sm lg:text-sm">
              <li>
                <Link
                  href="/prompts/portrait-enhancement/professional-headshot"
                  className="transition hover:text-white"
                >
                  Professional Headshot
                </Link>
              </li>
              <li>
                <Link
                  href="/prompts/creative-mood/cinematic-look"
                  className="transition hover:text-white"
                >
                  Cinematic Look
                </Link>
              </li>
              <li>
                <Link
                  href="/prompts/change-background/beach"
                  className="transition hover:text-white"
                >
                  Beach Background
                </Link>
              </li>
              <li>
                <Link
                  href="/prompts/remove-elements/remove-watermark"
                  className="transition hover:text-white"
                >
                  Remove Watermark
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compatibility */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-neutral-200 lg:text-sm">
              Model Support
            </p>
            <ul className="mt-3 space-y-2.5 text-xs sm:text-sm lg:text-sm">
              <li className="text-neutral-400">Midjourney v6 &amp; Niji</li>
              <li className="text-neutral-400">Flux.1 Schnell &amp; Dev</li>
              <li className="text-neutral-400">DALL-E 3 (OpenAI)</li>
              <li className="text-neutral-400">Stable Diffusion XL</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-800/80 pt-6 text-xs sm:text-sm sm:flex-row lg:mt-14">
          <p className="text-neutral-500">
            © {new Date().getFullYear()} RemixKit. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-neutral-500">
            <Link href="/library" className="hover:text-neutral-300">
              Library
            </Link>
            <Link href="/generate" className="hover:text-neutral-300">
              Generate
            </Link>
            <Link href="/prompts" className="hover:text-neutral-300">
              Prompts
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
