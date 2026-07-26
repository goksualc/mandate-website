import { securityLayers } from "@/content/product";

export function SecurityLayers() {
  return (
    <div className="rounded-2xl border border-border-strong bg-background-elevated p-5 sm:p-7">
      <ol className="space-y-0">
        {securityLayers.map((layer, i) => (
          <li key={layer.order} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-soft text-[13px] font-bold text-accent-strong">
                {layer.order}
              </span>
              {i < securityLayers.length - 1 && <span className="my-1 w-px flex-1 bg-border-strong" aria-hidden />}
            </div>
            <div className="pb-6 pt-1">
              <p className="text-sm font-semibold text-foreground">{layer.title}</p>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{layer.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="rounded-lg border border-border-strong bg-background-inset px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">
        Failure at any single layer is sufficient to prevent an order from being submitted.
      </p>
    </div>
  );
}
