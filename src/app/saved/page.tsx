"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SwipeFeed } from "@/components/swipe-feed";
import type { StoryDTO } from "@/lib/stories";
import { getGuestBookmarks } from "@/lib/bookmarks-client";

async function fetchSavedStories(ids: string[]): Promise<StoryDTO[]> {
  if (ids.length === 0) return [];
  const res = await fetch(`/api/stories?ids=${ids.join(",")}`);
  if (!res.ok) return [];
  return res.json() as Promise<StoryDTO[]>;
}

export default function SavedPage() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [stories, setStories] = useState<StoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const ids = getGuestBookmarks();
      if (cancelled) return;
      setBookmarkIds(ids);

      if (ids.length === 0) {
        setStories([]);
        setLoading(false);
        return;
      }

      const data = await fetchSavedStories(ids);
      if (!cancelled) {
        setStories(data);
        setLoading(false);
      }
    }

    void refresh();

    const onStorage = () => {
      void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <AppShell>
      <div className="border-b border-border/60 px-4 py-4">
        <h1 className="font-serif text-2xl">Saved</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stories bookmarked in this browser
          {bookmarkIds.length > 0 ? ` (${bookmarkIds.length})` : ""}
        </p>
      </div>
      <div className="h-[calc(100dvh-3.25rem-3.5rem-4.5rem)]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading saved stories…
          </div>
        ) : (
          <SwipeFeed
            stories={stories}
            emptyMessage="No saved stories yet. Tap the bookmark icon on any card."
          />
        )}
      </div>
    </AppShell>
  );
}
