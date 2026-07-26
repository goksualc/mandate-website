import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Callout } from "@/components/callout";
import { ComparisonTable } from "@/components/comparison-table";
import { FeatureStatus } from "@/components/feature-status";
import { PdfViewer } from "@/components/pdf-viewer";
import { TableOfContents } from "@/components/table-of-contents";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { SecurityLayers } from "@/components/security-layers";
import {
  risks,
  mandateIs,
  mandateIsNot,
  demoPolicy,
  demoOrders,
  demoEvidence,
  comparisonRows,
  mvpVsProduction,
  useCases,
  glossary,
  faq,
  roadmap,
  provenConfirmed,
  provenNotYet,
} from "@/content/product";
import { mcpTools } from "@/content/mcp";

export const metadata: Metadata = {
  title: "Product Overview",
  description: "A practical walkthrough of the working local MVP: the problem, architecture, MCP tools, demo policy, verified test results, security model, and limitations.",
};

const toc = [
  { id: "executive-summary", title: "Executive summary" },
  { id: "the-problem", title: "The problem" },
  { id: "what-mandate-is", title: "What MANDATE is" },
  { id: "user-experience", title: "User experience" },
  { id: "how-the-mvp-works", title: "How the MVP works" },
  { id: "agent-tools", title: "What the agent can do" },
  { id: "demo-policy", title: "The demo policy" },
  { id: "verified-results", title: "Verified demo results" },
  { id: "comparison", title: "Comparison with alternatives" },
  { id: "security-model", title: "Security model" },
  { id: "mvp-vs-production", title: "MVP vs. production" },
  { id: "use-cases", title: "Potential use cases" },
  { id: "roadmap", title: "Roadmap" },
  { id: "faq", title: "FAQ" },
  { id: "glossary", title: "Glossary" },
];

