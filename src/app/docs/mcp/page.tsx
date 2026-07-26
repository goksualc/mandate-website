import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { CodeGroup } from "@/components/code-group";
import { ComparisonTable } from "@/components/comparison-table";
import { FeatureStatus } from "@/components/feature-status";
import { mcpTools, mcpEnvVars } from "@/content/mcp";

export const metadata: Metadata = {
  title: "MCP",
  description: "How to install, configure, and use the MANDATE MCP server — its three tools, environment variables, and security rationale.",
};

const toc = [
  { id: "overview", title: "Overview" },
  { id: "installation", title: "Installation" },
  { id: "client-configuration", title: "Client configuration" },
  { id: "available-tools", title: "Available tools" },
  { id: "tool-schemas", title: "Tool schemas" },
  { id: "example-interaction", title: "Example interaction" },
  { id: "security-considerations", title: "Security considerations" },
];

const configExample = `{
  "mcpServers": {
    "mandate": {
      "command": "npx",
      "args": ["-y", "@0xgks/mandate-mcp@0.1.0"],
      "env": {
        "MANDATE_RPC_URL": "<RPC_ENDPOINT>",
        "MANDATE_SEQUENCER_URL": "<SEQUENCER_ENDPOINT>",
        "MANDATE_AUCTION_ADDRESS": "<AUCTION_CONTRACT_ADDRESS>",
        "MANDATE_REGISTRY_ADDRESS": "<REGISTRY_CONTRACT_ADDRESS>",
        "MANDATE_AGENT_ID": "<REGISTERED_AGENT_ID>",
        "MANDATE_SESSION_KEY": "<SESSION_PRIVATE_KEY — SECRET, NEVER COMMIT>",
        "MANDATE_CIRCUIT_PATH": "<PATH_TO_circuits/policy_check>",
        "MANDATE_WHITELIST_ROOT": "<WHITELIST_MERKLE_ROOT>",
        "MANDATE_MAX_ORDER_NOTIONAL": "1000000",
        "MANDATE_MAX_POSITION": "<MAX_POSITION>",
        "MANDATE_MAX_DAILY_LOSS": "<MAX_DAILY_LOSS>",
        "MANDATE_POLICY_SALT": "<POLICY_SALT — SECRET, NEVER COMMIT>"
      }
    }
  }
}`;

