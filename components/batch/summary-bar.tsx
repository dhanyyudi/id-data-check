"use client";

import type { BatchSummary } from "@/lib/batch/run";
import type { NikStatus } from "@/lib/nik/status";

interface Props {
  summary: BatchSummary;
  filter: NikStatus | null;
  onFilter: (status: NikStatus | null) => void;
}

const CHIPS: { status: NikStatus | null; label: string; className: string; activeClassName: string }[] = [
  {
    status: null,
    label: "Semua",
    className: "border-border bg-card text-foreground hover:bg-muted",
    activeClassName: "border-border bg-foreground text-background",
  },
  {
    status: "OK",
    label: "OK",
    className: "border-border bg-card text-foreground hover:bg-muted",
    activeClassName: "border-border bg-foreground text-background",
  },
  {
    status: "PERLU DICEK",
    label: "Perlu Dicek",
    className: "border-border bg-primary/40 text-foreground hover:bg-primary/60",
    activeClassName: "border-border bg-primary text-primary-foreground",
  },
  {
    status: "TIDAK VALID",
    label: "Tidak Valid",
    className: "border-border bg-destructive/10 text-destructive hover:bg-destructive/20",
    activeClassName: "border-border bg-destructive text-destructive-foreground",
  },
];

export function SummaryBar({ summary, filter, onFilter }: Props) {
  const countFor = (status: NikStatus | null) => {
    if (status === null) return summary.total;
    if (status === "OK") return summary.ok;
    if (status === "PERLU DICEK") return summary.perluDicek;
    return summary.tidakValid;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-2 border-border bg-card p-3 shadow-md sm:p-4">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Ringkasan
      </span>
      {CHIPS.map((chip) => {
        const active = filter === chip.status;
        const count = countFor(chip.status);
        return (
          <button
            key={chip.label}
            type="button"
            onClick={() => onFilter(active ? null : chip.status)}
            className={`inline-flex items-center gap-1.5 border-2 px-3 py-1.5 text-xs font-bold shadow-xs transition-all ${
              active ? chip.activeClassName : chip.className
            }`}
          >
            {chip.label}
            <span
              className={`border-2 border-border px-1.5 py-0.5 text-[10px] font-black tabular ${
                active ? "border-transparent bg-foreground/20" : "bg-muted"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
      <span className="ml-auto text-[11px] font-semibold text-muted-foreground">
        {summary.total} baris data
      </span>
    </div>
  );
}
