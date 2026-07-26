import Link from "next/link";
import Image from "next/image";
import { GitFork, Menu } from "lucide-react";
import { mainNav, siteConfig } from "@/content/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-md">
          <Image
            src="/logo.png"
            alt="MANDATE owl logo"
            width={42}
            height={42}
            priority
            className="h-9 w-9 object-contain md:h-10 md:w-10"
          />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
          {siteConfig.githubUrl ? (
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitFork className="size-3.5" aria-hidden />
              GitHub
            </a>
          ) : (
            <a
              href={siteConfig.npmUrlMcp}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              title="No public GitHub repository yet — linking to the published npm package"
            >
              <GitFork className="size-3.5" aria-hidden />
              npm
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/docs/quickstart">Get Started</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-ring inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-4" aria-hidden />
        </button>
      </DialogTrigger>
      <DialogContent side="left">
        <DialogTitle className="mb-6 flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <Image src="/logo.png" alt="MANDATE owl logo" width={32} height={32} className="h-8 w-8 object-contain" />
          {siteConfig.name}
        </DialogTitle>
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-background-inset"
            >
              {item.title}
            </Link>
          ))}
          <Link href="/docs" className="focus-ring rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-background-inset">
            Docs
          </Link>
          <a
            href={siteConfig.npmUrlMcp}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-background-inset"
          >
            npm package
          </a>
        </nav>
        <div className="mt-6 flex items-center gap-2 border-t border-border pt-6">
          <ThemeToggle />
          <Button asChild size="sm" className="flex-1">
            <Link href="/docs/quickstart">Get Started</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
