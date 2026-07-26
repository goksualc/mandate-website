export interface McpTool {
  name: string;
  type: "Read-only" | "Execution (proof-gated)";
  title: string;
  description: string;
  inputSchema: string;
  exampleResponse: string;
}

/**
 * Sourced directly from packages/mandate-mcp/src/tools.ts
 * (registerTools + orderShape). The MCP server exposes exactly these three
 * tools — no preview/dry-run tool exists; see the note in that file.
 */
export const mcpTools: McpTool[] = [
  {
    name: "mandate_get_epoch",
    type: "Read-only",
    title: "Get MANDATE auction epoch state",
    description:
      "Reads the current MANDATE batch-auction epoch, phase (commit/reveal), and circuit-breaker bit directly from the auction contract. Read-only; does not submit anything.",
    inputSchema: "{}",
    exampleResponse: `{
  "epoch": "396",
  "phase": "commit",
  "breaker": false
}`,
  },
  {
    name: "mandate_get_portfolio",
    type: "Read-only",
    title: "Get MANDATE portfolio",
    description:
      "Reads this agent's current anchored portfolio state: position, daily PnL, and the Merkle root anchored on-chain for this agent, cross-checked against the on-chain state root. Read-only; does not submit anything.",
    inputSchema: "{}",
    exampleResponse: `{
  "agentId": "0x2c4fd536018985d83870a4ed4a18dc1a4ded2c3343f7c3da46af50a92846b420",
  "position": "0",
  "dailyPnl": "0",
  "stateRoot": "0x...",
  "onchainStateRoot": "0x...",
  "stateRootMatches": true,
  "whitelistIndex": 0
}`,
  },
  {
    name: "mandate_submit_order",
    type: "Execution (proof-gated)",
    title: "Submit a MANDATE proof-gated order",
    description:
      "Generates a real zero-knowledge compliance proof (Noir/UltraHonk) for this order and submits the proof-gated commitment through MANDATE. This is the only path that can put an order in the batch auction — there is no separate execution or signing tool. A mandate-violating order cannot be proven: it is rejected here, before it ever reaches the chain, with the circuit's rejection reason. This performs real proving (nargo execute + bb prove) and, on success, a real on-chain transaction — it is not a preview or simulation.",
    inputSchema: `{
  market: string,      // e.g. "ETH/USDC", "ETH", or a numeric circuit market id
  side: "buy" | "sell",
  amount: string,      // positive whole-number string, no sign, no decimals
  limitPrice: string,  // positive whole-number string, no sign, no decimals
}`,
    exampleResponse: `// compliant order
{
  "status": "submitted",
  "submitted": true,
  "orderCommitment": "0x12a254be...5e74d89",
  "epoch": "396",
  "txHash": "0xdee28569...9a60bc01"
}

// non-compliant order
{
  "status": "rejected",
  "submitted": false,
  "reason": "order notional exceeds mandate maximum"
}`,
  },
];

export interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

/**
 * Sourced directly from packages/mandate-mcp/src/config.ts (loadConfig).
 * This is a superset of the env vars shown in the product-overview PDF's
 * redacted config example — the PDF's example omits five variables
 * (MANDATE_CIRCUIT_PATH, MANDATE_WHITELIST_ROOT, MANDATE_MAX_ORDER_NOTIONAL,
 * MANDATE_MAX_POSITION, MANDATE_MAX_DAILY_LOSS) that the real server
 * requires to construct a MandateClient. This page follows the repository
 * implementation.
 */
export const mcpEnvVars: EnvVar[] = [
  { name: "MANDATE_AGENT_ID", required: true, description: "This agent's identity — Poseidon2(session pk, salt), as a 0x bytes32 or decimal integer." },
  { name: "MANDATE_SESSION_KEY", required: true, description: "The session private key used to sign submitOrder transactions. Secret — never commit or log." },
  { name: "MANDATE_AUCTION_ADDRESS", required: true, description: "Deployed BatchAuction contract address." },
  { name: "MANDATE_REGISTRY_ADDRESS", required: true, description: "Deployed MandateRegistry contract address." },
  { name: "MANDATE_CIRCUIT_PATH", required: true, description: "Filesystem path to the policy_check Noir circuit project (containing Nargo.toml), used for proving." },
  { name: "MANDATE_WHITELIST_ROOT", required: true, description: "Plaintext mandate parameter — root of the approved-markets Merkle tree. Part of the policy commitment opening." },
  { name: "MANDATE_MAX_ORDER_NOTIONAL", required: true, description: "Plaintext mandate parameter — maximum notional (quantity × limit price) per order." },
  { name: "MANDATE_MAX_POSITION", required: true, description: "Plaintext mandate parameter — maximum post-fill absolute position." },
  { name: "MANDATE_MAX_DAILY_LOSS", required: true, description: "Plaintext mandate parameter — maximum realized daily loss." },
  { name: "MANDATE_POLICY_SALT", required: true, description: "Plaintext mandate parameter — random salt binding the policy commitment. Secret — never commit or log." },
  { name: "MANDATE_RPC_URL", required: false, description: "JSON-RPC endpoint for the target chain. Defaults to http://127.0.0.1:8545 (local Anvil)." },
  { name: "MANDATE_SEQUENCER_URL", required: false, description: "Sequencer HTTP base URL. Defaults to http://127.0.0.1:8787." },
  { name: "MANDATE_NARGO_PATH", required: false, description: "Override path to the nargo binary. Defaults to $NARGO_BIN or \"nargo\" on PATH." },
  { name: "MANDATE_BB_PATH", required: false, description: "Override path to the bb (Barretenberg) binary. Defaults to $BB_BIN or \"bb\" on PATH." },
  { name: "MANDATE_MARKET_MAP", required: false, description: "Optional JSON object mapping market symbols (e.g. \"ETH/USDC\") to numeric circuit market ids, merged over the built-in defaults." },
];
