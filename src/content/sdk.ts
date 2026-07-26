/**
 * Every snippet below is written against the real @0xgks/mandate-sdk source
 * (packages/mandate-sdk/src/*.ts) — MandateClient, MandateClientConfig,
 * PolicyParams, MandateOrder, ProveAndSubmitResult, and the four error
 * classes are all real exports. No method on this page is invented.
 */

export const sdkInstall = {
  npm: "npm install @0xgks/mandate-sdk",
  pnpm: "pnpm add @0xgks/mandate-sdk",
  yarn: "yarn add @0xgks/mandate-sdk",
};

export const sdkImport = `import { MandateClient } from "@0xgks/mandate-sdk";
import type { MandateClientConfig, PolicyParams, MandateOrder } from "@0xgks/mandate-sdk";`;

export const sdkEnvExample = `# .env.example — never commit real values for the lines marked SECRET

MANDATE_RPC_URL=http://127.0.0.1:8545
MANDATE_SEQUENCER_URL=http://127.0.0.1:8787
MANDATE_AUCTION_ADDRESS=0x...
MANDATE_REGISTRY_ADDRESS=0x...
MANDATE_AGENT_ID=0x...
MANDATE_SESSION_KEY=0x...            # SECRET
MANDATE_POLICY_SALT=...              # SECRET
MANDATE_CIRCUIT_PATH=./circuits/policy_check`;

export const sdkConfig = `// Construct the client's config from environment variables.
// agentId is Poseidon2(session pk, salt) — the agent's on-chain identity.
const policy: PolicyParams = {
  whitelistRoot: BigInt(process.env.MANDATE_WHITELIST_ROOT!),
  maxOrderNotional: BigInt(process.env.MANDATE_MAX_ORDER_NOTIONAL!), // e.g. 1_000_000n
  maxPosition: BigInt(process.env.MANDATE_MAX_POSITION!),
  maxDailyLoss: BigInt(process.env.MANDATE_MAX_DAILY_LOSS!),
  policySalt: BigInt(process.env.MANDATE_POLICY_SALT!),
};

const config: MandateClientConfig = {
  agentId: process.env.MANDATE_AGENT_ID as \`0x\${string}\`,
  sequencerUrl: process.env.MANDATE_SEQUENCER_URL ?? "http://127.0.0.1:8787",
  rpcUrl: process.env.MANDATE_RPC_URL ?? "http://127.0.0.1:8545",
  auctionAddress: process.env.MANDATE_AUCTION_ADDRESS as \`0x\${string}\`,
  registryAddress: process.env.MANDATE_REGISTRY_ADDRESS as \`0x\${string}\`,
  sessionPrivateKey: process.env.MANDATE_SESSION_KEY as \`0x\${string}\`,
  policy,
  circuitDir: process.env.MANDATE_CIRCUIT_PATH ?? "./circuits/policy_check",
};

const mandate = new MandateClient(config);`;

export const sdkRegistration = `// Agent registration and policy commitment happen on-chain, ahead of time
// (see demo/register.ts and scripts/setup-local-mandate.ts), not through a
// MandateClient method — MandateClient assumes an already-registered
// agentId whose on-chain policyCommitmentOf(agentId) matches the plaintext
// PolicyParams you configure it with. proveAndSubmit() checks this on
// every call and throws PolicyMismatchError if the two disagree:

import { policyCommitment } from "@0xgks/mandate-sdk";

const localCommitment = policyCommitment(policy);
// must equal MandateRegistry.policyCommitmentOf(agentId) on-chain`;

export const sdkPortfolio = `// MandateClient does not expose a standalone "read portfolio" method —
// proveAndSubmit() fetches and verifies the anchored portfolio witness
// internally, from the sequencer's GET /portfolio/:agentId endpoint, and
// throws PortfolioMismatchError if the reported state root disagrees with
// the auction contract's stateRootOf(agentId). This is what the MCP
// server's mandate_get_portfolio tool reads directly for read-only display
// (see /docs/mcp#available-tools).`;

