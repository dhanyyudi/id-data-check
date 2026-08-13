/**
 * Basis URL situs. Nilainya berasal dari `vars.NEXT_PUBLIC_SITE_URL` di
 * wrangler.jsonc, yang dibaca next.config.ts saat build dan dibaca Worker saat
 * request. Fallback di bawah hanya untuk `next dev` tanpa wrangler.jsonc;
 * build produksi tanpa nilai ini sengaja gagal di next.config.ts.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Cek Data Indonesia";
