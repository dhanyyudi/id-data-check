import { describe, expect, it } from "vitest";
import { DATE_FORMATS, formatTanggal, hitungUmur } from "./format";

const ISO = "2000-03-31";

describe("DATE_FORMATS", () => {
  it("dmy-slash menghasilkan 31/03/2000", () => {
    expect(formatTanggal(ISO, "dmy-slash")).toBe("31/03/2000");
  });

  it("dmy-dash menghasilkan 31-03-2000", () => {
    expect(formatTanggal(ISO, "dmy-dash")).toBe("31-03-2000");
  });

  it("long-id menghasilkan 31 Maret 2000", () => {
    expect(formatTanggal(ISO, "long-id")).toBe("31 Maret 2000");
  });

  it("iso mengembalikan 2000-03-31", () => {
    expect(formatTanggal(ISO, "iso")).toBe("2000-03-31");
  });

  it("short-id menghasilkan 31 Mar 2000", () => {
    expect(formatTanggal(ISO, "short-id")).toBe("31 Mar 2000");
  });

  it("kelima format terdaftar dengan labelnya", () => {
    expect(DATE_FORMATS.map((f) => f.id)).toEqual([
      "dmy-slash",
      "dmy-dash",
      "long-id",
      "iso",
      "short-id",
    ]);
    expect(DATE_FORMATS.map((f) => f.label)).toEqual([
      "31/03/2000",
      "31-03-2000",
      "31 Maret 2000",
      "2000-03-31",
      "31 Mar 2000",
    ]);
  });
});

describe("nama bulan Indonesia", () => {
  const bulan = [
    ["2000-01-15", "15 Januari 2000", "15 Jan 2000"],
    ["2000-02-15", "15 Februari 2000", "15 Feb 2000"],
    ["2000-03-15", "15 Maret 2000", "15 Mar 2000"],
    ["2000-04-15", "15 April 2000", "15 Apr 2000"],
    ["2000-05-15", "15 Mei 2000", "15 Mei 2000"],
    ["2000-06-15", "15 Juni 2000", "15 Jun 2000"],
    ["2000-07-15", "15 Juli 2000", "15 Jul 2000"],
    ["2000-08-15", "15 Agustus 2000", "15 Agu 2000"],
    ["2000-09-15", "15 September 2000", "15 Sep 2000"],
    ["2000-10-15", "15 Oktober 2000", "15 Okt 2000"],
    ["2000-11-15", "15 November 2000", "15 Nov 2000"],
    ["2000-12-15", "15 Desember 2000", "15 Des 2000"],
  ] as const;

  it("nama panjang keduabelas bulan tepat", () => {
    for (const [iso, panjang] of bulan) {
      expect(formatTanggal(iso, "long-id")).toBe(panjang);
    }
  });

  it("nama singkat keduabelas bulan tepat", () => {
    for (const [iso, , singkat] of bulan) {
      expect(formatTanggal(iso, "short-id")).toBe(singkat);
    }
  });
});

describe("hitungUmur", () => {
  const now = new Date("2026-08-13T12:00:00Z");

  it("menghitung umur saat ulang tahun sudah lewat", () => {
    expect(hitungUmur("2000-03-31", now)).toBe(26);
  });

  it("mengurangi satu tahun saat ulang tahun belum lewat", () => {
    expect(hitungUmur("2000-12-25", now)).toBe(25);
  });

  it("menghitung penuh tepat pada hari ulang tahun", () => {
    expect(hitungUmur("2000-08-13", now)).toBe(26);
  });

  it("mengembalikan null untuk tanggal tidak valid", () => {
    expect(hitungUmur("bukan-tanggal", now)).toBeNull();
    expect(hitungUmur("2000-13-01", now)).toBeNull();
  });
});
