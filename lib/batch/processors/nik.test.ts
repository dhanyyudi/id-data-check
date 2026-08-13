import { describe, expect, it } from "vitest";
import { nikProcessor } from "./nik";

describe("nikProcessor.detectColumn", () => {
  it("menemukan header bernama NIK", () => {
    expect(
      nikProcessor.detectColumn(["Nama", "NIK", "Alamat"], [])
    ).toBe(1);
    expect(
      nikProcessor.detectColumn(["Nama", "nik"], [])
    ).toBe(1);
    expect(
      nikProcessor.detectColumn(["Nama", "  Nik  "], [])
    ).toBe(1);
  });

  it("menemukan header yang memuat kata NIK", () => {
    expect(
      nikProcessor.detectColumn(["Nama", "NIK Lama", "NIK Baru"], [])
    ).toBe(1);
  });

  it("jatuh ke penilaian isi 16 digit saat header tidak jelas", () => {
    const headers = ["Kolom A", "Kolom B"];
    const rows = [
      ["Budi", "3201011505850001"],
      ["Siti", "1201014312900002"],
      ["Andi", "5101012007750003"],
    ];
    expect(nikProcessor.detectColumn(headers, rows)).toBe(1);
  });

  it("mengembalikan null saat tidak ada kandidat", () => {
    expect(
      nikProcessor.detectColumn(["A", "B"], [["x", "y"], ["p", "q"]])
    ).toBeNull();
  });
});

describe("nikProcessor.load", () => {
  it("baris TIDAK VALID mengosongkan seluruh kolom hasil kecuali status dan catatan", async () => {
    const processRow = await nikProcessor.load();
    const { values, status } = processRow("32010115058500012", {
      dateFormat: "dmy-slash",
    });
    expect(status).toBe("TIDAK VALID");
    for (const field of nikProcessor.outputFields) {
      if (field.key === "status" || field.key === "catatan") continue;
      expect(values[field.key], `field ${field.key}`).toBe("");
    }
    expect(values.status).toBe("TIDAK VALID");
    expect(values.catatan).toBe("panjang 17 digit, seharusnya 16");
  });

  it("baris OK mengisi kolom hasil dan memformat tanggal", async () => {
    const processRow = await nikProcessor.load();
    const { values, status } = processRow("3201011505850001", {
      dateFormat: "long-id",
    });
    expect(status).toBe("OK");
    expect(values.provinsi).toBe("Jawa Barat");
    expect(values.kabupaten).toBe("Kabupaten Bogor");
    expect(values.kecamatan).toBe("Cibinong");
    expect(values.tanggal_lahir).toBe("15 Mei 1985");
    expect(values.jenis_kelamin).toBe("LAKI-LAKI");
    expect(values.nomor_urut).toBe("0001");
    expect(values.umur).not.toBe("");
  });
});
