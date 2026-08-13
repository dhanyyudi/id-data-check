import { parseWilayah } from "@/lib/data/wilayah";
import { parseNIKWith } from "./parse-core";

export type { NikResult } from "./parse-core";

/** Server-side: memakai dataset wilayah lengkap (7 MB). */
export function parseNIK(nik: string) {
  return parseNIKWith(nik, parseWilayah);
}
