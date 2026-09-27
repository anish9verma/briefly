import { getDb } from "@/lib/db";
import { stories, type NewStory } from "@/lib/db/schema";
import { fetchAllowlistedFeeds, fetchNewsApiHeadlines } from "./rss";
import { summarizeItem } from "./summarizer";

export type IngestResult = {
  fetched: number;
  inserted: number;
  skipped: number;
  errors: string[];
};

export async function runIngest(): Promise<IngestResult> {
  const result: IngestResult = {
    fetched: 0,
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  const db = getDb();
  if (!db) {
    result.errors.push("DATABASE_URL not configured");
    return result;
  }

  const [rssItems, apiItems] = await Promise.all([
    fetchAllowlistedFeeds(),
    fetchNewsApiHeadlines(),
  ]);

  const seen = new Set<string>();
  const items = [...rssItems, ...apiItems].filter((item) => {
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });

  result.fetched = items.length;

  for (const item of items) {
    try {
      const brief = await summarizeItem(item);
      if (!brief) {
        result.skipped++;
        continue;
      }

      const row: NewStory = {
        headline: brief.headline,
        summary: brief.summary,
        sourceName: item.sourceName,
        sourceUrl: item.link,
        category: brief.category,
        publishedAt: item.publishedAt,
        snippet: item.snippet,
      };

      await db
        .insert(stories)
        .values(row)
        .onConflictDoNothing({ target: stories.sourceUrl });

      result.inserted++;
    } catch (error) {
      result.skipped++;
      result.errors.push(
        `Failed ${item.link}: ${error instanceof Error ? error.message : "unknown"}`,
      );
    }
  }

  return result;
}
