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
      description="@0xgks/mandate-sdk is a TypeScript library for building and submitting orders that follow a MANDATE policy. It handles Poseidon2 commitments, sparse Merkle portfolio membership, Noir/Barretenberg proving, and submission to the sequencer and contracts. The snippets on this page are written against the package source."
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
        You create a <code>MandateClient</code> with one <code>MandateClientConfig</code> object. The fields below come
        from <code>packages/mandate-sdk/src/types.ts</code>.
      </p>
      <CodeBlock code={sdkEnvExample} lang="bash" filename=".env.example" />
      <CodeBlock code={sdkConfig} lang="typescript" filename="mandate-client.ts" className="mt-4" />
      <p className="text-xs">
        Optional settings not shown above: <code>chain</code> (defaults to the local Anvil/foundry chain),{" "}
        <code>nargoBin</code> and <code>bbBin</code> (default to <code>$NARGO_BIN</code> and <code>$BB_BIN</code>, or
        to the binaries on <code>PATH</code>), <code>orderSaltBase</code>, and three hooks meant for tests:{" "}
        <code>publicClient</code>, <code>walletClient</code> and <code>fetch</code>.
      </p>

      <Heading id="agent-registration">Agent registration</Heading>
      <p>
        <code>MandateClient</code> does not register agents. Registration is a one-time on-chain setup step (see{" "}
        <code>demo/register.ts</code> and <code>scripts/setup-local-mandate.ts</code> in the repository) and is
        separate from the per-order proving path. What the SDK does check on every call is that your local plaintext
        policy still opens the commitment registered on-chain:
      </p>
      <CodeBlock code={sdkRegistration} lang="typescript" />

      <Heading id="policy-setup">Policy setup</Heading>
      <p>
        A <code>PolicyParams</code> object is the plaintext that opens the on-chain policy commitment. All fields are{" "}
        <code>bigint</code> and must match <code>circuits/policy_check/src/main.nr</code> exactly:
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
        <code>MandateClient</code> has one method for this: <code>proveAndSubmit(order: MandateOrder)</code>. It reads
        the current epoch and the on-chain state root, and checks the local policy against the registered commitment.
        It then fetches the sequencer&apos;s portfolio witness and verifies it, and generates the Noir proof. Only if
        every step succeeds does it submit the proof-gated commitment on-chain.
      </p>
      <CodeBlock code={sdkSubmit} lang="typescript" />
      <p>On success it returns a <code>ProveAndSubmitResult</code>:</p>
      <CodeBlock code={sdkSuccessResult} lang="typescript" hideCopy />

      <Heading id="handling-proof-failures">Handling proof failures</Heading>
      <p>
        An order that breaks the mandate throws an error before anything reaches the chain. <code>nargo execute</code>{" "}
        fails on the violated circuit assertion, and <code>proveAndSubmit</code> reports it as a typed error:
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
        The SDK has no <code>previewOrder()</code> or simulation method. The only way to check compliance is to call{" "}
        <code>proveAndSubmit()</code>. A rejection has no on-chain side effects, because no transaction is sent for a
        non-compliant order. The proving attempt still runs locally.
      </Callout>
    </DocsPageShell>
  );
}
