import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-background-inset px-3 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="size-3.5 text-accent-strong" aria-hidden />
      Local MVP · Experimental · Not Audited
    </span>
  );
}
