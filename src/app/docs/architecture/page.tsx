import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ComparisonTable } from "@/components/comparison-table";

export const metadata: Metadata = {
  title: "Architecture",
  description: "How the MoonPay Agent, MCP server, SDK, Noir circuit, contracts, sequencer, and local chain fit together in the MANDATE MVP.",
};

const toc = [
  { id: "system-overview", title: "System overview" },
  { id: "sdk", title: "SDK" },
  { id: "noir-circuit", title: "Noir circuit" },
  { id: "contracts", title: "Contracts" },
  { id: "sequencer", title: "Sequencer" },
  { id: "local-chain", title: "Local chain" },
];

export default function ArchitectureDocsPage() {
  return (
    <DocsPageShell
      title="Architecture"
      description="The agent interacts only with the MCP server. All proof generation and on-chain commitment happen inside the SDK and contract layer."
      toc={toc}
      pagerHref="/docs/architecture"
    >
      <Heading id="system-overview">System overview</Heading>
      <ArchitectureDiagram />
      <p className="mt-6">
        Per epoch (default 10 seconds): the agent reads the anchored state, its strategy decides, it proves
        compliance (Noir/UltraHonk, ~1s on a laptop), and the order <em>commitment</em> goes on-chain gated by
        the proof — the plaintext order stays off-chain with the sequencer, simulating threshold encryption.
        The sequencer then closes the epoch, reveals, and the auction contract computes the uniform clearing
        price on-chain (maximum executed volume, midpoint of the tie interval); fills are emitted, reputation
        counters accrue, and per-agent state roots advance.
      </p>
      <Callout type="note" title="Public inputs are assembled by the contract, not calldata">
        The five public inputs of every proof — policy commitment (from the registry), state root (from the
        contract), order commitment, current epoch, and the breaker bit — are assembled by the contract from
        registry state. An agent cannot substitute different public inputs than what the contract itself holds.
      </Callout>

      <Heading id="sdk">SDK</Heading>
      <p>
        <code>@0xgks/mandate-sdk</code> coordinates portfolio reads, policy checks, proof generation, signing,
        and order submission behind a single class, <code>MandateClient</code>. Full reference:{" "}
        <a href="/docs/sdk">/docs/sdk</a>.
      </p>

      <Heading id="noir-circuit">Noir circuit</Heading>
      <p>
        <code>circuits/policy_check</code> is an UltraHonk compliance circuit (~277 ACIR opcodes, ~1s/proof, 13
        Noir tests) that proves policy satisfaction without revealing the private strategy. It checks, in order:
      </p>
      <ol>
        <li>Correct opening of the policy commitment (the agent cannot substitute looser limits).</li>
        <li>Order/epoch binding (replay-safe — a proof for epoch <em>e</em> cannot be reused in epoch <em>e&apos;</em>).</li>
        <li>Whitelist Merkle membership (the market is on the approved list).</li>
        <li>Portfolio-leaf membership in the on-chain state root (the agent cannot self-report a healthier portfolio).</li>
        <li>Notional cap: <code>size × limit_price ≤ max_order_notional</code>.</li>
        <li>Post-fill position cap.</li>
        <li>Daily loss cap.</li>
        <li>Circuit breaker: when active, only strictly risk-reducing orders are provable.</li>
      </ol>

      <Heading id="contracts">Contracts</Heading>
      <p>Foundry-tested Solidity (24 tests, including on-chain verification of a real proof):</p>
      <ComparisonTable
        columns={["Contract", "Role"]}
        rows={[
          ["MandateRegistry", "Agent registration, session-key authorization, policy commitment storage"],
          ["BatchAuction", "Commit–reveal epoch loop; verifies proofs; computes the uniform clearing price on-chain"],
          ["MandateAccount", "Fund custody; owner-only escape hatch independent of agent, sequencer, or auction"],
          ["HonkVerifier", "The real bb-generated UltraHonk Solidity verifier"],
          ["MockVerifier / MockERC20", "Test doubles used only in the Foundry test suite"],
        ]}
      />

      <Heading id="sequencer">Sequencer</Heading>
      <p>
        A minimal HTTP service running the commit–reveal epoch loop: envelope intake (verifies the Poseidon2
        opening), reveal, clearing trigger, state-root settlement, and a mock price oracle. It is trusted for
        liveness and privacy — not for mandate enforcement or replacing proofs. State-transition proofs are
        deferred: the sequencer computes and posts post-fill Merkle roots off-chain, so the agent still cannot
        lie, but the operator is trusted for state updates (see <a href="/docs/security#trust-assumptions">Security — trust assumptions</a>).
      </p>

      <Heading id="local-chain">Local chain</Heading>
      <p>
        An Anvil-based local Ethereum environment running the MVP contracts. There is no public testnet or
        mainnet deployment yet — see the roadmap on the <a href="/product-overview">Product Overview</a> page.
      </p>
    </DocsPageShell>
  );
}
