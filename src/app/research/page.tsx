import type { Metadata } from "next";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { ComparisonTable } from "@/components/comparison-table";
import { FeatureStatus } from "@/components/feature-status";
import { PdfViewer } from "@/components/pdf-viewer";
import { TableOfContents } from "@/components/table-of-contents";

export const metadata: Metadata = {
  title: "Research — Protocol Design",
  description: "A structured summary of MANDATE.pdf: the long-term protocol vision, design principles, competitive landscape, cryptographic architecture, risks, and roadmap. Distinguished clearly from the current working MVP.",
};

const toc = [
  { id: "about-this-page", title: "About this page" },
  { id: "protocol-vision", title: "Protocol vision" },
  { id: "design-principles", title: "Design principles" },
  { id: "competitive-landscape", title: "Competitive landscape" },
  { id: "cryptographic-architecture", title: "Cryptographic architecture" },
  { id: "agentic-trading-flow", title: "Agentic trading flow" },
  { id: "mvp-lite", title: "MANDATE Lite (the buildable MVP)" },
  { id: "risks", title: "Risks" },
  { id: "future-roadmap", title: "Future roadmap" },
  { id: "recommendation", title: "Final recommendation" },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex gap-10">
        <article className="prose-mandate min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-strong">Research</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Protocol Design Document
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            A structured web adaptation of <code>MANDATE.pdf</code> — the long-term protocol research document.
            This covers the vision <em>beyond</em> the current MVP. For what actually runs today, see the{" "}
            <Link href="/product-overview">Product Overview</Link> and <Link href="/docs">Documentation</Link>.
          </p>

          <Heading id="about-this-page" className="mt-10">About this page</Heading>
          <Callout type="warning" title="Research vision — not implemented">
            Everything below this point describes protocol <em>design research</em>, not shipped functionality.
            Where a concept is implemented in the working MVP, it is labeled <FeatureStatus value="MVP" />. Where
            it is future protocol design, it is labeled <FeatureStatus value="Research" /> or{" "}
            <FeatureStatus value="Future work" />. This page condenses and reorganizes the source document for
            web reading — it summarizes rather than reproduces the PDF verbatim. The original is authoritative;
            read it directly below or download it.
          </Callout>
          <div className="not-prose mt-6">
            <PdfViewer src="/MANDATE.pdf" title="MANDATE.pdf — Protocol design document, v0.1 draft, July 2026" />
          </div>

          <Heading id="protocol-vision" className="mt-12">Protocol vision</Heading>
          <p>
            <strong>One-line thesis:</strong> everyone is building either private execution, encrypted mempools,
            agent wallets with plaintext policy engines, or intent/solver networks. Nobody has built the thing
            that connects them: a layer where an autonomous agent can trade a hidden strategy over a hidden
            portfolio while producing public, succinct, composable proofs that every action complied with a
            pre-committed risk mandate — and where those proofs accumulate into a portable, privacy-preserving
            reputation that lets strangers delegate capital to agents they cannot inspect.
          </p>
          <p>
            The document is explicit that MANDATE is deliberately <strong>not a new L1</strong>. It is proposed as
            cryptographic middleware plus an app-specific settlement layer anchored to Ethereum — contracts,
            circuits, and a thin operator network, not a new chain competing for validators and liquidity from
            zero. <FeatureStatus value="Research" /> The working MVP implements a small slice of this vision on a
            local Anvil chain, described throughout as <FeatureStatus value="MVP" />.
          </p>
          <p>The full vision names four gaps the research identifies as unsolved elsewhere:</p>
          <ol>
            <li>
              <strong>The delegation-trust gap</strong> — no system today lets a stranger cryptographically
              verify an agent&apos;s track record (limits respected, drawdown bounded) without trusting the
              operator, the model, or the cloud it runs on.
            </li>
            <li>
              <strong>Portfolio-state-conditioned policies</strong> — enforcing stateful risk limits (drawdown,
              leverage) requires the enforcement layer to know the portfolio, but publishing the portfolio
              destroys the agent&apos;s privacy.
            </li>
            <li>
              <strong>Reputation portability</strong> — agent reputation today is a token price, a follower
              count, or a platform-local score; nothing compresses verified behavioral history into a portable,
              privacy-preserving credential.
            </li>
            <li>
              <strong>Interoperability of trust, not just messages</strong> — ERC-7683 standardized intent
              <em>messages</em>, but nobody standardized a proof-carrying answer to &ldquo;is this agent allowed
              to sign this, and is it in good standing?&rdquo;
            </li>
          </ol>

          <Heading id="design-principles" className="mt-12">Design principles</Heading>
          <ComparisonTable
            columns={["Principle", "Summary"]}
            rows={[
              ["P1 — Prove actions, not algorithms", "Prove the action satisfied constraint set P over anchored state S — never that a model is trustworthy. Constraint circuits are small; model circuits are enormous."],
              ["P2 — Integrity from cryptography, confidentiality from layered defense", "Funds safety and mandate enforcement rest only on zk proofs + on-chain state. A total TEE break may leak privacy, but must never break integrity."],
              ["P3 — The proven-against state must not be self-reported", "Portfolio state is maintained by the settlement contract as a function of settled fills — the agent cannot fabricate it."],
              ["P4 — Don't race; batch", "Frequent batch auctions with uniform clearing prices make intra-batch order irrelevant, neutralizing latency competition and front-running."],
              ["P5 — Middleware, not a new chain", "Liquidity, security, and users live on Ethereum and its rollups; a new L1 restarts all three from zero."],
              ["P6 — Consume commodity components", "Encrypted mempools, intent standards (7683), account abstraction, DA, and proof systems already exist — originality is spent only on the mandate/reputation layer."],
              ["P7 — Pseudonymous accountability", "One persistent agent identity; unlinkable actions; provable aggregate history; instant principal-side revocation; opt-in selective disclosure via viewing keys."],
              ["P8 — Graceful degradation and exits", "Every trust assumption gets an explicit failure mode and a user-visible downgrade — never a silent one."],
            ]}
          />

          <Heading id="competitive-landscape" className="mt-12">Competitive landscape</Heading>
          <p>
            The document surveys general-purpose base layers (Bitcoin, Ethereum, Solana, Avalanche, Cosmos,
            Polkadot, Near, Aptos/Sui), modular infrastructure (Celestia, EigenLayer, shared sequencers), privacy
            systems (Zcash, Monero, Aztec, Aleo, Secret Network, Starknet, Penumbra), and the direct competitive
            frontier — MEV, intents, and agent infrastructure. A few comparisons it draws out explicitly:
          </p>
          <ComparisonTable
            columns={["System", "Their frame", "MANDATE's difference"]}
            rows={[
              ["Aztec", "General-purpose private smart contracts", "Complementary, not competitive — Aztec is a platform; MANDATE is a market + trust structure with no native batch auctions, anchored-state policy proofs, or folding reputation."],
              ["Penumbra", "Threshold-encrypted DEX (batch swaps)", "The prior art for private batch-auction trading, but on its own chain (liquidity island) and missing the agent/mandate/reputation layer."],
              ["CoW / UniswapX / ERC-7683", "Best execution for visible intents", "MANDATE = “7683 with a trust layer” — adds who may sign (mandates) and how they've behaved (credentials) to a stack that only standardized what is signed."],
              ["Cobo-style agentic wallets", "Plaintext policy enforcement, operator-trusted", "Identical goal (safe agent autonomy), inverted trust: their guarantees are legible only to the customer and rest on the operator; MANDATE's rest on math."],
              ["ZKML (verifiable inference)", "Prove a specific model produced a specific output", "Proves the wrong thing at the wrong cost — MANDATE proves the action, not the model."],
            ]}
          />

          <Heading id="cryptographic-architecture" className="mt-12">Cryptographic architecture</Heading>
          <p>
            The research document specifies a fuller cryptographic stack than the current MVP implements:
          </p>
          <ComparisonTable
            columns={["Function", "Proposed primitive", "MVP status"]}
            rows={[
              ["Compliance & state-transition proofs", "Plonkish SNARK (UltraHonk) over BN254, circuits in Noir", "Compliance proofs: implemented. State-transition proofs: not implemented (operator-trusted)."],
              ["Commitments", "Poseidon2 hash over BN254", "Implemented — policy, order, whitelist, and portfolio-leaf commitments all use Poseidon2."],
              ["Reputation accumulation", "Folding-scheme IVC (Nova/HyperNova), terminal Honk wrap", "Not implemented. Simulated by plain on-chain counters (epochs, orders, volume, violations)."],
              ["Order-flow encryption", "Threshold IBE (Shutter-style), t-of-n keyper committee", "Not implemented. Simulated by commit–reveal through a single sequencer."],
              ["Committee attestations", "BLS threshold signatures", "Not implemented — no committee exists yet."],
              ["Agent authority", "ERC-4337 validation + session keys", "Implemented in spirit: a scoped session key signs order submissions; full ERC-4337 EntryPoint integration is not required by the MVP's custom account."],
            ]}
          />
          <p>The three concentric privacy rings the design proposes:</p>
          <ul>
            <li><strong>Ring 1 — transit privacy:</strong> intents encrypted under threshold IBE until the epoch&apos;s intent set is fixed. <FeatureStatus value="Research" /> (MVP: commit–reveal via a trusted sequencer, <FeatureStatus value="MVP" />).</li>
            <li><strong>Ring 2 — state privacy:</strong> portfolio state as Poseidon commitments in a tree, updated by verified fill-delta proofs. <FeatureStatus value="MVP" /> (implemented, without the fill-delta proof step).</li>
            <li><strong>Ring 3 — behavioral privacy:</strong> uniform-price batches mean an individual fill can&apos;t be attributed to an individual agent from the public transcript. <FeatureStatus value="MVP" /> for the demo&apos;s single market.</li>
          </ul>

          <Heading id="agentic-trading-flow" className="mt-12">Agentic trading flow (end-to-end vision)</Heading>
          <p>
            The document walks through a ten-step full-vision flow: principal setup and mandate definition,
            agent registration, continuous authorization proof via session signatures, off-chain strategy
            execution, compliance proving, encrypted submission, batch clearing, an optional ERC-7683 cross-chain
            leg, state updates, and — after months of epochs — a folded reputation credential a vault on another
            chain can verify in one proof and act on, <em>without the agent ever revealing a trade</em>.
          </p>
          <p>
            The MVP demonstrates the middle of this flow — registration through compliance proving, submission,
            and settlement against a single local market — without cross-chain execution or folded reputation.
          </p>

          <Heading id="mvp-lite" className="mt-12">MANDATE Lite — the buildable MVP</Heading>
          <p>
            The document specifies a scoped, four-week &ldquo;MANDATE Lite&rdquo; build target, explicit about
            what should be real versus simulated:
          </p>
          <ComparisonTable
            columns={["Component", "Document's prescribed treatment", "What the MVP actually did"]}
            rows={[
              ["Policy zk proof", "Real — the one part worth spending credibility on", "Real Noir/UltraHonk proof, verified on-chain by a bb-generated verifier"],
              ["Threshold encryption", "Simulated via commit–reveal by a single sequencer", "Matches — commit–reveal through the sequencer"],
              ["Folding reputation", "Simulated via on-chain counters", "Matches — epochs/orders/volume/violations counters"],
              ["State-transition proof", "Plain contract execution over commitments", "Matches — sequencer posts roots; not proven"],
              ["Cross-chain (7683)", "Omitted / roadmap", "Matches — omitted"],
            ]}
          />
          <p>
            This is a rare case where the shipped MVP tracks the document&apos;s own scoping almost exactly —
            the &ldquo;what is real vs. simulated&rdquo; table in the repository README uses nearly identical
            language to this section of the protocol design.
          </p>

          <Heading id="risks" className="mt-12">Risks</Heading>
          <p>The document is unusually direct about what could fail. Three risks it flags as possibly fatal:</p>
          <ol>
            <li>
              <strong>Cold-start liquidity</strong> — batch auctions need flow to price well; agents need
              pricing to bring flow. The document names this &ldquo;the real boss fight, not cryptography.&rdquo;
            </li>
            <li>
              <strong>Reputation may not be the commodity it claims</strong> — allocators might keep allocating
              on brand and audited track records rather than zero-knowledge credentials. A market hypothesis,
              not a theorem.
            </li>
            <li>
              <strong>Statistical privacy erosion is permanent and cumulative</strong> — clearing prices,
              volumes, and participation timing leak bits every epoch, forever; strategy privacy degrades to
              strategy obscurity against a motivated long-horizon observer.
            </li>
          </ol>
          <p>
            It also flags regulatory exposure directly: this is, functionally, dark-pool infrastructure for
            autonomous traders, and the document recommends building selective-disclosure tooling from day one
            rather than marketing anonymity.
          </p>

          <Heading id="future-roadmap" className="mt-12">Future roadmap</Heading>
          <p>The research document&apos;s own phased plan for a serious 12–24 month build (distinct from the product roadmap on the Product Overview page):</p>
          <ComparisonTable
            columns={["Phase", "Focus"]}
            rows={[
              ["Phase 1 (months 1–6)", "Cryptographic core — formally specified circuits, folding-based reputation, a real threshold-IBE lane, published protocol paper"],
              ["Phase 2 (months 6–12)", "Decentralize the operator — restaked keyper/watchtower AVS sets, proved off-chain auction execution, sub-2s epochs"],
              ["Phase 3 (months 12–24)", "Market depth + interop — production ERC-7683 adapter, multi-market cross-margining, a reputation credential standard, selective-disclosure tooling"],
            ]}
          />
          <Callout type="note" title="Two different roadmaps, on purpose">
            This research-grade roadmap describes a ground-up, 12–24 month protocol build. It is separate from
            the nearer-term MVP roadmap (Phases 1–5) described on the <Link href="/product-overview">Product Overview</Link> page,
            which extends the <em>current</em> local MVP toward a public testnet.
          </Callout>

          <Heading id="recommendation" className="mt-12">Final recommendation</Heading>
          <p>
            The document&apos;s own conclusion: build MANDATE as cryptographic middleware and an app-specific
            settlement layer on Ethereum rollups — not a new chain, and not yet its own rollup. Ship MANDATE Lite
            first as a hackathon-scale proof of the one genuinely novel claim (the policy circuit), then write
            the fuller protocol paper with the risk section intact, then publish the policy-circuit and
            credential format as a draft standard early — in this design, the standard is the moat.
          </p>
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
