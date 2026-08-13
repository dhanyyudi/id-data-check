import type { NikStatus } from "@/lib/nik/status";

export interface OutputField {
  key: string; // stabil, dipakai internal
  defaultLabel: string; // header default, mis. "NIK_Provinsi"
  hint?: string; // teks bantuan kecil di UI
  defaultOn: boolean;
}

export interface ProcessorOptions {
  dateFormat: string;
}

export interface RowOutput {
  values: Record<string, string>; // dikunci OutputField.key
  status: NikStatus;
}

export interface BatchProcessor {
  id: string;
  label: string;
  description: string;
  outputFields: OutputField[];
  /** Menebak indeks kolom sumber. null kalau tidak yakin. */
  detectColumn(headers: string[], rows: string[][]): number | null;
  /** Memuat dependensi berat secara lazy, mengembalikan fungsi per-baris. */
  load(): Promise<(raw: string, opts: ProcessorOptions) => RowOutput>;
}
