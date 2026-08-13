export interface DateFormat {
  id: "dmy-slash" | "dmy-dash" | "long-id" | "iso" | "short-id";
  label: string; // dipakai di dropdown, mis. "31/03/2000"
  format: (iso: string) => string;
}

const BULAN_PANJANG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const BULAN_SINGKAT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/** Pecah ISO YYYY-MM-DD jadi komponen; return null kalau tidak valid. */
function pecahIso(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export const DATE_FORMATS: DateFormat[] = [
  {
    id: "dmy-slash",
    label: "31/03/2000",
    format: (iso) => {
      const p = pecahIso(iso);
      return p ? `${pad2(p.d)}/${pad2(p.m)}/${p.y}` : "";
    },
  },
  {
    id: "dmy-dash",
    label: "31-03-2000",
    format: (iso) => {
      const p = pecahIso(iso);
      return p ? `${pad2(p.d)}-${pad2(p.m)}-${p.y}` : "";
    },
  },
  {
    id: "long-id",
    label: "31 Maret 2000",
    format: (iso) => {
      const p = pecahIso(iso);
      return p ? `${p.d} ${BULAN_PANJANG[p.m - 1]} ${p.y}` : "";
    },
  },
  {
    id: "iso",
    label: "2000-03-31",
    format: (iso) => iso,
  },
  {
    id: "short-id",
    label: "31 Mar 2000",
    format: (iso) => {
      const p = pecahIso(iso);
      return p ? `${p.d} ${BULAN_SINGKAT[p.m - 1]} ${p.y}` : "";
    },
  },
];

export const DEFAULT_DATE_FORMAT: DateFormat["id"] = "dmy-slash";

export function formatTanggal(iso: string, id: DateFormat["id"]): string {
  const fmt = DATE_FORMATS.find((f) => f.id === id);
  return fmt ? fmt.format(iso) : "";
}

/** Umur dalam tahun dari tanggal lahir; null kalau input tidak valid. */
export function hitungUmur(iso: string, now?: Date): number | null {
  const p = pecahIso(iso);
  if (!p) return null;

  const n = now ?? new Date();
  const y = n.getFullYear();
  const m = n.getMonth() + 1;
  const d = n.getDate();

  let umur = y - p.y;
  if (m < p.m || (m === p.m && d < p.d)) {
    umur -= 1;
  }
  return umur;
}
