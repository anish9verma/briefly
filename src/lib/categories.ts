import type { Category } from "@/lib/db/schema";

export const CATEGORY_LABELS: Record<Category, string> = {
  top: "Top Stories",
  us: "US",
  politics: "Politics",
  world: "World",
  business: "Business",
  tech: "Tech",
  sports: "Sports",
  entertainment: "Entertainment",
  science: "Science",
  health: "Health",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  top: "from-slate-700 to-slate-900",
  us: "from-blue-900 to-indigo-950",
  politics: "from-red-950 to-slate-900",
  world: "from-emerald-950 to-slate-900",
  business: "from-amber-950 to-slate-900",
  tech: "from-violet-950 to-slate-900",
  sports: "from-green-950 to-slate-900",
  entertainment: "from-pink-950 to-slate-900",
  science: "from-cyan-950 to-slate-900",
  health: "from-teal-950 to-slate-900",
};

export function isCategory(value: string): value is Category {
  return value in CATEGORY_LABELS;
}
