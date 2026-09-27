import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { getStoryById } from "@/lib/stories";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) return { title: "Story" };
  return {
    title: story.headline,
    description: story.summary,
    openGraph: {
      title: story.headline,
      description: story.summary,
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) notFound();

  return (
    <AppShell>
      <div className="border-b border-border/60 px-4 py-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to feed
          </Link>
        </Button>
      </div>
      <div className="min-h-[calc(100dvh-3.25rem-3.5rem-3rem)] pb-20">
        <StoryCard story={story} />
      </div>
    </AppShell>
  );
}
