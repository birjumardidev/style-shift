import type { Metadata } from "next";
import { Clock3, LockKeyhole, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Under maintenance",
  description: "RemixKit is being updated and will be back shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-6 py-16 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.34), transparent 42%), radial-gradient(circle at 10% 90%, rgba(236, 72, 153, 0.18), transparent 32%)",
        }}
      />

      <section className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-2xl shadow-violet-950/40">
          <Sparkles className="h-7 w-7 text-violet-300" aria-hidden />
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-violet-300">
          RemixKit
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          We are making things better.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-neutral-400 sm:text-lg">
          The site is temporarily unavailable while we work on an update. It
          will be back shortly.
        </p>

        <div className="mx-auto mt-10 grid max-w-sm gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <Clock3 className="h-5 w-5 text-violet-300" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-white">In progress</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              We are polishing the experience.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <LockKeyhole className="h-5 w-5 text-violet-300" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-white">
              Coming back soon
            </p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Thanks for your patience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
