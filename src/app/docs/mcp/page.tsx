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
  description: "How to install, configure and use the MANDATE MCP server: its three tools, its environment variables and why the tool list is small.",
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
      description="@0xgks/mandate-mcp is a thin stdio wrapper around @0xgks/mandate-sdk. It works with MoonPay Agent, Claude Desktop, Codex and other MCP clients."
      toc={toc}
      pagerHref="/docs/mcp"
    >
      <Heading id="overview">Overview</Heading>
      <p>
        MCP (Model Context Protocol) is an open standard that lets AI agents find and call external tools. Because
        MANDATE has its own MCP server, any MCP-compatible agent can connect to it without changes to the agent.
      </p>
      <p>
        The server has no proving, commitment, Merkle or submission logic of its own. Every tool is a thin wrapper
        around the same <code>MandateClient</code> from <code>@0xgks/mandate-sdk</code> that the{" "}
        <a href="/docs/sdk">SDK page</a> describes.
      </p>

      <Heading id="installation">Installation</Heading>
      <CodeGroup
        items={[
          { label: "npm", code: "npm install @0xgks/mandate-mcp" },
          { label: "pnpm", code: "pnpm add @0xgks/mandate-mcp" },
          { label: "yarn", code: "yarn add @0xgks/mandate-mcp" },
        ]}
      />
      <p>Or run the published binary without installing it:</p>
      <CodeBlock code="npx -y @0xgks/mandate-mcp@0.1.0" lang="bash" />
      <p>
        In the repository, <code>npm run local:start</code> writes a complete config to{" "}
        <code>.local/moonpay-agent-mandate.json</code> for you. See{" "}
        <a href="/docs/quickstart#mcp-local-setup">Quickstart — MCP local setup</a>.
      </p>

      <Heading id="client-configuration">Client configuration</Heading>
      <p>
        Here is an example configuration with secrets removed. It works with any MCP client that reads an{" "}
        <code>mcpServers</code> map, including MoonPay Agent, Claude Desktop and Codex:
      </p>
      <CodeBlock code={configExample} lang="json" filename="mcp config (redacted)" />
      <Callout type="note" title="This lists more environment variables than the product overview">
        The product overview PDF lists seven <code>MANDATE_*</code> variables in its example. The server itself (
        <code>packages/mandate-mcp/src/config.ts</code>) needs five more: <code>MANDATE_CIRCUIT_PATH</code>,{" "}
        <code>MANDATE_WHITELIST_ROOT</code>, <code>MANDATE_MAX_ORDER_NOTIONAL</code>,{" "}
        <code>MANDATE_MAX_POSITION</code> and <code>MANDATE_MAX_DAILY_LOSS</code>. The SDK config requires{" "}
        <code>PolicyParams</code>, and the server cannot read that plaintext from the chain, which stores only the
        commitment. This page follows the repository code.
      </Callout>
      <p className="mt-6 text-sm font-medium text-foreground">Environment variables</p>
      <ComparisonTable
        columns={["Variable", "Required", "Description"]}
        rows={mcpEnvVars.map((v) => [v.name, v.required ? "Yes" : "No", v.description])}
      />

      <Heading id="available-tools">Available tools</Heading>
      <p>
        The server exposes <strong>exactly three tools</strong>. This is deliberate, not an unfinished API. There is
        no <code>mandate_preview_order</code> or dry-run tool, because the SDK has no such method.
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
      <p>An end-to-end example, as described in the repository README:</p>
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
        A small tool list limits what an agent can do. The agent cannot do anything the server does not expose, no
        matter what it is told to try. The server reads the chain, sequencer, circuit and key settings only from its
        own environment variables, never from tool arguments. A client can ask for an order, but it cannot point the
        server at a different RPC endpoint, sequencer, signer or circuit.
      </p>
      <Callout type="danger" title="Never combine mandate_submit_order with unrestricted execution tools">
        Do not give the same agent unrestricted wallet, swap, transfer or trading tools next to{" "}
        <code>mandate_submit_order</code>. Proof-gating only works if it is the agent&apos;s only way to act. Session
        keys and policy salts are secrets. Do not put them in version control, chat logs or shared documents.
      </Callout>
    </DocsPageShell>
  );
}
