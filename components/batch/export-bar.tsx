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
    <div className="space-y-2 border-2 border-border bg-card p-3.5 shadow-md sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 border-2 border-border bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Download className="h-4 w-4" />
          Unduh CSV
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-3 text-xs font-bold text-foreground shadow-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-foreground" />
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
          <span className="text-[11px] font-semibold text-destructive">{copyError}</span>
        )}
      </div>
      <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Ekspor selalu memuat seluruh {result.summary.total} baris, tidak terpengaruh
        filter tampilan di atas. CSV memakai UTF-8 dengan BOM supaya huruf beraksen
        aman dibuka di Excel.
      </p>
    </div>
  );
}
