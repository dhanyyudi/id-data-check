"use client";

import { ChevronLeft } from "lucide-react";
import { DATE_FORMATS } from "@/lib/nik/format";
import type { OutputField } from "@/lib/batch/types";

interface Props {
  fields: OutputField[];
  selectedKeys: string[];
  labels: Record<string, string>;
  dateFormat: string;
  originalHeaders: string[];
  onToggle: (key: string) => void;
  onLabelChange: (key: string, label: string) => void;
  onDateFormatChange: (id: string) => void;
  onBack: () => void;
  onProcess: () => void;
  processing: boolean;
}

export function OutputConfig({
  fields,
  selectedKeys,
  labels,
  dateFormat,
  originalHeaders,
  onToggle,
  onLabelChange,
  onDateFormatChange,
  onBack,
  onProcess,
  processing,
}: Props) {
  const hasTanggalLahir = selectedKeys.includes("tanggal_lahir");

  const problems: Record<string, string> = {};
  const selected = fields.filter((f) => selectedKeys.includes(f.key));
  const seen = new Set<string>();

  for (const field of selected) {
    const label = (labels[field.key] ?? field.defaultLabel).trim();
    if (label === "") {
      problems[field.key] = "Nama kolom tidak boleh kosong.";
      continue;
    }
    const lower = label.toLowerCase();
    if (seen.has(lower)) {
      problems[field.key] = "Nama kolom kembar dengan kolom hasil lain.";
    } else {
      seen.add(lower);
    }
    if (originalHeaders.some((h) => h.trim().toLowerCase() === lower)) {
      problems[field.key] =
        "Nama kolom bentrok dengan kolom asli berkas. Ganti namanya.";
    }
  }

  const canProcess =
    selectedKeys.length > 0 &&
    Object.keys(problems).length === 0 &&
    !processing;

  return (
    <div className="space-y-4">
      <div className="border-2 border-border bg-card p-4 shadow-md sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Kolom hasil yang akan ditambahkan
          </h3>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {selectedKeys.length}/{fields.length} kolom
          </span>
        </div>

        <div className="space-y-2">
          {fields.map((field) => {
            const checked = selectedKeys.includes(field.key);
            const label = labels[field.key] ?? field.defaultLabel;
            const problem = problems[field.key];
            return (
              <div
                key={field.key}
                className={`flex flex-col gap-1.5 border-2 p-3 transition-colors sm:flex-row sm:items-center sm:gap-3 ${
                  checked
                    ? problem
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-background"
                    : "border-border bg-card opacity-70"
                }`}
              >
                <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(field.key)}
                    className="h-4 w-4 shrink-0 accent-foreground"
                  />
                  <span className="truncate text-xs font-bold text-foreground">
                    {field.defaultLabel}
                  </span>
                </label>
                <input
                  type="text"
                  value={label}
                  disabled={!checked}
                  onChange={(e) => onLabelChange(field.key, e.target.value)}
                  aria-invalid={Boolean(problem)}
                  className={`w-full min-h-11 border-2 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-xs outline-none transition-colors focus:ring-2 focus:ring-primary sm:w-56 disabled:opacity-50 ${
                    problem
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t-2 border-border pt-4">
          <label
            htmlFor="date-format"
            className="text-[11px] font-bold uppercase tracking-wider text-foreground"
          >
            Format tanggal lahir
          </label>
          <select
            id="date-format"
            value={dateFormat}
            disabled={!hasTanggalLahir}
            onChange={(e) => onDateFormatChange(e.target.value)}
            className="mt-2 w-full border-2 border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground shadow-xs outline-none transition-colors focus:ring-2 focus:ring-primary disabled:opacity-50 sm:w-64"
          >
            {DATE_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          {!hasTanggalLahir && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Centang kolom NIK_Tanggal Lahir untuk mengubah format ini.
            </p>
          )}
        </div>

        {Object.keys(problems).length > 0 && (
          <div className="mt-4 border-2 border-destructive bg-destructive/10 p-3">
            <ul className="list-inside list-disc space-y-1 text-xs font-semibold text-destructive">
              {Object.values(problems).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={processing}
          onClick={onBack}
          className="inline-flex items-center gap-1 border-2 border-border bg-card px-3.5 py-3 text-xs font-bold text-foreground shadow-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Kembali
        </button>
        <button
          type="button"
          disabled={!canProcess}
          onClick={onProcess}
          className="inline-flex items-center gap-2 border-2 border-border bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {processing ? "Memproses…" : "Proses"}
        </button>
      </div>
    </div>
  );
}
