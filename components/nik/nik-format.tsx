"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const NIK_SPEC = [
  {
    id: "prov",
    label: "Provinsi",
    digits: "Digit 1–2",
    sample: "32",
    description: "Kode unik provinsi sesuai standar Kependudukan BPS/Kemendagri.",
  },
  {
    id: "kab",
    label: "Kabupaten / Kota",
    digits: "Digit 3–4",
    sample: "04",
    description: "Kode unik kabupaten (dimulai dari 01) atau kota (dimulai dari 71).",
  },
  {
    id: "kec",
    label: "Kecamatan",
    digits: "Digit 5–6",
    sample: "21",
    description: "Kode unik kecamatan di dalam wilayah kabupaten/kota tersebut.",
  },
  {
    id: "tgl",
    label: "Tanggal Lahir",
    digits: "Digit 7–12",
    sample: "450190",
    description: "Format DDMMYY. Untuk perempuan, tanggal lahir ditambah 40 (contoh: tgl 5 menjadi 45).",
  },
  {
    id: "urut",
    label: "Nomor Urut",
    digits: "Digit 13–16",
    sample: "0001",
    description: "Nomor urut penerbitan NIK pada tanggal lahir yang sama (dimulai dari 0001).",
  },
] as const;

export function NikFormat() {
  const [activeSegment, setActiveSegment] = useState<string>("prov");
  const selectedSpec = NIK_SPEC.find((s) => s.id === activeSegment) || NIK_SPEC[0];

  return (
    <section className="mt-8 sm:mt-10 border-2 border-border bg-card p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
        <h2 className="font-head text-xs sm:text-sm text-foreground uppercase">
          Struktur Segmen 16 Digit NIK
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-2 border-border bg-muted/50 p-2.5 sm:p-3">
        {NIK_SPEC.map((spec) => {
          const isActive = activeSegment === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => setActiveSegment(spec.id)}
              className={`flex flex-col items-center px-3 py-1.5 sm:px-4 sm:py-2 text-center transition-all border-2 ${
                isActive
                  ? "border-border bg-primary text-primary-foreground shadow-xs"
                  : "border-transparent bg-card text-foreground hover:bg-muted"
              }`}
            >
              <span className="font-mono text-sm sm:text-base font-bold tabular tracking-wider">
                {spec.sample}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 ${isActive ? "text-foreground/70" : "text-muted-foreground"}`}>
                {spec.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4 border-2 border-border bg-muted/40 p-3.5 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">{selectedSpec.label}</span>
          <span className="font-mono text-[11px] sm:text-xs font-bold text-foreground bg-card px-2 py-0.5 border-2 border-border">
            {selectedSpec.digits}
          </span>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-muted-foreground">
          {selectedSpec.description}
        </p>
      </div>
    </section>
  );
}