export const sdkSubmit = `// The order an agent/strategy hands to the SDK — human-friendly,
// string-encoded fields (see MandateOrder in types.ts).
const order: MandateOrder = {
  market: "1",        // circuit market id, as a decimal string
  side: "buy",
  amount: "250",       // whole circuit units, as a decimal string
  limitPrice: "3500",  // whole circuit units, as a decimal string
};

const result = await mandate.proveAndSubmit(order);
// result: { epoch, orderCommitment, proof, publicInputs, txHash }
console.log(\`submitted in epoch \${result.epoch}: \${result.txHash}\`);`;

export const sdkSuccessResult = `{
  epoch: 396n,
  orderCommitment: "0x12a254be...5e74d89",
  proof: "0x...",
  publicInputs: [
    "0x..." /* policy_commitment */,
    "0x..." /* state_root */,
    "0x..." /* order_commitment */,
    "0x..." /* epoch */,
    "0x..." /* breaker */,
  ],
  txHash: "0xdee28569...9a60bc01",
}`;

export const sdkRejection = `import {
  MandateViolationError,
  PolicyMismatchError,
  PortfolioMismatchError,
  EpochClosedError,
} from "@0xgks/mandate-sdk";

try {
  await mandate.proveAndSubmit({
    market: "1",
    side: "buy",
    amount: "10000",     // 10,000 * 3,500 = 35,000,000 notional
    limitPrice: "3500",
  });
} catch (err) {
  if (err instanceof MandateViolationError) {
    // The order cannot be proven: nargo execute failed on a circuit
    // assertion (e.g. "order notional exceeds mandate maximum").
    // Nothing was submitted on-chain. err.reason is the bare circuit
    // assertion text; err.order is the rejected order.
    console.error(err.reason);
  } else if (err instanceof PolicyMismatchError) {
    // Local plaintext policy doesn't open the on-chain registered
    // commitment — refusing to prove with a stale or wrong mandate.
  } else if (err instanceof PortfolioMismatchError) {
    // Sequencer's reported state root disagrees with the on-chain
    // anchored root — refusing to prove against untrusted state.
  } else if (err instanceof EpochClosedError) {
    // The commit window closed while proving; not submitted.
  }
}`;

export interface SdkErrorDoc {
  name: string;
  thrownWhen: string;
}

export const sdkErrors: SdkErrorDoc[] = [
  {
    name: "MandateViolationError",
    thrownWhen:
      "The order fails a Noir circuit assertion (whitelist, notional cap, position cap, daily-loss cap, or circuit breaker). Carries `reason` (the bare circuit assertion string) and `order`. Nothing is submitted on-chain.",
  },
  {
    name: "PolicyMismatchError",
    thrownWhen:
      "The locally-held plaintext PolicyParams does not open the on-chain registered policy commitment for this agentId. Carries `localCommitment` and `registeredCommitment`.",
  },
  {
    name: "PortfolioMismatchError",
    thrownWhen:
      "The sequencer's reported portfolio state root disagrees with the auction contract's on-chain root for this agent. Carries `sequencerRoot` and `onchainRoot`.",
  },
  {
    name: "EpochClosedError",
    thrownWhen:
      "The epoch's commit window closed (or the epoch advanced) while a proof was being generated. Thrown instead of submitting a transaction guaranteed to revert. Carries `epoch`.",
  },
];

export interface SdkTypeDoc {
  name: string;
  kind: "interface" | "class";
  summary: string;
}

export const sdkTypes: SdkTypeDoc[] = [
  { name: "MandateClient", kind: "class", summary: "The SDK's single public entry point. Constructed with a MandateClientConfig; exposes proveAndSubmit(order)." },
  { name: "MandateClientConfig", kind: "interface", summary: "agentId, sequencerUrl, rpcUrl, auctionAddress, registryAddress, sessionPrivateKey, policy, circuitDir, plus optional chain/nargoBin/bbBin/orderSaltBase/publicClient/walletClient/fetch overrides." },
  { name: "MandateOrder", kind: "interface", summary: "The human-friendly order shape: { market: string; side: \"buy\" | \"sell\"; amount: string; limitPrice: string }." },
  { name: "PolicyParams", kind: "interface", summary: "The plaintext opening of the on-chain policy commitment: whitelistRoot, maxOrderNotional, maxPosition, maxDailyLoss, policySalt (all bigint)." },
  { name: "ProveAndSubmitResult", kind: "interface", summary: "{ epoch, orderCommitment, proof, publicInputs, txHash } returned on a successful proveAndSubmit() call." },
];
