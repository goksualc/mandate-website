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
  description: "A summary of MANDATE.pdf: the long-term protocol vision, design principles, related work, cryptographic architecture, risks and roadmap. It is kept separate from what the prototype implements.",
};

const toc = [
  { id: "about-this-page", title: "About this page" },
  { id: "protocol-vision", title: "Protocol vision" },
  { id: "design-principles", title: "Design principles" },
  { id: "competitive-landscape", title: "Competitive landscape" },
  { id: "cryptographic-architecture", title: "Cryptographic architecture" },
  { id: "agentic-trading-flow", title: "Agentic trading flow" },
  { id: "mvp-lite", title: "MANDATE Lite" },
  { id: "risks", title: "Risks" },
  { id: "future-roadmap", title: "Future roadmap" },
  { id: "recommendation", title: "Conclusion" },
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
            A web summary of <code>MANDATE.pdf</code>, my longer-term protocol design. It covers ideas <em>beyond</em>{" "}
            the current prototype. For what runs today, see the{" "}
            <Link href="/product-overview">Product Overview</Link> and <Link href="/docs">Documentation</Link>.
          </p>

          <Heading id="about-this-page" className="mt-10">About this page</Heading>
          <Callout type="warning" title="Design ideas, not implemented">
            What follows is protocol <em>design work</em>, not finished software. A concept that the prototype
            implements is marked <FeatureStatus value="MVP" />. A concept that is only a design is marked{" "}
            <FeatureStatus value="Research" /> or <FeatureStatus value="Future work" />. This page shortens and
            reorganizes the PDF instead of copying it. The PDF is the authoritative version, shown below and available
            for download.
          </Callout>
          <div className="not-prose mt-6">
            <PdfViewer src="/MANDATE.pdf" title="MANDATE.pdf — Protocol design document, v0.1 draft, July 2026" />
          </div>

          <Heading id="protocol-vision" className="mt-12">Protocol vision</Heading>
          <p>
            <strong>Thesis:</strong> existing work covers private execution, encrypted mempools, agent wallets with
            plaintext policy engines, and intent/solver networks. As far as I know, nothing connects them. The
            idea is a layer where an autonomous agent trades a hidden strategy over a hidden portfolio and produces
            public, short, composable proofs that every action followed a pre-committed risk mandate. Over time those
            proofs would add up to a portable, privacy-preserving reputation, so that strangers could delegate capital
            to agents they cannot inspect.
          </p>
          <p>
            The document says clearly that MANDATE is <strong>not a new L1</strong>. It is proposed as cryptographic
            middleware plus an app-specific settlement layer anchored to Ethereum: contracts, circuits and a thin
            operator network. It would not be a new chain that has to find validators and liquidity from zero.{" "}
            <FeatureStatus value="Research" /> The prototype implements a small part of this on a local Anvil chain,
            marked <FeatureStatus value="MVP" /> throughout.
          </p>
          <p>The design names four gaps that I think are not solved elsewhere:</p>
          <ol>
            <li>
              <strong>The delegation-trust gap.</strong> No system I know of lets a stranger verify an agent&apos;s track
              record (limits respected, drawdown bounded) without trusting the operator, the model or the cloud it runs
              on.
            </li>
            <li>
              <strong>Policies that depend on portfolio state.</strong> To enforce stateful limits such as drawdown or
              leverage, the enforcement layer must know the portfolio. But publishing the portfolio removes the
              agent&apos;s privacy.
            </li>
            <li>
              <strong>Portable reputation.</strong> Agent reputation today is a token price, a follower count or a score
              inside one platform. Nothing compresses verified behavior into a portable, privacy-preserving
              credential.
            </li>
            <li>
              <strong>Interoperable trust, not only messages.</strong> ERC-7683 standardized intent <em>messages</em>.
              Nothing standardizes a proof-carrying answer to &ldquo;is this agent allowed to sign this, and is it in
              good standing?&rdquo;
            </li>
          </ol>

          <Heading id="design-principles" className="mt-12">Design principles</Heading>
          <ComparisonTable
            columns={["Principle", "Summary"]}
            rows={[
              ["P1 — Prove actions, not algorithms", "Prove that the action satisfied constraints P over anchored state S, never that a model is trustworthy. Constraint circuits are small. Model circuits are very large."],
              ["P2 — Integrity from cryptography, confidentiality from layered defense", "Fund safety and mandate enforcement rely only on zk proofs and on-chain state. A full TEE break may leak privacy, but must never break integrity."],
              ["P3 — The proven-against state must not be self-reported", "The settlement contract maintains portfolio state from settled fills. The agent cannot make it up."],
              ["P4 — Don't race; batch", "Frequent batch auctions with uniform clearing prices make the order inside a batch irrelevant. This removes latency competition and front-running."],
              ["P5 — Middleware, not a new chain", "Liquidity, security and users are on Ethereum and its rollups. A new L1 would start all three from zero."],
              ["P6 — Consume commodity components", "Encrypted mempools, intent standards (7683), account abstraction, data availability and proof systems already exist. New work goes only into the mandate and reputation layer."],
              ["P7 — Pseudonymous accountability", "One persistent agent identity, unlinkable actions, provable aggregate history, immediate revocation by the principal, and optional selective disclosure with viewing keys."],
              ["P8 — Graceful degradation and exits", "Every trust assumption has an explicit failure mode and a downgrade the user can see, never a silent one."],
            ]}
          />

          <Heading id="competitive-landscape" className="mt-12">Competitive landscape</Heading>
          <p>
            The document surveys general-purpose base layers (Bitcoin, Ethereum, Solana, Avalanche, Cosmos, Polkadot,
            Near, Aptos/Sui), modular infrastructure (Celestia, EigenLayer, shared sequencers), privacy systems (Zcash,
            Monero, Aztec, Aleo, Secret Network, Starknet, Penumbra), and the closest related areas: MEV, intents and
            agent infrastructure. These are the main comparisons:
          </p>
          <ComparisonTable
            columns={["System", "Their frame", "MANDATE's difference"]}
            rows={[
              ["Aztec", "General-purpose private smart contracts", "Complementary. Aztec is a general platform. MANDATE is a market and trust structure. Aztec has no native batch auctions, anchored-state policy proofs or folding reputation."],
              ["Penumbra", "Threshold-encrypted DEX (batch swaps)", "The closest prior work on private batch-auction trading. It runs on its own chain, so liquidity is isolated, and it has no agent, mandate or reputation layer."],
              ["CoW / UniswapX / ERC-7683", "Best execution for visible intents", "MANDATE is roughly 7683 plus a trust layer. It adds who may sign (mandates) and how they have behaved (credentials) to a stack that only standardized what is signed."],
              ["Cobo-style agentic wallets", "Plaintext policy enforcement, operator-trusted", "Same goal (safe agent autonomy), different trust. Their guarantees are visible only to the customer and depend on the operator. MANDATE's guarantees depend on cryptography."],
              ["ZKML (verifiable inference)", "Prove a specific model produced a specific output", "It proves something else, at a high cost. MANDATE proves the action, not the model."],
            ]}
          />

          <Heading id="cryptographic-architecture" className="mt-12">Cryptographic architecture</Heading>
          <p>
            The design uses a larger cryptographic stack than the prototype implements:
          </p>
          <ComparisonTable
            columns={["Function", "Proposed primitive", "MVP status"]}
            rows={[
              ["Compliance & state-transition proofs", "Plonkish SNARK (UltraHonk) over BN254, circuits in Noir", "Compliance proofs: implemented. State-transition proofs: not implemented (operator-trusted)."],
              ["Commitments", "Poseidon2 hash over BN254", "Implemented. Policy, order, whitelist and portfolio-leaf commitments all use Poseidon2."],
              ["Reputation accumulation", "Folding-scheme IVC (Nova/HyperNova), terminal Honk wrap", "Not implemented. Replaced by plain on-chain counters (epochs, orders, volume, violations)."],
              ["Order-flow encryption", "Threshold IBE (Shutter-style), t-of-n keyper committee", "Not implemented. Replaced by commit–reveal through a single sequencer."],
              ["Committee attestations", "BLS threshold signatures", "Not implemented. There is no committee yet."],
              ["Agent authority", "ERC-4337 validation + session keys", "Partly. A scoped session key signs order submissions. The prototype's custom account does not need full ERC-4337 EntryPoint integration."],
            ]}
          />
          <p>The design has three nested privacy rings:</p>
          <ul>
            <li><strong>Ring 1 — transit privacy:</strong> intents encrypted under threshold IBE until the epoch&apos;s intent set is fixed. <FeatureStatus value="Research" /> (MVP: commit–reveal via a trusted sequencer, <FeatureStatus value="MVP" />).</li>
            <li><strong>Ring 2 — state privacy:</strong> portfolio state as Poseidon commitments in a tree, updated by verified fill-delta proofs. <FeatureStatus value="MVP" /> (implemented, without the fill-delta proof step).</li>
            <li><strong>Ring 3 — behavioral privacy:</strong> uniform-price batches mean an individual fill can&apos;t be attributed to an individual agent from the public transcript. <FeatureStatus value="MVP" /> for the demo&apos;s single market.</li>
          </ul>

          <Heading id="agentic-trading-flow" className="mt-12">Agentic trading flow (end-to-end vision)</Heading>
          <p>
            The document describes a ten-step flow: the principal sets up and defines the mandate, the agent
            registers, authorization is shown continuously with session signatures, the strategy runs off-chain, the
            agent proves compliance, submits an encrypted order, the batch clears, there is an optional ERC-7683
            cross-chain step, and state is updated. After months of epochs, the agent holds a folded reputation
            credential. A vault on another chain could check it with one proof, <em>without the agent revealing any
            trade</em>.
          </p>
          <p>
            The prototype covers the middle of this flow: registration, compliance proving, submission and settlement
            in a single local market. It has no cross-chain execution and no folded reputation.
          </p>

          <Heading id="mvp-lite" className="mt-12">MANDATE Lite: the buildable prototype</Heading>
          <p>
            The document defines a smaller, four-week build called &ldquo;MANDATE Lite&rdquo;. It says which parts
            should be real and which should be simulated:
          </p>
          <ComparisonTable
            columns={["Component", "Treatment in the document", "What the prototype does"]}
            rows={[
              ["Policy zk proof", "Real. This is the part that must work for real.", "Real Noir/UltraHonk proof, verified on-chain by a bb-generated verifier"],
              ["Threshold encryption", "Simulated via commit–reveal by a single sequencer", "Same. Commit–reveal through the sequencer."],
              ["Folding reputation", "Simulated via on-chain counters", "Same. Counters for epochs, orders, volume and violations."],
              ["State-transition proof", "Plain contract execution over commitments", "Same. The sequencer posts roots, and they are not proven."],
              ["Cross-chain (7683)", "Omitted / roadmap", "Same. Omitted."],
            ]}
          />
          <p>
            The prototype follows the document&apos;s scoping closely. The &ldquo;real vs. simulated&rdquo; table in the
            repository README uses almost the same wording as this section of the protocol design.
          </p>

          <Heading id="risks" className="mt-12">Risks</Heading>
          <p>The document lists what could go wrong. It marks three risks as possibly fatal:</p>
          <ol>
            <li>
              <strong>Cold-start liquidity.</strong> Batch auctions need order flow to price well, and agents need good
              prices to bring flow. The document says this is the hardest problem, harder than the cryptography.
            </li>
            <li>
              <strong>Reputation may not matter as much as assumed.</strong> Allocators might keep relying on brand and
              audited track records instead of zero-knowledge credentials. This is a hypothesis about the market, not
              something proven.
            </li>
            <li>
              <strong>Privacy erodes statistically and the loss is permanent.</strong> Clearing prices, volumes and
              participation timing leak a little information every epoch. Against a patient observer, strategy privacy
              becomes only strategy obscurity.
            </li>
          </ol>
          <p>
            It also notes regulatory risk. The system works like dark-pool infrastructure for autonomous traders, so the
            document recommends building selective-disclosure tools from the start instead of promoting anonymity.
          </p>

          <Heading id="future-roadmap" className="mt-12">Future roadmap</Heading>
          <p>The document&apos;s phased plan for a 12–24 month build. It is separate from the roadmap on the Product Overview page:</p>
          <ComparisonTable
            columns={["Phase", "Focus"]}
            rows={[
              ["Phase 1 (months 1–6)", "Cryptographic core: formally specified circuits, folding-based reputation, a real threshold-IBE lane, a published protocol paper"],
              ["Phase 2 (months 6–12)", "Decentralize the operator: restaked keyper and watchtower AVS sets, proved off-chain auction execution, epochs under 2 seconds"],
              ["Phase 3 (months 12–24)", "Market depth and interoperability: a production ERC-7683 adapter, multi-market cross-margining, a reputation credential standard, selective-disclosure tools"],
            ]}
          />
          <Callout type="note" title="Two roadmaps">
            This roadmap is for building the full protocol from scratch over 12–24 months. The shorter roadmap
            (Phases 1–5) on the <Link href="/product-overview">Product Overview</Link> page is different. It extends
            the <em>current</em> local prototype toward a public testnet.
          </Callout>

          <Heading id="recommendation" className="mt-12">Conclusion</Heading>
          <p>
            The document concludes with this plan. Build MANDATE as cryptographic middleware and an app-specific
            settlement layer on Ethereum rollups, not as a new chain and not yet as its own rollup. Build MANDATE Lite
            first, as a small demonstration of the main new idea, the policy circuit. Then write the full protocol paper
            and keep the risk section. Then publish the policy circuit and credential format as a draft standard early,
            because in this design the standard is what makes the project hard to replace.
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
