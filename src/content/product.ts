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
  { risk: "Prompt injection", example: "Malicious input tells the agent to place an oversized order", withoutMandate: "The instruction may override the original policy" },
  { risk: "Strategy bug", example: "The agent miscalculates its position and submits an oversized trade", withoutMandate: "No constraint in a circuit" },
  { risk: "Unauthorized market", example: "The agent picks an asset that is not on the approved list", withoutMandate: "No whitelist that can be enforced" },
  { risk: "Policy manipulation", example: "Local limits differ from the registered policy", withoutMandate: "No on-chain commitment to check against" },
  { risk: "Compromised runtime", example: "The agent's output is changed before submission", withoutMandate: "No cryptographic proof of compliance" },
  { risk: "State inconsistency", example: "Off-chain portfolio data is stale or false", withoutMandate: "No state-root check" },
];

export const mandateIs: string[] = [
  "Infrastructure for enforcing policies",
  "An authorization layer for agents",
  "A path for generating and verifying proofs",
  "A layer that connects to execution systems",
  "Delegated authority that can be verified",
  "A set of limits for autonomous agents",
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
    role: "User-facing AI agent that proposes actions in natural language or as structured intents",
    detail:
      "The agent I used to test the integration. MANDATE does not depend on MoonPay. Any MCP-compatible agent can connect through the same three tools.",
  },
  {
    id: "mcp-server",
    name: "MCP server",
    role: "Exposes exactly three tools to the agent. It is the only interface between the agent and MANDATE",
    detail:
      "@0xgks/mandate-mcp is a thin stdio wrapper around @0xgks/mandate-sdk. It has no proving, commitment or submission logic of its own. mandate_submit_order calls MandateClient.proveAndSubmit() directly.",
  },
  {
    id: "mandate-sdk",
    name: "Mandate SDK",
    role: "Does portfolio reads, policy checks, proof generation, signing and order submission",
    detail:
      "MandateClient.proveAndSubmit() in @0xgks/mandate-sdk reads the current epoch and the on-chain state root. It checks that the local policy opens the registered commitment, fetches the sequencer's portfolio witness and checks it against the on-chain root, generates the Noir proof, and submits the proof-gated commitment.",
  },
  {
    id: "noir-circuit",
    name: "Noir circuit",
    role: "UltraHonk compliance circuit (about 277 ACIR opcodes, about 1 second per proof). Proves that the policy is satisfied without revealing the private strategy",
    detail:
      "circuits/policy_check checks, in order: the policy commitment opening, the order and epoch binding, whitelist Merkle membership, portfolio membership in the state root, the notional cap, the post-fill position cap, the daily-loss cap, and the circuit-breaker rule that allows only risk-reducing orders. There are 13 Noir tests, one per constraint, with passing and failing cases.",
  },
  {
    id: "registry-contract",
    name: "Registry contract",
    role: "Stores agent registration, session key authorization and the policy commitment on-chain",
    detail: "MandateRegistry (Solidity, tested with Foundry). The contract builds the proof's policy_commitment public input from registry state. It never takes it from calldata.",
  },
  {
    id: "auction-contract",
    name: "Auction contract",
    role: "Accepts committed orders only with a valid proof for the current epoch",
    detail:
      "BatchAuction runs a commit–reveal epoch loop and computes the uniform clearing price on-chain (maximum executed volume, midpoint tie-break). An order with an invalid proof cannot enter the batch.",
  },
  {
    id: "mandate-account",
    name: "MandateAccount contract",
    role: "Holds funds and has an owner-only escape hatch that does not depend on the agent, sequencer or auction",
    detail:
      "The session key has no authority over funds. It cannot call any MandateAccount function. The escape hatch works even when the rest of the infrastructure is down (see test_account_escapeHatchWorksWithDeadInfrastructure).",
  },
  {
    id: "sequencer",
    name: "Sequencer",
    role: "Runs the commit–reveal epoch loop and keeps portfolio state. Trusted for liveness and state updates",
    detail:
      "A small HTTP service: it takes in order envelopes (checking the Poseidon2 opening), reveals them, triggers clearing, settles state roots, and runs a mock price oracle. It is trusted for liveness and privacy, but not for enforcing the mandate, and it does not replace proofs.",
  },
  {
    id: "local-chain",
    name: "Local chain",
    role: "Local Ethereum environment based on Anvil, running the prototype contracts",
    detail: "A local development chain with a single operator. There is no public testnet or mainnet deployment yet (see the roadmap).",
  },
];

