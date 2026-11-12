import Link from "next/link";
import { mainNav, siteConfig } from "@/content/site";

const link = "focus-ring text-[14px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";

export function SiteHeader() {
  const external = siteConfig.githubUrl
    ? { label: "GitHub", href: siteConfig.githubUrl }
    : { label: "npm", href: siteConfig.npmUrlSdk };

  return (
    <header className="border-b border-border-strong">
      <div className="paper flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5">
        <Link href="/" className="focus-ring font-serif text-lg font-semibold tracking-wide text-foreground">
          MANDATE
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-6 gap-y-1">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {item.title}
            </Link>
          ))}
          <a href={external.href} target="_blank" rel="noopener noreferrer" className={link}>
            {external.label} <span aria-hidden>↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
