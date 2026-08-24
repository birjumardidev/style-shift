"use client";

import Link from "next/link";
import { Menu, Wand2, X, Paintbrush } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Prompt Library" },
  { href: "/generate", label: "Image to Prompt" },
  { href: "/reframe", label: "StyleShift" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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

        {/* CTA */}
        <Link
          href="/reframe"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/15 active:scale-[0.98] lg:px-7 lg:py-3 lg:text-[15px]"
        >
          <Paintbrush className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          StyleShift
        </Link>

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
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <Link
              href="/reframe"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              <Paintbrush className="h-3.5 w-3.5" />
              StyleShift
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
