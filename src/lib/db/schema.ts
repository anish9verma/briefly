import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const categories = [
  "top",
  "us",
  "politics",
  "world",
  "business",
  "tech",
  "sports",
  "entertainment",
  "science",
  "health",
] as const;

export type Category = (typeof categories)[number];

export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull().unique(),
  category: text("category").notNull().$type<Category>(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  ingestedAt: timestamp("ingested_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  snippet: text("snippet"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  theme: text("theme").notNull().default("dark"),
  followedCategories: text("followed_categories").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.storyId] })],
);

export const readEvents = pgTable("read_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  storyId: uuid("story_id")
    .notNull()
    .references(() => stories.id, { onDelete: "cascade" }),
  userId: text("user_id"),
  dwellMs: integer("dwell_ms").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
