export const siteConfig = {
  name: "MANDATE",
  titleShort: "MANDATE — Verifiable Policy Layer",
  tagline: "Verifiable Policy Controls for Autonomous Financial Agents",
  themeColor: "#a9142b",
  description:
    "MANDATE is a verifiable policy enforcement layer that enables autonomous financial agents to act only within cryptographically committed user-defined rules.",
  url: "https://mandate-protocol.example",
  npmPackageMcp: "@0xgks/mandate-mcp",
  npmPackageSdk: "@0xgks/mandate-sdk",
  npmVersion: "0.1.0",
  npmUrlMcp: "https://www.npmjs.com/package/@0xgks/mandate-mcp",
  npmUrlSdk: "https://www.npmjs.com/package/@0xgks/mandate-sdk",
  /**
   * No public GitHub repository exists yet for this project. GitHub CTAs
   * are intentionally left unlinked (rendered as disabled / "coming soon")
   * rather than pointing at a URL that doesn't exist.
   */
  githubUrl: null as string | null,
  contactEmail: "goksualcinkaya@gmail.com",
  status: "Local MVP · Experimental · Not Audited",
} as const;

export const mainNav = [
  { title: "Product", href: "/#what-is-mandate" },
  { title: "Architecture", href: "/#architecture" },
  { title: "Developers", href: "/docs/sdk" },
  { title: "Research", href: "/research" },
] as const;
