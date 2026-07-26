// Content sourced from mandate-product-overview.pdf (the working local MVP)
// and cross-checked against the repository (README.md, circuits/policy_check,
// packages/mandate-sdk, packages/mandate-mcp). Where the two differ, the
// repository wins and the difference is called out on the relevant page.

export interface RiskRow {
  risk: string;
  example: string;
  withoutMandate: string;
}

export const risks: RiskRow[] = [
  { risk: "Prompt injection", example: "Malicious input instructs agent to place an oversized order", withoutMandate: "Instruction may override original policy" },
  { risk: "Strategy bug", example: "Agent miscalculates position and submits an oversized trade", withoutMandate: "No circuit-level constraint" },
  { risk: "Unauthorized market", example: "Agent selects an asset not on the approved list", withoutMandate: "No enforceable whitelist" },
  { risk: "Policy manipulation", example: "Local execution limits differ from registered policy", withoutMandate: "No on-chain commitment to verify against" },
  { risk: "Compromised runtime", example: "Agent output is tampered with before submission", withoutMandate: "No cryptographic receipt of compliance" },
  { risk: "State inconsistency", example: "Off-chain portfolio data is stale or falsified", withoutMandate: "No state-root verification" },
];

export const mandateIs: string[] = [
  "Policy enforcement infrastructure",
  "An agent authorization layer",
  "A proof generation and verification path",
  "An integration layer for execution systems",
  "Verifiable delegated authority",
  "A protection layer for autonomous agents",
];

export const mandateIsNot: string[] = [
  "An AI model or trading strategy",
  "A general-purpose wallet",
  "A replacement for MoonPay",
  "A centralized risk API",
  "A simple transaction simulator",
  "A standard multi-signature scheme",
];

export interface ArchComponent {
  id: string;
  name: string;
  role: string;
  detail: string;
}

export const architectureComponents: ArchComponent[] = [
  {
    id: "moonpay-agent",
    name: "MoonPay Agent",
    role: "User-facing AI agent that proposes actions via natural language or structured intent",
    detail:
      "The integration demonstration vehicle for the MVP. MANDATE is not specific to MoonPay — any MCP-compatible agent can connect through the same three-tool surface.",
  },
  {
    id: "mcp-server",
    name: "MCP server",
    role: "Exposes exactly three safe tools to the agent — the only interface between agent and MANDATE",
    detail:
      "@0xgks/mandate-mcp is a thin stdio wrapper around @0xgks/mandate-sdk. It reimplements no proving, commitment, or submission logic — mandate_submit_order calls MandateClient.proveAndSubmit() directly.",
  },
  {
    id: "mandate-sdk",
    name: "Mandate SDK",
    role: "Coordinates portfolio reads, policy checks, proof generation, signing, and order submission",
    detail:
      "@0xgks/mandate-sdk's MandateClient.proveAndSubmit(): reads the current epoch and on-chain state root, verifies the local policy opens the registered commitment, fetches the sequencer's portfolio witness and verifies it against the on-chain root, generates the Noir proof, and submits the proof-gated commitment.",
  },
  {
    id: "noir-circuit",
    name: "Noir circuit",
    role: "UltraHonk compliance circuit (~277 ACIR opcodes, ~1s/proof); proves policy satisfaction without revealing private strategy",
    detail:
      "circuits/policy_check checks, in order: policy commitment opening, order/epoch binding, whitelist Merkle membership, portfolio-in-state-root membership, notional cap, post-fill position cap, daily-loss cap, and circuit-breaker risk-reduction-only mode. 13 Noir tests, one per constraint (positive and negative vectors).",
  },
  {
    id: "registry-contract",
    name: "Registry contract",
    role: "Stores agent registration, session key authorization, and policy commitment on-chain",
    detail: "MandateRegistry (Solidity, Foundry-tested). The proof's policy_commitment public input is assembled by the contract from registry state, never taken from calldata.",
  },
  {
    id: "auction-contract",
    name: "Auction contract",
    role: "Accepts committed orders only when accompanied by a valid proof for the current epoch",
    detail:
      "BatchAuction runs a commit–reveal epoch loop and computes the uniform clearing price on-chain (maximum executed volume, midpoint tie-break). An invalid proof can never place an order in the batch.",
  },
  {
    id: "mandate-account",
    name: "MandateAccount contract",
    role: "Holds funds; provides an owner-only escape hatch independent of agent, sequencer, or auction",
    detail:
      "The session key has zero authority over funds — no MandateAccount function is callable by it. The escape hatch works even with dead infrastructure (see test_account_escapeHatchWorksWithDeadInfrastructure).",
  },
  {
    id: "sequencer",
    name: "Sequencer",
    role: "Runs the commit–reveal epoch loop; maintains portfolio state; trusted for liveness and state updates",
    detail:
      "A minimal HTTP service: envelope intake (verifies the Poseidon2 opening), reveal, clearing trigger, state-root settlement, and a mock price oracle. Trusted for liveness and privacy — not for mandate enforcement or replacing proofs.",
  },
  {
    id: "local-chain",
    name: "Local chain",
    role: "Anvil-based local Ethereum environment running the MVP contracts",
    detail: "A local, single-operator development chain. No public testnet or mainnet deployment exists yet (see the roadmap).",
  },
];

