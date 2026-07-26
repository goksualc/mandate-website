import type { Metadata } from "next";
import Link from "next/link";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { glossary } from "@/content/product";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Introduction to MANDATE's core concepts: mandates, policy commitments, session keys, portfolio state, compliance proofs, order commitments, and batch auction epochs.",
};

const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "project-status", title: "Project status" },
  { id: "mandates", title: "Mandates" },
  { id: "policy-commitments", title: "Policy commitments" },
  { id: "session-keys", title: "Session keys" },
  { id: "portfolio-state", title: "Portfolio state" },
  { id: "compliance-proofs", title: "Compliance proofs" },
  { id: "order-commitments", title: "Order commitments" },
  { id: "epochs-and-batch-auctions", title: "Epochs and batch auctions" as const },
];

export default function DocsIndexPage() {
  const g = (term: string) => glossary.find((t) => t.term === term)?.definition ?? "";

  return (
    <DocsPageShell
      title="Introduction"
      description="MANDATE is a verifiable policy enforcement layer for autonomous financial agents. This page introduces the core concepts used throughout the rest of the documentation."
      toc={toc}
      pagerHref="/docs"
    >
      <Heading id="introduction">Introduction</Heading>
      <p>
        MANDATE sits between an AI agent and a financial execution system. Before an agent can submit a
        financial action, MANDATE requires the action to be accompanied by a cryptographic proof showing that
        it complies with the user&apos;s predefined policy. MANDATE does not decide what an agent should do —
        it enforces what the agent is allowed to do.
      </p>
      <p>
        The current MVP integrates MANDATE with the MoonPay Agent through a published MCP server
        (<code>@0xgks/mandate-mcp@0.1.0</code>). If you want the fastest path to a working system, start with{" "}
        <Link href="/docs/quickstart">Quickstart</Link>.
      </p>

      <Heading id="project-status">Project status</Heading>
      <Callout type="warning" title="Local MVP — experimental, not audited">
        Everything on this site describes a working local system: a real Noir/UltraHonk circuit, real Foundry
        contracts, a real published npm package, and a real local demo. It runs on a local Anvil chain with
        test-only keys. It has not been externally audited and has no public testnet or mainnet deployment.
        See <Link href="/docs/security#current-limitations">Current limitations</Link>.
      </Callout>

      <Heading id="mandates">Mandates</Heading>
      <p>{g("Mandate")}</p>
      <p>
        A mandate is composed of a <strong>policy</strong> (the specific numeric and structural rules) plus the
        authorization data (session key, on-chain registration) that lets an agent act under it.
      </p>

      <Heading id="policy-commitments">Policy commitments</Heading>
      <p>{g("Policy commitment")}</p>
      <p>
        Concretely, the repository&apos;s <code>policyCommitment()</code> function computes{" "}
        <code>Poseidon2(whitelistRoot, maxOrderNotional, maxPosition, maxDailyLoss, policySalt)</code>. The
        agent&apos;s SDK client checks this local commitment against{" "}
        <code>MandateRegistry.policyCommitmentOf(agentId)</code> before ever generating a proof — see{" "}
        <Link href="/docs/sdk#agent-registration">SDK — agent registration</Link>.
      </p>

      <Heading id="session-keys">Session keys</Heading>
      <p>{g("Session key")}</p>
      <p>
        The session key has zero authority over funds — no function of the <code>MandateAccount</code> contract
        is callable by it. It exists only to sign order-submission calls to the <code>BatchAuction</code>{" "}
        contract.
      </p>

      <Heading id="portfolio-state">Portfolio state</Heading>
      <p>
        An agent&apos;s portfolio (position and daily PnL, per market) is stored as a leaf in a sparse Merkle
        tree whose root is anchored on-chain by the settlement contract. The agent proves a portfolio leaf is a
        member of that root — it cannot fabricate a healthier portfolio, because it doesn&apos;t control the
        commitment. See <Link href="/docs/architecture#noir-circuit">Architecture — Noir circuit</Link>.
      </p>

      <Heading id="compliance-proofs">Compliance proofs</Heading>
      <p>{g("Zero-knowledge proof")}</p>
      <p>
        MANDATE&apos;s compliance circuit is written in Noir and proved with UltraHonk (Barretenberg). It proves,
        in a single proof, that an order simultaneously satisfies whitelist membership, the notional cap, the
        post-fill position cap, the daily-loss cap, and circuit-breaker mode — against a portfolio anchored
        on-chain. See <Link href="/docs/architecture#noir-circuit">Architecture — Noir circuit</Link> for the
        exact constraint list.
      </p>

      <Heading id="order-commitments">Order commitments</Heading>
      <p>
        An order commitment is <code>Poseidon2(market, side, size, limit_price, epoch, order_salt)</code>. Binding
        the epoch into the commitment means a proof generated for epoch <em>e</em> cannot be replayed against a
        different epoch — the circuit rejects the mismatch (see{" "}
        <code>test_order_commitment_mismatch_rejected</code>).
      </p>

      <Heading id="epochs-and-batch-auctions">Epochs and batch auctions</Heading>
      <p>{g("Epoch")}</p>
      <p>
        {g("Batch auction")} The default epoch duration in the demo is 10 seconds. See{" "}
        <Link href="/docs/demo">Demo</Link> for a walkthrough of a full epoch, including a compliant and a
        rejected order.
      </p>
    </DocsPageShell>
  );
}
