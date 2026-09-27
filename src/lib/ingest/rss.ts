import Parser from "rss-parser";
import type { Category } from "@/lib/db/schema";
import { ALLOWLISTED_FEEDS, isBlockedUrl } from "./feeds";

export type RawFeedItem = {
  title: string;
  link: string;
  snippet: string;
  publishedAt: Date;
  sourceName: string;
  defaultCategory: Category;
};

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Briefly/1.0 (US news aggregator; +https://briefly.news)",
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferCategory(text: string, fallback: Category): Category {
  const lower = text.toLowerCase();
  if (/election|congress|senate|president|policy|white house/.test(lower))
    return "politics";
  if (/nfl|nba|mlb|olympic|championship|game/.test(lower)) return "sports";
  if (/stock|market|economy|business|trade/.test(lower)) return "business";
  if (/tech|ai|software|cyber|space|nasa|satellite/.test(lower))
    return "tech";
  if (/health|cdc|vaccine|disease|medical|nih/.test(lower)) return "health";
  if (/climate|research|study|scientist/.test(lower)) return "science";
  return fallback;
}

export async function fetchAllowlistedFeeds(): Promise<RawFeedItem[]> {
  const items: RawFeedItem[] = [];

  for (const feed of ALLOWLISTED_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const entry of parsed.items.slice(0, 15)) {
        const link = entry.link ?? entry.guid;
        if (!link || !entry.title || isBlockedUrl(link)) continue;

        const snippet = stripHtml(
          entry.contentSnippet ?? entry.content ?? entry.summary ?? "",
        ).slice(0, 500);

        const publishedAt = entry.isoDate
          ? new Date(entry.isoDate)
          : entry.pubDate
            ? new Date(entry.pubDate)
            : new Date();

        items.push({
          title: entry.title.trim(),
          link,
          snippet,
          publishedAt,
          sourceName: feed.name,
          defaultCategory: inferCategory(
            `${entry.title} ${snippet}`,
            feed.defaultCategory as Category,
          ),
        });
      }
    } catch (error) {
      console.error(`Failed to fetch feed ${feed.id}:`, error);
    }
  }

  return items;
}

export async function fetchNewsApiHeadlines(): Promise<RawFeedItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("country", "us");
    url.searchParams.set("pageSize", "30");
    url.searchParams.set("apiKey", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      articles: Array<{
        title: string;
        url: string;
        description: string | null;
        publishedAt: string;
        source: { name: string };
      }>;
    };

    return data.articles
      .filter((a) => a.title && a.url && !isBlockedUrl(a.url))
      .map((a) => ({
        title: a.title.replace(/ - [^-]+$/, "").trim(),
        link: a.url,
        snippet: (a.description ?? "").slice(0, 500),
        publishedAt: new Date(a.publishedAt),
        sourceName: a.source.name,
        defaultCategory: inferCategory(
          `${a.title} ${a.description ?? ""}`,
          "us",
        ),
      }));
  } catch (error) {
    console.error("NewsAPI fetch failed:", error);
    return [];
  }
}
