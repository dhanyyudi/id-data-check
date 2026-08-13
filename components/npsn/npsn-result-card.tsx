"use client";

import { useState } from "react";
import { GraduationCap, Copy, Check } from "lucide-react";

interface SekolahData {
  npsn: string;
  nama: string;
  jenjang: string | null;
  status: string;
  alamat: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  kecamatan: string | null;
  lintang?: number | null;
  bujur?: number | null;
}

export function NpsnResultCard({ data }: { data: SekolahData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `NPSN: ${data.npsn}\nNama Sekolah: ${data.nama}\nJenjang: ${data.jenjang}\nStatus: ${data.status}\nAlamat: ${data.alamat ?? "-"}\nWilayah: ${data.kecamatan}, ${data.kabupaten}, ${data.provinsi}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in overflow-hidden border-2 border-border bg-card shadow-md">
      <div className="flex items-center justify-between border-b-2 border-border bg-muted/50 px-3.5 py-2.5 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-6 w-6 sm:h-8 sm:w-8 shrink-0 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground truncate">
            Detail Sekolah
          </span>
          <span className="font-mono text-[11px] sm:text-xs font-bold text-foreground bg-card px-2 py-0.5 border-2 border-border shadow-xs tabular shrink-0">
            NPSN: {data.npsn}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 border-2 border-border bg-card px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-foreground shadow-xs transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none shrink-0"
        >
          {copied ? <Check className="h-3 w-3 text-foreground" /> : <Copy className="h-3 w-3 text-foreground" />}
          <span>{copied ? "Tersalin" : "Salin Data"}</span>
        </button>
      </div>

      <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">{data.nama}</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {data.alamat ? `${data.alamat}, ` : ""}{data.kecamatan}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Jenjang</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.jenjang ?? "—"}</span>
          </div>
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Status</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.status}</span>
          </div>
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Kabupaten / Kota</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.kabupaten ?? "—"}</span>
          </div>
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Provinsi</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.provinsi ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