export interface SecurityLayer {
  order: number;
  title: string;
  description: string;
}

export const securityLayers: SecurityLayer[] = [
  { order: 1, title: "Schema validation", description: "Malformed inputs are rejected before any processing (Zod-validated MCP tool inputs)." },
  { order: 2, title: "Session-key authorization", description: "The agent must hold a registered key scoped to a specific mandate. The session key has zero authority over funds — no MandateAccount function is callable by it." },
  { order: 3, title: "Policy-commitment verification", description: "MandateClient checks the local plaintext policy opens the on-chain registered commitment before ever proving — refusing to prove with a stale or wrong mandate." },
  { order: 4, title: "Portfolio-state-root verification", description: "Confirms the sequencer-reported portfolio matches the on-chain committed state root. The agent cannot fabricate a healthier portfolio. The sequencer/operator is trusted to post correct state roots after clearing — state-transition proofs are deferred." },
  { order: 5, title: "Zero-knowledge compliance proof", description: "The Noir/UltraHonk circuit cryptographically proves all policy constraints are satisfied simultaneously — whitelist, notional, position, daily loss, and breaker mode." },
  { order: 6, title: "On-chain contract verification", description: "The bb-generated HonkVerifier re-verifies the proof on-chain. The five public inputs (policy commitment, state root, order commitment, epoch, breaker bit) are assembled by the contract from registry state, not taken from calldata." },
  { order: 7, title: "Batch-auction epoch commitment", description: "An order is committed only within the valid commit window of the current epoch; the order commitment binds the epoch, so a proof cannot be replayed against a different one." },
  { order: 8, title: "Owner escape hatch", description: "MandateAccount provides an owner-only withdrawal that depends on nothing — not the agent, sequencer, proof, or auction being alive." },
];

export const securityReminders: string[] = [
  "This system is experimental and has not undergone an external security audit.",
  "It runs entirely on local infrastructure (a local Anvil chain) — there is no public testnet or mainnet deployment.",
  "All keys and values are test-only. This is not production custody infrastructure.",
  "Session keys and policy salts are secrets and must never be committed to version control.",
  "Do not give the same agent unrestricted wallet, swap, transfer, or trading tools alongside mandate_submit_order — proof-gating only works if it is the only execution path.",
];

export interface ComparisonRow {
  approach: string;
  strength: string;
  limitation: string;
}

export const comparisonRows: ComparisonRow[] = [
  { approach: "Prompt instructions", strength: "Easy to implement, low overhead", limitation: "Model may ignore, misunderstand, or be manipulated" },
  { approach: "Human approval", strength: "Strong oversight, high trust", limitation: "Slows or prevents autonomous operation" },
  { approach: "Backend rules", strength: "Practical, flexible, widely used", limitation: "User must trust the operator; not independently verifiable" },
  { approach: "Wallet spending limits", strength: "Useful financial boundary", limitation: "Cannot express strategy-level or multi-variable rules" },
  { approach: "Multisig", strength: "Strong ownership model", limitation: "Not designed for high-frequency autonomous execution" },
  { approach: "MANDATE", strength: "Verifiable, programmable, proof-based", limitation: "Current MVP is local and experimental" },
];

