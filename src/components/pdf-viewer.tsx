import { ExternalLink } from "lucide-react";

export function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-strong bg-background-inset">
      <div className="flex items-center justify-between border-b border-border-strong px-4 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium text-accent-strong hover:underline"
        >
          Open in new tab
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>
      <object data={src} type="application/pdf" className="h-[75vh] w-full" aria-label={title}>
        <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
          <p>Your browser can&apos;t display this PDF inline.</p>
          <a href={src} className="focus-ring font-medium text-accent-strong hover:underline">
            Open {title} directly →
          </a>
        </div>
      </object>
    </div>
  );
}
