import { Bot, KeyRound, ScrollText, ShieldCheck, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FlowStep {
  actor: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const flow: FlowStep[] = [
  {
    actor: "User",
    icon: ScrollText,
    title: "Define the mandate",
    description: "Approved markets, size limits, position caps, and loss limits — set once.",
  },
  {
    actor: "MANDATE",
    icon: KeyRound,
    title: "Register policy + session key",
    description: "A policy commitment is registered on-chain; the agent is issued a scoped session key.",
  },
  {
    actor: "Agent",
    icon: Bot,
    title: "Propose an order",
    description: "The agent decides an action based on its own logic or a user instruction.",
  },
  {
    actor: "MANDATE",
    icon: ShieldCheck,
    title: "Generate a compliance proof",
    description: "The order is checked against the policy; a valid proof is produced only if every constraint holds.",
  },
  {
    actor: "System",
    icon: Workflow,
    title: "Execute — or reject",
    description: "Only orders accompanied by a valid proof are submitted to the batch auction.",
  },
];

export function ExecutionFlow() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {flow.map((step, i) => (
        <li key={step.title} className="relative rounded-xl border border-border-strong bg-background-elevated p-4">
          <div className="flex items-center justify-between">
            <span className="flex size-8 items-center justify-center rounded-full border border-accent/40 bg-accent-soft text-accent-strong">
              <step.icon className="size-4" aria-hidden />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {i + 1} · {step.actor}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">{step.title}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
