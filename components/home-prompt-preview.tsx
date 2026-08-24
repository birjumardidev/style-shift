"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Copy, ImageIcon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type Prompt } from "@/lib/supabase";

export function HomePromptPreview() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setPrompts((data as Prompt[]) ?? []));
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl lg:max-w-7xl xl:max-w-[1380px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-label lg:text-sm">
              <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              From the library
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready-to-copy creative directions.
            </h2>
          </div>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow lg:px-5 lg:py-2.5 lg:text-base"
          >
            View all prompts
            <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-8 lg:mt-12 grid gap-5 sm:grid-cols-3 lg:gap-8">
          {prompts.length
            ? prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))
            : <EmptyCards />}
        </div>
      </div>
    </section>
  );
}

function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-neutral-200/60">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100">
        {prompt.image_url ? (
          <Image
            src={prompt.image_url}
            alt={prompt.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 400px"
          />
        ) : (
          <ImageIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-violet-300 lg:h-10 lg:w-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-5 lg:p-7">
        <p className="line-clamp-1 text-sm font-bold text-neutral-900 lg:text-lg xl:text-xl">{prompt.title}</p>
        <p className="mt-1 text-xs text-neutral-500 lg:text-sm xl:text-base">{prompt.category}</p>
        <div className="mt-auto pt-4 lg:pt-6">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 transition-colors hover:text-violet-800 lg:text-sm xl:text-base"
          >
            Open &amp; copy
            <Copy className="h-3 w-3 lg:h-4 lg:w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyCards() {
  return (
    <>
      <Fallback title="Cinematic portrait" gradient="from-violet-200 via-fuchsia-100 to-pink-200" />
      <Fallback title="Editorial studio scene" gradient="from-sky-200 via-blue-100 to-indigo-200" />
      <Fallback title="Dreamy colour grade" gradient="from-amber-200 via-orange-100 to-rose-200" />
    </>
  );
}

function Fallback({ title, gradient }: { title: string; gradient: string }) {
  return (
    <Link
      href="/library"
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-neutral-200/60"
    >
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient}`}>
        <ImageIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-violet-400 transition-transform duration-300 group-hover:scale-110 lg:h-10 lg:w-10" />
      </div>
      <div className="flex flex-1 flex-col p-5 lg:p-7">
        <p className="text-sm font-bold text-neutral-900 lg:text-lg xl:text-xl">{title}</p>
        <p className="mt-1 text-xs text-neutral-500 lg:text-sm xl:text-base">Open the prompt library</p>
        <div className="mt-auto pt-4 lg:pt-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 transition-colors group-hover:text-violet-800 lg:text-sm xl:text-base">
            Explore prompts
            <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