export interface RoadmapPhase {
  phase: string;
  status: "Done" | "Near-term" | "Planned";
  deliverables: string;
}

export const roadmap: RoadmapPhase[] = [
  { phase: "Phase 1 — Completed MVP", status: "Done", deliverables: "Noir/UltraHonk circuit (13 tests), contracts (24 tests), SDK, sequencer, agent strategies, demo script, npm package, MoonPay Agent integration" },
  { phase: "Phase 2 — Surface layer", status: "Near-term", deliverables: "Next.js principal dashboard, docker-compose wrapper, local:start polish, improved agent onboarding" },
  { phase: "Phase 3 — Public testnet", status: "Planned", deliverables: "Testnet contracts, hosted sequencer, persistent agent registration, public explorer" },
  { phase: "Phase 4 — Security & integrations", status: "Planned", deliverables: "Contract + circuit audit, wallet integrations, production monitoring" },
  { phase: "Phase 5 — Production network", status: "Planned", deliverables: "Real settlement rails, decentralized keypers, proved state transitions, Nova reputation, cross-chain (ERC-7683)" },
];

export interface MvpVsProduction {
  area: string;
  currentMvp: string;
  productionDirection: string;
}

export const mvpVsProduction: MvpVsProduction[] = [
  { area: "Network", currentMvp: "Local Anvil chain", productionDirection: "Public L2 or application-specific deployment" },
  { area: "Sequencer", currentMvp: "Single trusted service (state-transition proofs deferred; operator trusted for state updates)", productionDirection: "Decentralized operator set; proved state transitions; watchtowers" },
  { area: "Market", currentMvp: "Single demo market", productionDirection: "Multiple real markets" },
  { area: "Funds", currentMvp: "Test-only keys and values", productionDirection: "Audited custody and settlement integration" },
  { area: "Proofs", currentMvp: "Real Noir / UltraHonk compliance proofs (~1 s/proof)", productionDirection: "Optimized, audited, production-benchmarked" },
  { area: "Order privacy", currentMvp: "Commit-reveal through single sequencer (ring-1 privacy)", productionDirection: "Threshold-encrypted intents via decentralized keyper set" },
  { area: "Reputation", currentMvp: "On-chain counters (epochs, orders, volume, violations)", productionDirection: "Nova-style recursive credential (constant-size, portable)" },
  { area: "Auction", currentMvp: "Local batch auction with real on-chain clearing", productionDirection: "Production liquidity, clearing, and settlement" },
  { area: "Monitoring", currentMvp: "Local logs", productionDirection: "Watchtowers, alerting, and operational dashboards" },
  { area: "Integration", currentMvp: "MoonPay Agent via MCP", productionDirection: "Multiple agent platforms, wallets, payment systems" },
];

export const provenConfirmed: string[] = [
  "MoonPay Agent can discover and connect to the MANDATE MCP server",
  "Read-only tools return accurate current state",
  "Portfolio state root matches the on-chain committed value",
  "A compliant order generates a valid Noir compliance proof",
  "A compliant order is successfully committed to the on-chain batch auction",
  "An on-chain transaction is produced with a verifiable transaction hash",
  "A non-compliant order fails proof generation",
  "The non-compliant order is not submitted — no on-chain transaction created",
  "The MCP server remains fully available after rejecting a non-compliant order",
  "Execution is isolated behind a single, controlled tool",
];

export const provenNotYet: string[] = [
  "Mainnet safety or real-money security",
  "Real-fund custody adequacy",
  "Production-scale decentralization",
  "External security audit results",
  "Production-scale proof generation performance",
  "Multi-market or cross-chain liquidity",
  "Cross-chain settlement",
  "State-transition validity (sequencer posts state roots after clearing; operator trust for state updates not yet eliminated)",
];

export interface UseCase {
  useCase: string;
  example: string;
}

