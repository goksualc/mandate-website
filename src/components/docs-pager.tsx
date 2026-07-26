import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { docsPageOrder } from "@/content/docs-nav";

export function DocsPager({ current }: { current: string }) {
  const index = docsPageOrder.findIndex((p) => p.href === current);
  if (index === -1) return null;

  const prev = index > 0 ? docsPageOrder[index - 1] : null;
  const next = index < docsPageOrder.length - 1 ? docsPageOrder[index + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav aria-label="Docs pagination" className="mt-12 flex items-stretch justify-between gap-4 border-t border-border pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="focus-ring group flex flex-1 flex-col items-start gap-1 rounded-lg border border-border-strong px-4 py-3 hover:border-accent/50"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5" aria-hidden />
            Previous
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-accent-strong">{prev.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="focus-ring group flex flex-1 flex-col items-end gap-1 rounded-lg border border-border-strong px-4 py-3 text-right hover:border-accent/50"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Next
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-accent-strong">{next.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
