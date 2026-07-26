import { highlightCode } from "@/lib/highlight";
import { CodeGroupClient } from "@/components/code-group-client";

export interface CodeGroupItem {
  label: string;
  code: string;
  lang?: string;
}

export async function CodeGroup({ items }: { items: CodeGroupItem[] }) {
  const tabs = await Promise.all(
    items.map(async (item) => {
      const raw = item.code.replace(/\n$/, "");
      const html = await highlightCode(raw, item.lang ?? "bash");
      return { label: item.label, html, raw };
    }),
  );

  return <CodeGroupClient tabs={tabs} />;
}
