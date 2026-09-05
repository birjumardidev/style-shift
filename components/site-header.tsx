"use client";

import Link from "next/link";
import {
  Menu,
  Wand2,
  X,
  Paintbrush,
  ChevronDown,
  LogIn,
  LogOut,
  Coins,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { AuthDialog } from "@/components/auth-dialog";

const links = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Prompt Library" },
  { href: "/generate", label: "Image to Prompt" },
  { href: "/reframe", label: "Reframe" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const { user, loading, signOut } = useAuth();

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

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:px-12 lg:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 shadow-md shadow-violet-500/25 transition-all duration-300 group-hover:shadow-violet-500/40 group-hover:scale-105 lg:h-10 lg:w-10">
            <Wand2 className="h-[17px] w-[17px] text-white lg:h-5 lg:w-5" />
          </span>
          <span className="text-[1.05rem] font-bold tracking-tight text-neutral-900 lg:text-lg">
            RemixKit
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1.5 sm:flex lg:gap-2"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 transition-all duration-200 hover:text-neutral-900 hover:bg-neutral-100 lg:px-4.5 lg:py-2.5 lg:text-base lg:font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Account / CTA */}
        {!loading && user ? (
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-3 text-left transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              {avatar ? (
                <span
                  aria-hidden="true"
                  className="h-8 w-8 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${avatar})` }}
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {initials}
                </span>
              )}
              <span className="max-w-24 truncate text-sm font-semibold text-neutral-800">
                {name}
              </span>
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-900/10">
                <div className="border-b border-neutral-100 px-2 pb-3">
                  <p className="truncate text-sm font-bold text-neutral-900">
                    {name}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center justify-between px-2 py-3 text-sm">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <Coins className="h-4 w-4 text-violet-600" /> Credits
                  </span>
                  <strong className="text-neutral-900">
                    {credits ?? "..."}
                  </strong>
                </div>
                <Link
                  href="/reframe"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <Paintbrush className="h-4 w-4" /> Open Reframe
                </Link>
                <Link
                  href="/credits"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <Coins className="h-4 w-4" /> Buy credits
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 lg:px-6 lg:py-3"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </button>
        )}

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all duration-200 hover:bg-neutral-50 sm:hidden"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="h-4.5 w-4.5" />
          ) : (
            <Menu className="h-4.5 w-4.5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="border-t border-neutral-100 bg-white/95 backdrop-blur-xl px-4 pb-4 pt-3 sm:hidden"
          aria-label="Mobile navigation"
        >
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!loading && user && (
            <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="flex items-center gap-3">
                {avatar ? (
                  <span
                    aria-hidden="true"
                    className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${avatar})` }}
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {initials}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-900">
                    {name}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {credits ?? "..."} credits
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-neutral-100">
            {!loading && user && (
              <Link
                href="/credits"
                onClick={() => setOpen(false)}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <Coins className="h-4 w-4 text-violet-600" /> Buy credits
              </Link>
            )}
            <Link
              href="/reframe"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              <Paintbrush className="h-3.5 w-3.5" />
              Reframe
            </Link>
          </div>
        </nav>
      )}
      <AuthDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
}