export interface SecurityLayer {
  order: number;
  title: string;
  description: string;
}

export const securityLayers: SecurityLayer[] = [
  { order: 1, title: "Schema validation", description: "Malformed inputs are rejected before any processing (MCP tool inputs are validated with Zod)." },
  { order: 2, title: "Session-key authorization", description: "The agent must hold a registered key tied to one mandate. The session key has no authority over funds. It cannot call any MandateAccount function." },
  { order: 3, title: "Policy-commitment verification", description: "Before proving, MandateClient checks that the local plaintext policy opens the commitment registered on-chain. It refuses to prove with a stale or wrong mandate." },
  { order: 4, title: "Portfolio-state-root verification", description: "Checks that the portfolio the sequencer reports matches the state root committed on-chain. The agent cannot claim a healthier portfolio. The sequencer is trusted to post correct state roots after clearing, because state-transition proofs are not implemented." },
  { order: 5, title: "Zero-knowledge compliance proof", description: "The Noir/UltraHonk circuit proves that all policy constraints hold at once: whitelist, notional, position, daily loss and breaker mode." },
  { order: 6, title: "On-chain contract verification", description: "The bb-generated HonkVerifier checks the proof again on-chain. The contract builds the five public inputs (policy commitment, state root, order commitment, epoch, breaker bit) from registry state instead of taking them from calldata." },
  { order: 7, title: "Batch-auction epoch commitment", description: "An order can be committed only in the commit window of the current epoch. The order commitment includes the epoch, so a proof cannot be replayed in a different one." },
  { order: 8, title: "Owner escape hatch", description: "MandateAccount has an owner-only withdrawal. It does not depend on the agent, sequencer, proof or auction being alive." },
];

export const securityReminders: string[] = [
  "This system is experimental and has not had an external security audit.",
  "It runs only on local infrastructure (a local Anvil chain). There is no public testnet or mainnet deployment.",
  "All keys and values are for testing. This is not production custody infrastructure.",
  "Session keys and policy salts are secrets and must never be committed to version control.",
  "Do not give the same agent unrestricted wallet, swap, transfer or trading tools next to mandate_submit_order. Proof-gating only works if it is the agent's only way to act.",
];

export interface ComparisonRow {
  approach: string;
  strength: string;
  limitation: string;
}

export const comparisonRows: ComparisonRow[] = [
  { approach: "Prompt instructions", strength: "Easy to implement, little overhead", limitation: "The model may ignore, misread or be manipulated" },
  { approach: "Human approval", strength: "Good oversight, high trust", limitation: "Slows down or prevents autonomous operation" },
  { approach: "Backend rules", strength: "Practical, flexible and widely used", limitation: "The user must trust the operator, and it cannot be verified independently" },
  { approach: "Wallet spending limits", strength: "Useful financial boundary", limitation: "Cannot express strategy-level rules or rules with several variables" },
  { approach: "Multisig", strength: "Clear ownership model", limitation: "Not designed for frequent autonomous execution" },
  { approach: "MANDATE", strength: "Verifiable, programmable, based on proofs", limitation: "Current prototype is local and experimental" },
];

export interface RoadmapPhase {
  phase: string;
  status: "Done" | "Near-term" | "Planned";
  deliverables: string;
}

