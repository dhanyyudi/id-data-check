import { describe, expect, it } from "vitest";
import { parseWilayahSlim } from "@/lib/data/wilayah-slim";
import { evaluateNik } from "./status";

const NOW = new Date("2026-08-13T12:00:00Z");
const ev = (raw: string) => evaluateNik(raw, parseWilayahSlim, NOW);

describe("evaluateNik: kesembilan aturan status", () => {
  it("1: kosong setelah normalisasi menjadi TIDAK VALID dengan catatan NIK kosong", () => {
    const r = ev("");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe("NIK kosong");
    expect(r.hasil).toBeNull();
  });

  it("2: karakter bukan angka menjadi TIDAK VALID", () => {
    const r = ev("320101150585000X");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe("mengandung karakter bukan angka");
    expect(r.hasil).toBeNull();
  });

  it("3: panjang bukan 16 menjadi TIDAK VALID dengan sebutan panjangnya", () => {
    const r = ev("32010115058500012");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe("panjang 17 digit, seharusnya 16");
  });

  it("4: tanggal mustahil menjadi TIDAK VALID", () => {
    const r = ev("3201013213900001");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe("tanggal lahir tidak valid");
  });

  it("5: kode provinsi tidak dikenal menjadi TIDAK VALID", () => {
    const r = ev("9901011505850001");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe("kode provinsi tidak dikenal");
  });

  it("6: kode kabupaten/kota tidak dikenal menjadi TIDAK VALID", () => {
    const r = ev("3299011505850001");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe("kode kabupaten/kota tidak dikenal");
  });

  it("7: kode kecamatan tidak ditemukan menjadi PERLU DICEK", () => {
    const r = ev("3201991505850001");
    expect(r.status).toBe("PERLU DICEK");
    expect(r.catatan).toBe(
      "kode kecamatan tidak ditemukan (kemungkinan pemekaran/penggabungan wilayah)"
    );
    expect(r.hasil).not.toBeNull();
  });

  it("8: umur di bawah 17 menjadi PERLU DICEK dengan sebutan umurnya", () => {
    const r = ev("3201010301180001");
    expect(r.status).toBe("PERLU DICEK");
    expect(r.catatan).toBe("umur 8 tahun, di luar rentang wajar");
  });

  it("8b: cabang umur di atas 100 tidak tercapai lewat parser, karena ambang abad membatasi umur maksimal 99", () => {
    // yy terendah yang dipetakan ke 19xx adalah T = (nowYear % 100) + 1,
    // sehingga umur tertua yang bisa dihasilkan parser adalah 99 tahun.
    const r = ev("3201011501270001");
    expect(r.status).toBe("OK");
    expect(r.hasil?.tanggal_lahir).toBe("1927-01-15");
  });

  it("9: tahun dua-tafsir menjadi PERLU DICEK", () => {
    const r = ev("3201011501260001");
    expect(r.status).toBe("PERLU DICEK");
    expect(r.catatan).toBe(
      "umur 0 tahun, di luar rentang wajar; tahun bisa dibaca 19xx atau 20xx"
    );
  });

  it("selain itu OK tanpa catatan", () => {
    const r = ev("3201011505850001");
    expect(r.status).toBe("OK");
    expect(r.catatan).toBe("");
    expect(r.hasil?.provinsi).toBe("Jawa Barat");
  });
});

describe("evaluateNik: normalisasi", () => {
  it("membuang spasi, spasi tak putus, dan tab", () => {
    const r = ev(" 3201011505850001\u00A0\t");
    expect(r.nikBersih).toBe("3201011505850001");
    expect(r.status).toBe("OK");
    expect(r.catatan).toBe("spasi/pemisah dirapikan");
  });

  it("membuang kutip tunggal di depan", () => {
    const r = ev("'3201011505850001");
    expect(r.nikBersih).toBe("3201011505850001");
    expect(r.status).toBe("OK");
    expect(r.catatan).toBe("spasi/pemisah dirapikan");
  });

  it("catatan normalisasi ikut menyertai status hasil validasi", () => {
    const r = ev(" 32010115058500012 ");
    expect(r.status).toBe("TIDAK VALID");
    expect(r.catatan).toBe(
      "spasi/pemisah dirapikan; panjang 17 digit, seharusnya 16"
    );
  });
});

describe("evaluateNik: penggabungan catatan", () => {
  it("beberapa catatan PERLU DICEK digabung dengan titik koma", () => {
    const r = ev("3201990301180001");
    expect(r.status).toBe("PERLU DICEK");
    expect(r.catatan).toBe(
      "kode kecamatan tidak ditemukan (kemungkinan pemekaran/penggabungan wilayah); umur 8 tahun, di luar rentang wajar"
    );
  });

  it("hasil tetap terisi untuk PERLU DICEK", () => {
    const r = ev("3201991505850001");
    expect(r.hasil).not.toBeNull();
    expect(r.hasil?.provinsi).toBe("Jawa Barat");
  });
});
