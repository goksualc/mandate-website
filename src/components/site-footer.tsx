import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/content/site";

const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/#what-is-mandate" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Security model", href: "/docs/security" },
      { label: "Demo", href: "/docs/demo" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "SDK docs", href: "/docs/sdk" },
      { label: "MCP docs", href: "/docs/mcp" },
      { label: "npm package", href: siteConfig.npmUrlMcp, external: true },
    ],
  },
  {
    title: "Documents",
    links: [
      { label: "Product overview", href: "/product-overview" },
      { label: "Protocol design", href: "/research" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="focus-ring flex items-center gap-2 rounded-md">
              <Image src="/logo.png" alt="MANDATE owl logo" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="text-sm font-semibold text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 max-w-[26ch] text-xs leading-relaxed text-muted-foreground">
              A verifiable policy enforcement layer for autonomous financial agents.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring text-[13px] text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link href={link.href} className="focus-ring text-[13px] text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            License: not yet specified. © {new Date().getFullYear()} {siteConfig.name}.
          </p>
          <p className="max-w-2xl sm:text-right">
            {siteConfig.status} — this software is unaudited research/demo code. Do not use it with real funds, real
            private keys, or a public RPC endpoint.
          </p>
        </div>
      </div>
    </footer>
  );
}
