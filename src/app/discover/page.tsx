import { AppShell, CategoryGrid } from "@/components/app-shell";

export const metadata = {
  title: "Discover",
};

export default function DiscoverPage() {
  return (
    <AppShell>
      <div className="pb-20">
        <div className="border-b border-border/60 px-4 py-4">
          <h1 className="font-serif text-2xl">Discover</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse US news by topic
          </p>
        </div>
        <CategoryGrid />
      </div>
    </AppShell>
  );
}