export const roadmap: RoadmapPhase[] = [
  { phase: "Phase 1: Prototype (done)", status: "Done", deliverables: "Noir/UltraHonk circuit (13 tests), contracts (24 tests), SDK, sequencer, agent strategies, demo script, npm package, MoonPay Agent integration" },
  { phase: "Phase 2: Web interface", status: "Near-term", deliverables: "Next.js dashboard for the principal, a docker-compose wrapper, a better local:start, easier agent onboarding" },
  { phase: "Phase 3: Public testnet", status: "Planned", deliverables: "Testnet contracts, a hosted sequencer, persistent agent registration, a public explorer" },
  { phase: "Phase 4: Security and integrations", status: "Planned", deliverables: "Audit of the contracts and circuit, wallet integrations, production monitoring" },
  { phase: "Phase 5: Production network", status: "Planned", deliverables: "Real settlement rails, decentralized keypers, proved state transitions, Nova reputation, cross-chain support (ERC-7683)" },
];

export interface MvpVsProduction {
  area: string;
  currentMvp: string;
  productionDirection: string;
}

export const mvpVsProduction: MvpVsProduction[] = [
  { area: "Network", currentMvp: "Local Anvil chain", productionDirection: "Public L2 or application-specific deployment" },
  { area: "Sequencer", currentMvp: "One trusted service (no state-transition proofs; the operator is trusted for state updates)", productionDirection: "Decentralized operator set; proved state transitions; watchtowers" },
  { area: "Market", currentMvp: "Single demo market", productionDirection: "Multiple real markets" },
  { area: "Funds", currentMvp: "Test keys and values only", productionDirection: "Audited custody and settlement" },
  { area: "Proofs", currentMvp: "Real Noir / UltraHonk compliance proofs (~1 s/proof)", productionDirection: "Optimized, audited and benchmarked for production" },
  { area: "Order privacy", currentMvp: "Commit-reveal through single sequencer (ring-1 privacy)", productionDirection: "Threshold-encrypted intents via decentralized keyper set" },
  { area: "Reputation", currentMvp: "On-chain counters (epochs, orders, volume, violations)", productionDirection: "Nova-style recursive credential (constant-size, portable)" },
  { area: "Auction", currentMvp: "Local batch auction with on-chain clearing", productionDirection: "Real liquidity, clearing and settlement" },
  { area: "Monitoring", currentMvp: "Local logs", productionDirection: "Watchtowers, alerts and monitoring dashboards" },
  { area: "Integration", currentMvp: "MoonPay Agent via MCP", productionDirection: "More agent platforms, wallets and payment systems" },
];

export const provenConfirmed: string[] = [
  "The MoonPay Agent can find and connect to the MANDATE MCP server",
  "The read-only tools return the correct current state",
  "Portfolio state root matches the on-chain committed value",
  "A compliant order produces a valid Noir compliance proof",
  "A compliant order is committed to the on-chain batch auction",
  "The on-chain transaction has a transaction hash that can be checked",
  "A non-compliant order fails proof generation",
  "The non-compliant order is not submitted and no on-chain transaction is created",
  "The MCP server keeps working after it rejects a non-compliant order",
  "Execution is only possible through one controlled tool",
];

