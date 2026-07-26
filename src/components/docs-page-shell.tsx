import type { ReactNode } from "react";
import { TableOfContents, type TocEntry } from "@/components/table-of-contents";
import { DocsPager } from "@/components/docs-pager";

export function DocsPageShell({
  title,
  description,
  toc,
  pagerHref,
  children,
}: {
  title: string;
  description?: string;
  toc: TocEntry[];
  pagerHref: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-10">
      <article className="prose-mandate min-w-0 flex-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
        <div className="mt-8">{children}</div>
        <DocsPager current={pagerHref} />
      </article>
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-24">
          <TableOfContents items={toc} />
        </div>
      </aside>
    </div>
  );
}
