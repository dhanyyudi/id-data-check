"use client";

import { useState } from "react";
import { Check, Copy, ShieldCheck, Terminal } from "lucide-react";
import type { Segment } from "@/components/ui/segmented-input";

interface NikData {
  provinsi: string | null;
  kabupaten: string | null;
  kecamatan: string | null;
  jenis_kelamin: string;
  tanggal_lahir: string;
  nomor_urut: string;
}

interface Props {
  data: NikData;
  segments: Segment[];
  value: string;
}

const SEGMENT_RESULT_MAP: Record<string, { key: keyof NikData; label: string }> = {
  prov: { key: "provinsi", label: "Provinsi" },
  kab: { key: "kabupaten", label: "Kabupaten / Kota" },
  kec: { key: "kecamatan", label: "Kecamatan" },
  tgl: { key: "tanggal_lahir", label: "Tanggal Lahir" },
  urut: { key: "nomor_urut", label: "Nomor Urut" },
};

export function NikResultCard({ data, segments, value }: Props) {
  const [copied, setCopied] = useState(false);

  const segValues: string[] = [];
  let offset = 0;
  for (const seg of segments) {
    segValues.push(value.slice(offset, offset + seg.maxLength));
    offset += seg.maxLength;
  }

  const genderLabel =
    data.jenis_kelamin === "PEREMPUAN"
      ? "Perempuan"
      : data.jenis_kelamin === "LAKI-LAKI"
        ? "Laki-laki"
        : "—";

  const handleCopyJson = () => {
    const jsonOutput = JSON.stringify(
      {
        nik: value,
        provinsi: data.provinsi,
        kabupaten: data.kabupaten,
        kecamatan: data.kecamatan,
        jenisKelamin: genderLabel,
        tanggalLahir: data.tanggal_lahir,
        nomorUrut: data.nomor_urut,
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isComplete = value.length >= 16;

  return (
    <div className="animate-fade-in overflow-hidden border-2 border-border bg-card shadow-md">
      {/* Inspector Header */}
      <div className="flex items-center justify-between border-b-2 border-border bg-muted/50 px-3.5 py-2.5 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 sm:h-8 sm:w-8 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
            <Terminal className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
            Pemeriksa NIK
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1 bg-card px-2 py-0.5 text-[10px] sm:text-xs font-bold text-foreground border-2 border-border">
              <ShieldCheck className="h-3 w-3 text-foreground" />
              <span className="hidden sm:inline">16 Digit Tervalidasi</span>
              <span className="sm:hidden">16 Digit</span>
            </span>
          )}
        </div>

        {/* Compact Mobile Copy Button */}
        <button
          type="button"
          onClick={handleCopyJson}
          className="inline-flex items-center gap-1 sm:gap-1.5 border-2 border-border bg-card px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-foreground shadow-xs transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-foreground" />
              <span>Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-foreground" />
              <span>Salin JSON</span>
            </>
          )}
        </button>
      </div>

      {/* Grid Inspection View */}
      <div className="p-3.5 sm:p-5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {segments.map((seg, i) => {
            const mapping = SEGMENT_RESULT_MAP[seg.id];
            if (!mapping) return null;

            const rawVal = segValues[i] || "";
            const parsedVal = data[mapping.key];
            const displayVal = parsedVal ?? (rawVal ? "..." : "—");

            return (
              <div
                key={seg.id}
                className="flex flex-col justify-between border-2 border-border bg-background p-3 sm:p-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-muted-foreground">
                  <span>{mapping.label}</span>
                  <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground">
                    [{seg.maxLength}d]
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-xs sm:text-base font-bold text-foreground truncate">
                    {displayVal}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold tabular text-foreground bg-card px-1.5 py-0.5 border-2 border-border">
                    {rawVal || "—"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Gender Inspector Tile */}
          <div className="flex flex-col justify-between border-2 border-border bg-background p-3 sm:p-4 transition-colors hover:bg-muted/60">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-muted-foreground">
              <span>Jenis Kelamin</span>
              <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground">Digit 7-12</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <span className="text-xs sm:text-base font-bold text-foreground">
                {genderLabel}
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-foreground bg-card px-1.5 py-0.5 border-2 border-border">
                {data.jenis_kelamin === "PEREMPUAN"
                  ? "Tgl +40"
                  : data.jenis_kelamin === "LAKI-LAKI"
                    ? "Tgl Normal"
                    : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Raw NIK String Bar */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between border-2 border-border bg-muted/60 px-3 py-2 sm:px-4 sm:py-2.5 text-xs text-muted-foreground font-mono">
          <span className="font-bold text-muted-foreground text-[11px] sm:text-xs">Input Asli:</span>
          <span className="text-xs sm:text-base font-bold tracking-widest text-foreground tabular">
            {value || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
