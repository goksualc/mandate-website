import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { VideoPlayer } from "@/components/video-player";
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
        <h1 id="title" className="text-5xl font-semibold tracking-wide sm:text-6xl">
          MANDATE
        </h1>
        <p className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">
          Verifiable Authorization for Autonomous Agents
        </p>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          An experimental framework for letting autonomous agents act on a user&apos;s behalf while staying inside limits the
          user sets, and where those limits can be checked cryptographically.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
          <li><a className="textlink" href="/MANDATE.pdf" target="_blank" rel="noopener noreferrer">Design document (PDF) ↗</a></li>
          <li><a className="textlink" href={siteConfig.npmUrlSdk} target="_blank" rel="noopener noreferrer">npm: SDK ↗</a></li>
          <li><a className="textlink" href={siteConfig.npmUrlMcp} target="_blank" rel="noopener noreferrer">npm: MCP server ↗</a></li>
          <li><Link className="textlink" href="/docs">Documentation ↗</Link></li>
        </ul>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Status: local prototype · experimental · not audited
        </p>
      </section>

      {/* Project overview video */}
      <section id="overview" className="paper-section" aria-labelledby="video-h">
        <h2 id="video-h">Project Overview</h2>
        <VideoPlayer videoId="Md1v-K03hV0" title="Mandate Project Introduction" />
      </section>

      {/* Abstract */}
      <section id="abstract" className="paper-section" aria-labelledby="abstract-h">
        <h2 id="abstract-h">Abstract</h2>
        <p>
          Software agents now place orders and make payments for users. This raises an authorization problem. A user
          wants to set limits on what the agent can do, but today those limits are usually enforced by prompt
          instructions, rules on the operator&apos;s server, or wallet limits. The agent may be able to influence
          these, an outside party cannot check them, or both.
        </p>
        <p>
          MANDATE explores another approach. The user&apos;s policy is committed to with a hash that is registered
          on-chain. Every action the agent proposes must come with a zero-knowledge proof that it satisfies the
          committed policy, given a committed portfolio state. The properties I am aiming for are: the agent cannot
          produce an acceptable action outside its policy; a proof is tied to one policy, state, epoch and order, so it
          cannot be replayed; and the policy values do not have to be made public.
        </p>
        <p>
          The current implementation is a local prototype. It has a Noir circuit proved with UltraHonk, Solidity
          verification contracts, a TypeScript SDK and an MCP server. It runs on a local development chain with one
          trusted sequencer. The test suites and a documented demo exercise these properties. The system has not been
          audited and should not be used in production.
        </p>
      </section>

      {/* System architecture */}
      <section id="architecture" className="paper-section" aria-labelledby="arch-h">
        <h2 id="arch-h">System Architecture</h2>
        <ArchitectureDiagram />
        <p>
          The agent talks only to the MCP server. The server exposes three tools and passes calls to the SDK. For each
          order, the SDK reads the current epoch and the on-chain state root, and checks that the local policy opens the
          registered commitment. It then gets the portfolio witness from the sequencer and checks it against the
          on-chain root. After that it runs the Noir circuit. If the circuit produces a proof, the SDK sends the order
          commitment and the proof to the auction contract. The contract builds the five public inputs itself (policy
          commitment, state root, order commitment, epoch and circuit-breaker bit) instead of reading them from
          calldata.
        </p>
        <p>
          Funds sit in a separate account contract. Its owner-only withdrawal does not depend on the agent, the
          sequencer, the proof system or the auction. More detail is in the{" "}
          <Link href="/docs/architecture">architecture documentation</Link>.
        </p>
      </section>

      {/* Research approach */}
      <section id="research-approach" className="paper-section" aria-labelledby="ra-h">
        <h2 id="ra-h">Research Approach</h2>

        <h3>Delegated Authorization</h3>
        <p>
          A user gives an agent limited authority: a list of allowed markets, a maximum order size, a position limit, a
          daily loss limit, and an emergency mode that only allows orders that reduce risk. Prompt instructions, human
          approval, backend rules, wallet limits and multisig each cover part of this. My question is whether the
          limits themselves can be checked by someone other than the operator, without a human approving every action.
          I compare these approaches in the <Link href="/research#competitive-landscape">protocol design notes</Link>.
        </p>

        <h3>Cryptographic Policy Commitments</h3>
        <p>
          The policy is hashed with a secret salt (Poseidon2), and only the hash is stored on-chain when the agent is
          registered. To prove anything, the agent must open this commitment. It therefore cannot swap in looser limits
          than the ones the user registered. The policy values themselves are not published.
        </p>

        <h3>Zero-Knowledge Verification</h3>
        <p>
          The circuit encodes what an order must satisfy: the commitment opens correctly, the order is bound to the
          epoch, the market is on the whitelist, the portfolio is part of the committed state root, and the order stays
          within the notional, position and daily-loss limits and the circuit-breaker rule. If an order breaks a rule,
          proof generation fails. The rejection comes from the circuit, not from a separate check that could be skipped.
          The on-chain verifier only accepts proofs for the current epoch and state.
        </p>

        <h3>Enforcement and Trust Assumptions</h3>
        <p>
          This only works if proof-gated submission is the agent&apos;s only way to act. If the agent also has
          unrestricted transfer or trading tools, it can go around the system. The sequencer is trusted for liveness,
          for state updates after clearing, and for order privacy. I have not implemented state-transition proofs, so
          the guarantee is limited. A faulty sequencer can stall the system or post a wrong state root, but it should not
          let an agent prove a violating order against the root the contract holds. The UltraHonk setup is reused from
          elsewhere and I did not re-audit it. These are design goals tested on a local prototype. I have not shown
          them to hold in general. The <Link href="/docs/security">Security</Link> page has the threat model.
        </p>
      </section>

      {/* Implementation */}
      <section id="implementation" className="paper-section" aria-labelledby="impl-h">
        <h2 id="impl-h">Implementation</h2>
        <p>
          The prototype has the components listed below. The circuit is written in Noir and proved with UltraHonk. It has
          about 277 ACIR opcodes, and a proof takes roughly one second on a laptop. These are informal numbers from one
          local setup, not benchmarks. The verifier contract is generated with Barretenberg and checks proofs on-chain.
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
          <code>MandateClient</code> in the SDK runs the sequence described above. The MCP server is a thin wrapper that
          exposes only{" "}
          {mcpTools.map((t, i) => (
            <span key={t.name}>
              <code>{t.name}</code>
              {i < mcpTools.length - 2 ? ", " : i === mcpTools.length - 2 ? ", and " : ""}
            </span>
          ))}
          . Keeping the tool list this small limits what a manipulated or compromised agent can try. I tested the
          integration with a MoonPay agent, but the server does not depend on it.
        </p>

        <h3>Demonstration</h3>
        <p>
          In the local demo, a compliant order gets a proof and an on-chain commitment. An order over the notional limit
          fails at proof generation and creates no transaction. The MCP server keeps working afterwards. See the <Link href="/docs/demo">demo walkthrough</Link>.
        </p>

        <h3>Resources</h3>
        <ul>
          <li><Link href="/docs">Documentation</Link>: quickstart, SDK, MCP, architecture, security, demo</li>
          <li><Link href="/product-overview">Prototype overview</Link> (<a href="/mandate-product-overview.pdf">PDF</a>)</li>
          <li><Link href="/research">Protocol design</Link> (<a href="/MANDATE.pdf">PDF</a>), a longer-term design, mostly not implemented</li>
          <li><a href={siteConfig.npmUrlSdk}>{siteConfig.npmPackageSdk}</a> and <a href={siteConfig.npmUrlMcp}>{siteConfig.npmPackageMcp}</a> (v{siteConfig.npmVersion})</li>
        </ul>
      </section>

      {/* Limitations and future work */}
      <section id="limitations" className="paper-section" aria-labelledby="lim-h">
        <h2 id="lim-h">Limitations and Future Work</h2>
        <h3>Limitations of the current prototype</h3>
        <ul>
          <li>It runs only on a local development chain. There is no testnet or mainnet deployment.</li>
          <li>The circuit, contracts and SDK have not been audited.</li>
          <li>The sequencer is a single trusted service, and the state roots it posts after clearing have no validity proofs.</li>
          <li>Only one demo market and one policy shape are tested. I have not measured proving cost at larger scale.</li>
          <li>Order privacy comes from commit–reveal through a single party, so it holds against everyone except the sequencer.</li>
        </ul>
        <h3>Directions for future work</h3>
        <ul>
          <li>Prove state transitions, so the sequencer&apos;s updates do not have to be trusted.</li>
          <li>Replace the single sequencer with threshold-encrypted order flow and a decentralized set of operators.</li>
          <li>Get an independent review of the circuit and contracts, and test on a public test network.</li>
          <li>Support policies beyond trading, such as payments with recipient allowlists and cumulative limits.</li>
          <li>Keep a private, portable record of an agent&apos;s compliance history.</li>
        </ul>
        <p className="mt-3">
          The first two items and the last one are described in the <Link href="/research">protocol design document</Link>.
          None of them is implemented.
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
