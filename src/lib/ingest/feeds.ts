export type FeedSource = {
  id: string;
  name: string;
  url: string;
  defaultCategory: string;
  /** Government / public-domain friendly sources only in v1 */
  tier: "government" | "newsapi";
};

/** Allowlisted sources — government feeds are safest for v1 auto-ingest */
export const ALLOWLISTED_FEEDS: FeedSource[] = [
  {
    id: "nasa",
    name: "NASA",
    url: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    defaultCategory: "science",
    tier: "government",
  },
  {
    id: "noaa",
    name: "NOAA",
    url: "https://www.noaa.gov/news/rss.xml",
    defaultCategory: "science",
    tier: "government",
  },
  {
    id: "cdc",
    name: "CDC",
    url: "https://tools.cdc.gov/api/v2/resources/media/132608.rss",
    defaultCategory: "health",
    tier: "government",
  },
  {
    id: "nih",
    name: "NIH",
    url: "https://www.nih.gov/news-events/news-releases/rss.xml",
    defaultCategory: "health",
    tier: "government",
  },
  {
    id: "whitehouse",
    name: "White House",
    url: "https://www.whitehouse.gov/news/feed/",
    defaultCategory: "politics",
    tier: "government",
  },
  {
    id: "fema",
    name: "FEMA",
    url: "https://www.fema.gov/rss/news-releases.xml",
    defaultCategory: "us",
    tier: "government",
  },
];

/** Blocked domains — do not ingest without written license */
export const BLOCKED_DOMAINS = [
  "apnews.com",
  "reuters.com",
  "npr.org",
  "nytimes.com",
  "wsj.com",
  "washingtonpost.com",
];

export function isBlockedUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return BLOCKED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`),
    );
  } catch {
    return true;
  }
}
