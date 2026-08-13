import { describe, expect, it } from "vitest";
import { parseCsvFile } from "./csv";

function makeFile(name: string, content: string): File {
  return new File([content], name, { type: "text/csv" });
}

describe("parseCsvFile", () => {
  it("field berkutip yang memuat koma tetap utuh", async () => {
    const file = makeFile(
      "a.csv",
      'NIK,Nama\n3201011505850001,"Budi, Contoh"\n'
    );
    const sheet = await parseCsvFile(file);
    expect(sheet.headers).toEqual(["NIK", "Nama"]);
    expect(sheet.rows).toEqual([["3201011505850001", "Budi, Contoh"]]);
  });

  it("BOM di awal berkas tidak bocor ke nama header", async () => {
    const file = makeFile(
      "a.csv",
      "\uFEFFNIK,Nama\n3201011505850001,Budi\n"
    );
    const sheet = await parseCsvFile(file);
    expect(sheet.headers).toEqual(["NIK", "Nama"]);
  });

  it("header kosong diberi nama Kolom N", async () => {
    const file = makeFile("a.csv", ",,Alamat\n1,2,Bogor\n");
    const sheet = await parseCsvFile(file);
    expect(sheet.headers).toEqual(["Kolom 1", "Kolom 2", "Alamat"]);
  });

  it("baris yang lebih pendek dari header dinormalkan panjangnya", async () => {
    const file = makeFile("a.csv", "A,B,C\n1,2\n");
    const sheet = await parseCsvFile(file);
    expect(sheet.rows[0]).toEqual(["1", "2", ""]);
  });

  it("baris yang lebih panjang dipangkas agar sama dengan header", async () => {
    const file = makeFile("a.csv", "A,B\n1,2,3,4\n");
    const sheet = await parseCsvFile(file);
    expect(sheet.rows[0]).toEqual(["1", "2"]);
  });

  it("menolak berkas bukan .csv dengan pesan jelas", async () => {
    const file = makeFile("a.txt", "A,B\n1,2\n");
    await expect(parseCsvFile(file)).rejects.toThrow("harus berformat .csv");
  });

  it("berkas satu kolom tanpa delimiter tetap terbaca", async () => {
    const file = makeFile("a.csv", "NIK\n3201011505850001\n3201011505850002\n");
    const sheet = await parseCsvFile(file);
    expect(sheet.headers).toEqual(["NIK"]);
    expect(sheet.rows).toHaveLength(2);
  });

  it("berkas kosong ditolak", async () => {
    const file = makeFile("a.csv", "");
    await expect(parseCsvFile(file)).rejects.toThrow(
      "Berkas kosong atau tidak bisa dibaca"
    );
  });
});
