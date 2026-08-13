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
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
            Kolom hasil yang akan ditambahkan
          </h3>
          <span className="text-[11px] font-semibold text-zinc-500">
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
                className={`flex flex-col gap-1.5 rounded-xl border p-3 transition-colors sm:flex-row sm:items-center sm:gap-3 ${
                  checked
                    ? problem
                      ? "border-red-300 bg-red-50/50"
                      : "border-zinc-300 bg-zinc-50/60"
                    : "border-zinc-200 bg-white opacity-70"
                }`}
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(field.key)}
                    className="h-4 w-4 shrink-0 accent-zinc-950"
                  />
                  <span className="truncate text-xs font-bold text-zinc-950">
                    {field.defaultLabel}
                  </span>
                </label>
                <input
                  type="text"
                  value={label}
                  disabled={!checked}
                  onChange={(e) => onLabelChange(field.key, e.target.value)}
                  aria-invalid={Boolean(problem)}
                  className={`w-full rounded-lg border px-2.5 py-1.5 text-xs font-semibold text-zinc-950 shadow-xs outline-none transition-colors focus:ring-2 focus:ring-zinc-950/15 sm:w-56 disabled:opacity-50 ${
                    problem
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-zinc-300 bg-white focus:border-zinc-950"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t border-zinc-100 pt-4">
          <label
            htmlFor="date-format"
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-700"
          >
            Format tanggal lahir
          </label>
          <select
            id="date-format"
            value={dateFormat}
            disabled={!hasTanggalLahir}
            onChange={(e) => onDateFormatChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-950 shadow-xs outline-none transition-colors focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/15 disabled:opacity-50 sm:w-64"
          >
            {DATE_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          {!hasTanggalLahir && (
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Centang kolom NIK_Tanggal Lahir untuk mengubah format ini.
            </p>
          )}
        </div>

        {Object.keys(problems).length > 0 && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <ul className="list-inside list-disc space-y-1 text-xs font-semibold text-red-700">
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
          className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-xs transition-colors hover:bg-zinc-100 disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Kembali
        </button>
        <button
          type="button"
          disabled={!canProcess}
          onClick={onProcess}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
        >
          {processing ? "Memproses…" : "Proses"}
        </button>
      </div>
    </div>
  );
}
