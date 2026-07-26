"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/content/docs-nav";
import { cn } from "@/lib/utils";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="space-y-6">
      {docsNav.map((group) => (
        <div key={group.title}>
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</p>
          <ul className="mt-1.5 space-y-0.5">
            {group.links.map((link) => {
              const active = pathname === link.href.split("#")[0] && !link.href.includes("#");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "focus-ring block rounded-md px-2 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-accent-soft font-medium text-accent-strong"
                        : "text-muted-foreground hover:bg-background-inset hover:text-foreground",
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
