"use client";

import type { NikResult } from "./parse-core";

export type NikParser = (nik: string) => NikResult;

let cached: NikParser | null = null;
let inflight: Promise<NikParser> | null = null;

/** Memuat dataset wilayah ramping (~56 KB gzip) sekali, lalu memakai cache. */
export function loadNikParser(): Promise<NikParser> {
  if (cached) {
    return Promise.resolve(cached);
  }

  inflight ??= (async () => {
    const [{ parseWilayahSlim }, { parseNIKWith }] = await Promise.all([
      import("@/lib/data/wilayah-slim"),
      import("./parse-core"),
    ]);

    const parser: NikParser = (nik: string) => parseNIKWith(nik, parseWilayahSlim);

    cached = parser;
    return parser;
  })().catch((err) => {
    inflight = null;
    throw err;
  });

  return inflight;
}
