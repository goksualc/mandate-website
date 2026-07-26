import Link from "next/link";
import { ArrowRight, BookOpen, GitFork, ShieldCheck } from "lucide-react";
import { Section } from "@/components/section";
import { StatusBadge } from "@/components/status-badge";
import { HeroArchitecture } from "@/components/hero-architecture";
import { HeroLogo } from "@/components/hero-logo";
import { ExecutionFlow } from "@/components/execution-flow";
import { OrderDemo } from "@/components/order-demo";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { SecurityLayers } from "@/components/security-layers";
import { ComparisonTable } from "@/components/comparison-table";
import { DocumentCard } from "@/components/document-card";
import { FeatureStatus } from "@/components/feature-status";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { CodeGroup } from "@/components/code-group";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import { risks, mandateIs, mandateIsNot, architectureComponents, securityReminders, comparisonRows } from "@/content/product";
import { sdkInstall, sdkImport, sdkConfig, sdkSubmit, sdkRejection } from "@/content/sdk";
import { mcpTools } from "@/content/mcp";
import { siteConfig } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <Section className="pt-14 sm:pt-20" containerClassName="max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-strong">
              Verifiable Policy Controls for Autonomous Financial Agents
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Give agents authority.
              <br />
              Not unlimited authority.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              MANDATE sits between an AI agent and financial execution. Every action must prove that it complies
              with the user&apos;s predefined policy before it can reach the execution layer.
            </p>
            <div className="mt-6">
              <StatusBadge />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/docs/sdk">
                  Explore the SDK
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/product-overview">Read the Product Overview</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href={siteConfig.githubUrl ?? siteConfig.npmUrlMcp} target="_blank" rel="noopener noreferrer">
                  <GitFork className="size-4" aria-hidden />
                  {siteConfig.githubUrl ? "View on GitHub" : "View npm package"}
                </a>
              </Button>
            </div>
          </div>
          <Reveal>
            <HeroLogo />
          </Reveal>
        </div>
      </Section>

      {/* THE PROBLEM */}
      <Section
        id="the-problem"
        eyebrow="The problem"
        title="Agents need authority, but not unlimited authority"
        description="AI agents are increasingly able to place trades, initiate payments, manage portfolio positions, and interact with protocols directly. Prompt instructions, backend permissions, and human approvals alone are not enough — enforcement happens at a layer the agent can influence, that a third party cannot independently verify, or that requires trusting a centralized operator."
      >
        <Reveal>
          <div className="overflow-x-auto rounded-xl border border-border-strong">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border-strong bg-background-inset">
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">Risk</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">Example</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">Without MANDATE</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r, i) => (
                  <tr key={r.risk} className={i % 2 === 1 ? "bg-background-inset/40" : undefined}>
                    <td className="px-4 py-3 font-medium text-foreground">{r.risk}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.example}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.withoutMandate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Callout type="tip" title="Key insight" className="mt-6">
            There is a difference between asking an agent not to exceed a limit and making it mathematically
            impossible for the agent to submit an action that does.
          </Callout>
        </Reveal>
      </Section>

      {/* WHAT MANDATE IS */}
      <Section
        id="what-is-mandate"
        eyebrow="Definition"
        title="What MANDATE is"
        description="A verifiable policy layer placed between an AI agent and a financial execution rail. It takes a user-defined mandate, registers a cryptographic fingerprint of it on-chain, and requires every execution action to carry a zero-knowledge proof that it satisfies those rules."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal className="rounded-xl border border-success/30 bg-success-soft/40 p-6">
            <p className="text-sm font-semibold text-success">MANDATE is</p>
            <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
              {mandateIs.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-success">+</span> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="rounded-xl border border-danger/30 bg-danger-soft/40 p-6">
            <p className="text-sm font-semibold text-danger">MANDATE is not</p>
            <ul className="mt-3 space-y-2 text-[13px] text-muted-foreground">
              {mandateIsNot.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-danger">−</span> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <Callout type="note" title="Core principle" className="mt-6">
            <strong className="text-foreground">Prove the action, not the model.</strong> MANDATE does not prove
            that an AI is trustworthy. It proves that a specific proposed action satisfies a committed policy
            against an anchored portfolio state.
          </Callout>
        </Reveal>
      </Section>

      {/* INTERACTIVE EXECUTION FLOW */}
      <Section
        id="execution-flow"
        eyebrow="How it works"
        title="Five steps, one enforcement point"
        description="MANDATE allows the agent to act autonomously, but only inside a policy the agent cannot rewrite."
      >
        <Reveal className="mx-auto mb-10 max-w-md">
          <HeroArchitecture />
        </Reveal>
        <Reveal>
          <ExecutionFlow />
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <OrderDemo />
        </Reveal>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Formula: order notional = quantity × limit price.
        </p>
      </Section>

      {/* ARCHITECTURE */}
      <Section
        id="architecture"
        eyebrow="Architecture"
        title="From agent call to on-chain proof"
        description="The agent interacts only with the MCP server. Proof generation and on-chain commitment happen entirely inside the SDK and contract layer."
      >
        <Reveal>
          <ArchitectureDiagram />
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <Accordion type="single" collapsible className="space-y-3">
            {architectureComponents.map((c) => (
              <AccordionItem key={c.id} value={c.id}>
                <AccordionTrigger>
                  <span className="flex flex-col items-start text-left">
                    <span>{c.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{c.role}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>{c.detail}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Section>

      {/* SECURITY */}
      <Section
        id="security"
        eyebrow="Security model"
        title="Defense in depth"
        description="Eight independent layers. Failure at any single layer is sufficient to prevent an order from being submitted."
      >
        <Reveal>
          <SecurityLayers />
        </Reveal>
        <Reveal delay={0.1} className="mt-6">
          <Callout type="danger" title="Trust assumptions and current limitations">
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {securityReminders.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Callout>
        </Reveal>
      </Section>

      {/* SDK */}
      <Section
        id="sdk"
        eyebrow="Developers"
        title="Prove and submit an order in a few lines"
        description="@0xgks/mandate-sdk — the same MandateClient the MCP server and the demo scripts use internally. Full reference at /docs/sdk."
      >
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">1. Install</p>
            <CodeGroup
              items={[
                { label: "npm", code: sdkInstall.npm },
                { label: "pnpm", code: sdkInstall.pnpm },
                { label: "yarn", code: sdkInstall.yarn },
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">2. Import and configure</p>
            <CodeBlock code={sdkImport} lang="typescript" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">3. Construct the client</p>
            <CodeBlock code={sdkConfig} lang="typescript" filename="mandate-client.ts" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">4. Prove and submit an order</p>
            <CodeBlock code={sdkSubmit} lang="typescript" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">5. Handle a policy rejection</p>
            <CodeBlock code={sdkRejection} lang="typescript" />
          </div>
          <div className="text-center">
            <Link href="/docs/sdk" className="focus-ring inline-flex items-center gap-1 text-sm font-medium text-accent-strong hover:underline">
              Full SDK reference <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      {/* MCP */}
      <Section
        id="mcp"
        eyebrow="MCP integration"
        title="A deliberately narrow tool surface"
        description="The MANDATE MCP server exposes exactly three tools. Limiting the tool surface area is itself a security property — an agent cannot do something the server doesn't expose, regardless of what it's instructed to attempt."
      >
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {mcpTools.map((tool) => (
            <div key={tool.name} className="rounded-xl border border-border-strong bg-background-elevated p-5">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent-strong" aria-hidden />
                <FeatureStatus value={tool.type === "Read-only" ? "Implemented" : "MVP"} />
              </div>
              <p className="font-mono text-[13px] font-semibold text-foreground">{tool.name}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tool.title}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-4xl text-center">
          <Link href="/docs/mcp" className="focus-ring inline-flex items-center gap-1 text-sm font-medium text-accent-strong hover:underline">
            Full MCP reference, config, and tool schemas <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </Section>

      {/* COMPARISON */}
      <Section
        id="comparison"
        eyebrow="Comparison"
        title="Where MANDATE sits"
        description="MANDATE is not intended to replace human approval or wallet-level security. It complements them — the core difference is independent verifiability."
      >
        <ComparisonTable
          columns={["Approach", "Strength", "Limitation"]}
          rows={comparisonRows.map((r) => [r.approach, r.strength, r.limitation])}
          highlightRow={comparisonRows.length - 1}
        />
      </Section>

      {/* RESEARCH VISION */}
      <Section
        id="research-vision"
        eyebrow="Research"
        title="The larger protocol vision"
        description="MANDATE.pdf describes a long-term protocol: hidden strategies and portfolios, public compliance proofs, pre-committed risk mandates, proof-carrying agent history, and privacy-preserving reputation. None of this is implemented yet — the current MVP demonstrates only the core proof-gated enforcement loop."
      >
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-accent/30 bg-accent-soft p-6">
            <FeatureStatus value="MVP" />
            <p className="mt-3 text-sm font-semibold text-foreground">Current working MVP</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Real Noir/UltraHonk proofs, on-chain policy commitments, a local batch auction, and a working MCP
              integration with the MoonPay Agent.
            </p>
          </div>
          <div className="rounded-xl border border-secondary/30 bg-secondary-soft p-6">
            <FeatureStatus value="Research" />
            <p className="mt-3 text-sm font-semibold text-foreground">Long-term protocol design</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Threshold-encrypted order flow, decentralized keyper committees, Nova-style folded reputation
              credentials, proved state transitions, and cross-chain settlement via ERC-7683.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="/research" className="focus-ring inline-flex items-center gap-1 text-sm font-medium text-accent-strong hover:underline">
            Read the full protocol design <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </Section>

      {/* DOCUMENTS */}
      <Section
        id="documents"
        eyebrow="Documentation"
        title="Two documents, two purposes"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <DocumentCard
            title="Protocol Design Document"
            file="MANDATE.pdf"
            description="A research-oriented protocol design covering private agent execution, verifiable mandates, cryptographic primitives, market structure, settlement, and privacy-preserving reputation."
            readHref="/research"
            pdfHref="/MANDATE.pdf"
          />
          <DocumentCard
            title="Product Overview"
            file="mandate-product-overview.pdf"
            description="A practical walkthrough of the working local MVP, SDK, MCP integration, architecture, security model, demo policy, and verified test results."
            readHref="/product-overview"
            pdfHref="/mandate-product-overview.pdf"
          />
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border-strong bg-background-elevated px-6 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Build agents that can act — without giving them unlimited authority.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/docs/sdk">
                Start with the SDK
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/product-overview">
                <BookOpen className="size-4" aria-hidden />
                Read the Product Overview
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/research">Explore the Protocol Design</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href={siteConfig.npmUrlMcp} target="_blank" rel="noopener noreferrer">
                <GitFork className="size-4" aria-hidden />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