export default function ProductOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex gap-10">
        <article className="prose-mandate min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-strong">Product Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            MANDATE — Product Overview
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            A structured web adaptation of <code>mandate-product-overview.pdf</code> — the practical walkthrough
            of the working local MVP. For developer reference (install commands, exact types, tool schemas), see{" "}
            <Link href="/docs">Documentation</Link>.
          </p>
          <div className="not-prose mt-6">
            <PdfViewer src="/mandate-product-overview.pdf" title="mandate-product-overview.pdf — Product Overview, July 2026" />
          </div>

          <h2 id="executive-summary" className="scroll-mt-24">Executive summary</h2>
          <p>
            AI agents are increasingly capable of interacting directly with financial systems — placing orders,
            initiating payments, managing portfolio positions, and executing across protocols and platforms.
            MANDATE is a verifiable policy layer placed between an AI agent and a financial execution rail: the
            agent does not simply assert that an action is allowed, it generates a zero-knowledge compliance
            proof demonstrating that the action satisfies the registered policy. If the proof cannot be
            produced, the order cannot be submitted.
          </p>
          <p>
            The current working MVP integrates MANDATE with the MoonPay Agent through a published MCP server,{" "}
            <code>@0xgks/mandate-mcp@0.1.0</code>. During testing, a valid order (buy 250 units at 3,500 —
            notional 875,000) was successfully proven and submitted on-chain. An oversized order (10,000 units at
            3,500 — notional 35,000,000) failed proof generation and was correctly rejected, with no transaction
            accepted and the server remaining fully available.
          </p>

          <h2 id="the-problem" className="scroll-mt-24">The problem: agents need authority, but not unlimited authority</h2>
          <p>
            Consider a practical scenario: a user wants an AI agent to trade ETH on their behalf, but only
            within a specific market, within an order size of 1,000,000 notional, with a defined position limit,
            and a daily loss ceiling — provided as instructions in the agent&apos;s prompt.
          </p>
          <ComparisonTable
            columns={["Risk", "Example", "Without MANDATE"]}
            rows={risks.map((r) => [r.risk, r.example, r.withoutMandate])}
          />
          <Callout type="tip" title="Key insight" className="mt-4">
            There is a difference between asking an agent not to exceed a limit and making it mathematically
            impossible for the agent to submit an action that does.
          </Callout>

          <h2 id="what-mandate-is" className="scroll-mt-24">What MANDATE is</h2>
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-success/30 bg-success-soft/40 p-5">
              <p className="text-sm font-semibold text-success">MANDATE is</p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
                {mandateIs.map((i) => <li key={i}>+ {i}</li>)}
              </ul>
            </div>
            <div className="rounded-lg border border-danger/30 bg-danger-soft/40 p-5">
              <p className="text-sm font-semibold text-danger">MANDATE is not</p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
                {mandateIsNot.map((i) => <li key={i}>− {i}</li>)}
              </ul>
            </div>
          </div>
          <p className="mt-4">
            <strong>Core design principle:</strong> the circuit proves the ACTION, not the model. It does not
            prove &ldquo;this is a trustworthy AI.&rdquo; It proves: &ldquo;this order satisfies policy
            constraint set P against portfolio state S, where S is anchored on-chain.&rdquo; The agent&apos;s
            strategy, reasoning, and confidence level are irrelevant to whether the proof succeeds.
          </p>

          <h2 id="user-experience" className="scroll-mt-24">User experience</h2>
          <p>
            From the user&apos;s perspective, MANDATE operates as a silent enforcer running behind the agent: the
            user defines the rules once, and the system enforces them automatically on every execution attempt —
            (1) user defines the mandate, (2) MANDATE registers a policy commitment and issues a session key,
            (3) the agent proposes an order, (4) MANDATE checks it and generates (or fails to generate) a proof,
            (5) only a validly-proven order reaches the execution layer.
          </p>

          <h2 id="how-the-mvp-works" className="scroll-mt-24">How the MVP works</h2>
          <ArchitectureDiagram />
          <p className="mt-4">
            Order plaintext (side, quantity, price) stays off-chain with the sequencer until the commit phase
            closes — a commit-reveal design that simulates threshold encryption. Only the order commitment hash
            goes on-chain with the proof. Full component breakdown: <Link href="/docs/architecture">Architecture</Link>.
          </p>

          <h2 id="agent-tools" className="scroll-mt-24">What the agent can do</h2>
          <p>The MCP server exposes exactly three tools — this is a deliberate security boundary, not an incomplete API.</p>
          <ComparisonTable
            columns={["Tool", "Type", "Purpose"]}
            rows={mcpTools.map((t) => [t.name, t.type, t.title])}
          />
          <p>Full schemas and configuration: <Link href="/docs/mcp">MCP documentation</Link>.</p>

          <h2 id="demo-policy" className="scroll-mt-24">The demo policy</h2>
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
          <p><strong>Order notional = quantity × limit price.</strong></p>
          <ComparisonTable
            columns={["Order", "Quantity", "Price", "Notional", "Limit", "Result"]}
            rows={[
              ["Valid", demoOrders.valid.quantity, demoOrders.valid.limitPrice.toLocaleString(), demoOrders.valid.notional.toLocaleString(), demoOrders.valid.maxNotional.toLocaleString(), "ALLOWED — proof generated"],
              ["Invalid", demoOrders.invalid.quantity.toLocaleString(), demoOrders.invalid.limitPrice.toLocaleString(), demoOrders.invalid.notional.toLocaleString(), demoOrders.invalid.maxNotional.toLocaleString(), "REJECTED — proof failed"],
            ]}
            highlightRow={1}
          />
          <p>Interactive version with a full breakdown: <Link href="/docs/demo">Demo</Link>.</p>

          <h2 id="verified-results" className="scroll-mt-24">Verified demo results</h2>
          <p>Produced during a live local test — not simulated outcomes.</p>
          <ComparisonTable
            columns={["Field", "Value"]}
            rows={[
              ["Epoch", demoEvidence.epoch.toString()],
              ["Order commitment", demoEvidence.orderCommitment],
              ["Transaction hash", demoEvidence.txHash],
            ]}
          />
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border-strong bg-background-elevated p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">Confirmed</p>
              <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                {provenConfirmed.map((i) => (
                  <li key={i} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border-strong bg-background-elevated p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">Not yet proven</p>
              <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                {provenNotYet.map((i) => (
                  <li key={i} className="flex gap-2"><X className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />{i}</li>
                ))}
              </ul>
            </div>
          </div>

          <h2 id="comparison" className="scroll-mt-24">Comparison with alternatives</h2>
          <ComparisonTable
            columns={["Approach", "Strength", "Limitation"]}
            rows={comparisonRows.map((r) => [r.approach, r.strength, r.limitation])}
            highlightRow={comparisonRows.length - 1}
          />

          <h2 id="security-model" className="scroll-mt-24">Security model</h2>
          <SecurityLayers />
          <p className="mt-4">Full threat model and trust assumptions: <Link href="/docs/security">Security</Link>.</p>

          <h2 id="mvp-vs-production" className="scroll-mt-24">Current MVP vs. future production system</h2>
          <ComparisonTable
            columns={["Area", "Current MVP", "Production direction"]}
            rows={mvpVsProduction.map((r) => [r.area, r.currentMvp, r.productionDirection])}
          />

          <h2 id="use-cases" className="scroll-mt-24">Potential use cases</h2>
          <p>MANDATE&apos;s policy model is intentionally general — the same architecture applies across many autonomous financial applications:</p>
          <ComparisonTable
            columns={["Use case", "Example mandate"]}
            rows={useCases.map((u) => [u.useCase, u.example])}
          />

          <h2 id="roadmap" className="scroll-mt-24">Roadmap</h2>
          <div className="not-prose grid gap-3">
            {roadmap.map((r) => (
              <div key={r.phase} className="flex items-start justify-between gap-4 rounded-lg border border-border-strong bg-background-elevated p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.phase}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{r.deliverables}</p>
                </div>
                <FeatureStatus value={r.status === "Done" ? "Implemented" : r.status === "Near-term" ? "MVP" : "Future work"} className="shrink-0" />
              </div>
            ))}
          </div>

          <h2 id="faq" className="scroll-mt-24">Frequently asked questions</h2>
          <div className="not-prose space-y-4">
            {faq.map((f) => (
              <div key={f.question}>
                <p className="text-sm font-semibold text-foreground">{f.question}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>

          <h2 id="glossary" className="scroll-mt-24">Glossary</h2>
          <dl className="not-prose divide-y divide-border">
            {glossary.map((g) => (
              <div key={g.term} className="py-3">
                <dt className="text-sm font-semibold text-foreground">{g.term}</dt>
                <dd className="mt-1 text-[13px] text-muted-foreground">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </article>

        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </div>
  );
}
