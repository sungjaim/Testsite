import data from "@/data/dresses.json";
import type { Locale } from "./i18n";

export type DressStatus = "available" | "rented";

export type Dress = {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  size: string;
  measurements: { height?: string; bust?: number; waist?: number; hip?: number; length?: number };
  colors: string[];
  price: number;
  deposit: number;
  status: DressStatus;
  images: string[];
  featured: boolean;
};

export const dresses = data as Dress[];

export function getDress(id: string) {
  return dresses.find((d) => d.id === id);
}

export function getFeaturedDresses(limit = 4) {
  return dresses.filter((d) => d.featured).slice(0, limit);
}
