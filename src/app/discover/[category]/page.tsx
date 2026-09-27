import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SwipeFeed } from "@/components/swipe-feed";
import { CATEGORY_LABELS, isCategory } from "@/lib/categories";
import { getStories } from "@/lib/stories";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) return { title: "Category" };
  return { title: CATEGORY_LABELS[category] };
}

export default async function CategoryFeedPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const stories = await getStories({ category, limit: 50 });

  return (
    <AppShell>
      <div className="border-b border-border/60 px-4 py-3">
        <h1 className="font-serif text-xl">{CATEGORY_LABELS[category]}</h1>
      </div>
      <div className="h-[calc(100dvh-3.25rem-3.5rem-3rem)]">
        <SwipeFeed
          stories={stories}
          emptyMessage={`No ${CATEGORY_LABELS[category].toLowerCase()} stories yet.`}
        />
      </div>
    </AppShell>
  );
}
