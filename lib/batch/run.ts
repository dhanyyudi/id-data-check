import type { NikStatus } from "@/lib/nik/status";
import type { ParsedSheet } from "./csv";
import type { BatchProcessor, ProcessorOptions } from "./types";

export interface BatchSummary {
  total: number;
  ok: number;
  perluDicek: number;
  tidakValid: number;
}

export interface BatchResult {
  outHeaders: string[]; // header asli + label kolom terpilih
  outRows: string[][]; // baris asli + nilai hasil
  statuses: NikStatus[]; // sejajar dengan outRows
  summary: BatchSummary;
}

const CHUNK_SIZE = 500;

export async function runBatch(args: {
  sheet: ParsedSheet;
  columnIndex: number;
  processor: BatchProcessor;
  selectedKeys: string[];
  labels: Record<string, string>;
  options: ProcessorOptions;
  onProgress?: (done: number, total: number) => void;
}): Promise<BatchResult> {
  const { sheet, columnIndex, processor, selectedKeys, labels, options } = args;

  const processRow = await processor.load();

  const selectedFields = processor.outputFields.filter((f) =>
    selectedKeys.includes(f.key)
  );

  const outHeaders = [
    ...sheet.headers,
    ...selectedFields.map((f) => labels[f.key] ?? f.defaultLabel),
  ];

  const outRows: string[][] = [];
  const statuses: NikStatus[] = [];

  const total = sheet.rows.length;

  for (let start = 0; start < total; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, total);
    for (let i = start; i < end; i++) {
      const row = sheet.rows[i];
      const { values, status } = processRow(row[columnIndex], options);
      outRows.push([...row, ...selectedFields.map((f) => values[f.key] ?? "")]);
      statuses.push(status);
    }
    if (args.onProgress) {
      args.onProgress(end, total);
    }
    if (end < total) {
      // Beri napas pada UI supaya tidak membeku dan progress terlihat.
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const summary: BatchSummary = { total, ok: 0, perluDicek: 0, tidakValid: 0 };
  for (const s of statuses) {
    if (s === "OK") summary.ok++;
    else if (s === "PERLU DICEK") summary.perluDicek++;
    else summary.tidakValid++;
  }

  return { outHeaders, outRows, statuses, summary };
}
