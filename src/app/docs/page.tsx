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
      description="MANDATE checks that an autonomous agent stays inside a policy set by its user. This page explains the main concepts used in the rest of the documentation."
      toc={toc}
      pagerHref="/docs"
    >
      <Heading id="introduction">Introduction</Heading>
      <p>
        MANDATE sits between an AI agent and a financial execution system. Before the agent can submit an
        action, the action must come with a cryptographic proof that it follows the user&apos;s policy. MANDATE does
        not decide what the agent should do. It only checks what the agent is allowed to do.
      </p>
      <p>
        The prototype connects to the MoonPay Agent through a published MCP server
        (<code>@0xgks/mandate-mcp@0.1.0</code>). To get a working system quickly, start with the{" "}
        <Link href="/docs/quickstart">Quickstart</Link>.
      </p>

      <Heading id="project-status">Project status</Heading>
      <Callout type="warning" title="Local prototype: experimental, not audited">
        This site describes a system that runs locally. It has a Noir/UltraHonk circuit, Foundry-tested contracts, a
        published npm package and a local demo. It uses a local Anvil chain and test-only keys. It has not been
        audited and is not deployed on any public testnet or mainnet. See <Link href="/docs/security#current-limitations">Current limitations</Link>.
      </Callout>

      <Heading id="mandates">Mandates</Heading>
      <p>{g("Mandate")}</p>
      <p>
        A mandate is a <strong>policy</strong> (the numeric and structural rules) plus the authorization data that
        lets an agent act under it: a session key and an on-chain registration.
      </p>

      <Heading id="policy-commitments">Policy commitments</Heading>
      <p>{g("Policy commitment")}</p>
      <p>
        In the repository, <code>policyCommitment()</code> computes{" "}
        <code>Poseidon2(whitelistRoot, maxOrderNotional, maxPosition, maxDailyLoss, policySalt)</code>. Before
        generating a proof, the SDK client compares this local commitment with{" "}
        <code>MandateRegistry.policyCommitmentOf(agentId)</code>. See{" "}
        <Link href="/docs/sdk#agent-registration">SDK — agent registration</Link>.
      </p>

      <Heading id="session-keys">Session keys</Heading>
      <p>{g("Session key")}</p>
      <p>
        The session key has no authority over funds. It cannot call any function of the <code>MandateAccount</code>{" "}
        contract. It is only used to sign order submissions to the <code>BatchAuction</code> contract.
      </p>

      <Heading id="portfolio-state">Portfolio state</Heading>
      <p>
        An agent&apos;s portfolio (position and daily PnL for each market) is stored as a leaf in a sparse Merkle
        tree. The settlement contract anchors the root of this tree on-chain. The agent proves that its portfolio
        leaf is part of that root. It cannot claim a healthier portfolio, because it does not control the root. See <Link href="/docs/architecture#noir-circuit">Architecture — Noir circuit</Link>.
      </p>

      <Heading id="compliance-proofs">Compliance proofs</Heading>
      <p>{g("Zero-knowledge proof")}</p>
      <p>
        The compliance circuit is written in Noir and proved with UltraHonk (Barretenberg). One proof shows that an
        order satisfies all of these at once: whitelist membership, the notional cap, the post-fill position cap,
        the daily-loss cap and the circuit-breaker rule. The proof is checked against a portfolio root anchored
        on-chain. See <Link href="/docs/architecture#noir-circuit">Architecture — Noir circuit</Link> for the
        exact constraint list.
      </p>

      <Heading id="order-commitments">Order commitments</Heading>
      <p>
        An order commitment is <code>Poseidon2(market, side, size, limit_price, epoch, order_salt)</code>. Because
        the epoch is part of the commitment, a proof made for epoch <em>e</em> cannot be reused in a different epoch.
        The circuit rejects the mismatch (see{" "}
        <code>test_order_commitment_mismatch_rejected</code>).
      </p>

      <Heading id="epochs-and-batch-auctions">Epochs and batch auctions</Heading>
      <p>{g("Epoch")}</p>
      <p>
        {g("Batch auction")} In the demo an epoch lasts 10 seconds by default. The{" "}
        <Link href="/docs/demo">Demo</Link> page walks through a full epoch with one compliant and one rejected order.
      </p>
    </DocsPageShell>
  );
}
