"use client";

import { useState } from "react";
import { Loader2, LogIn, Wand2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signInWithGoogle: signInWithGoogleAuth } = useAuth();

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogleAuth();
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Google sign-in failed.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xl shadow-neutral-200/50 sm:p-10">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2 font-bold text-neutral-900"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Wand2 className="h-5 w-5" />
          </span>
          RemixKit
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-neutral-900">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Sign in to use StyleShift and receive 5 free credits.
        </p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          Continue with Google
        </button>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <p className="mt-6 text-xs leading-5 text-neutral-400">
          Your account is used to protect your credits and purchases.
        </p>
      </section>
    </main>
  );
}
