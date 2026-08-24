"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import {
  Check,
  Download,
  Loader2,
  Paintbrush,
  Sparkles,
  Upload,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

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

const packs = [
  { id: "poco", name: "Poco / Trial", price: 10, credits: 3 },
  { id: "mini", name: "Mini", price: 29, credits: 11 },
  { id: "standard", name: "Standard", price: 59, credits: 25 },
  { id: "super", name: "Super", price: 99, credits: 45 },
  { id: "mega", name: "Mega", price: 149, credits: 75 },
] as const;

export default function StyleShiftPage() {
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
  const [credits, setCredits] = useState<number | null>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
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
    if (!user) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      fetch("/api/credits", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      })
        .then((response) => response.json())
        .then((body) =>
          setCredits(typeof body.credits === "number" ? body.credits : null),
        );
    });
  }, [user]);

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

  async function styleShift() {
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
        setError("Please sign in to use StyleShift.");
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
      setCredits((current) =>
        current === null ? current : Math.max(0, current - 1),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function buyCredits(packId: (typeof packs)[number]["id"]) {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      setError("Please sign in to buy credits.");
      return;
    }
    setPaymentBusy(true);
    setError("");
    try {
      const selectedPack = packs.find((pack) => pack.id === packId)!;
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pack: packId }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok)
        throw new Error(order.error || "Unable to start payment.");
      await new Promise<void>((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: "INR",
          name: "RemixKit",
          description: `${selectedPack.credits} StyleShift credits`,
          order_id: order.orderId,
          prefill: { email: user?.email || "" },
          handler: async (payment: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...payment,
                credits: selectedPack.credits,
              }),
            });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok) {
              reject(
                new Error(verified.error || "Payment verification failed."),
              );
              return;
            }
            setCredits(verified.credits);
            resolve();
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
        });
        checkout.on("payment.failed", () =>
          reject(new Error("Payment failed. No credits were added.")),
        );
        checkout.open();
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment failed.");
    } finally {
      setPaymentBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-violet-500 selection:text-white">
      <SiteHeader />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {!authLoading && !user && (
          <section className="mx-auto mb-8 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-center sm:flex-row sm:text-left">
            <div>
              <strong className="block text-sm text-violet-900">
                Sign in to use StyleShift
              </strong>
              <span className="text-sm text-violet-700">
                Google sign-in includes 5 free credits.
              </span>
            </div>
            <Link
              href="/login"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Sign in with Google
            </Link>
          </section>
        )}
        {user && (
          <section className="mx-auto mb-8 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 sm:flex-row">
            <div>
              <strong className="block text-sm text-neutral-900">
                StyleShift credits: {credits ?? "..."}
              </strong>
              <span className="text-sm text-neutral-500">
                One credit creates one image.
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {packs.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  disabled={paymentBusy}
                  onClick={() => buyCredits(pack.id)}
                  className="rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50"
                >
                  {pack.name} · ₹{pack.price}
                </button>
              ))}
            </div>
          </section>
        )}
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label justify-center">
            <Paintbrush className="h-4 w-4" /> StyleShift image editing
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            StyleShift your image. Keep the you.
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
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${selected[option.key] ? "border-violet-300 bg-violet-700 text-white shadow-md shadow-violet-600/20" : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${selected[option.key] ? "bg-white/20 ring-1 ring-white/30" : "bg-neutral-100"}`}
                >
                  {selected[option.key] ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    option.emoji
                  )}
                </span>
                <span>
                  <strong className="block text-sm font-semibold">
                    {option.label}
                  </strong>
                  <small
                    className={
                      selected[option.key]
                        ? "text-violet-100"
                        : "text-neutral-500"
                    }
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
            onClick={styleShift}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-neutral-700 disabled:cursor-wait disabled:bg-neutral-700"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {busy ? "Creating your edit..." : "Create my edit"}
          </button>
        </section>

        {result && (
          <section className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4 sm:px-7">
              <div>
                <p className="section-label">Your StyleShift image</p>
                <h2 className="mt-1 text-xl font-bold text-neutral-900">
                  Made for your point of view.
                </h2>
              </div>
              <a
                href={result}
                download="remixkit-styleshift.png"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
            <div className="relative min-h-[240px] w-full max-h-[720px] aspect-video">
              <Image
                src={result}
                alt="Generated StyleShift edit"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
