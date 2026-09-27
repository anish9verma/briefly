import { AppShell } from "@/components/app-shell";
import { SwipeFeed } from "@/components/swipe-feed";
import { getStories } from "@/lib/stories";

export default async function HomePage() {
  const stories = await getStories({ category: "top", limit: 50 });

  return (
    <AppShell>
      <div className="h-[calc(100dvh-3.25rem-3.5rem)]">
        <SwipeFeed stories={stories} />
      </div>
    </AppShell>
  );
}
