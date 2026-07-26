import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { OrderDemo } from "@/components/order-demo";
import { demoPolicy, demoOrders, demoEvidence, provenConfirmed, provenNotYet, localCommands } from "@/content/product";

export const metadata: Metadata = {
  title: "Demo",
  description: "The demo policy, the compliant and rejected test orders, verified results from a live local run, and how to reproduce it.",
};

const toc = [
  { id: "demo-policy", title: "Demo policy" },
  { id: "valid-order", title: "Valid order" },
  { id: "invalid-order", title: "Invalid order" },
  { id: "verified-results", title: "Verified results" },
  { id: "running-locally", title: "Running locally" },
];

export default function DemoDocsPage() {
  return (
    <DocsPageShell
      title="Demo"
      description="A visualization and record of the documented local MVP demo — a real compliance proof, a real on-chain commitment, a valid order accepted, and an invalid order rejected."
      toc={toc}
      pagerHref="/docs/demo"
    >
      <Heading id="demo-policy">Demo policy</Heading>
      <ComparisonTable
        columns={["Rule", "Demo value"]}
        rows={[
          ["Approved market", demoPolicy.approvedMarket],
          ["Maximum order notional", demoPolicy.maxOrderNotional.toLocaleString()],
          ["Maximum position", demoPolicy.maxPosition],
          ["Maximum daily loss", demoPolicy.maxDailyLoss],
          ["Authorization", demoPolicy.authorization],
          ["Policy identity", demoPolicy.policyIdentity],
          ["Execution window", demoPolicy.executionWindow],
          ["Emergency control", demoPolicy.emergencyControl],
        ]}
      />
      <p className="mt-4">
        <strong>Order notional = quantity × limit price</strong> — the key metric the policy enforces. It
        measures the total value of an order, not just its quantity or price in isolation.
      </p>

      <Heading id="valid-order">Valid order</Heading>
      <div className="not-prose mb-4 flex items-center gap-2 rounded-lg border border-success/35 bg-success-soft p-4">
        <Check className="size-5 shrink-0 text-success" aria-hidden />
        <p className="text-sm text-foreground">
          Buy <strong>{demoOrders.valid.quantity}</strong> units at <strong>{demoOrders.valid.limitPrice.toLocaleString()}</strong> — notional{" "}
          <strong>{demoOrders.valid.notional.toLocaleString()}</strong>, under the {demoOrders.valid.maxNotional.toLocaleString()} limit.
          Proof generated: yes. Result: {demoOrders.valid.result}.
        </p>
      </div>

      <Heading id="invalid-order">Invalid order</Heading>
      <div className="not-prose mb-4 flex items-center gap-2 rounded-lg border border-danger/35 bg-danger-soft p-4">
        <X className="size-5 shrink-0 text-danger" aria-hidden />
        <p className="text-sm text-foreground">
          Buy <strong>{demoOrders.invalid.quantity.toLocaleString()}</strong> units at{" "}
          <strong>{demoOrders.invalid.limitPrice.toLocaleString()}</strong> — notional{" "}
          <strong>{demoOrders.invalid.notional.toLocaleString()}</strong>, {Math.round(demoOrders.invalid.notional / demoOrders.invalid.maxNotional)}×
          over the {demoOrders.invalid.maxNotional.toLocaleString()} limit. Proof generated: no. Result: {demoOrders.invalid.result}.
        </p>
      </div>

      <OrderDemo />

      <Heading id="verified-results" className="mt-10">Verified results</Heading>
      <p>
        These results were produced during a live local test of the MVP — real MCP tool calls, a real on-chain
        transaction, and a real proof-generation failure (not simulated outcomes).
      </p>
      <ComparisonTable
        columns={["Field", "Value"]}
        rows={[
          ["Epoch", demoEvidence.epoch.toString()],
          ["Agent ID", demoEvidence.agentId],
          ["Order commitment (valid order)", demoEvidence.orderCommitment],
          ["Transaction hash (valid order)", demoEvidence.txHash],
        ]}
      />
      <div className="mt-6 grid gap-4 not-prose sm:grid-cols-2">
        <div className="rounded-lg border border-border-strong bg-background-elevated p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Confirmed in the MVP</p>
          <ul className="space-y-1.5 text-[13px] text-muted-foreground">
            {provenConfirmed.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border-strong bg-background-elevated p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Not yet proven</p>
          <ul className="space-y-1.5 text-[13px] text-muted-foreground">
            {provenNotYet.map((item) => (
              <li key={item} className="flex gap-2">
                <X className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Heading id="running-locally" className="mt-10">Running locally</Heading>
      <p>The one-command demo (from a clone of the repository):</p>
      <CodeBlock code="./demo/run.sh" lang="bash" />
      <p>Or, for the persistent MCP-agent setup:</p>
      <CodeBlock code={`${localCommands.start}\n${localCommands.status}\n${localCommands.stop}`} lang="bash" />
      <p>See <a href="/docs/quickstart">Quickstart</a> for the full walkthrough and prerequisites.</p>
    </DocsPageShell>
  );
}
