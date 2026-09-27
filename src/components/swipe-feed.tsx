"use client";

import { useEffect, useRef, useState } from "react";
import type { StoryDTO } from "@/lib/stories";
import { StoryCard } from "@/components/story-card";
import { cn } from "@/lib/utils";

type SwipeFeedProps = {
  stories: StoryDTO[];
  emptyMessage?: string;
  className?: string;
};

export function SwipeFeed({
  stories,
  emptyMessage = "No stories yet. Check back soon.",
  className,
}: SwipeFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const height = container.clientHeight;
      if (height === 0) return;
      const index = Math.round(container.scrollTop / height);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [stories.length]);

  if (stories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full", className)}>
      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((story) => (
          <section
            key={story.id}
            className="h-full snap-start snap-always pb-16"
          >
            <StoryCard story={story} />
          </section>
        ))}
      </div>

      {stories.length > 1 && (
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
          {stories.map((story, i) => (
            <span
              key={story.id}
              className={cn(
                "size-1.5 rounded-full transition-all",
                i === activeIndex
                  ? "h-4 bg-foreground"
                  : "bg-foreground/25",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
