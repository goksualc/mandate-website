import { highlightCode } from "@/lib/highlight";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
  hideCopy?: boolean;
}

export async function CodeBlock({ code, lang = "bash", filename, className, hideCopy }: CodeBlockProps) {
  const trimmed = code.replace(/\n$/, "");
  const html = await highlightCode(trimmed, lang);

  return (
    <div className={cn("group relative overflow-hidden rounded-lg border border-border-strong", className)}>
      {filename ? (
        <div className="flex items-center justify-between border-b border-border-strong bg-background-inset px-4 py-2 text-xs text-muted-foreground">
          <span className="font-mono">{filename}</span>
        </div>
      ) : null}
      <div className="relative">
        {!hideCopy && <CopyButton value={trimmed} className="absolute right-2.5 top-2.5 z-10" />}
        <div className="overflow-x-auto [&>pre]:m-0" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
