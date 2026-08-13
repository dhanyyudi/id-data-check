/** Basis URL situs. Ditimpa lewat NEXT_PUBLIC_SITE_URL saat build. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Cek Data Indonesia";
