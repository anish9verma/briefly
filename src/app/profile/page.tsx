"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { categories } from "@/lib/db/schema";
import { CATEGORY_LABELS } from "@/lib/categories";
import {
  getFollowedCategories,
  setFollowedCategories,
} from "@/lib/bookmarks-client";
import { cn } from "@/lib/utils";

function subscribeCategories(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const followed = useSyncExternalStore(
    subscribeCategories,
    getFollowedCategories,
    () => [] as string[],
  );

  const toggleCategory = (category: string) => {
    const next = followed.includes(category)
      ? followed.filter((c) => c !== category)
      : [...followed, category];
    setFollowedCategories(next);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AppShell>
      <div className="space-y-6 px-4 py-6 pb-24">
        <div>
          <h1 className="font-serif text-2xl">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reading works without an account. Bookmarks stay in this browser.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </h2>
          <Button variant="outline" className="w-full" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </Button>
        </section>

        <Separator />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Topics you follow
          </h2>
          <p className="text-sm text-muted-foreground">
            Used to personalize your feed later. Stored locally for now.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c !== "top")
              .map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    followed.includes(category)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-2 text-sm">
          <h2 className="font-semibold uppercase tracking-wide text-muted-foreground">
            Legal
          </h2>
          <Link href="/privacy" className="block text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="block text-foreground hover:underline">
            Terms of Use
          </Link>
          <p className="pt-2 text-muted-foreground">
            DMCA:{" "}
            <a href="mailto:dmca@briefly.news" className="underline">
              dmca@briefly.news
            </a>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
