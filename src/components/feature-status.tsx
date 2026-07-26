import { cn } from "@/lib/utils";

export type FeatureStatusValue = "Implemented" | "MVP" | "Experimental" | "Research" | "Future work";

const styles: Record<FeatureStatusValue, string> = {
  Implemented: "border-success/40 bg-success-soft text-success",
  MVP: "border-accent/40 bg-accent-soft text-accent-strong",
  Experimental: "border-secondary/50 bg-secondary-soft text-secondary",
  Research: "border-secondary/30 bg-secondary-soft/60 text-secondary",
  "Future work": "border-border-strong bg-background-inset text-muted-foreground",
};

export function FeatureStatus({ value, className }: { value: FeatureStatusValue; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[value],
        className,
      )}
    >
      {value}
    </span>
  );
}
