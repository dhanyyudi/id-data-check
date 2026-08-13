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
      <div className="border-2 border-border bg-card p-4 shadow-md sm:p-6">
        <label
          htmlFor="nik-column"
          className="text-[11px] font-bold uppercase tracking-wider text-foreground"
        >
          Kolom berisi NIK
        </label>
        <select
          id="nik-column"
          value={columnIndex ?? ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="mt-2 w-full border-2 border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground shadow-xs outline-none transition-colors focus:ring-2 focus:ring-primary"
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
        <p className="mt-2 text-[11px] text-muted-foreground">
          Kolom dideteksi otomatis. Periksa contoh isi di bawah sebelum lanjut.
        </p>

        {samples.length > 0 && (
          <div className="mt-3 space-y-1.5 border-2 border-border bg-background p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Contoh isi kolom
            </p>
            {samples.map((sample, i) => (
              <div
                key={i}
                className="border-2 border-border bg-card px-3 py-1.5 font-mono text-xs font-bold tabular text-foreground"
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
          className="inline-flex items-center gap-1 border-2 border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground shadow-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Ganti Berkas
        </button>
        <button
          type="button"
          disabled={columnIndex === null}
          onClick={onNext}
          className="inline-flex items-center gap-2 border-2 border-border bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          Lanjut ke Pengaturan
        </button>
      </div>
    </div>
  );
}
