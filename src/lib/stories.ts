import type { Category, Story } from "@/lib/db/schema";
import seedStories from "@/data/seed-stories.json";
import { getDb } from "@/lib/db";
import { stories } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export type StoryDTO = {
  id: string;
  headline: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  category: Category;
  publishedAt: string;
  ingestedAt: string;
};

function toDto(story: Story): StoryDTO {
  return {
    id: story.id,
    headline: story.headline,
    summary: story.summary,
    sourceName: story.sourceName,
    sourceUrl: story.sourceUrl,
    category: story.category as Category,
    publishedAt: story.publishedAt.toISOString(),
    ingestedAt: story.ingestedAt.toISOString(),
  };
}

function seedToDto(
  story: (typeof seedStories)[number],
  index: number,
): StoryDTO {
  return {
    id: `seed-${index}`,
    headline: story.headline,
    summary: story.summary,
    sourceName: story.sourceName,
    sourceUrl: story.sourceUrl,
    category: story.category as Category,
    publishedAt: story.publishedAt,
    ingestedAt: story.publishedAt,
  };
}

function getSeedStories(category?: Category): StoryDTO[] {
  const items = category
    ? seedStories.filter((s) => s.category === category || category === "top")
    : seedStories;

  return items.map(seedToDto);
}

export async function getStories(options?: {
  category?: Category;
  limit?: number;
}): Promise<StoryDTO[]> {
  const db = getDb();
  const limit = options?.limit ?? 50;

  if (!db) {
    const items = getSeedStories(options?.category);
    return items.slice(0, limit);
  }

  try {
    const query = db
      .select()
      .from(stories)
      .orderBy(desc(stories.publishedAt))
      .limit(limit);

    const rows =
      options?.category && options.category !== "top"
        ? await db
            .select()
            .from(stories)
            .where(eq(stories.category, options.category))
            .orderBy(desc(stories.publishedAt))
            .limit(limit)
        : await query;

    if (rows.length === 0) {
      return getSeedStories(options?.category).slice(0, limit);
    }

    return rows.map(toDto);
  } catch {
    return getSeedStories(options?.category).slice(0, limit);
  }
}

export async function getStoryById(id: string): Promise<StoryDTO | null> {
  if (id.startsWith("seed-")) {
    const index = Number.parseInt(id.replace("seed-", ""), 10);
    const item = seedStories[index];
    return item ? seedToDto(item, index) : null;
  }

  const db = getDb();
  if (!db) return null;

  try {
    const [row] = await db
      .select()
      .from(stories)
      .where(eq(stories.id, id))
      .limit(1);
    return row ? toDto(row) : null;
  } catch {
    return null;
  }
}

export async function getStoriesByIds(ids: string[]): Promise<StoryDTO[]> {
  const results = await Promise.all(ids.map((id) => getStoryById(id)));
  return results.filter((s): s is StoryDTO => s !== null);
}