export const provenNotYet: string[] = [
  "Safety on mainnet or with real money",
  "Whether custody of real funds is adequate",
  "Decentralization at production scale",
  "Results of an external security audit",
  "Proof generation performance at production scale",
  "Liquidity across several markets or chains",
  "Cross-chain settlement",
  "Validity of state transitions (the sequencer posts state roots after clearing, so the operator is still trusted for state updates)",
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
  { term: "AI agent", definition: "A software system that takes in inputs, reasons about them and acts on its own. Here, one that can call financial tools and APIs." },
  { term: "Mandate", definition: "The set of rules, defined by the user, that says what an agent may do. It is like a delegation agreement with clear limits." },
  { term: "Policy", definition: "The specific rules in a mandate: approved markets, size limits, position caps, loss limits, authorized session keys and so on." },
  { term: "Policy commitment", definition: "A hash (Poseidon2) of the policy, stored on-chain at registration. It makes sure the policy used to generate a proof is the one the user registered." },
  { term: "Session key", definition: "A limited key that lets an agent sign order instructions. It is tied to one registered mandate and has no authority over user funds." },
  { term: "Zero-knowledge proof", definition: "A cryptographic method that lets one party prove a statement is true without revealing the private information behind it." },
  { term: "Circuit", definition: "The code that specifies what must be proven. The Noir circuit encodes the policy constraints an order must satisfy to get a valid proof." },
  { term: "Registry", definition: "The on-chain contract (MandateRegistry) that records agent registrations, session key authorizations and policy commitments." },
  { term: "Batch auction", definition: "The on-chain execution venue (BatchAuction). Compliant orders are committed during the commit phase of an epoch and are processed later, when the batch clears." },
  { term: "Epoch", definition: "A fixed-length auction window. Orders can be committed only during the commit phase of an epoch." },
  { term: "Sequencer", definition: "The off-chain service that keeps the current portfolio state and provides the data needed to check a policy." },
  { term: "State root", definition: "A short cryptographic summary of the whole portfolio state at one point in time, committed on-chain." },
  { term: "MCP (Model Context Protocol)", definition: "An open standard for connecting AI agents to external tools and services." },
  { term: "Circuit breaker", definition: "A safety switch. When it is active, only orders that strictly reduce risk can be proved." },
  { term: "Whitelist", definition: "The list of markets the agent may trade. An order for any other market cannot satisfy the circuit." },
  { term: "Notional value", definition: "The total value of an order: quantity multiplied by limit price." },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  { question: "Is MANDATE an AI model?", answer: "No. MANDATE is a policy enforcement layer that runs next to an AI agent. It does not generate text, make trading decisions or replace the agent's reasoning." },
  { question: "Does MANDATE hold user funds?", answer: "Not in the current prototype. It uses test keys and a local environment, and it does not hold, custody or transfer real funds." },
  { question: "Can the agent change its own policy?", answer: "No. The policy is registered on-chain as a commitment before the agent starts, and MandateClient refuses to prove against a policy that does not open the registered commitment." },
  { question: "Why use zero-knowledge proofs?", answer: "A zero-knowledge proof lets the system check that an action follows a policy without making the whole policy or the agent's strategy public. It also gives a receipt that anyone can check." },
  { question: "Why not rely only on human approval?", answer: "Human approval gives good oversight, but a person has to be available for every action. MANDATE lets the agent run on its own inside a policy that a human approved once, so people only decide the policy." },
  { question: "What happens when an order violates the policy?", answer: "The Noir circuit cannot produce a valid proof (nargo execute fails on the violated assertion). Without a valid proof, the order cannot be submitted. This is a cryptographic failure, not a warning or a blocked API call." },
  { question: "Is the current system running on mainnet?", answer: "No. The prototype runs on a local Anvil development chain. All keys, assets and transactions are for testing." },
  { question: "Can MANDATE support payments as well as trading?", answer: "In principle, yes. The policy model can express payment rules such as approved recipients, daily limits and per-transaction limits. The prototype only covers trading, so I have not tested payments." },
  { question: "Why is MCP used?", answer: "MCP is an open standard for connecting AI agents to tools. Any compatible agent can connect without custom work, and the tool list is short and explicit." },
  { question: "Is MoonPay required?", answer: "No. I used the MoonPay Agent to test the integration. The server is meant to work with any MCP-compatible agent." },
  { question: "What information remains private?", answer: "The policy values are not published on-chain. Only a Poseidon2 commitment is stored. The proof shows compliance without revealing the full policy." },
  { question: "What happens if the sequencer provides incorrect state?", answer: "The state-root check fails if the root the sequencer reports does not match the committed on-chain root (PortfolioMismatchError). A compromised or stale sequencer should not be able to cause a policy violation. It can only hurt liveness." },
  { question: "Can a user revoke an agent?", answer: "The design supports revoking a session key through the Registry contract, which stops further order submission." },
  { question: "Is the system audited?", answer: "No. The prototype has had no external security audit. The contracts, circuit and SDK are experimental. An audit is planned for Phase 4 of the roadmap." },
  { question: "What is the next milestone?", answer: "A public testnet deployment, with a hosted sequencer, persistent agent registration and simpler onboarding." },
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
