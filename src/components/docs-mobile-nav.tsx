"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DocsSidebar } from "@/components/docs-sidebar";

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-[13px] font-medium text-foreground lg:hidden"
        >
          <PanelLeft className="size-3.5" aria-hidden />
          Docs menu
        </button>
      </DialogTrigger>
      <DialogContent side="left">
        <DialogTitle className="mb-6 text-sm font-semibold text-foreground">Documentation</DialogTitle>
        <DocsSidebar onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
