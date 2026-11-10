import type { Dictionary } from "@/lib/i18n";
import type { DressStatus } from "@/lib/dresses";

export default function StatusBadge({ status, dict, className = "" }: { status: DressStatus; dict: Dictionary; className?: string }) {
  const available = status === "available";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        available ? "bg-white text-brand ring-1 ring-brand/25" : "bg-blush-soft text-ink ring-1 ring-blush"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-brand" : "bg-blush"}`} />
      {available ? dict.common.available : dict.common.rented}
    </span>
  );
}
