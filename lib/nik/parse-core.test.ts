import { describe, expect, it } from "vitest";
import { parseNIKWith, type WilayahLookup } from "./parse-core";

const lookup: WilayahLookup = (kode) => ({
  provinsi: kode.startsWith("32") ? "Jawa Barat" : null,
  kabupaten: kode.startsWith("32.01") ? "Kabupaten Bogor" : null,
  kecamatan: kode.startsWith("32.01.01") ? "Cibinong" : null,
});

const NOW = new Date("2026-08-13T12:00:00Z");

describe("parseNIKWith", () => {
  it("membaca NIK 16 digit laki-laki secara lengkap", () => {
    const result = parseNIKWith("3201011505850001", lookup, NOW);
    expect(result).toEqual({
      provinsi: "Jawa Barat",
      kabupaten: "Kabupaten Bogor",
      kecamatan: "Cibinong",
      jenis_kelamin: "LAKI-LAKI",
      tanggal_lahir: "1985-05-15",
      nomor_urut: "0001",
    });
  });

  it("aturan +40: hari lebih dari 40 menghasilkan PEREMPUAN dan tanggal dikurangi 40", () => {
    const result = parseNIKWith("3201016501900002", lookup, NOW);
    expect(result.jenis_kelamin).toBe("PEREMPUAN");
    expect(result.tanggal_lahir).toBe("1990-01-25");
  });

  it("panjang parsial 2 hanya mengembalikan provinsi", () => {
    const result = parseNIKWith("32", lookup, NOW);
    expect(result.provinsi).toBe("Jawa Barat");
    expect(result.kabupaten).toBeNull();
    expect(result.kecamatan).toBeNull();
    expect(result.tanggal_lahir).toBeNull();
    expect(result.jenis_kelamin).toBeNull();
    expect(result.nomor_urut).toBeNull();
  });

  it("panjang parsial 4 mengembalikan provinsi dan kabupaten", () => {
    const result = parseNIKWith("3201", lookup, NOW);
    expect(result.provinsi).toBe("Jawa Barat");
    expect(result.kabupaten).toBe("Kabupaten Bogor");
    expect(result.kecamatan).toBeNull();
  });

  it("panjang parsial 6 menambahkan kecamatan", () => {
    const result = parseNIKWith("320101", lookup, NOW);
    expect(result.kecamatan).toBe("Cibinong");
    expect(result.tanggal_lahir).toBeNull();
  });

  it("panjang parsial 12 menambahkan tanggal dan jenis kelamin tanpa nomor urut", () => {
    const result = parseNIKWith("320101150585", lookup, NOW);
    expect(result.tanggal_lahir).toBe("1985-05-15");
    expect(result.jenis_kelamin).toBe("LAKI-LAKI");
    expect(result.nomor_urut).toBeNull();
  });

  it("melempar untuk input bukan angka", () => {
    expect(() => parseNIKWith("3201A1", lookup, NOW)).toThrow(
      "NIK harus berupa angka"
    );
    expect(() => parseNIKWith("", lookup, NOW)).toThrow("NIK harus berupa angka");
    expect(() => parseNIKWith("3", lookup, NOW)).toThrow("NIK harus berupa angka");
  });

  it("tanggal mustahil menghasilkan tanggal_lahir null", () => {
    expect(
      parseNIKWith("3201013213900001", lookup, NOW).tanggal_lahir
    ).toBeNull();
    expect(
      parseNIKWith("3201010000000001", lookup, NOW).tanggal_lahir
    ).toBeNull();
  });

  it("ambang abad memakai now yang disuntikkan", () => {
    expect(
      parseNIKWith("3201011505260001", lookup, NOW).tanggal_lahir
    ).toBe("2026-05-15");
    expect(
      parseNIKWith("3201011505270001", lookup, NOW).tanggal_lahir
    ).toBe("1927-05-15");

    const older = new Date("2010-06-01T12:00:00Z");
    expect(
      parseNIKWith("3201011505990001", lookup, older).tanggal_lahir
    ).toBe("1999-05-15");
  });
});
