"use client";

import { ChevronLeft } from "lucide-react";

interface Props {
  headers: string[];
  rows: string[][];
  columnIndex: number | null;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ColumnMapper({
  headers,
  rows,
  columnIndex,
  onSelect,
  onBack,
  onNext,
}: Props) {
  const samples = columnIndex === null
    ? []
    : rows.slice(0, 3).map((row) => row[columnIndex] ?? "");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs sm:p-6">
        <label
          htmlFor="nik-column"
          className="text-[11px] font-bold uppercase tracking-wider text-zinc-700"
        >
          Kolom berisi NIK
        </label>
        <select
          id="nik-column"
          value={columnIndex ?? ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-950 shadow-xs outline-none transition-colors focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/15"
        >
          {columnIndex === null && (
            <option value="" disabled>
              Pilih kolom…
            </option>
          )}
          {headers.map((header, i) => (
            <option key={i} value={i}>
              {header}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[11px] text-zinc-500">
          Kolom dideteksi otomatis. Periksa contoh isi di bawah sebelum lanjut.
        </p>

        {samples.length > 0 && (
          <div className="mt-3 space-y-1.5 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Contoh isi kolom
            </p>
            {samples.map((sample, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-mono text-xs font-bold tabular text-zinc-950"
              >
                {sample === "" ? "—" : sample}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-xs transition-colors hover:bg-zinc-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Ganti Berkas
        </button>
        <button
          type="button"
          disabled={columnIndex === null}
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
        >
          Lanjut ke Pengaturan
        </button>
      </div>
    </div>
  );
}
