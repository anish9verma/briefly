import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-3xl">Page not found</h1>
        <p className="text-muted-foreground">
          That story or page doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/">Back to feed</Link>
        </Button>
      </div>
    </AppShell>
  );
}
