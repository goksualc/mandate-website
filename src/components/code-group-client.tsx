"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";

export interface CodeGroupTabData {
  label: string;
  html: string;
  raw: string;
}

export function CodeGroupClient({ tabs }: { tabs: CodeGroupTabData[] }) {
  const defaultValue = tabs[0]?.label ?? "";

  return (
    <Tabs defaultValue={defaultValue} className="overflow-hidden rounded-lg border border-border-strong">
      <div className="flex items-center justify-between border-b border-border-strong bg-background-inset px-2 py-1.5">
        <TabsList className="border-0 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.label} value={tab.label}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label} className="relative m-0">
          <CopyButton value={tab.raw} className="absolute right-2.5 top-2.5 z-10" />
          <div className="overflow-x-auto [&>pre]:m-0" dangerouslySetInnerHTML={{ __html: tab.html }} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
