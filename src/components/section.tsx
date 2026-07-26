import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-24", className)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", containerClassName)}>
        {(eyebrow || title || description) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-accent-strong">{eyebrow}</p>}
            {title && <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>}
            {description && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
