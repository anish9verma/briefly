import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import seedStories from "../src/data/seed-stories.json";
import { runIngest } from "../src/lib/ingest/ingest";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required for seeding");
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });

  console.log("Creating tables if needed...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS stories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      headline TEXT NOT NULL,
      summary TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      published_at TIMESTAMPTZ NOT NULL,
      ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      snippet TEXT
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      theme TEXT NOT NULL DEFAULT 'dark',
      followed_categories TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, story_id)
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS read_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id TEXT,
      dwell_ms INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log("Seeding demo stories...");
  for (const story of seedStories) {
    await db
      .insert(schema.stories)
      .values({
        headline: story.headline,
        summary: story.summary,
        sourceName: story.sourceName,
        sourceUrl: story.sourceUrl,
        category: story.category as schema.Category,
        publishedAt: new Date(story.publishedAt),
        snippet: story.summary.slice(0, 200),
      })
      .onConflictDoNothing({ target: schema.stories.sourceUrl });
  }

  console.log(`Seeded ${seedStories.length} stories`);

  console.log("Running ingest from allowlisted feeds...");
  const result = await runIngest();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
