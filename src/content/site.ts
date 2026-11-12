export const siteConfig = {
  name: "MANDATE",
  titleShort: "MANDATE — Verifiable Authorization for Autonomous Agents",
  tagline: "Verifiable Authorization for Autonomous Agents",
  themeColor: "#fafaf8",
  description:
    "An independent research project on verifiable authorization for autonomous agents, using zero-knowledge proofs and cryptographic policy commitments. Experimental local prototype; not audited.",
  url: "https://www.mandate.help",
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

export const author = {
  name: "Göksu Alçınkaya",
  role: "Independent Researcher",
  areas: "Computer Science · Cryptography · Distributed Systems",
} as const;

export const mainNav = [
  { title: "Research", href: "/#research-approach" },
  { title: "Implementation", href: "/#implementation" },
  { title: "Documentation", href: "/docs" },
] as const;
