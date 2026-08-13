import { WILAYAH_SLIM_JSON } from "./wilayah-slim.generated";

let cache: Map<string, string> | null = null;

function getMap(): Map<string, string> {
  if (!cache) {
    cache = new Map(
      Object.entries(JSON.parse(WILAYAH_SLIM_JSON) as Record<string, string>)
    );
  }
  return cache;
}

/** Cerminan persis parseWilayah() di wilayah.ts, tanpa level kelurahan. */
export function parseWilayahSlim(kode: string) {
  const m = getMap();
  return {
    provinsi: m.get(kode.slice(0, 2)) ?? null,
    kabupaten: m.get(kode.slice(0, 5)) ?? null,
    kecamatan: m.get(kode.slice(0, 8)) ?? null,
  };
}
