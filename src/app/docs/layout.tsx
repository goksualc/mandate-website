import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { DocsSearch } from "@/components/docs-search";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
        <DocsMobileNav />
      </div>
      <div className="flex gap-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto pb-8 pr-2">
            <DocsSearch />
            <DocsSidebar />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
