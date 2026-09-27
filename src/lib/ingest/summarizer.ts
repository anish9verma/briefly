import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { Category } from "@/lib/db/schema";
import { categories } from "@/lib/db/schema";
import type { RawFeedItem } from "./rss";

const summarySchema = z.object({
  headline: z.string().describe("Clear headline, max 12 words"),
  summary: z
    .string()
    .describe("Original factual brief of 55-65 words in new sentences"),
  category: z.enum(categories as unknown as [Category, ...Category[]]),
});

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function fallbackSummary(item: RawFeedItem): {
  headline: string;
  summary: string;
  category: Category;
} {
  const facts = [item.title, item.snippet].filter(Boolean).join(". ");
  const sentences = facts
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  let summary = sentences.slice(0, 3).join(" ");
  const words = summary.split(/\s+/);
  if (words.length > 65) {
    summary = words.slice(0, 62).join(" ") + "…";
  } else if (words.length < 40 && item.snippet) {
    summary = `${item.title}. ${item.snippet}`.slice(0, 420);
    const w = summary.split(/\s+/);
    if (w.length > 65) summary = w.slice(0, 62).join(" ") + "…";
  }

  return {
    headline: item.title.length > 80 ? item.title.slice(0, 77) + "…" : item.title,
    summary,
    category: item.defaultCategory,
  };
}

export async function summarizeItem(item: RawFeedItem): Promise<{
  headline: string;
  summary: string;
  category: Category;
} | null> {
  if (!item.snippet && item.title.length < 20) return null;

  const hasAi =
    process.env.OPENAI_API_KEY ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_AI_GATEWAY_API_KEY;

  if (!hasAi) {
    const result = fallbackSummary(item);
    const count = wordCount(result.summary);
    if (count < 25) return null;
    return result;
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: summarySchema,
      prompt: `You write original 60-word news briefs for a US audience.

Rules:
- Write NEW sentences. Do NOT copy phrases from the source.
- 55-65 words in the summary.
- Stick to facts present in the title and snippet only. Do not invent details.
- Neutral, present tense where appropriate.
- Category must be one of: ${categories.join(", ")}.

Source: ${item.sourceName}
Title: ${item.title}
Snippet: ${item.snippet || "(none)"}`,
    });

    const count = wordCount(object.summary);
    if (count < 40 || count > 80) {
      return fallbackSummary(item);
    }

    return object;
  } catch (error) {
    console.error("AI summarization failed, using fallback:", error);
    const result = fallbackSummary(item);
    const count = wordCount(result.summary);
    if (count < 25) return null;
    return result;
  }
}
