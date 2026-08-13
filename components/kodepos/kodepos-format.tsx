"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const KODEPOS_SPEC = [
  {
    id: "wil",
    label: "Wilayah Pos Utama",
    digits: "Digit 1",
    sample: "4",
    description: "Digit pertama menentukan zona pos geografis utama di Indonesia (wilayah 1–9).",
  },
  {
    id: "kab",
    label: "Kabupaten / Kota",
    digits: "Digit 2–3",
    sample: "01",
    description: "Menunjukkan kode unik kabupaten atau kota di dalam zona pos utama.",
  },
  {
    id: "kec",
    label: "Kecamatan",
    digits: "Digit 4",
    sample: "1",
    description: "Kode kecamatan di dalam wilayah kabupaten/kota tersebut.",
  },
  {
    id: "kel",
    label: "Kelurahan / Desa",
    digits: "Digit 5",
    sample: "5",
    description: "Kode kelurahan atau desa paling spesifik di tujuan lokasi pengiriman.",
  },
] as const;

export function KodeposFormat() {
  const [activeSegment, setActiveSegment] = useState<string>("wil");
  const selectedSpec = KODEPOS_SPEC.find((s) => s.id === activeSegment) || KODEPOS_SPEC[0];

  return (
    <section className="mt-8 sm:mt-10 border-2 border-border bg-card p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
        <h2 className="font-head text-xs sm:text-sm text-foreground uppercase">
          Struktur Hierarki 5 Digit Kode Pos
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-2 border-border bg-muted/50 p-2.5 sm:p-3">
        {KODEPOS_SPEC.map((spec) => {
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