export default function McpDocsPage() {
  return (
    <DocsPageShell
      title="MCP"
      description="@0xgks/mandate-mcp is a thin stdio wrapper around @0xgks/mandate-sdk, published for MoonPay Agent, Claude Desktop, Codex, and other MCP-compatible clients."
      toc={toc}
      pagerHref="/docs/mcp"
    >
      <Heading id="overview">Overview</Heading>
      <p>
        MCP (Model Context Protocol) is an open standard that lets AI agents discover and call external tools in
        a structured, interoperable way. By publishing a dedicated MCP server, MANDATE ensures that any
        MCP-compatible agent can connect to the policy enforcement layer without modification to the agent
        itself.
      </p>
      <p>
        The server reimplements no proving, commitment, Merkle, or submission logic of its own — every tool is a
        thin wrapper around the same <code>MandateClient</code> from <code>@0xgks/mandate-sdk</code> documented
        on the <a href="/docs/sdk">SDK page</a>.
      </p>

      <Heading id="installation">Installation</Heading>
      <CodeGroup
        items={[
          { label: "npm", code: "npm install @0xgks/mandate-mcp" },
          { label: "pnpm", code: "pnpm add @0xgks/mandate-mcp" },
          { label: "yarn", code: "yarn add @0xgks/mandate-mcp" },
        ]}
      />
      <p>Or run the published binary directly, without installing:</p>
      <CodeBlock code="npx -y @0xgks/mandate-mcp@0.1.0" lang="bash" />
      <p>
        The repository&apos;s <code>npm run local:start</code> writes a complete, ready-to-paste config to{" "}
        <code>.local/moonpay-agent-mandate.json</code> automatically — see{" "}
        <a href="/docs/quickstart#mcp-local-setup">Quickstart — MCP local setup</a>.
      </p>

      <Heading id="client-configuration">Client configuration</Heading>
      <p>
        A redacted configuration example, adaptable to any MCP client that reads an <code>mcpServers</code>{" "}
        map (this shape matches MoonPay Agent, Claude Desktop, and Codex):
      </p>
      <CodeBlock code={configExample} lang="json" filename="mcp config (redacted)" />
      <Callout type="note" title="This is more environment variables than the product overview shows">
        The product-overview PDF&apos;s redacted example lists seven <code>MANDATE_*</code> variables. The
        actual server (<code>packages/mandate-mcp/src/config.ts</code>) requires five more —{" "}
        <code>MANDATE_CIRCUIT_PATH</code>, <code>MANDATE_WHITELIST_ROOT</code>,{" "}
        <code>MANDATE_MAX_ORDER_NOTIONAL</code>, <code>MANDATE_MAX_POSITION</code>, and{" "}
        <code>MANDATE_MAX_DAILY_LOSS</code> — because <code>PolicyParams</code> is a required field of the
        SDK&apos;s config and the server has no way to recover that plaintext from the chain (only its
        commitment is on-chain). This page follows the repository implementation.
      </Callout>
      <p className="mt-6 text-sm font-medium text-foreground">Environment variables</p>
      <ComparisonTable
        columns={["Variable", "Required", "Description"]}
        rows={mcpEnvVars.map((v) => [v.name, v.required ? "Yes" : "No", v.description])}
      />

      <Heading id="available-tools">Available tools</Heading>
      <p>
        The server exposes <strong>exactly three tools</strong> — this is a deliberate design decision, not an
        incomplete API. There is no <code>mandate_preview_order</code> or dry-run tool: the SDK exposes no such
        method, so none was invented for the server either.
      </p>
      <div className="grid gap-4 not-prose sm:grid-cols-3">
        {mcpTools.map((tool) => (
          <div key={tool.name} className="rounded-lg border border-border-strong bg-background-elevated p-4">
            <FeatureStatus value={tool.type === "Read-only" ? "Implemented" : "MVP"} />
            <p className="mt-2 font-mono text-[13px] font-semibold text-foreground">{tool.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{tool.type}</p>
          </div>
        ))}
      </div>

      <Heading id="tool-schemas">Tool schemas</Heading>
      {mcpTools.map((tool) => (
        <div key={tool.name} className="mb-8">
          <p className="font-mono text-sm font-semibold text-foreground">{tool.name}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">{tool.description}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Input schema</p>
          <CodeBlock code={tool.inputSchema} lang="typescript" />
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Example response</p>
          <CodeBlock code={tool.exampleResponse} lang="json" />
        </div>
      ))}

      <Heading id="example-interaction">Example interaction</Heading>
      <p>An end-to-end walkthrough, exactly as documented in the repository README:</p>
      <ComparisonTable
        columns={["Step", "Prompt / action", "Expected result"]}
        rows={[
          ["1", "“What is the current epoch?” → mandate_get_epoch", "Epoch: 396, Phase: commit, Circuit breaker: false"],
          ["2", "“Show me the portfolio.” → mandate_get_portfolio", "Position: 0, PnL: 0, State root match: true"],
          ["3", "“Buy 250 units at 3,500.” → mandate_submit_order", "Proof generated, order submitted, tx hash returned"],
          ["4", "“Buy 10,000 units at 3,500.” → mandate_submit_order", "“order notional exceeds mandate maximum” — rejected, nothing submitted"],
        ]}
      />

      <Heading id="security-considerations">Security considerations</Heading>
      <p>
        Limiting the tool surface area is itself a security property: an agent cannot do something the MCP
        server does not expose, regardless of what it is instructed to attempt. All chain/sequencer/circuit/key
        material is sourced only from server-side environment variables — never from MCP tool arguments — so a
        client can request an order but can never redirect the server at a different RPC endpoint, sequencer,
        signer, or circuit.
      </p>
      <Callout type="danger" title="Never combine mandate_submit_order with unrestricted execution tools">
        Do not give the same agent unrestricted wallet, swap, transfer, or trading tools alongside{" "}
        <code>mandate_submit_order</code>. Proof-gating only works if it is the only execution path available
        to the agent. Session keys and policy salts are secrets — never commit them to version control, chat
        logs, or shared documents.
      </Callout>
    </DocsPageShell>
  );
}
