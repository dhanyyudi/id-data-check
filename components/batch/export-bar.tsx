"use client";

import { useState } from "react";
import { Check, ClipboardCopy, Download, Info } from "lucide-react";
import type { BatchResult } from "@/lib/batch/run";
import { downloadText, suggestFilename, toCsvWithBom, toTsv } from "@/lib/batch/export";

interface Props {
  result: BatchResult;
  filename: string;
}

export function ExportBar({ result, filename }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleDownload = () => {
    const csv = toCsvWithBom(result.outHeaders, result.outRows);
    downloadText(
      suggestFilename(filename || "data.csv"),
      csv,
      "text/csv;charset=utf-8"
    );
  };

  const handleCopy = async () => {
    const tsv = toTsv(result.outHeaders, result.outRows);
    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Clipboard tidak bisa diakses dari browser ini. Gunakan Unduh CSV.");
    }
  };

  return (
    <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-xs sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95"
        >
          <Download className="h-4 w-4" />
          Unduh CSV
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-xs transition-colors hover:bg-zinc-100 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-zinc-950" />
              Tersalin!
            </>
          ) : (
            <>
              <ClipboardCopy className="h-4 w-4" />
              Salin ke Clipboard (TSV)
            </>
          )}
        </button>
        {copyError && (
          <span className="text-[11px] font-semibold text-red-600">{copyError}</span>
        )}
      </div>
      <p className="flex items-start gap-1.5 text-[11px] text-zinc-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Ekspor selalu memuat seluruh {result.summary.total} baris, tidak terpengaruh
        filter tampilan di atas. CSV memakai UTF-8 dengan BOM supaya huruf beraksen
        aman dibuka di Excel.
      </p>
    </div>
  );
}
