import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { SecurityLayers } from "@/components/security-layers";
import { ComparisonTable } from "@/components/comparison-table";
import { securityReminders } from "@/content/product";

export const metadata: Metadata = {
  title: "Security",
  description: "MANDATE's threat model, defense-in-depth layers, trust assumptions, escape hatch, secrets management, and current limitations.",
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
      description="Defense in depth: failure at any single layer is sufficient to prevent an order from being submitted."
      toc={toc}
      pagerHref="/docs/security"
    >
      <Heading id="threat-model">Threat model</Heading>
      <p>What each adversary can and cannot do, as tested in the repository&apos;s circuit and contract test suites:</p>
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
          <strong>The sequencer is trusted for liveness and state updates</strong> — it computes and posts
          post-fill Merkle roots off-chain. State-transition proofs (fraud proofs / validity proofs) are
          deferred, so a malicious sequencer could stall the system, but the ZK circuit still prevents it from
          enabling a policy violation: the agent can only prove against the root the sequencer posted, and if
          that root disagrees with reality, that&apos;s a liveness/state bug to fix, not a security hole an
          agent can exploit for profit.
        </li>
        <li>
          <strong>The sequencer is trusted for order-flow privacy</strong> — the commit–reveal design simulates
          threshold encryption through a single party. Ring-1 privacy holds only against everyone except the
          sequencer itself.
        </li>
        <li>
          <strong>The powers-of-tau / circuit setup</strong> underlying UltraHonk is a universal, widely-reused
          setup — not specific to this project, and not re-audited here.
        </li>
        <li>
          <strong>Not assumed for fund safety:</strong> the sequencer&apos;s honesty, or any liveness of the
          agent, auction, or proof pipeline — the escape hatch below depends on none of them.
        </li>
      </ul>

      <Heading id="escape-hatch">Escape hatch</Heading>
      <p>
        <code>MandateAccount</code> provides an owner-only withdrawal path that depends on nothing — not the
        agent, the sequencer, a proof, or the auction being alive. This is tested directly:{" "}
        <code>test_account_escapeHatchWorksWithDeadInfrastructure</code>. The session key that authorizes trading
        has zero authority over this path; no <code>MandateAccount</code> function is callable by it.
      </p>

      <Heading id="secrets-management">Secrets management</Heading>
      <Callout type="danger" title="Never commit these">
        <ul className="list-disc space-y-1 pl-4">
          {securityReminders.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Callout>
      <p className="mt-4">
        Concretely, <code>MANDATE_SESSION_KEY</code> and <code>MANDATE_POLICY_SALT</code> (see{" "}
        <a href="/docs/mcp#client-configuration">MCP — client configuration</a>) are the two values that must
        never appear in version control, logs, or chat transcripts. The local setup script writes them to{" "}
        <code>.local/</code> with <code>chmod 600</code> and that directory is git-ignored by default.
      </p>

      <Heading id="current-limitations">Current limitations</Heading>
      <ul>
        <li>Local Anvil chain only — no public testnet or mainnet deployment.</li>
        <li>No external security audit of the circuit, contracts, or SDK.</li>
        <li>Test-only keys and values throughout; not production custody infrastructure.</li>
        <li>Single, centralized sequencer — no decentralized keyper committee or watchtower network yet.</li>
        <li>State-transition proofs deferred — the operator is trusted to post correct state roots after clearing.</li>
        <li>No cross-chain settlement (ERC-7683), TEE fast lane, or DA-blob publishing yet.</li>
      </ul>
    </DocsPageShell>
  );
}
