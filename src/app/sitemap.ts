import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/docs",
    "/docs/quickstart",
    "/docs/sdk",
    "/docs/mcp",
    "/docs/architecture",
    "/docs/security",
    "/docs/demo",
    "/research",
    "/product-overview",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
