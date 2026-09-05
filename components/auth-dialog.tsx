"use client";

import { Loader2, LogIn, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/use-auth";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { signInWithGoogle } = useAuth();

  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  async function continueWithGoogle() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle(
        `${window.location.pathname}${window.location.search}`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Google sign-in failed.",
      );
      setBusy(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-neutral-950/55 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onOpenChange(false);
      }}
    >
      <section className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-7 shadow-2xl shadow-neutral-900/20 sm:p-9">
        <button
          type="button"
          aria-label="Close sign-in dialog"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
          ✦
        </div>
        <h2
          id="auth-dialog-title"
          className="mt-6 text-2xl font-bold tracking-tight text-neutral-900"
        >
          Sign in to use Reframe
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
          Continue with Google to edit images, save your work, and receive 5
          free credits.
        </p>
        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={busy}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          Continue with Google
        </button>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <p className="mt-5 text-center text-xs text-neutral-400">
          Your session works across the whole RemixKit website.
        </p>
      </section>
    </div>,
    document.body,
  );
}
