import { Bot, CheckCircle2, FileCheck2, Fingerprint, ScrollText, ShieldCheck, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  label: string;
}

const steps: Step[] = [
  { icon: ScrollText, label: "User policy" },
  { icon: Fingerprint, label: "Policy commitment" },
  { icon: Bot, label: "AI agent action" },
  { icon: ShieldCheck, label: "MANDATE SDK" },
  { icon: FileCheck2, label: "ZK compliance proof" },
];

export function HeroArchitecture() {
  return (
    <div className="relative rounded-2xl border border-border-strong bg-background-elevated/60 p-5 sm:p-6">
      <div className="bg-grid pointer-events-none absolute inset-0 rounded-2xl opacity-70" aria-hidden />
      <ol className="relative flex flex-col gap-0">
        {steps.map((step, i) => (
          <li key={step.label} className="flex items-stretch gap-3">
            <div className="flex flex-col items-center">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-background-elevated text-accent-strong">
                <step.icon className="size-4" aria-hidden />
              </span>
              {i < steps.length - 1 && <span className="my-1 w-px flex-1 bg-border-strong" aria-hidden />}
            </div>
            <div className="flex-1 pb-6 pt-1.5">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="relative grid grid-cols-2 gap-3 border-t border-dashed border-border-strong pt-5">
        <div className="rounded-lg border border-success/35 bg-success-soft p-3">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="size-4" aria-hidden />
            <p className="text-[13px] font-semibold">Valid proof</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Contract verifies → order submitted to the batch auction.</p>
        </div>
        <div className="rounded-lg border border-danger/35 bg-danger-soft p-3">
          <div className="flex items-center gap-2 text-danger">
            <XCircle className="size-4" aria-hidden />
            <p className="text-[13px] font-semibold">Invalid proof</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Proof cannot be generated → order rejected, nothing on-chain.</p>
        </div>
      </div>
    </div>
  );
}
