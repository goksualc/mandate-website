import Link from "next/link";
import { BookOpen, Download, ExternalLink, FileText, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentCardProps {
  title: string;
  file: string;
  description: string;
  readHref: string;
  pdfHref: string;
  githubUrl?: string | null;
  className?: string;
}

export function DocumentCard({ title, file, description, readHref, pdfHref, githubUrl, className }: DocumentCardProps) {
  return (
    <div className={cn("flex flex-col gap-5 rounded-xl border border-border-strong bg-background-elevated p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-background-inset text-accent-strong">
          <FileText className="size-5" aria-hidden />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="font-mono text-xs text-muted-foreground">{file}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <Link
          href={readHref}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[13px] font-medium text-accent-foreground hover:bg-accent-strong"
        >
          <BookOpen className="size-3.5" aria-hidden />
          Read online
        </Link>
        <a
          href={pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-background-inset"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          Open PDF
        </a>
        <a
          href={pdfHref}
          download
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-background-inset"
        >
          <Download className="size-3.5" aria-hidden />
          Download
        </a>
        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-background-inset"
          >
            <GitFork className="size-3.5" aria-hidden />
            View source
          </a>
        ) : (
          <span
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-[13px] font-medium text-muted-foreground/70"
            title="No public repository yet"
          >
            <GitFork className="size-3.5" aria-hidden />
            Source coming soon
          </span>
        )}
      </div>
    </div>
  );
}
