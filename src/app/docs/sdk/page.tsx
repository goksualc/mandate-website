import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs-page-shell";
import { Heading } from "@/components/heading";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { CodeGroup } from "@/components/code-group";
import { ComparisonTable } from "@/components/comparison-table";
import {
  sdkInstall,
  sdkImport,
  sdkEnvExample,
  sdkConfig,
  sdkRegistration,
  sdkPortfolio,
  sdkSubmit,
  sdkSuccessResult,
  sdkRejection,
  sdkErrors,
  sdkTypes,
} from "@/content/sdk";

export const metadata: Metadata = {
  title: "SDK",
  description: "Reference for @0xgks/mandate-sdk: MandateClient configuration, agent registration, policy setup, portfolio reads, order submission, and error handling.",
};

const toc = [
  { id: "configuration", title: "Configuration" },
  { id: "agent-registration", title: "Agent registration" },
  { id: "policy-setup", title: "Policy setup" },
  { id: "reading-portfolio-state", title: "Reading portfolio state" },
  { id: "submitting-an-order", title: "Submitting an order" },
  { id: "handling-proof-failures", title: "Handling proof failures" },
  { id: "types-and-errors", title: "Types and errors" },
];

export default function SdkDocsPage() {
  return (
    <DocsPageShell
      title="SDK"
      description="@0xgks/mandate-sdk is a TypeScript library for generating and submitting MANDATE-compliant agent orders: Poseidon2 commitments, sparse-Merkle portfolio membership, Noir/Barretenberg proving, and sequencer/contract submission. Every snippet on this page is written directly against the package's real source."
      toc={toc}
      pagerHref="/docs/sdk"
    >
      <p>Install:</p>
      <CodeGroup
        items={[
          { label: "npm", code: sdkInstall.npm },
          { label: "pnpm", code: sdkInstall.pnpm },
          { label: "yarn", code: sdkInstall.yarn },
        ]}
      />
      <CodeBlock code={sdkImport} lang="typescript" className="mt-4" />

      <Heading id="configuration">Configuration</Heading>
      <p>
        <code>MandateClient</code> is constructed with a single <code>MandateClientConfig</code> object. Every
        field below comes directly from <code>packages/mandate-sdk/src/types.ts</code>.
      </p>
      <CodeBlock code={sdkEnvExample} lang="bash" filename=".env.example" />
      <CodeBlock code={sdkConfig} lang="typescript" filename="mandate-client.ts" className="mt-4" />
      <p className="text-xs">
        Optional config overrides not shown above: <code>chain</code> (defaults to the local Anvil/foundry
        chain), <code>nargoBin</code> / <code>bbBin</code> (default to <code>$NARGO_BIN</code>/<code>$BB_BIN</code>{" "}
        or the binaries on <code>PATH</code>), <code>orderSaltBase</code>, and test-only injection points
        (<code>publicClient</code>, <code>walletClient</code>, <code>fetch</code>).
      </p>

      <Heading id="agent-registration">Agent registration</Heading>
      <p>
        <code>MandateClient</code> does not register agents itself — registration is an on-chain, one-time setup
        step (see <code>demo/register.ts</code> and <code>scripts/setup-local-mandate.ts</code> in the
        repository), independent of the SDK&apos;s per-order proving path. What the SDK <em>does</em> check, on
        every call, is that your local plaintext policy still opens the on-chain registered commitment:
      </p>
      <CodeBlock code={sdkRegistration} lang="typescript" />

      <Heading id="policy-setup">Policy setup</Heading>
      <p>
        A <code>PolicyParams</code> object is the plaintext opening of the on-chain policy commitment. All
        fields are <code>bigint</code> and must mirror <code>circuits/policy_check/src/main.nr</code> exactly:
      </p>
      <ComparisonTable
        columns={["Field", "Meaning"]}
        rows={[
          ["whitelistRoot", "Merkle root of the approved-markets whitelist"],
          ["maxOrderNotional", "Maximum notional (quantity × limit price) per order"],
          ["maxPosition", "Maximum post-fill absolute position"],
          ["maxDailyLoss", "Maximum realized daily loss"],
          ["policySalt", "Random salt binding the policy commitment"],
        ]}
      />

      <Heading id="reading-portfolio-state">Reading portfolio state</Heading>
      <p>{sdkPortfolio}</p>

      <Heading id="submitting-an-order">Submitting an order</Heading>
      <p>
        The one method on <code>MandateClient</code>: <code>proveAndSubmit(order: MandateOrder)</code>. It reads
        the current epoch and on-chain state root, verifies the local policy against the registered commitment,
        fetches and verifies the sequencer&apos;s portfolio witness, generates the Noir proof, and — only if
        every step succeeds — submits the proof-gated commitment on-chain.
      </p>
      <CodeBlock code={sdkSubmit} lang="typescript" />
      <p>On success, it resolves to a <code>ProveAndSubmitResult</code>:</p>
      <CodeBlock code={sdkSuccessResult} lang="typescript" hideCopy />

      <Heading id="handling-proof-failures">Handling proof failures</Heading>
      <p>
        A mandate-violating order throws before anything touches the chain — <code>nargo execute</code> fails on
        the violated circuit assertion, and <code>proveAndSubmit</code> surfaces it as a typed error:
      </p>
      <CodeBlock code={sdkRejection} lang="typescript" />

      <Heading id="types-and-errors">Types and errors</Heading>
      <ComparisonTable
        columns={["Export", "Kind", "Summary"]}
        rows={sdkTypes.map((t) => [t.name, t.kind, t.summary])}
      />
      <p className="mt-6 text-sm font-medium text-foreground">Error classes</p>
      <ComparisonTable
        columns={["Error", "Thrown when"]}
        rows={sdkErrors.map((e) => [e.name, e.thrownWhen])}
      />
      <Callout type="note" title="No preview or dry-run method" className="mt-6">
        The SDK exposes no <code>previewOrder()</code> or simulation method — the only way to check compliance
        is to actually attempt <code>proveAndSubmit()</code>. A rejection is free of on-chain side effects (no
        transaction is ever sent for a non-compliant order), but proving itself still runs locally.
      </Callout>
    </DocsPageShell>
  );
}
