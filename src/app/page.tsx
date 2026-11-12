import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { author, siteConfig } from "@/content/site";
import { mcpTools } from "@/content/mcp";

export const metadata: Metadata = {
  title: { absolute: siteConfig.titleShort },
  description: siteConfig.description,
};

const implementation: { component: string; detail: string; status: string }[] = [
  { component: "Compliance circuit", detail: "Noir circuit policy_check, proved with UltraHonk; 13 Noir tests, one per constraint", status: "Implemented" },
  { component: "On-chain verification", detail: "Solidity contracts (MandateRegistry, BatchAuction, MandateAccount) and a bb-generated HonkVerifier; 24 Foundry tests", status: "Implemented (local chain)" },
  { component: "Policy commitment", detail: "Poseidon2 commitment registered on-chain; the SDK refuses to prove against a policy that does not open it", status: "Implemented" },
  { component: "SDK", detail: "@0xgks/mandate-sdk, MandateClient.proveAndSubmit()", status: "Implemented" },
  { component: "MCP server", detail: "@0xgks/mandate-mcp, three tools over stdio, wrapping the SDK", status: "Implemented" },
  { component: "Sequencer", detail: "Single HTTP service: commit–reveal epoch loop, portfolio state, state-root settlement", status: "Implemented, trusted" },
  { component: "State-transition proofs", detail: "Validity of post-clearing state roots", status: "Not implemented" },
  { component: "Public deployment", detail: "Testnet or mainnet", status: "Not implemented" },
];

