import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/categories";
import type { Category } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

type CategoryPanelProps = {
  category: Category;
  sourceName: string;
  className?: string;
};

export function CategoryPanel({
  category,
  sourceName,
  className,
}: CategoryPanelProps) {
  return (
    <div
      className={cn(
        "relative flex h-44 shrink-0 flex-col justify-end bg-gradient-to-br p-5 sm:h-52",
        CATEGORY_COLORS[category],
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="relative space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          {CATEGORY_LABELS[category]}
        </p>
        <p className="font-serif text-lg text-white/90">{sourceName}</p>
      </div>
    </div>
  );
}
