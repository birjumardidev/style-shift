"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Copy, Check, ImageIcon, Wand2, X, Sparkles } from "lucide-react";
import { supabase, type Prompt } from "@/lib/supabase";
import { FILTER_PILLS, categoryClass, categoryEmoji } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

const PIN_ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[2/3]",
  "aspect-[5/4]",
  "aspect-[3/5]",
];

function pinAspect(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % PIN_ASPECTS.length;
  }
  return PIN_ASPECTS[hash];
}

export default function GalleryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Prompt | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setPrompts((data as Prompt[]) ?? []);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  const handleCopy = useCallback(async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.prompt_text);
      setCopiedId(p.id);
      setTimeout(() => setCopiedId((id) => (id === p.id ? null : id)), 2000);
    } catch {
      setCopiedId(p.id);
      setTimeout(() => setCopiedId((id) => (id === p.id ? null : id)), 2000);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.prompt_text.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [prompts, activeCategory, query]);

  return (
    <div className="min-h-screen bg-white selection:bg-violet-500 selection:text-white">
      <LibraryHeader query={query} onQueryChange={setQuery} />

      <main className="mx-auto max-w-[1600px] px-3 pb-20 pt-4 sm:px-4 md:px-6 lg:px-8 xl:px-12 lg:pt-6">
        {/* Category pills */}
        <div className="sticky top-[64px] lg:top-[80px] z-30 -mx-3 mb-2 bg-white/90 px-3 py-3 backdrop-blur-xl border-b border-neutral-100/80 sm:-mx-4 sm:px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8 xl:-mx-12 xl:px-12 lg:py-4">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5 lg:gap-3 ">
            {FILTER_PILLS.map((pill) => {
              const active = activeCategory === pill.value;
              return (
                <button
                  key={pill.value}
                  onClick={() => setActiveCategory(pill.value)}
                  className={cn(
                    "pill lg:px-5 lg:py-2.5 lg:text-base lg:font-semibold",
                    active ? "pill-active" : "pill-inactive"
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-5 text-sm font-medium text-neutral-400 lg:text-base lg:mb-7">
          {loading
            ? "Loading prompts…"
            : `${filtered.length} ${filtered.length === 1 ? "idea" : "ideas"}`}
        </p>

        {/* States */}
        {error ? (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-10 text-center lg:max-w-lg lg:p-12 lg:rounded-3xl">
            <p className="text-sm font-semibold text-red-700 lg:text-base">Couldn&apos;t load prompts.</p>
            <p className="mt-1 text-xs text-red-500 lg:text-sm">{error}</p>
          </div>
        ) : loading ? (
          <MasonrySkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState hasPrompts={prompts.length > 0} />
        ) : (
          <div className="masonry-grid">
            {filtered.map((p) => (
              <PinCard
                key={p.id}
                prompt={p}
                copied={copiedId === p.id}
                onCopy={() => handleCopy(p)}
                onOpen={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />

      {selected && (
        <PinModal
          prompt={selected}
          copied={copiedId === selected.id}
          onCopy={() => handleCopy(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function LibraryHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4 md:px-6 lg:px-8 xl:px-12 lg:py-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 shadow-md shadow-violet-500/25 transition-all duration-300 group-hover:scale-105 lg:h-10 lg:w-10">
            <Wand2 className="h-[17px] w-[17px] text-white lg:h-5 lg:w-5" />
          </span>
          <span className="hidden text-[1.05rem] font-bold tracking-tight text-neutral-900 sm:block lg:text-lg">
            RemixKit
          </span>
        </Link>

        {/* Search */}
        <div className="relative mx-auto w-full max-w-2xl flex-1 lg:max-w-3xl xl:max-w-4xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-neutral-400 lg:h-5 lg:w-5 lg:left-5" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search prompts…"
            className="search-input lg:py-3.5 lg:pl-12 lg:text-base"
          />
        </div>

        <Link href="/prompts" className="btn-secondary hidden shrink-0 sm:inline-flex lg:px-5 lg:py-2.5 lg:text-base">
          Prompt Guides
        </Link>
        <Link href="/generate" className="btn-primary shrink-0 lg:px-5 lg:py-2.5 lg:text-base">
          <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span className="hidden sm:inline">Generate Prompt</span>
          <span className="sm:hidden">Generate</span>
        </Link>
      </div>
    </header>
  );
}

function PinCard({
  prompt,
  onOpen,
}: {
  prompt: Prompt;
  copied: boolean;
  onCopy: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="pin-card group masonry-item">
      <div className="pin-image-wrap shadow-sm transition-shadow duration-300 group-hover:shadow-md lg:rounded-3xl">
        <button
          type="button"
          onClick={onOpen}
          className="block w-full cursor-pointer text-left"
          aria-label={`Preview ${prompt.title}`}
        >
          {prompt.image_url ? (
            <div className={cn("relative w-full", pinAspect(prompt.id))}>
              <Image
                src={prompt.image_url}
                alt={prompt.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <div className={cn("flex w-full items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100", pinAspect(prompt.id))}>
              <ImageIcon className="h-8 w-8 text-violet-300 lg:h-12 lg:w-12" />
            </div>
          )}
        </button>

        {/* Hover overlay — desktop */}
        <div className="pin-overlay hidden sm:flex pointer-events-none lg:p-6">
          <div />
          <div>
            <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow lg:text-base">
              {prompt.title}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-sm lg:text-xs lg:px-3 lg:py-1.5">
              {categoryEmoji(prompt.category)} {prompt.category}
            </span>
          </div>
        </div>
      </div>

      {/* Title below — mobile */}
      <button
        type="button"
        onClick={onOpen}
        className="mt-2 w-full px-1 text-left sm:hidden"
      >
        <p className="line-clamp-2 text-sm font-semibold text-neutral-900">{prompt.title}</p>
        <span className={cn("mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", categoryClass(prompt.category))}>
          {categoryEmoji(prompt.category)} {prompt.category}
        </span>
      </button>
    </article>
  );
}

function PinModal({
  prompt,
  copied,
  onCopy,
  onClose,
}: {
  prompt: Prompt;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4 lg:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={prompt.title}
    >
      <div
        className="relative flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200/50 sm:max-h-[min(88vh,520px)] sm:max-w-[640px] sm:flex-row md:max-w-[720px] lg:max-w-[880px] xl:max-w-[980px] lg:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 lg:h-10 lg:w-10 lg:right-4 lg:top-4"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
        </button>

        {/* Image */}
        <div className="flex h-[200px] shrink-0 items-center justify-center bg-neutral-100 p-2 sm:h-auto sm:w-[44%] sm:min-h-[320px] sm:max-h-[min(88vh,520px)] sm:p-3 lg:w-[46%] lg:p-4">
          {prompt.image_url ? (
            <div className="relative h-full w-full">
              <Image
                src={prompt.image_url}
                alt={prompt.title}
                fill
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 360px, 450px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100">
              <ImageIcon className="h-12 w-12 text-violet-300 lg:h-16 lg:w-16" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5 sm:pr-5 lg:p-7 xl:p-8">
          <div className="mb-3 shrink-0 pr-6 lg:mb-5">
            <h2 className="line-clamp-2 text-sm font-bold text-neutral-900 sm:text-base leading-snug lg:text-xl xl:text-2xl">
              {prompt.title}
            </h2>
            <span className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-[11px] lg:text-xs lg:px-3 lg:py-1.5 lg:mt-3", categoryClass(prompt.category))}>
              {categoryEmoji(prompt.category)} {prompt.category}
            </span>
          </div>

          <div className="mb-3.5 min-h-0 flex-1 rounded-xl bg-neutral-50 px-3.5 py-3 ring-1 ring-neutral-100 lg:p-5 lg:rounded-2xl lg:mb-5">
            <p className="line-clamp-[8] text-[11px] leading-[1.55] text-neutral-600 sm:line-clamp-[11] sm:text-xs sm:leading-[1.6] lg:text-sm lg:leading-relaxed xl:text-[15px]">
              {prompt.prompt_text}
            </p>
          </div>

          <button
            type="button"
            onClick={onCopy}
            className={cn(
              "flex w-full shrink-0 items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all duration-200 sm:py-3.5 sm:text-sm lg:py-4 lg:text-base lg:font-bold lg:rounded-2xl active:scale-[0.98]",
              copied
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                : "bg-neutral-900 text-white hover:bg-neutral-700 shadow-sm",
            )}
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" /> Copy Prompt</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MasonrySkeleton() {
  return (
    <div className="masonry-grid">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="masonry-item animate-pulse">
          <div className={cn("rounded-2xl bg-neutral-100 lg:rounded-3xl", PIN_ASPECTS[i % PIN_ASPECTS.length])} />
          <div className="mt-2 h-3 w-3/4 rounded-full bg-neutral-100 sm:hidden" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasPrompts }: { hasPrompts: boolean }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm lg:max-w-lg lg:p-16 lg:rounded-3xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 lg:h-20 lg:w-20">
        <Wand2 className="h-7 w-7 text-violet-600 lg:h-9 lg:w-9" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 lg:text-2xl">
        {hasPrompts ? "No matches found" : "No prompts yet"}
      </h3>
      <p className="mt-2 text-sm text-neutral-500 lg:text-base">
        {hasPrompts
          ? "Try a different category or search term."
          : "Create your first prompt to get started."}
      </p>
      {!hasPrompts && (
        <Link href="/generate" className="btn-primary mt-6 lg:px-6 lg:py-3 lg:text-base">
          <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
          Generate a Prompt
        </Link>
      )}
    </div>
  );
}
