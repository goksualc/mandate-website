import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { localCommands, testCommands } from "@/content/product";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Install the prerequisites, run the local MANDATE demo, and connect an MCP-compatible agent.",
};

const toc = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "installation", title: "Installation" },
  { id: "one-command-demo", title: "One-command demo" },
  { id: "mcp-local-setup", title: "MCP local setup" },
  { id: "test-prompts", title: "Test prompts" },
  { id: "running-tests", title: "Running the test suites" },
];

export default function QuickstartPage() {
  return (
    <DocsPageShell
      title="Quickstart"
      description="How to go from a clean checkout to a compliant order accepted on-chain and a non-compliant order rejected by the circuit."
      toc={toc}
      pagerHref="/docs/quickstart"
    >
      <Heading id="prerequisites">Prerequisites</Heading>
      <p>
        Node ≥ 20, <a href="https://noir-lang.org" target="_blank" rel="noopener noreferrer">noirup</a> (nargo
        1.0.0-beta.22), <code>bbup</code> (bb 5.0.0-nightly, auto-matched to nargo), and{" "}
        <a href="https://getfoundry.sh" target="_blank" rel="noopener noreferrer">foundryup</a>. Built and tested
        on macOS arm64.
      </p>

      <Heading id="installation">Installation</Heading>
      <p>Install the published MCP server package with your package manager:</p>
      <CodeBlock code="npm install @0xgks/mandate-mcp" lang="bash" />
      <p>Or run it without installing, with npx:</p>
      <CodeBlock code="npx -y @0xgks/mandate-mcp@0.1.0" lang="bash" />

      <Heading id="one-command-demo">One-command demo</Heading>
      <p>
        From a clone of the repository, one script starts Anvil, deploys the contracts (including the
        bb-generated UltraHonk verifier) and starts the sequencer. It then runs two agents (a momentum agent and a
        market maker) and the misbehave scenario:
      </p>
      <CodeBlock code={`./demo/run.sh\n\n# knobs\nDURATION=120 EPOCH_MS=6000 ./demo/run.sh   # shorter demo, faster epochs`} lang="bash" />
      <p>The script does the following:</p>
      <ol>
        <li>Deploys the contracts, including the UltraHonk verifier, on a local Anvil chain.</li>
        <li>Two agents prove compliance and commit orders in every epoch. Each batch clears at a uniform price.</li>
        <li>
          In the misbehave scenario, the momentum agent tries an order about 10× over the notional limit. The prover
          fails with &ldquo;order notional exceeds mandate maximum&rdquo;, and the script shows{" "}
          <code>committedIn(epoch, commitment) = false</code> on-chain. An order that cannot be proved never reaches
          the chain.
        </li>
        <li>
          The run needs no supervision. You can follow <code>demo/logs/*.log</code>, or query the explorer endpoints at{" "}
          <code>http://127.0.0.1:8787/epochs</code> and <code>/portfolio/&lt;agentId&gt;</code>.
        </li>
      </ol>

      <Heading id="mcp-local-setup">MCP / MoonPay Agent local setup</Heading>
      <p>
        This is the quickest way to get <code>@0xgks/mandate-mcp</code> working. One command starts a persistent
        local Anvil chain, deploys the contracts and starts the sequencer. It also creates a new test-only demo agent
        (session key, policy, whitelist), registers it, and writes an MCP config you can paste into your client.
      </p>
      <CodeBlock
        code={`${localCommands.start}     # idempotent: safe to re-run, never rotates keys/policy\n${localCommands.status}     # read-only health check\n${localCommands.stop}       # gracefully stops anvil + sequencer, keeps all state\n${localCommands.reset}   # DESTROYS local chain state + generated secrets`}
        lang="bash"
      />
      <p>
        <code>local:start</code> writes two git-ignored files with <code>chmod 600</code>:{" "}
        <code>.local/mandate-mcp.env</code> (all the <code>MANDATE_*</code> values) and{" "}
        <code>.local/moonpay-agent-mandate.json</code> (a complete MCP config with the real values filled in). Copy
        that JSON into your MCP client&apos;s config (for example the <code>mcpServers</code> key of{" "}
        <code>claude_desktop_config.json</code>) and restart the client fully. Most clients read this file only at
        startup.
      </p>

      <Heading id="test-prompts">Test prompts</Heading>
      <p>When your MCP client is connected, you can try these prompts:</p>
      <CodeBlock
        code={`Use the mandate_get_epoch tool and tell me the current epoch, phase, and breaker status.`}
        lang="text"
        hideCopy={false}
      />
      <CodeBlock code={`Use the mandate_get_portfolio tool and summarize the current portfolio state for the configured agent.`} lang="text" />
      <CodeBlock
        code={`Use only mandate_submit_order to submit a buy order for 250 units at a price of 3500. Do not use any unrestricted wallet, swap, transfer, or MoonPay execution tool.`}
        lang="text"
      />
      <CodeBlock
        code={`Use only mandate_submit_order to attempt a buy order for 10000 units at a price of 3500. Return the exact policy or proof rejection reason. Do not bypass the MANDATE policy engine.`}
        lang="text"
      />

      <Callout type="danger" title="Security reminder" className="mt-6">
        Do not give the same agent unrestricted wallet, swap, transfer or trading tools next to{" "}
        <code>mandate_submit_order</code>. Proof-gating only works if it is the agent&apos;s only way to act. This
        whole stack is local, unaudited research software. Never use it with real funds, real private keys or a
        public RPC endpoint.
      </Callout>

      <Heading id="running-tests">Running the test suites</Heading>
      <ul>
        {testCommands.map((t) => (
          <li key={t.command}>
            <code>{t.command}</code> — {t.label}
          </li>
        ))}
      </ul>
    </DocsPageShell>
  );
}