export const useCases: UseCase[] = [
  { useCase: "Autonomous trading agent", example: "May trade only whitelisted markets; max position 500,000; max daily loss 50,000" },
  { useCase: "Treasury management agent", example: "May rebalance approved assets within a 2% daily risk budget; no withdrawals to new addresses" },
  { useCase: "Payment agent", example: "May pay approved vendors up to a daily cumulative limit of 25,000" },
  { useCase: "DAO treasury agent", example: "May execute approved treasury actions below the governance authorization threshold" },
  { useCase: "Institutional execution agent", example: "Must follow venue restrictions, exposure limits, and drawdown rules at circuit level" },
  { useCase: "Portfolio rebalancing agent", example: "May adjust allocations within predefined bands; no single trade may exceed 5% of portfolio NAV" },
  { useCase: "Cross-chain intent execution", example: "May bridge approved assets between approved networks within configured size limits" },
  { useCase: "Business spending agent", example: "May approve invoices from registered suppliers below a per-transaction ceiling" },
];

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossary: GlossaryTerm[] = [
  { term: "AI agent", definition: "A software system that perceives inputs, reasons about them, and takes actions autonomously. Here, one that can call financial tools and APIs." },
  { term: "Mandate", definition: "The user-defined set of rules that governs what an agent is permitted to do. Analogous to a delegation agreement with explicit boundaries." },
  { term: "Policy", definition: "The specific rules within a mandate: approved markets, size limits, position caps, loss limits, authorized session keys, and so on." },
  { term: "Policy commitment", definition: "A cryptographic fingerprint (Poseidon2 hash) of the policy, stored on-chain at registration time. Ensures the policy used during proof generation matches what the user originally registered." },
  { term: "Session key", definition: "A limited cryptographic key that allows an agent to sign order instructions. Scoped to a specific registered mandate; has zero authority over user funds." },
  { term: "Zero-knowledge proof", definition: "A cryptographic method that allows one party to prove a statement is true without revealing the underlying private information." },
  { term: "Circuit", definition: "The code-level specification of what must be proven. The Noir circuit encodes the policy constraints an order must satisfy to generate a valid proof." },
  { term: "Registry", definition: "The on-chain contract (MandateRegistry) that records agent registrations, session key authorizations, and policy commitments." },
  { term: "Batch auction", definition: "The on-chain execution venue (BatchAuction) where compliant orders are committed during an epoch's commit phase and later processed during the clearing lifecycle." },
  { term: "Epoch", definition: "A time-bounded auction window. Orders can only be committed during the commit phase of an epoch." },
  { term: "Sequencer", definition: "The off-chain service that maintains current portfolio state and provides data required for policy evaluation." },
  { term: "State root", definition: "A cryptographic summary of the entire portfolio state at a point in time, committed on-chain." },
  { term: "MCP (Model Context Protocol)", definition: "An open standard for connecting AI agents to external tools and services in a structured, discoverable way." },
  { term: "Circuit breaker", definition: "A system-level safety switch that, when active, allows only strictly risk-reducing orders to be provable." },
  { term: "Whitelist", definition: "The approved list of markets an agent is permitted to trade. An order for an unapproved market cannot satisfy the circuit." },
  { term: "Notional value", definition: "The total monetary value represented by an order, calculated as quantity multiplied by limit price." },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  { question: "Is MANDATE an AI model?", answer: "No. MANDATE is a policy enforcement layer that runs alongside an AI agent. It does not generate text, make trading decisions, or replace the agent's reasoning capabilities." },
  { question: "Does MANDATE hold user funds?", answer: "In the current MVP, MANDATE operates with test-only keys and a local environment. It does not hold, custody, or transfer real funds." },
  { question: "Can the agent change its own policy?", answer: "No. The policy is registered on-chain as a cryptographic commitment before the agent begins operating, and MandateClient refuses to prove against a policy that doesn't open the registered commitment." },
  { question: "Why use zero-knowledge proofs?", answer: "ZK proofs let the system verify that an action complies with a policy without requiring the complete policy — or the agent's strategy — to be made public, and they produce a verifiable receipt any party can independently check." },
  { question: "Why not rely only on human approval?", answer: "Human approval provides strong oversight but requires a person to be available for every action. MANDATE allows autonomous operation within a pre-approved policy boundary, reserving human decision-making for policy definition." },
  { question: "What happens when an order violates the policy?", answer: "The Noir circuit cannot produce a valid proof (nargo execute fails on the violated assertion). Without a valid proof, the order cannot be submitted. The rejection is cryptographic, not a warning or a blocked API call." },
  { question: "Is the current system running on mainnet?", answer: "No. The current MVP runs on a local Anvil development chain. All keys, assets, and transactions are for testing purposes only." },
  { question: "Can MANDATE support payments as well as trading?", answer: "Yes, in principle. The policy model can express payment constraints — approved recipients, daily limits, per-transaction ceilings. The current MVP uses a trading context; payments are a natural extension." },
  { question: "Why is MCP used?", answer: "MCP is an open standard for AI agent tool connectivity. Any compatible agent can connect without custom integration work, and it means the tool surface area is explicitly and narrowly defined." },
  { question: "Is MoonPay required?", answer: "No. The MoonPay Agent is the integration demonstration vehicle. MANDATE is designed to work with any MCP-compatible agent." },
  { question: "What information remains private?", answer: "The full policy parameters are not published on-chain — only a Poseidon2 commitment is stored. The proof demonstrates compliance without revealing policy values in full." },
  { question: "What happens if the sequencer provides incorrect state?", answer: "The state-root verification step fails if the sequencer's reported root doesn't match the on-chain committed root (PortfolioMismatchError). A compromised or stale sequencer cannot enable policy violations — it can only cause liveness failures." },
  { question: "Can a user revoke an agent?", answer: "The architecture supports session-key revocation through the Registry contract, preventing further order submission." },
  { question: "Is the system audited?", answer: "No. The current MVP has not undergone an external security audit. Contracts, circuits, and the SDK are considered experimental. An audit is planned in Phase 4 of the roadmap." },
  { question: "What is the next milestone?", answer: "Public testnet deployment — moving to a publicly accessible chain with a hosted sequencer, persistent agent registration, and simplified onboarding." },
];

