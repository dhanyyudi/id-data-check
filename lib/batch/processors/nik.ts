import type { BatchProcessor } from "../types";
import { loadNikParser } from "@/lib/nik/parse-client";

export const nikProcessor: BatchProcessor = {
  id: "nik",
  label: "NIK (KTP)",
  description:
    "Baca kolom NIK dan hasilkan provinsi, kabupaten/kota, kecamatan, tanggal lahir, umur, jenis kelamin, nomor urut, dan status validitas.",

  outputFields: [
    { key: "provinsi", defaultLabel: "NIK_Provinsi", defaultOn: true },
    { key: "kabupaten", defaultLabel: "NIK_Kab/Kota", defaultOn: true },
    { key: "kecamatan", defaultLabel: "NIK_Kecamatan", defaultOn: true },
    { key: "tanggal_lahir", defaultLabel: "NIK_Tanggal Lahir", defaultOn: true },
    { key: "umur", defaultLabel: "NIK_Umur", defaultOn: true },
    { key: "jenis_kelamin", defaultLabel: "NIK_Jenis Kelamin", defaultOn: true },
    { key: "nomor_urut", defaultLabel: "NIK_No Urut", defaultOn: false },
    { key: "status", defaultLabel: "NIK_Status", defaultOn: true },
    { key: "catatan", defaultLabel: "NIK_Catatan", defaultOn: true },
  ],

  detectColumn(headers: string[], rows: string[][]): number | null {
    // 1) Header persis "nik" (case-insensitive, sudah di-trim).
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].trim().toLowerCase() === "nik") return i;
    }

    // 2) Header yang memuat "nik" sebagai kata.
    const word = /\bnik\b/i;
    for (let i = 0; i < headers.length; i++) {
      if (word.test(headers[i])) return i;
    }

    // 3) Proporsi sel 16 digit pada 200 baris pertama.
    const sample = rows.slice(0, 200);
    let bestIndex: number | null = null;
    let bestRatio = 0;
    for (let c = 0; c < headers.length; c++) {
      let matches = 0;
      let nonEmpty = 0;
      for (const row of sample) {
        const cell = (row[c] ?? "").trim();
        if (cell === "") continue;
        nonEmpty++;
        if (/^\d{16}$/.test(cell)) matches++;
      }
      if (nonEmpty === 0) continue;
      const ratio = matches / nonEmpty;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = c;
      }
    }

    return bestRatio >= 0.5 ? bestIndex : null;
  },

  async load() {
    await loadNikParser();
    const [{ parseWilayahSlim }, { evaluateNik }, { formatTanggal, hitungUmur }] =
      await Promise.all([
        import("@/lib/data/wilayah-slim"),
        import("@/lib/nik/status"),
        import("@/lib/nik/format"),
      ]);

    // Ambil "now" sekali supaya umur konsisten untuk seluruh berkas.
    const now = new Date();
    const fields = this.outputFields;

    return (raw: string, opts: { dateFormat: string }) => {
      const cell = raw ?? "";
      const evaluation = evaluateNik(cell, parseWilayahSlim, now);

      const values: Record<string, string> = {};
      for (const field of fields) {
        values[field.key] = "";
      }

      values.status = evaluation.status;
      values.catatan = evaluation.catatan;

      const hasil = evaluation.hasil;
      if (hasil === null) {
        return { values, status: evaluation.status };
      }

      if (hasil.provinsi !== null) values.provinsi = hasil.provinsi;
      if (hasil.kabupaten !== null) values.kabupaten = hasil.kabupaten;
      if (hasil.kecamatan !== null) values.kecamatan = hasil.kecamatan;
      if (hasil.tanggal_lahir !== null) {
        values.tanggal_lahir = formatTanggal(
          hasil.tanggal_lahir,
          opts.dateFormat as Parameters<typeof formatTanggal>[1]
        );
        const umur = hitungUmur(hasil.tanggal_lahir, now);
        if (umur !== null) values.umur = String(umur);
      }
      if (hasil.jenis_kelamin !== null) values.jenis_kelamin = hasil.jenis_kelamin;
      if (hasil.nomor_urut !== null) values.nomor_urut = hasil.nomor_urut;

      return { values, status: evaluation.status };
    };
  },
};
