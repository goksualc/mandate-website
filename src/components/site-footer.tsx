import Link from "next/link";
import { siteConfig } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border-strong">
      <div className="paper py-8 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          MANDATE is an independent, experimental research prototype. It has not been externally audited and runs only
          on a local development chain. Do not use it with real funds or real private keys.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/docs" className="textlink">Documentation</Link>
          <Link href="/research" className="textlink">Protocol design</Link>
          <Link href="/product-overview" className="textlink">Prototype overview</Link>
          <a href={`mailto:${siteConfig.contactEmail}`} className="textlink">Contact</a>
        </p>
        <p className="mt-3">License: not yet specified.</p>
      </div>
    </footer>
  );
}
