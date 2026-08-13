"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { nikProcessor } from "@/lib/batch/processors/nik";
import { parseCsvFile, type ParsedSheet } from "@/lib/batch/csv";
import { runBatch, type BatchResult } from "@/lib/batch/run";
import { DEFAULT_DATE_FORMAT } from "@/lib/nik/format";
import type { NikStatus } from "@/lib/nik/status";
import { FileDrop } from "./file-drop";
import { ColumnMapper } from "./column-mapper";
import { OutputConfig } from "./output-config";
import { SummaryBar } from "./summary-bar";
import { ResultTable } from "./result-table";
import { ExportBar } from "./export-bar";

type Step = "upload" | "map" | "config" | "result";

const processor = nikProcessor;

export function BatchTool() {
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState("");
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [columnIndex, setColumnIndex] = useState<number | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    processor.outputFields.filter((f) => f.defaultOn).map((f) => f.key)
  );
  const [labels, setLabels] = useState<Record<string, string>>(
    Object.fromEntries(
      processor.outputFields.map((f) => [f.key, f.defaultLabel])
    )
  );
  const [dateFormat, setDateFormat] = useState<string>(DEFAULT_DATE_FORMAT);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NikStatus | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    setFilter(null);
    try {
      const parsed = await parseCsvFile(file);
      setSheet(parsed);
      setFileName(file.name);
      setColumnIndex(processor.detectColumn(parsed.headers, parsed.rows));
      setStep("map");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membaca berkas.");
    }
  };

  const handleProcess = async () => {
    if (!sheet || columnIndex === null) return;
    setError(null);
    setProcessing(true);
    setProgress({ done: 0, total: sheet.rows.length });
    try {
      const batchResult = await runBatch({
        sheet,
        columnIndex,
        processor,
        selectedKeys,
        labels,
        options: { dateFormat },
        onProgress: (done, total) => setProgress({ done, total }),
      });
      setResult(batchResult);
      setStep("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memproses berkas."
      );
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const resetAll = () => {
    setStep("upload");
    setSheet(null);
    setFileName("");
    setColumnIndex(null);
    setResult(null);
    setError(null);
    setFilter(null);
    setSelectedKeys(
      processor.outputFields.filter((f) => f.defaultOn).map((f) => f.key)
    );
    setLabels(
      Object.fromEntries(
        processor.outputFields.map((f) => [f.key, f.defaultLabel])
      )
    );
    setDateFormat(DEFAULT_DATE_FORMAT);
  };

  const progressPct =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-xs font-semibold text-red-700">{error}</p>
        </div>
      )}

      {step === "upload" && <FileDrop onFile={handleFile} onError={setError} />}

      {sheet && (step === "map" || step === "config") && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100/70 px-3 py-2.5 text-xs">
          <span className="font-bold text-zinc-950">{fileName}</span>
          <span className="text-zinc-500">
            · {sheet.rows.length} baris data · {sheet.headers.length} kolom
          </span>
        </div>
      )}

      {sheet && step === "map" && (
        <ColumnMapper
          headers={sheet.headers}
          rows={sheet.rows}
          columnIndex={columnIndex}
          onSelect={setColumnIndex}
          onBack={resetAll}
          onNext={() => setStep("config")}
        />
      )}

      {sheet && step === "config" && (
        <OutputConfig
          fields={processor.outputFields}
          selectedKeys={selectedKeys}
          labels={labels}
          dateFormat={dateFormat}
          originalHeaders={sheet.headers}
          onToggle={(key) =>
            setSelectedKeys((prev) =>
              prev.includes(key)
                ? prev.filter((k) => k !== key)
                : [...prev, key]
            )
          }
          onLabelChange={(key, label) =>
            setLabels((prev) => ({ ...prev, [key]: label }))
          }
          onDateFormatChange={setDateFormat}
          onBack={() => setStep("map")}
          onProcess={handleProcess}
          processing={processing}
        />
      )}

      {processing && progress && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-950">Memproses baris…</span>
            <span className="font-mono tabular text-zinc-500">
              {progress.done}/{progress.total} ({progressPct}%)
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-950 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {step === "result" && result && (
        <>
          <SummaryBar
            summary={result.summary}
            filter={filter}
            onFilter={setFilter}
          />
          <ResultTable result={result} filter={filter} />
          <ExportBar result={result} filename={fileName} />

          {sheet && sheet.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Peringatan pembacaan berkas
              </p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs font-medium text-amber-800">
                {sheet.warnings.slice(0, 10).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFilter(null);
                setStep("config");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-xs transition-colors hover:bg-zinc-100"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Ubah Pengaturan
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-xs transition-colors hover:bg-zinc-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Mulai Lagi dengan Berkas Lain
            </button>
          </div>
        </>
      )}
    </div>
  );
}
