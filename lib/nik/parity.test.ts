import { describe, expect, it } from "vitest";
import { parseWilayah } from "@/lib/data/wilayah";
import { parseWilayahSlim } from "@/lib/data/wilayah-slim";
import { WILAYAH_SLIM_JSON } from "@/lib/data/wilayah-slim.generated";
import { parseNIKWith } from "./parse-core";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260813);

const kecamatanCodes: string[] = [];
for (const kode of Object.keys(
  JSON.parse(WILAYAH_SLIM_JSON) as Record<string, string>
)) {
  if (kode.split(".").length === 3) kecamatanCodes.push(kode);
}

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();

function randomNik(full: boolean): string {
  const kode = kecamatanCodes[Math.floor(rand() * kecamatanCodes.length)];
  const base = kode.replace(/\./g, "");
  if (!full) {
    const len = [2, 4, 5, 6, 8, 10, 12, 14][Math.floor(rand() * 8)];
    return base.slice(0, len);
  }
  const year2 = Math.floor(rand() * 100);
  const month = months[Math.floor(rand() * months.length)];
  const yearGuess = year2 < 27 ? 2000 + year2 : 1900 + year2;
  const maxDay = daysInMonth(month, yearGuess);
  let day = 1 + Math.floor(rand() * maxDay);
  if (rand() < 0.5) day += 40;
  const serial = String(Math.floor(rand() * 10000)).padStart(4, "0");
  return (
    base +
    String(day).padStart(2, "0") +
    String(month).padStart(2, "0") +
    String(year2).padStart(2, "0") +
    serial
  );
}

describe("kesetaraan parser server dan browser", () => {
  const now = new Date("2026-08-13T12:00:00Z");
  const cases: string[] = [];
  for (let i = 0; i < 500; i++) {
    cases.push(randomNik(i % 3 !== 0));
  }

  it("500 NIK memberi hasil identik lewat dataset penuh dan slim", () => {
    expect(kecamatanCodes.length).toBeGreaterThan(7000);
    for (const nik of cases) {
      let full: unknown;
      let slim: unknown;
      let fullErr: string | null = null;
      let slimErr: string | null = null;
      try {
        full = parseNIKWith(nik, parseWilayah, now);
      } catch (e) {
        fullErr = (e as Error).message;
      }
      try {
        slim = parseNIKWith(nik, parseWilayahSlim, now);
      } catch (e) {
        slimErr = (e as Error).message;
      }
      expect(fullErr, `pesan galat untuk ${nik}`).toBe(slimErr);
      expect(full, `hasil untuk ${nik}`).toEqual(slim);
    }
  });
});
