import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Dictionary, type Locale } from "@/lib/i18n";
import type { Dress } from "@/lib/dresses";
import StatusBadge from "./StatusBadge";

export default function DressCard({ dress, lang, dict, priority = false }: { dress: Dress; lang: Locale; dict: Dictionary; priority?: boolean }) {
  const rented = dress.status === "rented";
  return (
    <Link href={`/${lang}/dresses/${dress.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-blush-soft">
        <Image
          src={dress.images[0]}
          alt={dress.name[lang]}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${rented ? "opacity-80" : ""}`}
        />
        <StatusBadge status={dress.status} dict={dict} className="absolute left-3 top-3" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl transition-colors group-hover:text-brand">{dress.name[lang]}</h3>
        <span className="shrink-0 text-sm text-muted">{dress.size}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{formatPrice(dress.price, lang, dict)}</p>
    </Link>
  );
}
