"use client";

import { useMemo, useState } from "react";
import type { Dress } from "@/lib/dresses";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import DressCard from "./DressCard";

type Props = { dresses: Dress[]; lang: Locale; dict: Dictionary };

const chip = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition-colors ${
    active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand hover:text-brand"
  }`;

export default function DressBrowser({ dresses, lang, dict }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const sizes = useMemo(() => {
    const unique = [...new Set(dresses.map((d) => d.size))];
    // numeric (child) sizes first in ascending order, then letter sizes in a sensible order
    const order = ["XS", "S", "M", "L", "XL"];
    return unique.sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      if (!Number.isNaN(na)) return -1;
      if (!Number.isNaN(nb)) return 1;
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [dresses]);
  const colors = useMemo(() => [...new Set(dresses.flatMap((d) => d.colors))], [dresses]);

  const filtered = dresses.filter(
    (d) => (!size || d.size === size) && (!color || d.colors.includes(color)) && (!onlyAvailable || d.status === "available"),
  );
  const active = Boolean(size || color || onlyAvailable);
  const colorLabel = (c: string) => (dict.colors as Record<string, string>)[c] ?? c;

  const groups = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">{dict.dresses.size}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={size === null} className={chip(size === null)} onClick={() => setSize(null)}>
            {dict.dresses.all}
          </button>
          {sizes.map((s) => (
            <button key={s} type="button" aria-pressed={size === s} className={chip(size === s)} onClick={() => setSize(size === s ? null : s)}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">{dict.dresses.color}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={color === null} className={chip(color === null)} onClick={() => setColor(null)}>
            {dict.dresses.all}
          </button>
          {colors.map((c) => (
            <button key={c} type="button" aria-pressed={color === c} className={chip(color === c)} onClick={() => setColor(color === c ? null : c)}>
              {colorLabel(c)}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">{dict.dresses.availability}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!onlyAvailable} className={chip(!onlyAvailable)} onClick={() => setOnlyAvailable(false)}>
            {dict.dresses.all}
          </button>
          <button type="button" aria-pressed={onlyAvailable} className={chip(onlyAvailable)} onClick={() => setOnlyAvailable(true)}>
            {dict.dresses.onlyAvailable}
          </button>
        </div>
      </fieldset>
    </div>
  );

  return (
    <div>
      <div className="mb-8 border-y border-line py-5">
        <div className="flex items-center justify-between md:hidden">
          <button
            type="button"
            aria-expanded={showFilters}
            aria-controls="dress-filters"
            onClick={() => setShowFilters((v) => !v)}
            className="text-sm font-medium text-brand"
          >
            {showFilters ? dict.dresses.hideFilters : dict.dresses.showFilters}
            {active && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blush align-middle" />}
          </button>
          <span className="text-sm text-muted" aria-live="polite">{format(dict.dresses.count, { count: filtered.length })}</span>
        </div>
        <div id="dress-filters" className={`${showFilters ? "mt-6 block" : "hidden"} md:mt-0 md:block`}>
          {groups}
        </div>
        <div className="mt-6 hidden items-center justify-between md:flex">
          <span className="text-sm text-muted" aria-live="polite">{format(dict.dresses.count, { count: filtered.length })}</span>
          {active && (
            <button
              type="button"
              className="text-sm text-brand underline-offset-4 hover:underline"
              onClick={() => {
                setSize(null);
                setColor(null);
                setOnlyAvailable(false);
              }}
            >
              {dict.dresses.reset}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted">{dict.dresses.empty}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <li key={d.id}>
              <DressCard dress={d} lang={lang} dict={dict} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
