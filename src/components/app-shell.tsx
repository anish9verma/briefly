import Link from "next/link";
import { categories } from "@/lib/db/schema";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col border-x border-border/40 bg-background shadow-2xl shadow-black/20">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="font-serif text-xl tracking-tight">
          Briefly
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          US News
        </span>
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 pb-24">
      {categories.map((category) => (
        <Link
          key={category}
          href={category === "top" ? "/" : `/discover/${category}`}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white shadow-sm transition-transform hover:scale-[1.02]",
            CATEGORY_COLORS[category],
          )}
        >
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          <p className="relative font-serif text-lg">{CATEGORY_LABELS[category]}</p>
          <p className="relative mt-1 text-xs text-white/70">Swipe to read</p>
        </Link>
      ))}
    </div>
  );
}
