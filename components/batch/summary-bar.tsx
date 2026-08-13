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
    className: "border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100",
    activeClassName: "border-zinc-950 bg-zinc-950 text-white",
  },
  {
    status: "OK",
    label: "OK",
    className: "border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100",
    activeClassName: "border-zinc-950 bg-zinc-950 text-white",
  },
  {
    status: "PERLU DICEK",
    label: "Perlu Dicek",
    className: "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100",
    activeClassName: "border-amber-500 bg-amber-500 text-white",
  },
  {
    status: "TIDAK VALID",
    label: "Tidak Valid",
    className: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
    activeClassName: "border-red-500 bg-red-500 text-white",
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
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs sm:p-4">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-xs transition-colors ${
              active ? chip.activeClassName : chip.className
            }`}
          >
            {chip.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-black tabular ${
                active ? "bg-white/25" : "bg-zinc-100"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
      <span className="ml-auto text-[11px] font-semibold text-zinc-500">
        {summary.total} baris data
      </span>
    </div>
  );
}
