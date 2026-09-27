import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <AppShell>
      <article className="prose prose-sm dark:prose-invert max-w-none px-4 py-6 pb-24">
        <h1 className="font-serif text-3xl not-prose">Terms of Use</h1>
        <p className="text-muted-foreground not-prose">Last updated: August 31, 2026</p>

        <h2>Service</h2>
        <p>
          Briefly provides short, original news briefs with links to original
          publisher reporting. We are an aggregator, not the publisher of the
          underlying articles.
        </p>

        <h2>Attribution</h2>
        <p>
          Every story credits its source and links to the original article.
          Attribution does not imply endorsement by the source publisher.
        </p>

        <h2>DMCA</h2>
        <p>
          Copyright holders may submit takedown notices to our designated agent
          at{" "}
          <a href="mailto:dmca@briefly.news">dmca@briefly.news</a>. Notices must
          include identification of the work, the URL on Briefly, and your
          contact information.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Briefs are generated from publicly available headlines and snippets.
          We strive for accuracy but do not guarantee completeness. Always read
          the original reporting for full context.
        </p>

        <p className="not-prose pt-4">
          <Link href="/profile" className="text-foreground underline">
            Back to profile
          </Link>
        </p>
      </article>
    </AppShell>
  );
}
