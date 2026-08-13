"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const PLAT_SPEC = [
  {
    id: "kode",
    label: "Kode Wilayah",
    sample: "B",
    description: "1–2 huruf pertama yang mengidentifikasi wilayah kepolisian pendaftaran kendaraan.",
  },
  {
    id: "no",
    label: "Nomor Registrasi",
    sample: "1234",
    description: "1–4 digit angka nomor registrasi kendaraan.",
  },
  {
    id: "seri",
    label: "Kode Seri Sub-Wilayah",
    sample: "XYZ",
    description: "1–3 huruf seri belakang yang menentukan sub-wilayah kabupaten/kota dan jenis kendaraan.",
  },
] as const;

export function PlatFormat() {
  const [activeSegment, setActiveSegment] = useState<string>("kode");
  const selectedSpec = PLAT_SPEC.find((s) => s.id === activeSegment) || PLAT_SPEC[0];

  return (
    <section className="mt-8 sm:mt-10 border-2 border-border bg-card p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
        <h2 className="font-head text-xs sm:text-sm text-foreground uppercase">
          Anatomi Kode Plat Nomor Kendaraan
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-2 border-border bg-muted/50 p-2.5 sm:p-3">
        {PLAT_SPEC.map((spec) => {
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
            Contoh: {selectedSpec.sample}
          </span>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-muted-foreground">
          {selectedSpec.description}
        </p>
      </div>
    </section>
  );
}