export default function HomePage() {
  return (
    <div className="paper">
      {/* Introduction */}
      <section aria-labelledby="title" className="py-14 sm:py-20">
        <p className="label">Independent Research Project · 2026</p>
        <h1 id="title" className="mt-4 text-5xl font-semibold tracking-wide sm:text-6xl">
          MANDATE
        </h1>
        <p className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">
          Verifiable Authorization for Autonomous Agents
        </p>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          An experimental framework investigating how autonomous agents can execute delegated actions while remaining
          subject to cryptographically verifiable, user-defined constraints.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
          <li><a className="textlink" href="/MANDATE.pdf" target="_blank" rel="noopener noreferrer">Design document (PDF) ↗</a></li>
          <li><a className="textlink" href={siteConfig.npmUrlSdk} target="_blank" rel="noopener noreferrer">npm: SDK ↗</a></li>
          <li><a className="textlink" href={siteConfig.npmUrlMcp} target="_blank" rel="noopener noreferrer">npm: MCP server ↗</a></li>
          <li><Link className="textlink" href="/docs">Documentation ↗</Link></li>
        </ul>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Status: local prototype · experimental · not externally audited · no public source repository yet
        </p>
      </section>

      {/* Abstract */}
      <section id="abstract" className="paper-section" aria-labelledby="abstract-h">
        <h2 id="abstract-h">Abstract</h2>
        <p>
          Autonomous software agents increasingly act on behalf of users, for example by placing orders or initiating
          payments. Delegating this authority raises an authorization problem. The constraints a user intends to impose
          are usually enforced through prompt instructions, operator-side rules, or wallet-level limits. These
          mechanisms operate at a layer the agent may influence, or they cannot be independently verified by a third
          party, or they require trusting the operator that runs them.
        </p>
        <p>
          MANDATE investigates an alternative. The user&apos;s policy is bound to a cryptographic commitment
          registered on-chain, and each proposed action must be accompanied by a zero-knowledge proof that it satisfies
          the committed policy with respect to an anchored portfolio state. The intended properties are that an agent
          cannot produce an acceptable action outside its policy, that a proof is bound to a particular policy, state,
          epoch and order and so cannot be replayed, and that the policy parameters need not be disclosed in full.
        </p>
        <p>
          The current implementation is a local proof-of-concept: a Noir circuit proved with UltraHonk, Solidity
          verification contracts, a TypeScript SDK, and an MCP server, running on a local development chain with a
          single trusted sequencer. These properties are exercised by the prototype&apos;s test suites and a
          documented demonstration. They are not externally audited, and they are not established for production use.
        </p>
      </section>

      {/* System architecture */}
      <section id="architecture" className="paper-section" aria-labelledby="arch-h">
        <h2 id="arch-h">System Architecture</h2>
        <ArchitectureDiagram />
        <p>
          The agent interacts only with the MCP server, which exposes three tools and delegates to the SDK. For each
          order the SDK reads the current epoch and on-chain state root, checks that the local policy opens the
          registered commitment, obtains the portfolio witness from the sequencer and verifies it against the on-chain
          root, and then invokes the Noir circuit. If a proof is produced, the SDK submits the order commitment with
          the proof to the auction contract. The five public inputs (policy commitment, state root, order commitment,
          epoch, circuit-breaker bit) are assembled by the contract from its own state rather than taken from calldata.
        </p>
        <p>
          Funds are held in a separate account contract whose owner-only withdrawal path does not depend on the agent,
          sequencer, proof system, or auction. Component-level detail is in the{" "}
          <Link href="/docs/architecture">architecture documentation</Link>.
        </p>
      </section>

      {/* Research approach */}
      <section id="research-approach" className="paper-section" aria-labelledby="ra-h">
        <h2 id="ra-h">Research Approach</h2>

        <h3>Delegated Authorization</h3>
        <p>
          A user grants an agent a bounded capability: a set of permitted markets, a per-order notional limit, a
          position limit, a daily loss limit, and an emergency mode that permits only risk-reducing orders. Prompt
          instructions, human approval, backend rules, wallet spending limits and multisignature schemes each address
          part of this problem. The question studied here is whether the bound itself can be made checkable by a party
          other than the operator, without requiring a human to approve every action. A comparison of these approaches
          is given in the <Link href="/research#competitive-landscape">protocol design notes</Link>.
        </p>

        <h3>Cryptographic Policy Commitments</h3>
        <p>
          The policy is hashed (Poseidon2) together with a secret salt, and only the resulting commitment is stored
          on-chain at registration. Proof generation must open this commitment, so the agent cannot substitute looser
          limits than the ones the user registered. The policy values themselves are not published.
        </p>

        <h3>Zero-Knowledge Verification</h3>
        <p>
          A circuit encodes the constraints an order must satisfy: commitment opening, order and epoch binding,
          whitelist membership, portfolio membership in the committed state root, notional, post-fill position and
          daily-loss caps, and circuit-breaker behaviour. A violating order makes proof generation fail, so the
          rejection is a property of the circuit rather than of a policy check that could be skipped. The on-chain
          verifier accepts only proofs for the current epoch and state.
        </p>

        <h3>Enforcement and Trust Assumptions</h3>
        <p>
          Enforcement holds only if proof-gated submission is the agent&apos;s sole execution path; an agent that is
          also given unrestricted transfer or trading tools bypasses it. The sequencer is trusted for liveness, for
          post-clearing state updates, and for order-flow privacy. State-transition proofs are not implemented, so the
          claim is limited: a faulty sequencer can stall the system or post an incorrect state root, but it does not
          let an agent prove a violating order against the root the contract holds. The UltraHonk setup is reused
          rather than re-audited. These are design intentions evaluated on a local prototype, not demonstrated
          guarantees. See <Link href="/docs/security">Security</Link> for the threat model.
        </p>
      </section>

      {/* Implementation */}
      <section id="implementation" className="paper-section" aria-labelledby="impl-h">
        <h2 id="impl-h">Implementation</h2>
        <p>
          The proof-of-concept comprises the components below. The circuit is written in Noir and proved with
          UltraHonk; the project documentation reports about 277 ACIR opcodes and roughly one second per proof on a
          laptop. These are informal measurements from a single local environment and are not benchmarks. The
          verifier contract is generated by the Barretenberg tooling and re-verifies proofs on-chain.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
            <caption className="sr-only">Implementation status of MANDATE components</caption>
            <thead>
              <tr className="border-y border-border-strong">
                <th scope="col" className="py-2 pr-4 font-semibold">Component</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Description</th>
                <th scope="col" className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {implementation.map((r) => (
                <tr key={r.component} className="border-b border-border align-top">
                  <th scope="row" className="py-2 pr-4 font-medium">{r.component}</th>
                  <td className="py-2 pr-4 text-muted-foreground">{r.detail}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>SDK and MCP integration</h3>
        <p>
          <code>MandateClient</code> in the SDK implements the sequence described above. The MCP server is a thin
          wrapper that exposes only{" "}
          {mcpTools.map((t, i) => (
            <span key={t.name}>
              <code>{t.name}</code>
              {i < mcpTools.length - 2 ? ", " : i === mcpTools.length - 2 ? ", and " : ""}
            </span>
          ))}
          . Limiting the tool surface is intended to limit what a prompted or compromised agent can attempt. A MoonPay
          agent was used as the integration test; the server is not specific to it.
        </p>

        <h3>Demonstration</h3>
        <p>
          In the documented local demonstration, a compliant order produces a proof and an on-chain commitment, while an
          order exceeding the notional limit fails proof generation and creates no transaction. The MCP server remains
          available afterwards. See the <Link href="/docs/demo">demo walkthrough</Link>.
        </p>

        <h3>Resources</h3>
        <ul>
          <li><Link href="/docs">Documentation</Link>: quickstart, SDK, MCP, architecture, security, demo</li>
          <li><Link href="/product-overview">Prototype overview</Link> (<a href="/mandate-product-overview.pdf">PDF</a>)</li>
          <li><Link href="/research">Protocol design</Link> (<a href="/MANDATE.pdf">PDF</a>), a longer-term design that is largely unimplemented</li>
          <li><a href={siteConfig.npmUrlSdk}>{siteConfig.npmPackageSdk}</a> and <a href={siteConfig.npmUrlMcp}>{siteConfig.npmPackageMcp}</a> (v{siteConfig.npmVersion})</li>
        </ul>
        <p className="mt-3 text-[14px] text-muted-foreground">
          The source repository is not yet public, so no repository link is provided.
        </p>
      </section>

      {/* Limitations and future work */}
      <section id="limitations" className="paper-section" aria-labelledby="lim-h">
        <h2 id="lim-h">Limitations and Future Work</h2>
        <h3>Limitations of the current prototype</h3>
        <ul>
          <li>It runs only on a local development chain; there is no testnet or mainnet deployment.</li>
          <li>Neither the circuit, contracts, nor SDK has been externally audited.</li>
          <li>The sequencer is a single trusted service, and post-clearing state roots are not accompanied by validity proofs.</li>
          <li>Only one demonstration market and policy shape is exercised. Proving cost has not been measured at scale.</li>
          <li>Order privacy is commit–reveal through one party, so it holds against everyone except the sequencer.</li>
        </ul>
        <h3>Directions for future work</h3>
        <ul>
          <li>Proving state transitions so that sequencer updates need not be trusted.</li>
          <li>Replacing the single sequencer with threshold-encrypted order flow and a decentralized operator set.</li>
          <li>Independent review of the circuit and contracts, and evaluation on a public test network.</li>
          <li>Policy models beyond trading, such as payments with recipient allowlists and cumulative limits.</li>
          <li>Privacy-preserving, portable records of an agent&apos;s compliance history.</li>
        </ul>
        <p className="mt-3">
          The last three items are described in the <Link href="/research">protocol design document</Link> and are not
          implemented.
        </p>
      </section>

      {/* Researcher */}
      <section id="researcher" className="paper-section" aria-labelledby="res-h">
        <h2 id="res-h">Researcher</h2>
        <p className="font-serif text-xl">{author.name}</p>
        <p className="mt-1 text-muted-foreground">{author.role}</p>
        <p className="text-muted-foreground">{author.areas}</p>
        <p className="mt-4">
          <a href={`mailto:${siteConfig.contactEmail}`}>Email</a>
        </p>
      </section>
    </div>
  );
}
