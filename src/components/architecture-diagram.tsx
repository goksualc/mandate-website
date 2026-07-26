import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Node({ title, subtitle, emphasize }: { title: string; subtitle?: string; emphasize?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-w-[9.5rem] flex-col items-center justify-center gap-0.5 rounded-lg border px-3 py-3 text-center",
        emphasize ? "border-accent/50 bg-accent-soft" : "border-border-strong bg-background-elevated",
      )}
    >
      <p className="text-[13px] font-semibold text-foreground">{title}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function ArchitectureDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-strong bg-background-inset p-5 sm:p-7">
      <div className="mx-auto flex min-w-[640px] max-w-3xl flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Node title="MoonPay Agent" subtitle="user-facing" />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <Node title="MANDATE MCP Server" subtitle="3 tools only" emphasize />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <Node title="MANDATE SDK" subtitle="proves + submits" emphasize />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <Node title="Noir Compliance Proof" subtitle="Noir / UltraHonk" emphasize />
        </div>

        <ArrowDown className="my-1 size-4 text-muted-foreground" aria-hidden />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Node title="Registry Contract" subtitle="policy + session key" />
          <Node title="Auction Contract" subtitle="proof-gated, on-chain" />
          <Node title="MandateAccount" subtitle="funds + escape hatch" />
          <Node title="Sequencer" subtitle="epoch loop, state" />
          <Node title="Local Ethereum Chain" subtitle="Anvil" />
        </div>
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        The agent interacts only with the MCP server. Proof generation and on-chain commitment happen entirely
        inside the SDK and contract layer.
      </p>
    </div>
  );
}
