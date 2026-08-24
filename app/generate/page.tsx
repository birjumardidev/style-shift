"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  ImagePlus,
  Loader2,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Feature = "pose" | "background" | "lighting" | "outfit";
const options: {
  key: Feature;
  label: string;
  detail: string;
  emoji: string;
}[] = [
  {
    key: "pose",
    label: "Pose & framing",
    detail: "Subject position and camera composition",
    emoji: "🎭",
  },
  {
    key: "background",
    label: "Background",
    detail: "Scene and environment",
    emoji: "🌅",
  },
  {
    key: "lighting",
    label: "Lighting & vibe",
    detail: "Atmosphere and colour",
    emoji: "✨",
  },
  {
    key: "outfit",
    label: "Outfit & styling",
    detail: "Clothing and accessories",
    emoji: "👗",
  },
];

const GENERATION_STEPS = [
  {
    label: "Scanning image composition & subject pose...",
    icon: "📸",
    progress: 25,
  },
  {
    label: "Analyzing lighting, color palette & environment...",
    icon: "✨",
    progress: 55,
  },
  {
    label: "Isolating chosen feature tags & styling...",
    icon: "🎯",
    progress: 80,
  },
  {
    label: "Synthesizing high-precision AI prompt...",
    icon: "⚡",
    progress: 95,
  },
];

