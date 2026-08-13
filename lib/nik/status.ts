import type { NikResult, WilayahLookup } from "./parse-core";
import { parseNIKWith } from "./parse-core";
import { hitungUmur } from "./format";

export type NikStatus = "OK" | "PERLU DICEK" | "TIDAK VALID";

export interface NikEvaluation {
  status: NikStatus;
  catatan: string; // alasan, Bahasa Indonesia; "" kalau OK tanpa catatan
  hasil: NikResult | null; // null kalau TIDAK VALID
  nikBersih: string; // setelah normalisasi
}

/** Buang spasi (termasuk non-breaking), tab, dan tanda kutip tunggal di depan. */
function normalize(raw: string): string {
  return raw
    .replace(/[\u0020\u00A0\u2007\u202F\t]/g, "")
    .replace(/^'+/, "");
}

/** Apakah tahun 2 digit benar-benar dua-tafsir (19xx masih ≤ 100 th, 20xx tidak di masa depan). */
function isAmbiguousYear(yy: number, iso: string, now: Date): boolean {
  const tail = iso.slice(4); // "-MM-DD"
  const umur19 = hitungUmur(`${1900 + yy}${tail}`, now);
  const umur20 = hitungUmur(`${2000 + yy}${tail}`, now);
  return umur19 !== null && umur20 !== null && umur19 <= 100 && umur20 >= 0;
}

export function evaluateNik(
  raw: string,
  lookup: WilayahLookup,
  now?: Date
): NikEvaluation {
  const current = now ?? new Date();

  const nikBersih = normalize(raw);
  const noteNormalisasi =
    nikBersih !== raw ? "spasi/pemisah dirapikan" : null;

  if (nikBersih === "") {
    return gabung({
      status: "TIDAK VALID",
      catatan: "NIK kosong",
      hasil: null,
      nikBersih,
    }, noteNormalisasi);
  }

  if (!/^\d+$/.test(nikBersih)) {
    return gabung({
      status: "TIDAK VALID",
      catatan: "mengandung karakter bukan angka",
      hasil: null,
      nikBersih,
    }, noteNormalisasi);
  }

  if (nikBersih.length !== 16) {
    return gabung({
      status: "TIDAK VALID",
      catatan: `panjang ${nikBersih.length} digit, seharusnya 16`,
      hasil: null,
      nikBersih,
    }, noteNormalisasi);
  }

  const hasil = parseNIKWith(nikBersih, lookup, current);

  if (hasil.tanggal_lahir === null) {
    return gabung({
      status: "TIDAK VALID",
      catatan: "tanggal lahir tidak valid",
      hasil: null,
      nikBersih,
    }, noteNormalisasi);
  }

  if (hasil.provinsi === null) {
    return gabung({
      status: "TIDAK VALID",
      catatan: "kode provinsi tidak dikenal",
      hasil: null,
      nikBersih,
    }, noteNormalisasi);
  }

  if (hasil.kabupaten === null) {
    return gabung({
      status: "TIDAK VALID",
      catatan: "kode kabupaten/kota tidak dikenal",
      hasil: null,
      nikBersih,
    }, noteNormalisasi);
  }

  const catatanPerluDicek: string[] = [];

  if (hasil.kecamatan === null) {
    catatanPerluDicek.push(
      "kode kecamatan tidak ditemukan (kemungkinan pemekaran/penggabungan wilayah)"
    );
  }

  const umur = hitungUmur(hasil.tanggal_lahir, current);
  if (umur !== null && (umur < 17 || umur > 100)) {
    catatanPerluDicek.push(`umur ${umur} tahun, di luar rentang wajar`);
  }

  const yy = Number(nikBersih.slice(10, 12));
  if (isAmbiguousYear(yy, hasil.tanggal_lahir, current)) {
    catatanPerluDicek.push("tahun bisa dibaca 19xx atau 20xx");
  }

  if (catatanPerluDicek.length > 0) {
    return gabung({
      status: "PERLU DICEK",
      catatan: catatanPerluDicek.join("; "),
      hasil,
      nikBersih,
    }, noteNormalisasi);
  }

  return {
    status: "OK",
    catatan: noteNormalisasi ?? "",
    hasil,
    nikBersih,
  };
}

function gabung(
  ev: NikEvaluation,
  noteNormalisasi: string | null
): NikEvaluation {
  if (!noteNormalisasi) return ev;
  return {
    ...ev,
    catatan: ev.catatan
      ? `${noteNormalisasi}; ${ev.catatan}`
      : noteNormalisasi,
  };
}
