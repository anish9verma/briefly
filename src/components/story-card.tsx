"use client";

import { useSyncExternalStore } from "react";
import { Bookmark, ExternalLink, Share2 } from "lucide-react";
import type { StoryDTO } from "@/lib/stories";
import { relativeUsTime } from "@/lib/time";
import { CategoryPanel } from "@/components/category-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  isGuestBookmarked,
  toggleGuestBookmark,
} from "@/lib/bookmarks-client";

type StoryCardProps = {
  story: StoryDTO;
  className?: string;
  onBookmarkChange?: () => void;
};

function subscribeBookmarks(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function StoryCard({ story, className, onBookmarkChange }: StoryCardProps) {
  const bookmarked = useSyncExternalStore(
    subscribeBookmarks,
    () => isGuestBookmarked(story.id),
    () => false,
  );

  const handleBookmark = () => {
    toggleGuestBookmark(story.id);
    window.dispatchEvent(new Event("storage"));
    onBookmarkChange?.();
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/s/${story.id}`
        : `/s/${story.id}`;
    const text = `${story.headline}\n\nOriginally reported by ${story.sourceName}: ${story.sourceUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: story.headline, text, url });
        return;
      } catch {
        /* fall through */
      }
    }

    await navigator.clipboard.writeText(`${text}\n\n${url}`);
  };

  return (
    <article
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-card text-card-foreground",
        className,
      )}
    >
      <CategoryPanel category={story.category} sourceName={story.sourceName} />

      <div className="flex min-h-0 flex-1 flex-col px-5 py-5">
        <h1 className="font-serif text-2xl leading-tight tracking-tight">
          {story.headline}
        </h1>

        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
          {story.summary}
        </p>

        <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Originally reported by{" "}
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              {story.sourceName}
            </a>{" "}
            · {relativeUsTime(story.publishedAt)}
          </p>

          <div className="flex items-center gap-2">
            <Button asChild className="flex-1 gap-2">
              <a href={story.sourceUrl} target="_blank" rel="noopener noreferrer">
                Read full story
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={bookmarked ? "Remove bookmark" : "Save story"}
              onClick={handleBookmark}
            >
              <Bookmark
                className={cn("size-4", bookmarked && "fill-current")}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Share story"
              onClick={handleShare}
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
