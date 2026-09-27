import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <AppShell>
      <article className="prose prose-sm dark:prose-invert max-w-none px-4 py-6 pb-24">
        <h1 className="font-serif text-3xl not-prose">Privacy Policy</h1>
        <p className="text-muted-foreground not-prose">Last updated: August 31, 2026</p>

        <h2>What we collect</h2>
        <p>
          Briefly is guest-first. If you browse without signing in, bookmarks and
          topic preferences are stored locally in your browser. We may collect
          anonymous usage data such as pages viewed and read time to improve the
          feed.
        </p>

        <h2>California residents (CCPA/CPRA)</h2>
        <p>
          We do not sell personal information. California residents may request
          access to or deletion of personal data we hold by contacting{" "}
          <a href="mailto:privacy@briefly.news">privacy@briefly.news</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies and local storage for theme and bookmark
          preferences. No advertising cookies in this version.
        </p>

        <h2>Contact</h2>
        <p>
          Questions:{" "}
          <a href="mailto:privacy@briefly.news">privacy@briefly.news</a>
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
