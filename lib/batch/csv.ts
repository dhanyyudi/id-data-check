import Papa from "papaparse";

export interface ParsedSheet {
  headers: string[];
  rows: string[][]; // panjang tiap baris dinormalisasi = headers.length
  warnings: string[]; // ringkasan galat papaparse, tanpa isi sel
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

/** Nama pengganti untuk header kosong: "Kolom 1", "Kolom 2", dst. */
function defaultHeaderName(index: number): string {
  return `Kolom ${index + 1}`;
}

export async function parseCsvFile(file: File): Promise<ParsedSheet> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Berkas terlalu besar (maksimal 20 MB). Pecah berkas menjadi beberapa bagian lalu proses satu per satu."
    );
  }
  if (!/\.csv$/i.test(file.name)) {
    throw new Error(
      "Berkas harus berformat .csv. Simpan berkas lain sebagai CSV dari Sheets atau Excel, lalu coba lagi."
    );
  }

  const text = await file.text();

  let parsed = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: "greedy",
    dynamicTyping: false,
  });

  if (parsed.data.length === 0 && parsed.errors.some((e) => e.code === "UndetectableDelimiter")) {
    // Berkas satu kolom tanpa delimiter apa pun — perlakukan baris sebagai satu kolom.
    parsed = Papa.parse<string[]>(text, {
      header: false,
      skipEmptyLines: "greedy",
      dynamicTyping: false,
      delimiter: "\n",
    });
  }

  if (parsed.data.length === 0) {
    throw new Error("Berkas kosong atau tidak bisa dibaca.");
  }

  const first = parsed.data[0] ?? [];
  const headerCount = first.length;

  const headers = first.map((cell, i) => {
    const trimmed = (cell ?? "").trim();
    return trimmed === "" ? defaultHeaderName(i) : trimmed;
  });

  const rows = parsed.data.slice(1).map((row) => {
    const normalized = Array.from(
      { length: headerCount },
      (_, i) => row[i] ?? ""
    );
    return normalized;
  });

  const warnings: string[] = [];
  for (const err of parsed.errors) {
    if (err.code === "UndetectableDelimiter") continue;
    warnings.push(
      `baris ${err.row ?? "?"}: ${err.message ?? err.code ?? "galat pembacaan"}`
    );
  }
  if (warnings.length > 20) {
    const extra = warnings.length - 20;
    warnings.splice(20);
    warnings.push(`… dan ${extra} galat lain`);
  }

  return { headers, rows, warnings };
}
