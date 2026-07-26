import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "warning" | "danger" | "tip";

const config: Record<CalloutType, { icon: typeof Info; classes: string; label: string }> = {
  note: { icon: Info, classes: "border-accent/30 bg-accent-soft text-foreground", label: "Note" },
  tip: { icon: Lightbulb, classes: "border-accent/30 bg-accent-soft text-foreground", label: "Key insight" },
  warning: { icon: AlertTriangle, classes: "border-warning/35 bg-warning-soft text-foreground", label: "Warning" },
  danger: { icon: ShieldAlert, classes: "border-danger/35 bg-danger-soft text-foreground", label: "Security" },
};

export function Callout({
  type = "note",
  title,
  children,
  className,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, classes, label } = config[type];
  return (
    <div role="note" className={cn("flex gap-3 rounded-lg border px-4 py-3.5 text-sm", classes, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="space-y-1">
        <p className="font-semibold">{title ?? label}</p>
        <div className="text-[13px] leading-relaxed text-muted-foreground [&>*]:text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
