"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  id: string;
  title: string;
  level?: 2 | 3;
}

export function TableOfContents({ items }: { items: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "1.5rem" : "0.75rem" }}>
            <a
              href={`#${item.id}`}
              className={cn(
                "focus-ring -ml-px block border-l-2 py-0.5 pl-2.5 text-[13px] transition-colors",
                activeId === item.id
                  ? "border-accent text-accent-strong font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
