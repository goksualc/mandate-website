import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Heading({
  id,
  level = 2,
  children,
  className,
}: {
  id: string;
  level?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id} className={cn("group relative scroll-mt-24", className)}>
      <a
        href={`#${id}`}
        className="focus-ring absolute -left-6 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-accent-strong group-hover:opacity-100 group-focus-within:opacity-100 lg:flex"
        aria-label={`Link to section: ${typeof children === "string" ? children : id}`}
      >
        <LinkIcon className="size-3.5" aria-hidden />
      </a>
      {children}
    </Tag>
  );
}
