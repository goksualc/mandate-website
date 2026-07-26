"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { docsNav } from "@/content/docs-nav";

interface SearchEntry {
  title: string;
  group: string;
  href: string;
}

const index: SearchEntry[] = docsNav.flatMap((group) =>
  group.links.map((link) => ({ title: link.title, group: group.title, href: link.href })),
);

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);
    return index.filter((e) => e.title.toLowerCase().includes(q) || e.group.toLowerCase().includes(q)).slice(0, 12);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="focus-ring flex w-full items-center gap-2 rounded-md border border-border bg-background-inset px-3 py-2 text-[13px] text-muted-foreground hover:border-border-strong"
        >
          <Search className="size-3.5" aria-hidden />
          Search docs
          <kbd className="ml-auto rounded border border-border-strong bg-background-elevated px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-24 z-50 w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border-strong bg-background-elevated shadow-2xl">
          <DialogPrimitive.Title className="sr-only">Search documentation</DialogPrimitive.Title>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="focus-ring w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</li>}
            {results.map((entry) => (
              <li key={entry.href}>
                <button
                  type="button"
                  onClick={() => go(entry.href)}
                  className="focus-ring flex w-full flex-col items-start rounded-md px-3 py-2 text-left hover:bg-background-inset"
                >
                  <span className="text-sm text-foreground">{entry.title}</span>
                  <span className="text-xs text-muted-foreground">{entry.group}</span>
                </button>
              </li>
            ))}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
