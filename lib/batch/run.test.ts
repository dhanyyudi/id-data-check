import { describe, expect, it } from "vitest";
import { nikProcessor } from "./processors/nik";
import { runBatch } from "./run";
import type { ParsedSheet } from "./csv";

const sheet: ParsedSheet = {
  headers: ["NIK", "Nama", "Keterangan"],
  rows: [
    ["3201011505850001", "Budi Contoh", "Reguler"],
    ["1201014312900002", "Siti Sampel", "Cadangan"],
    ["32010115058500012", "Doni Percobaan", "Reguler"],
  ],
  warnings: [],
};

describe("runBatch", () => {
  it("kolom asli tidak berubah sedikit pun", async () => {
    const result = await runBatch({
      sheet,
      columnIndex: 0,
      processor: nikProcessor,
      selectedKeys: ["provinsi", "status"],
      labels: {},
      options: { dateFormat: "dmy-slash" },
    });
    for (let i = 0; i < sheet.rows.length; i++) {
      expect(result.outRows[i].slice(0, 3)).toEqual(sheet.rows[i]);
    }
  });

  it("header keluaran memakai label yang diberikan, bukan label default", async () => {
    const result = await runBatch({
      sheet,
      columnIndex: 0,
      processor: nikProcessor,
      selectedKeys: ["provinsi", "status"],
      labels: { provinsi: "Wilayah Provinsi", status: "Hasil" },
      options: { dateFormat: "dmy-slash" },
    });
    expect(result.outHeaders).toEqual([
      "NIK",
      "Nama",
      "Keterangan",
      "Wilayah Provinsi",
      "Hasil",
    ]);
  });

  it("ringkasan menghitung ketiga status dengan benar", async () => {
    const result = await runBatch({
      sheet,
      columnIndex: 0,
      processor: nikProcessor,
      selectedKeys: ["provinsi", "status", "catatan"],
      labels: {},
      options: { dateFormat: "dmy-slash" },
    });
    expect(result.summary).toEqual({
      total: 3,
      ok: 2,
      perluDicek: 0,
      tidakValid: 1,
    });
    expect(result.statuses).toEqual(["OK", "OK", "TIDAK VALID"]);
  });

  it("hanya kolom terpilih yang muncul di keluaran, dalam urutan outputFields", async () => {
    const result = await runBatch({
      sheet,
      columnIndex: 0,
      processor: nikProcessor,
      selectedKeys: ["status", "provinsi"],
      labels: {},
      options: { dateFormat: "dmy-slash" },
    });
    expect(result.outHeaders.slice(3)).toEqual(["NIK_Provinsi", "NIK_Status"]);
    expect(result.outRows[0][3]).toBe("Jawa Barat");
    expect(result.outRows[0][4]).toBe("OK");
  });
});