/** The single demo policy used throughout the MVP (product-overview PDF §7, cross-checked against circuits/policy_check test fixtures). */
export const demoPolicy = {
  approvedMarket: "Configured whitelist market (whitelist index 0)",
  maxOrderNotional: 1_000_000,
  maxPosition: "Configured position limit",
  maxDailyLoss: "Configured daily loss limit",
  authorization: "Registered session key",
  policyIdentity: "On-chain commitment hash (Poseidon2)",
  executionWindow: "Active commit phase of the current epoch",
  emergencyControl: "Circuit breaker (active / inactive)",
};

export const demoOrders = {
  valid: { side: "buy", quantity: 250, limitPrice: 3_500, notional: 875_000, maxNotional: 1_000_000, proofGenerated: true, result: "Submitted", epoch: 396 },
  invalid: { side: "buy", quantity: 10_000, limitPrice: 3_500, notional: 35_000_000, maxNotional: 1_000_000, proofGenerated: false, result: "Rejected — proof generation failed" },
};

export const demoEvidence = {
  agentId: "0x2c4fd536018985d83870a4ed4a18dc1a4ded2c3343f7c3da46af50a92846b420",
  orderCommitment: "0x12a254be...5e74d89",
  txHash: "0xdee28569...9a60bc01",
  epoch: 396,
};

export const localCommands = {
  start: "npm run local:start",
  status: "npm run local:status",
  stop: "npm run local:stop",
  reset: "npm run local:reset -- --yes",
};

export const testCommands = [
  { label: "Noir circuit (13/13)", command: "cd circuits/policy_check && nargo test" },
  { label: "Contracts (24/24)", command: "cd contracts && forge test" },
  { label: "SDK / agents TS ↔ Noir parity", command: "cd agents && npm run selftest" },
  { label: "Sparse Merkle tree tests", command: "cd agents && npx tsx src/merkle.test.ts" },
  { label: "Real proof + bb verify + violation throws", command: "cd agents && npx tsx src/prover.test.ts" },
];
