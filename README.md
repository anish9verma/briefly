# Briefly

US short-news website — swipe through 60-word briefs with source credit and links.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS + shadcn/ui
- Drizzle ORM + Neon Postgres
- AI SDK (optional OpenAI summaries)
- Allowlisted RSS ingest (government feeds)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without `DATABASE_URL`, the app serves 30 seed stories.

## Environment

Copy `.env.example` to `.env.local`:

- `DATABASE_URL` — Neon Postgres connection string
- `OPENAI_API_KEY` — optional, for AI-written briefs
- `NEWS_API_KEY` — optional headline index (paid plan for production)
- `CRON_SECRET` — protects `/api/cron/ingest` in production

## Database

```bash
npm run db:seed   # create tables + seed + ingest
```

## Legal model

Briefly shows **original short briefs** with **source name + outbound link**. It does not republish full articles or use unlicensed photos. See `/privacy` and `/terms`.

## Deploy

Deploy to Vercel. Cron runs every 15 minutes via `vercel.json`.
