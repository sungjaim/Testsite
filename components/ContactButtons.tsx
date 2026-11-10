import { siteConfig, telHref } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n";

export default function ContactButtons({ dict, className = "" }: { dict: Dictionary; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <a
        href={siteConfig.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      >
        {dict.common.inquireInstagram}
      </a>
      <a
        href={telHref}
        className="inline-flex items-center justify-center rounded-full border border-brand px-7 py-3.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white"
      >
        {dict.common.inquireCall}
      </a>
    </div>
  );
}
