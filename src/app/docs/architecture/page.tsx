import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ComparisonTable } from "@/components/comparison-table";

export const metadata: Metadata = {
  title: "Architecture",
  description: "How the MoonPay Agent, MCP server, SDK, Noir circuit, contracts, sequencer and local chain fit together in the MANDATE prototype.",
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
      description="The agent talks only to the MCP server. Proof generation and on-chain commitment happen in the SDK and the contracts."
      toc={toc}
      pagerHref="/docs/architecture"
    >
      <Heading id="system-overview">System overview</Heading>
      <ArchitectureDiagram />
      <p className="mt-6">
        In each epoch (10 seconds by default), the agent reads the anchored state and its strategy picks an order.
        The agent then proves compliance (Noir/UltraHonk, about 1 second on a laptop). The order <em>commitment</em>{" "}
        goes on-chain, gated by the proof. The plaintext order stays off-chain with the sequencer, which stands in
        for threshold encryption. The sequencer then closes the epoch and reveals the orders. The auction contract
        computes the uniform clearing price on-chain (maximum executed volume, midpoint of the tie interval). Fills
        are emitted, reputation counters are updated and each agent&apos;s state root moves forward.
      </p>
      <Callout type="note" title="The contract builds the public inputs, not the caller">
        Every proof has five public inputs: the policy commitment (from the registry), the state root (from the
        contract), the order commitment, the current epoch and the breaker bit. The contract builds them from its own
        registry state. An agent cannot supply different public inputs from the ones the contract holds.
      </Callout>

      <Heading id="sdk">SDK</Heading>
      <p>
        <code>@0xgks/mandate-sdk</code> does portfolio reads, policy checks, proof generation, signing and order
        submission through one class, <code>MandateClient</code>. Full reference:{" "}
        <a href="/docs/sdk">/docs/sdk</a>.
      </p>

      <Heading id="noir-circuit">Noir circuit</Heading>
      <p>
        <code>circuits/policy_check</code> is the UltraHonk compliance circuit (about 277 ACIR opcodes, about 1 second
        per proof, 13 Noir tests). It proves that an order satisfies the policy without revealing the private
        strategy. It checks, in order:
      </p>
      <ol>
        <li>The policy commitment opens correctly, so the agent cannot use looser limits.</li>
        <li>The order is bound to the epoch, so a proof for epoch <em>e</em> cannot be reused in epoch <em>e&apos;</em>.</li>
        <li>The market is on the whitelist (Merkle membership).</li>
        <li>The portfolio leaf is part of the on-chain state root, so the agent cannot report a healthier portfolio.</li>
        <li>Notional cap: <code>size × limit_price ≤ max_order_notional</code>.</li>
        <li>Post-fill position cap.</li>
        <li>Daily loss cap.</li>
        <li>Circuit breaker: when it is active, only orders that strictly reduce risk can be proved.</li>
      </ol>

      <Heading id="contracts">Contracts</Heading>
      <p>Solidity contracts tested with Foundry (24 tests, including on-chain verification of a real proof):</p>
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
        A small HTTP service that runs the commit–reveal epoch loop. It takes in order envelopes (checking the
        Poseidon2 opening), reveals them, triggers clearing, settles state roots, and runs a mock price oracle. It is
        trusted for liveness and privacy, but not for enforcing the mandate and it does not replace proofs. I have not
        built state-transition proofs yet. The sequencer computes the post-fill Merkle roots and posts them, so the
        agent still cannot lie about its portfolio, but the operator must be trusted for state updates (see{" "}
        <a href="/docs/security#trust-assumptions">Security: trust assumptions</a>).
      </p>

      <Heading id="local-chain">Local chain</Heading>
      <p>
        A local Ethereum environment based on Anvil, running the prototype contracts. There is no public testnet or
        mainnet deployment yet. See the roadmap on the <a href="/product-overview">Product Overview</a> page.
      </p>
    </DocsPageShell>
  );
}
