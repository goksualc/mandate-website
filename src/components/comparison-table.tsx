import { cn } from "@/lib/utils";

export interface ComparisonTableProps {
  columns: string[];
  rows: (string | number)[][];
  /** column index to visually emphasize (e.g. the "MANDATE" row/column) */
  highlightRow?: number;
  caption?: string;
  className?: string;
}

export function ComparisonTable({ columns, rows, highlightRow, caption, className }: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border-strong", className)}>
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border-strong bg-background-inset">
            {columns.map((col) => (
              <th key={col} scope="col" className="px-4 py-3 font-semibold text-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-border last:border-0",
                highlightRow === i ? "bg-accent-soft" : i % 2 === 1 ? "bg-background-inset/40" : undefined,
              )}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-3 align-top text-muted-foreground",
                    j === 0 && "font-medium text-foreground",
                    highlightRow === i && j === 0 && "text-accent-strong",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
