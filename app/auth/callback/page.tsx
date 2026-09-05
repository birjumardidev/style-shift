"use client";

import { Suspense, useEffect, useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authCallbackPath } from "@/lib/auth-config";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function completeSignIn() {
      const authError =
        searchParams.get("error_description") || searchParams.get("error");
      if (authError) {
        setError(authError);
        return;
      }
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError("Google sign-in could not be completed. Please try again.");
          return;
        }
      }
      const queryNext = searchParams.get("next");
      const storedNext = sessionStorage.getItem("auth-return-to");
      const next = queryNext || storedNext;
      const safeNext =
        next?.startsWith("/") && !next.startsWith("//") ? next : "/reframe";
      sessionStorage.removeItem("auth-return-to");
      if (!cancelled) router.replace(safeNext || authCallbackPath);
    }
    completeSignIn();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <section className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xl shadow-neutral-200/50">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white">
          <Wand2 className="h-6 w-6" />
        </span>
        {error ? (
          <>
            <h1 className="mt-5 text-xl font-bold text-neutral-900">
              Sign-in failed
            </h1>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-6 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Return to login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mt-6 h-6 w-6 animate-spin text-violet-600" />
            <p className="mt-3 text-sm text-neutral-500">
              Completing Google sign-in...
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-neutral-50">
          <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
