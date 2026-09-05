"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Download,
  Maximize2,
  Loader2,
  Paintbrush,
  Sparkles,
  Upload,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "@/components/auth-dialog";

type Feature = "pose" | "background" | "lighting" | "outfit";
type PhotoType = "original" | "reference";

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

const valid = (file: File) =>
  ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
  file.size <= 10 * 1024 * 1024;

export default function ReframePage() {
  const [files, setFiles] = useState<Record<PhotoType, File | null>>({
    original: null,
    reference: null,
  });
  const [previews, setPreviews] = useState<Record<PhotoType, string | null>>({
    original: null,
    reference: null,
  });
  const [selected, setSelected] = useState<Record<Feature, boolean>>({
    pose: true,
    background: false,
    lighting: true,
    outfit: false,
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const inputs = useRef<Record<PhotoType, HTMLInputElement | null>>({
    original: null,
    reference: null,
  });

  useEffect(
    () => () =>
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url)),
    [previews],
  );

  useEffect(() => {
    if (authLoading || user) return;
    const timer = window.setTimeout(() => setLoginOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, user]);

  useEffect(() => {
    if (!previewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [previewOpen]);

  function setPhoto(kind: PhotoType, file?: File) {
    if (!file) return;
    if (!valid(file)) {
      setError("Choose a JPG, PNG, or WEBP image up to 10 MB.");
      return;
    }
    setError("");
    setFiles((current) => ({ ...current, [kind]: file }));
    setPreviews((current) => {
      if (current[kind]) URL.revokeObjectURL(current[kind]!);
      return { ...current, [kind]: URL.createObjectURL(file) };
    });
    setResult(null);
  }

  function drop(event: DragEvent<HTMLButtonElement>, kind: PhotoType) {
    event.preventDefault();
    setPhoto(kind, event.dataTransfer.files[0]);
  }

  async function reframe() {
    if (!files.original || !files.reference) {
      setError("Add both your original and reference image first.");
      return;
    }
    if (!Object.values(selected).some(Boolean)) {
      setError("Choose at least one visual to copy.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    const data = new FormData();
    data.append("original", files.original);
    data.append("reference", files.reference);
    data.append("preserve", JSON.stringify(selected));
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        setError("Please sign in to use Reframe.");
        return;
      }
      const response = await fetch("/api/reframe", {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error || "We could not create this edit.");
      setResult(body.image);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function downloadResult() {
    if (!result) return;
    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "remixkit-reframe.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(result, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-violet-500 selection:text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label justify-center">
            <Paintbrush className="h-4 w-4" /> Reframe image editing
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Reframe your image. Keep the you.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
            Upload your original and a reference image, choose the visual
            details to borrow, and create the edit without writing a prompt.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {(["original", "reference"] as PhotoType[]).map((kind, index) => (
            <section
              key={kind}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-3 border-b border-neutral-100 pb-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {kind === "original"
                      ? "Your original image"
                      : "Your reference image"}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {kind === "original"
                      ? "The subject and identity to preserve."
                      : "The look and visual direction to copy."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => inputs.current[kind]?.click()}
                onDrop={(event) => drop(event, kind)}
                onDragOver={(event) => event.preventDefault()}
                className="group mt-6 flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 transition-all hover:border-violet-300 hover:bg-violet-50/30"
              >
                {previews[kind] ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={previews[kind]!}
                      alt={`${kind} preview`}
                      fill
                      unoptimized
                      className="rounded-xl object-cover"
                    />
                    <span className="absolute bottom-3 right-3 rounded-full bg-neutral-900/85 px-3 py-1.5 text-xs font-semibold text-white">
                      Replace
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-neutral-200 transition-transform group-hover:scale-105">
                      <Upload className="h-6 w-6 text-neutral-500" />
                    </span>
                    <strong className="mt-4 text-sm font-semibold text-neutral-700">
                      Drop image here or browse
                    </strong>
                    <span className="mt-1.5 text-xs text-neutral-400">
                      JPG, PNG, or WEBP up to 10 MB
                    </span>
                  </>
                )}
              </button>
              <input
                ref={(node) => {
                  inputs.current[kind] = node;
                }}
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPhoto(kind, event.target.files?.[0])
                }
              />
            </section>
          ))}
        </div>

        <section className="mx-auto mt-6 max-w-4xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3 border-b border-neutral-100 pb-5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
              03
            </span>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                What should stay yours?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Everything else follows the reference image.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={selected[option.key]}
                onClick={() =>
                  setSelected((current) => ({
                    ...current,
                    [option.key]: !current[option.key],
                  }))
                }
                className={`flex min-h-[72px] items-center gap-2 rounded-lg border p-3 text-left transition-all sm:gap-3 sm:p-4 ${selected[option.key] ? "border-teal-300 bg-teal-800 text-white shadow-md shadow-teal-600/20" : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base sm:h-9 sm:w-9 ${selected[option.key] ? "bg-white/20 ring-1 ring-white/30" : "bg-neutral-100"}`}
                >
                  {selected[option.key] ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    option.emoji
                  )}
                </span>
                <span>
                  <strong className="block text-xs font-semibold leading-4 sm:text-sm">
                    {option.label}
                  </strong>
                  <small
                    className={`hidden text-xs leading-5 sm:block ${selected[option.key] ? "text-teal-100" : "text-neutral-500"}`}
                  >
                    {option.detail}
                  </small>
                </span>
              </button>
            ))}
          </div>
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={reframe}
            className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-neutral-900 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-neutral-700 disabled:cursor-wait disabled:bg-neutral-700"
          >
            {busy && (
              <span className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            )}
            {busy ? (
              <Loader2 className="relative h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            )}
            <span className="relative">
              {busy ? "Creating your edit..." : "Create my edit"}
            </span>
          </button>
        </section>

        {result && (
          <section className="animate-fade-up mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4 sm:px-7">
              <div>
                <p className="section-label">Your Reframe image</p>
              </div>
              <button
                type="button"
                onClick={downloadResult}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700"
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="group relative block min-h-[240px] w-full bg-neutral-100 p-3 sm:p-5"
              aria-label="View generated Reframe image full screen"
            >
              <Image
                src={result}
                alt="Generated Reframe edit"
                width={1536}
                height={1024}
                unoptimized
                className="mx-auto max-h-[720px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-neutral-950/80 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" /> View full image
              </span>
            </button>
          </section>
        )}
      </main>
      {previewOpen && result && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Generated Reframe image"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setPreviewOpen(false);
          }}
        >
          <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4">
            <div className="flex w-full items-center justify-between text-white">
              <p className="text-sm font-semibold">Your Reframe image</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadResult}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-900 transition hover:bg-neutral-200"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </div>
            <Image
              src={result}
              alt="Generated Reframe edit full screen"
              width={2048}
              height={1536}
              unoptimized
              className="max-h-[calc(100vh-9rem)] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      <AuthDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <SiteFooter />
    </div>
  );
}
