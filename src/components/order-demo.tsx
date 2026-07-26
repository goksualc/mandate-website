"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoOrders } from "@/content/product";

type Mode = "compliant" | "noncompliant";

const steps = ["Agent proposes order", "Check against policy", "Generate ZK compliance proof", "Submit to batch auction"];

export function OrderDemo() {
  const [mode, setMode] = useState<Mode>("compliant");
  const order = mode === "compliant" ? demoOrders.valid : demoOrders.invalid;
  const failsAt = 2; // 0-indexed: "Generate ZK compliance proof"

  return (
    <div className="rounded-2xl border border-border-strong bg-background-elevated p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Execution flow visualization</p>
          <p className="text-xs text-muted-foreground">
            A visualization of the documented local MVP demo — not a live transaction simulator.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 self-start rounded-lg border border-border bg-background-inset p-1">
          <button
            type="button"
            onClick={() => setMode("compliant")}
            aria-pressed={mode === "compliant"}
            className={cn(
              "focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              mode === "compliant" ? "bg-background-elevated text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Compliant order
          </button>
          <button
            type="button"
            onClick={() => setMode("noncompliant")}
            aria-pressed={mode === "noncompliant"}
            className={cn(
              "focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              mode === "noncompliant" ? "bg-background-elevated text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Non-compliant order
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* step progress */}
        <ol className="space-y-0">
          {steps.map((label, i) => {
            const isFailure = mode === "noncompliant" && i === failsAt;
            const isSkipped = mode === "noncompliant" && i > failsAt;
            const isDone = !isSkipped && !isFailure;

            return (
              <li key={label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      isFailure && "border-danger bg-danger-soft text-danger",
                      isSkipped && "border-ruby-muted bg-ruby-muted/40 text-ruby-muted-foreground",
                      isDone && !isFailure && "border-accent/60 bg-accent-soft text-accent-strong",
                    )}
                  >
                    {isFailure ? <X className="size-3.5" aria-hidden /> : isSkipped ? i + 1 : <Check className="size-3.5" aria-hidden />}
                  </span>
                  {i < steps.length - 1 && (
                    <span className={cn("my-1 w-px flex-1", isSkipped || isFailure ? "bg-ruby-muted" : "bg-accent/40")} aria-hidden />
                  )}
                </div>
                <div className="pb-5 pt-0.5">
                  <p className={cn("text-[13px] font-medium", isSkipped ? "text-ruby-muted-foreground" : "text-foreground")}>
                    {label}
                  </p>
                  {isFailure && (
                    <p className="mt-0.5 text-xs text-danger">
                      nargo execute fails: &ldquo;order notional exceeds mandate maximum&rdquo;
                    </p>
                  )}
                  {isSkipped && <p className="mt-0.5 text-xs text-ruby-muted-foreground">Not reached — no proof, no transaction.</p>}
                </div>
              </li>
            );
          })}
        </ol>

        {/* order data */}
        <div className="rounded-xl border border-border bg-background-inset p-4 sm:p-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Field label="Side" value={order.side} />
            <Field label="Quantity" value={order.quantity.toLocaleString()} />
            <Field label="Limit price" value={order.limitPrice.toLocaleString()} />
            <Field label="Policy limit" value={order.maxNotional.toLocaleString()} />
            <Field label="Notional (qty × price)" value={order.notional.toLocaleString()} emphasize />
            <Field label="Proof generated" value={order.proofGenerated ? "Yes" : "No"} tone={order.proofGenerated ? "success" : "danger"} />
          </dl>
          <div className="mt-4 rounded-md border border-border-strong bg-background-elevated px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Result</p>
            <p className={cn("mt-0.5 text-sm font-semibold", mode === "compliant" ? "text-success" : "text-danger")}>
              {order.result}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  emphasize,
  tone,
}: {
  label: string;
  value: string | number;
  emphasize?: boolean;
  tone?: "success" | "danger";
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 font-mono-tabular text-[15px] font-semibold text-foreground",
          emphasize && "text-accent-strong",
          tone === "success" && "text-success",
          tone === "danger" && "text-danger",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
