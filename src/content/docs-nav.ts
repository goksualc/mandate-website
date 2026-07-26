export interface DocsNavLink {
  title: string;
  href: string;
}

export interface DocsNavGroup {
  title: string;
  links: DocsNavLink[];
}

export const docsNav: DocsNavGroup[] = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs#introduction" },
      { title: "Quickstart", href: "/docs/quickstart" },
      { title: "Installation", href: "/docs/quickstart#installation" },
      { title: "Project status", href: "/docs#project-status" },
    ],
  },
  {
    title: "Core Concepts",
    links: [
      { title: "Mandates", href: "/docs#mandates" },
      { title: "Policy commitments", href: "/docs#policy-commitments" },
      { title: "Session keys", href: "/docs#session-keys" },
      { title: "Portfolio state", href: "/docs#portfolio-state" },
      { title: "Compliance proofs", href: "/docs#compliance-proofs" },
      { title: "Order commitments", href: "/docs#order-commitments" },
      { title: "Epochs and batch auctions", href: "/docs#epochs-and-batch-auctions" },
    ],
  },
  {
    title: "SDK",
    links: [
      { title: "Configuration", href: "/docs/sdk#configuration" },
      { title: "Agent registration", href: "/docs/sdk#agent-registration" },
      { title: "Policy setup", href: "/docs/sdk#policy-setup" },
      { title: "Reading portfolio state", href: "/docs/sdk#reading-portfolio-state" },
      { title: "Submitting an order", href: "/docs/sdk#submitting-an-order" },
      { title: "Handling proof failures", href: "/docs/sdk#handling-proof-failures" },
      { title: "Types and errors", href: "/docs/sdk#types-and-errors" },
    ],
  },
  {
    title: "MCP",
    links: [
      { title: "Overview", href: "/docs/mcp#overview" },
      { title: "Installation", href: "/docs/mcp#installation" },
      { title: "Client configuration", href: "/docs/mcp#client-configuration" },
      { title: "Available tools", href: "/docs/mcp#available-tools" },
      { title: "Tool schemas", href: "/docs/mcp#tool-schemas" },
      { title: "Example interaction", href: "/docs/mcp#example-interaction" },
      { title: "Security considerations", href: "/docs/mcp#security-considerations" },
    ],
  },
  {
    title: "Architecture",
    links: [
      { title: "System overview", href: "/docs/architecture#system-overview" },
      { title: "SDK", href: "/docs/architecture#sdk" },
      { title: "Noir circuit", href: "/docs/architecture#noir-circuit" },
      { title: "Contracts", href: "/docs/architecture#contracts" },
      { title: "Sequencer", href: "/docs/architecture#sequencer" },
      { title: "Local chain", href: "/docs/architecture#local-chain" },
    ],
  },
  {
    title: "Security",
    links: [
      { title: "Threat model", href: "/docs/security#threat-model" },
      { title: "Defense in depth", href: "/docs/security#defense-in-depth" },
      { title: "Trust assumptions", href: "/docs/security#trust-assumptions" },
      { title: "Escape hatch", href: "/docs/security#escape-hatch" },
      { title: "Secrets management", href: "/docs/security#secrets-management" },
      { title: "Current limitations", href: "/docs/security#current-limitations" },
    ],
  },
  {
    title: "Demo",
    links: [
      { title: "Demo policy", href: "/docs/demo#demo-policy" },
      { title: "Valid order", href: "/docs/demo#valid-order" },
      { title: "Invalid order", href: "/docs/demo#invalid-order" },
      { title: "Verified results", href: "/docs/demo#verified-results" },
      { title: "Running locally", href: "/docs/demo#running-locally" },
    ],
  },
  {
    title: "Research",
    links: [
      { title: "Protocol vision", href: "/research#protocol-vision" },
      { title: "Design principles", href: "/research#design-principles" },
      { title: "Competitive landscape", href: "/research#competitive-landscape" },
      { title: "Future roadmap", href: "/research#future-roadmap" },
    ],
  },
];

export interface DocsPage {
  title: string;
  href: string;
}

/** Linear page order for the prev/next pager. */
export const docsPageOrder: DocsPage[] = [
  { title: "Introduction", href: "/docs" },
  { title: "Quickstart", href: "/docs/quickstart" },
  { title: "SDK", href: "/docs/sdk" },
  { title: "MCP", href: "/docs/mcp" },
  { title: "Architecture", href: "/docs/architecture" },
  { title: "Security", href: "/docs/security" },
  { title: "Demo", href: "/docs/demo" },
  { title: "Research", href: "/research" },
];
