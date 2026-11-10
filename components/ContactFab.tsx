"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig, telHref } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n";

/** Floating contact button shown on every page. Opens a small menu with Instagram and phone. */
export default function ContactFab({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item =
    "flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-ink shadow-lg shadow-brand/10 transition-colors hover:border-brand hover:text-brand";

  return (
    <div
      ref={root}
      className="fixed bottom-0 right-0 z-50 flex flex-col items-end gap-3 p-5"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))", paddingRight: "max(1.25rem, env(safe-area-inset-right))" }}
    >
      {open && (
        <div id="fab-menu" role="group" aria-label={dict.fab.label} className="flex animate-fade-up flex-col items-end gap-2">
          <a href={telHref} className={item}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
            </svg>
            {dict.common.call}
          </a>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className={item}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
            </svg>
            {dict.common.instagram}
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="fab-menu"
        className="flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white shadow-xl shadow-brand/30 transition-colors hover:bg-brand-dark"
      >
        {open ? dict.fab.close : dict.fab.open}
      </button>
    </div>
  );
}