const valid = (file: File) =>
  file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024;

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<Feature, boolean>>({
    pose: true,
    background: false,
    lighting: true,
    outfit: false,
  });
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  useEffect(() => {
    if (!busy) {
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((curr) =>
        curr < GENERATION_STEPS.length - 1 ? curr + 1 : curr,
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [busy]);

  function setPhoto(next?: File) {
    if (!next) return;
    if (!valid(next)) {
      setError("Choose a JPG, PNG, or WEBP image up to 10 MB.");
      return;
    }
    setError("");
    setFile(next);
    setPrompt("");
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(next);
    });
  }

  async function generate() {
    if (!file) {
      setError("Add a reference image first.");
      return;
    }
    if (!Object.values(selected).some(Boolean)) {
      setError("Choose at least one detail to include.");
      return;
    }
    setBusy(true);
    setLoadingStep(0);
    setError("");
    setPrompt("");
    const data = new FormData();
    data.append("reference", file);
    data.append("preserve", JSON.stringify(selected));
    try {
      const response = await fetch("/api/edit", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error || "We could not generate a prompt.");
      setPrompt(body.prompt);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy the prompt. Please copy it manually.");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-violet-500 selection:text-white">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-14 lg:max-w-6xl xl:max-w-7xl lg:px-8 lg:py-10">
        {/* Page header */}
        <div className="mb-10 max-w-2xl lg:max-w-3xl lg:mb-10">
          <p className="section-label lg:text-sm">
            <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            Free Image to prompt
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Turn a look into the right words.
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-500 lg:text-l lg:leading-8">
            Upload a reference image, choose what to capture, then copy a
            ready-to-use prompt.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          {/* ── Step 1: Upload ─────────────────────────────── */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-9 xl:p-10">
            <Step
              n="01"
              title="Add your reference image"
              text="JPG, PNG, or WEBP up to 10 MB."
            />

            <button
              type="button"
              onClick={() => input.current?.click()}
              onDrop={(e: DragEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setPhoto(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="mt-5 group flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/30 lg:mt-7 lg:rounded-2xl lg:p-8"
            >
              {preview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={preview}
                    alt="Reference preview"
                    fill
                    unoptimized
                    className="h-full w-full object-cover rounded-lg lg:rounded-xl"
                  />
                  {busy && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg lg:rounded-xl bg-violet-950/20 backdrop-brightness-95">
                      {/* Laser scanner line */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-300 to-transparent shadow-[0_0_18px_4px_rgba(167,139,250,0.95)] animate-scan-line" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px] animate-pulse" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold text-violet-200 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                        </span>
                        Analyzing visual details…
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md shadow-neutral-100 ring-1 ring-neutral-200 transition-transform duration-200 group-hover:scale-105 lg:h-16 lg:w-16">
                    <Upload className="h-6 w-6 text-neutral-500 lg:h-7 lg:w-7" />
                  </span>
                  <strong className="mt-3.5 text-sm font-semibold text-neutral-700 lg:text-base">
                    Drop image here or tap to browse
                  </strong>
                  <span className="mt-1.5 text-xs text-neutral-400 lg:text-sm">
                    Your image is used only to generate this prompt.
                  </span>
                </>
              )}
            </button>
            <input
              ref={input}
              className="hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPhoto(e.target.files?.[0])
              }
            />
          </div>

          {/* ── Step 2: Options ────────────────────────────── */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm sm:p-7 lg:rounded-3xl lg:p-9 xl:p-10">
            <Step
              n="02"
              title="What should the prompt include?"
              text="Select the visual details you want us to describe."
            />
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-1 lg:mt-7 lg:gap-4">
              {options.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    setSelected((current) => ({
                      ...current,
                      [option.key]: !current[option.key],
                    }))
                  }
                  className={`flex items-center gap-2.5 sm:gap-3.5 rounded-xl border p-3 sm:p-4 text-left transition-all duration-200 lg:rounded-2xl lg:p-5 ${
                    selected[option.key]
                      ? "border-violet-300 bg-blue-900 text-white shadow-md shadow-blue-600/20"
                      : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition-all lg:h-10 lg:w-10 lg:rounded-xl lg:text-lg ${
                      selected[option.key]
                        ? "bg-white/20 ring-1 ring-white/30"
                        : "bg-neutral-100"
                    }`}
                  >
                    {selected[option.key] ? (
                      <Check className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      option.emoji
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-xs font-semibold sm:text-sm lg:text-base leading-tight truncate sm:whitespace-normal">
                      {option.label}
                    </strong>
                    <small
                      className={`hidden sm:block text-xs lg:text-sm mt-0.5 leading-snug ${
                        selected[option.key]
                          ? "text-violet-200"
                          : "text-neutral-500"
                      }`}
                    >
                      {option.detail}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 lg:text-base lg:p-5 lg:rounded-2xl"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold lg:h-6 lg:w-6 lg:text-sm">
              !
            </span>
            {error}
          </div>
        )}

        {/* Generate button */}
        <button
          type="button"
          disabled={busy}
          onClick={generate}
          className={cn(
            "mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 lg:mt-8 lg:py-5 lg:text-base lg:font-bold lg:rounded-2xl",
            busy
              ? "bg-neutral-700 cursor-wait"
              : "bg-neutral-900 shadow-neutral-600/25 hover:bg-neutral-700 active:scale-[0.99]",
          )}
        >
          <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
          <span>Generate prompt</span>
        </button>

        {/* Live Generation Progress Animation */}
        {busy && (
          <section
            aria-live="polite"
            className="mt-6 overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-fuchsia-50/70 p-6 shadow-xl shadow-violet-500/10 transition-all duration-300 sm:p-7 lg:mt-8 lg:rounded-3xl lg:p-8"
          >
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Disco Ball */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/35 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                  <div className="disco-ball h-8 w-8 animate-disco-spin" />
                  <span className="absolute -inset-1 animate-ping rounded-2xl bg-violet-400 opacity-25 [animation-duration:2s]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-violet-700 sm:text-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600" />
                      </span>
                      AI Prompt Generator
                    </span>
                    <span className="text-xs text-neutral-400 hidden sm:inline">
                      Step {loadingStep + 1} of {GENERATION_STEPS.length}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-neutral-900 sm:text-base lg:text-lg">
                    {GENERATION_STEPS[loadingStep].label}
                  </h3>
                </div>
              </div>
              <span className="text-xl sm:text-2xl animate-bounce [animation-duration:1.5s]">
                {GENERATION_STEPS[loadingStep].icon}
              </span>
            </div>

            {/* Dynamic animated progress bar */}
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-violet-100/80">
              <div
                className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${GENERATION_STEPS[loadingStep].progress}%` }}
              />
            </div>

            {/* Shimmer skeleton lines simulating live prompt composition */}
            <div className="mt-5 space-y-2 rounded-xl bg-white/80 p-4 border border-violet-100/70 backdrop-blur-sm sm:space-y-2.5 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-spin" />
                <span>Synthesizing output text parameters...</span>
              </div>
              <div className="h-3.5 w-full animate-disco-pulse rounded-md bg-violet-200/50" />
              <div className="h-3.5 w-[88%] animate-disco-pulse rounded-md bg-violet-200/40 [animation-delay:150ms]" />
              <div className="h-3.5 w-[65%] animate-disco-pulse rounded-md bg-violet-200/30 [animation-delay:300ms]" />
            </div>
          </section>
        )}

        {/* Generated prompt */}
        {prompt && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 shadow-md lg:mt-8 lg:rounded-3xl">
            <div className="flex items-center justify-between gap-4 border-b border-violet-100/70 px-5 py-4 sm:px-6 lg:px-8 lg:py-5">
              <p className="section-label lg:text-sm">
                <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                Generated prompt
              </p>
              <button
                type="button"
                onClick={copy}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs whitespace-nowrap font-semibold transition-all duration-200 lg:px-5 lg:py-2.5 lg:text-sm ${
                  copied
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                    : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 shadow-md "
                }`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                ) : (
                  <Copy className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                )}
                {copied ? "Copied!" : "Copy prompt"}
              </button>
            </div>
            <p className="whitespace-pre-wrap px-5 py-5 text-sm leading-7 text-neutral-700 sm:px-6 lg:px-8 lg:py-7 lg:text-lg lg:leading-8">
              {prompt}
            </p>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="flex gap-3.5 border-b border-neutral-100 pb-5 mb-1 lg:gap-4 lg:pb-6">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 lg:h-7 lg:w-7 lg:text-sm">
        {n}
      </span>
      <div>
        <h2 className="text-base font-bold text-neutral-900 lg:text-xl">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-neutral-500 lg:text-sm lg:mt-1">
          {text}
        </p>
      </div>
    </div>
  );
}
