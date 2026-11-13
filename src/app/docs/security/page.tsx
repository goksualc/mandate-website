import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { SecurityLayers } from "@/components/security-layers";
import { ComparisonTable } from "@/components/comparison-table";
import { securityReminders } from "@/content/product";

export const metadata: Metadata = {
  title: "Security",
  description: "The threat model, the layers of defense, trust assumptions, escape hatch, secrets handling and current limitations.",
};

const toc = [
  { id: "threat-model", title: "Threat model" },
  { id: "defense-in-depth", title: "Defense in depth" },
  { id: "trust-assumptions", title: "Trust assumptions" },
  { id: "escape-hatch", title: "Escape hatch" },
  { id: "secrets-management", title: "Secrets management" },
  { id: "current-limitations", title: "Current limitations" },
];

export default function SecurityDocsPage() {
  return (
    <DocsPageShell
      title="Security"
      description="Several layers of defense. A failure at any one layer is enough to stop an order from being submitted."
      toc={toc}
      pagerHref="/docs/security"
    >
      <Heading id="threat-model">Threat model</Heading>
      <p>What each adversary can and cannot do, as covered by the circuit and contract tests in the repository:</p>
      <ComparisonTable
        columns={["Adversary", "Worst case", "Mitigation"]}
        rows={[
          ["Malicious agent, arbitrary strategy", "Nothing — a breaching order is simply unprovable", "Circuit soundness (primary invariant)"],
          ["Malicious agent, stale proof replay", "Rejected", "Epoch + state-root binding in the order commitment"],
          ["Compromised or lagging sequencer", "Liveness/privacy issue, not a policy violation", "State-root verification (PortfolioMismatchError) — the agent still cannot lie about its portfolio"],
          ["Auction operator censorship", "Liveness delay", "Owner escape hatch on MandateAccount, independent of the operator"],
        ]}
      />

      <Heading id="defense-in-depth">Defense in depth</Heading>
      <SecurityLayers />

      <Heading id="trust-assumptions">Trust assumptions</Heading>
      <ul>
        <li>
          <strong>The sequencer is trusted for liveness and state updates.</strong> It computes the post-fill Merkle
          roots and posts them. State-transition proofs (fraud proofs or validity proofs) are not implemented. A
          malicious sequencer could stall the system, but the circuit should still stop it from enabling a policy
          violation. The agent can only prove against the root the sequencer posted. If that root does not match
          reality, I treat it as a liveness or state bug to fix, not as a hole an agent could exploit for profit.
        </li>
        <li>
          <strong>The sequencer is trusted for order-flow privacy.</strong> The commit–reveal design uses a single
          party to stand in for threshold encryption. Ring-1 privacy holds against everyone except the sequencer.
        </li>
        <li>
          <strong>The powers-of-tau setup</strong> behind UltraHonk is a universal setup that many projects reuse. It is
          not specific to this project, and I did not re-audit it.
        </li>
        <li>
          <strong>Not assumed for fund safety:</strong> an honest sequencer, or any of the agent, auction or proof
          pipeline staying alive. The escape hatch below does not depend on any of them.
        </li>
      </ul>

      <Heading id="escape-hatch">Escape hatch</Heading>
      <p>
        <code>MandateAccount</code> has an owner-only withdrawal path. It does not depend on the agent, the sequencer,
        a proof or the auction being alive. A test covers this directly:{" "}
        <code>test_account_escapeHatchWorksWithDeadInfrastructure</code>. The session key that authorizes trading has
        no authority over this path, and it cannot call any <code>MandateAccount</code> function.
      </p>

      <Heading id="secrets-management">Secrets management</Heading>
      <Callout type="danger" title="Keep these out of version control">
        <ul className="list-disc space-y-1 pl-4">
          {securityReminders.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Callout>
      <p className="mt-4">
        In practice, <code>MANDATE_SESSION_KEY</code> and <code>MANDATE_POLICY_SALT</code> (see{" "}
        <a href="/docs/mcp#client-configuration">MCP: client configuration</a>) must never appear in version control,
        logs or chat transcripts. The local setup script writes them to <code>.local/</code> with{" "}
        <code>chmod 600</code>, and that directory is git-ignored.
      </p>

      <Heading id="current-limitations">Current limitations</Heading>
      <ul>
        <li>Local Anvil chain only. There is no public testnet or mainnet deployment.</li>
        <li>No external security audit of the circuit, contracts or SDK.</li>
        <li>Test-only keys and values throughout. This is not production custody infrastructure.</li>
        <li>One centralized sequencer. There is no decentralized keyper committee or watchtower network yet.</li>
        <li>No state-transition proofs yet. The operator must be trusted to post correct state roots after clearing.</li>
        <li>No cross-chain settlement (ERC-7683), TEE fast lane or DA-blob publishing yet.</li>
      </ul>
    </DocsPageShell>
  );
}
