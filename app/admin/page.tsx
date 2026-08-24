"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Wand2,
  Sparkles,
  X,
  LogOut,
} from "lucide-react";
import { supabase, type Prompt } from "@/lib/supabase";
import { CATEGORIES, categoryClass, categoryEmoji } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { AuthLogin } from "@/components/auth-login";
import { Button } from "@/components/ui/button";

type Status = "idle" | "uploading-image" | "saving" | "success" | "error";

const STATUS_LABEL: Record<Exclude<Status, "idle">, string> = {
  "uploading-image": "Uploading image...",
  saving: "Saving prompt data...",
  success: "Successfully published!",
  error: "Something went wrong",
};

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [promptText, setPromptText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [recent, setRecent] = useState<Prompt[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadRecent();
  }, []);

  async function loadRecent() {
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    setRecent((data as Prompt[]) ?? []);
  }

  function onFileChange(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function resetForm() {
    setTitle("");
    setCategory(CATEGORIES[0].value);
    setPromptText("");
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canSubmit =
    status !== "uploading-image" &&
    status !== "saving" &&
    title.trim() &&
    promptText.trim() &&
    file !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("uploading-image");
    setErrorMsg(null);

    try {
      if (!file) throw new Error("Please choose an image.");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}.${ext}`;
      const filePath = `prompts/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from("prompt-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (upErr) throw new Error(`Image upload failed: ${upErr.message}`);

      const { data: pub } = supabase.storage
        .from("prompt-images")
        .getPublicUrl(filePath);
      const imageUrl = pub?.publicUrl ?? null;

      setStatus("saving");

      const { error: insErr } = await supabase.from("prompts").insert({
        title: title.trim(),
        prompt_text: promptText.trim(),
        category,
        image_url: imageUrl,
      });

      if (insErr) throw new Error(`Save failed: ${insErr.message}`);

      setStatus("success");
      resetForm();
      await loadRecent();
      setTimeout(() => setStatus((s) => (s === "success" ? "idle" : s)), 3500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
      setTimeout(() => setStatus((s) => (s === "error" ? "idle" : s)), 5000);
    }
  }

  const busy = status === "uploading-image" || status === "saving";

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <AuthLogin />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-violet-500 selection:text-white">
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:max-w-6xl xl:max-w-7xl lg:px-8 lg:py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-neutral-900 flex-shrink-0 lg:text-base"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5" />
            <span className="hidden sm:inline">Back to Gallery</span>
          </Link>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 flex-shrink-0 lg:h-9 lg:w-9">
              <Wand2 className="h-4 w-4 text-white lg:h-4.5 lg:w-4.5" />
            </div>
            <span className="text-sm font-bold text-neutral-900 hidden sm:inline lg:text-base">
              RemixKit
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            <span className="text-xs text-neutral-500 hidden sm:inline max-w-[180px] truncate lg:text-sm">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="gap-2 whitespace-nowrap lg:text-sm lg:px-4"
            >
              <LogOut className="h-4 w-4 flex-shrink-0 lg:h-4.5 lg:w-4.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-6xl xl:max-w-7xl lg:px-8 lg:py-14">
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 lg:text-sm">
            <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            Admin Panel
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Create a new pin
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 lg:text-base lg:max-w-2xl lg:mt-3">
            Upload a preview image, write the prompt, and publish it to the
            gallery.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:gap-10">
          <form onSubmit={handleSubmit} className="form-card lg:p-8 xl:p-10 lg:rounded-3xl">
            <label className="mb-2 block text-sm font-semibold text-neutral-800 lg:text-base">
              Preview Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f && f.type.startsWith("image/")) onFileChange(f);
              }}
              className={cn(
                "group relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all lg:rounded-3xl",
                previewUrl
                  ? "border-neutral-400"
                  : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50",
              )}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between lg:bottom-4 lg:left-4 lg:right-4">
                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-800 backdrop-blur lg:text-sm lg:px-3">
                      {file?.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileChange(null);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur transition hover:bg-white lg:h-9 lg:w-9"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400 lg:gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 transition group-hover:bg-neutral-200 lg:h-16 lg:w-16">
                    <Upload className="h-6 w-6 text-neutral-500 lg:h-7 lg:w-7" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-600 lg:text-base">
                    Click or drag to upload
                  </span>
                  <span className="text-xs text-neutral-400 lg:text-sm">
                    PNG, JPG, WEBP up to 10MB
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0 pointer-events-auto"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="mt-6 lg:mt-8">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-neutral-800 lg:text-base"
              >
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cartoon/Chibi Plush Portrait"
                className="form-input lg:py-3.5 lg:text-base"
              />
            </div>

            <div className="mt-6 lg:mt-8">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-neutral-800 lg:text-base"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input appearance-none pr-10 lg:py-3.5 lg:text-base"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 lg:h-5 lg:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="mt-6 lg:mt-8">
              <label
                htmlFor="prompt"
                className="mb-2 block text-sm font-semibold text-neutral-800 lg:text-base"
              >
                Prompt Text
              </label>
              <textarea
                id="prompt"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={6}
                placeholder="Write the full AI image editing prompt here..."
                className="form-input resize-none leading-relaxed lg:p-4 lg:text-base"
              />
            </div>

            {status !== "idle" && (
              <div
                className={cn(
                  "mt-5 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium lg:p-4 lg:text-base",
                  status === "success" &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                  status === "error" && "border-red-200 bg-red-50 text-red-700",
                  (status === "uploading-image" || status === "saving") &&
                    "border-neutral-200 bg-neutral-50 text-neutral-700",
                )}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
                ) : status === "error" ? (
                  <AlertCircle className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
                ) : (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin lg:h-5 lg:w-5" />
                )}
                <span>
                  {status === "error" && errorMsg
                    ? errorMsg
                    : STATUS_LABEL[status]}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition lg:py-4 lg:text-base lg:font-bold",
                canSubmit
                  ? "bg-neutral-900 text-white hover:bg-neutral-700"
                  : "cursor-not-allowed bg-neutral-100 text-neutral-400",
              )}
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin lg:h-5 lg:w-5" />
                  {
                    STATUS_LABEL[
                      status === "uploading-image"
                        ? "uploading-image"
                        : "saving"
                    ]
                  }
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                  Publish Pin
                </>
              )}
            </button>
          </form>

          <aside className="space-y-4 lg:space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 lg:text-base">
              Recently published
            </h2>
            {recent.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-400 lg:p-8 lg:text-base lg:rounded-3xl">
                No prompts published yet.
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {recent.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3 transition hover:shadow-sm lg:p-4 lg:rounded-2xl"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl lg:h-20 lg:w-20">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                          <ImageIcon className="h-5 w-5 text-neutral-300 lg:h-6 lg:w-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-neutral-900 lg:text-base">
                        {p.title}
                      </p>
                      <span
                        className={cn(
                          "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold lg:text-xs lg:px-2.5 lg:py-1",
                          categoryClass(p.category),
                        )}
                      >
                        {categoryEmoji(p.category)} {p.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
