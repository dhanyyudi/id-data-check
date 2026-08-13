/**
 * Headless verification of the batch pipeline against a CSV on disk.
 * Usage: bun run scripts/verify-batch.ts <path-to-csv> [nama-kolom]
 *
 * Prints aggregate numbers only. Never prints NIK values, names, or any
 * cell content. Never writes output files.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import Papa from "papaparse";
import { nikProcessor } from "../lib/batch/processors/nik";
import { runBatch } from "../lib/batch/run";
import type { ParsedSheet } from "../lib/batch/csv";
import { DEFAULT_DATE_FORMAT } from "../lib/nik/format";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: bun run scripts/verify-batch.ts <path-to-csv> [nama-kolom]");
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`Berkas tidak ditemukan: ${csvPath}`);
  process.exit(1);
}

const forcedColumnName = process.argv[3] ?? null;

const text = fs.readFileSync(csvPath, "utf8");

let parsed = Papa.parse<string[]>(text, {
  header: false,
  skipEmptyLines: "greedy",
  dynamicTyping: false,
});

if (
  parsed.data.length === 0 &&
  parsed.errors.some((e) => e.code === "UndetectableDelimiter")
) {
  parsed = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: "greedy",
    dynamicTyping: false,
    delimiter: "\n",
  });
}

if (parsed.data.length === 0) {
  console.error("Berkas kosong atau tidak bisa dibaca.");
  process.exit(1);
}

const first = parsed.data[0] ?? [];
const headers = first.map((cell, i) => {
  const trimmed = (cell ?? "").trim();
  return trimmed === "" ? `Kolom ${i + 1}` : trimmed;
});
const rows = parsed.data.slice(1).map((row) =>
  headers.map((_, i) => row[i] ?? "")
);

const sheet: ParsedSheet = { headers, rows, warnings: [] };

let columnIndex: number;
let detection: string;

if (forcedColumnName) {
  const idx = headers.findIndex(
    (h) => h.trim().toLowerCase() === forcedColumnName.trim().toLowerCase()
  );
  if (idx === -1) {
    console.error(
      `Kolom "${forcedColumnName}" tidak ditemukan di header berkas.`
    );
    process.exit(1);
  }
  columnIndex = idx;
  detection = "dipaksa via argumen";
} else {
  const detected = nikProcessor.detectColumn(headers, rows);
  if (detected === null) {
    console.error(
      "Kolom NIK tidak bisa dideteksi otomatis. Beri nama kolom sebagai argumen kedua."
    );
    process.exit(1);
  }
  columnIndex = detected;
  detection = "terdeteksi otomatis";
}

const result = await runBatch({
  sheet,
  columnIndex,
  processor: nikProcessor,
  selectedKeys: nikProcessor.outputFields
    .filter((f) => f.defaultOn)
    .map((f) => f.key),
  labels: {},
  options: { dateFormat: DEFAULT_DATE_FORMAT },
});

const catatanCounts = new Map<string, number>();
for (let i = 0; i < result.outRows.length; i++) {
  if (result.statuses[i] === "OK") continue;
  const catatanRaw = result.outRows[i][result.outRows[i].length - 1];
  if (!catatanRaw) continue;
  for (const part of catatanRaw.split("; ")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    catatanCounts.set(trimmed, (catatanCounts.get(trimmed) ?? 0) + 1);
  }
}

const topCatatan = [...catatanCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const baseName = path.basename(csvPath);

console.log(`Berkas       : ${baseName}`);
console.log(`Baris data   : ${result.summary.total}`);
console.log(
  `Kolom NIK    : "${headers[columnIndex]}" (indeks ${columnIndex}, ${detection})`
);
console.log(`OK           : ${result.summary.ok}`);
console.log(`Perlu dicek  : ${result.summary.perluDicek}`);
console.log(`Tidak valid  : ${result.summary.tidakValid}`);
if (topCatatan.length > 0) {
  console.log("Catatan terbanyak:");
  for (const [catatan, count] of topCatatan) {
    console.log(`  ${count}x  ${catatan}`);
  }
}
