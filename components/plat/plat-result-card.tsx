"use client";

import { useState } from "react";
import { Car, Copy, Check, MapPin } from "lucide-react";

interface PlatData {
  kode: string;
  wilayah: string;
  polda: string;
  pulau: string;
  subWilayah?: string;
  jenisKendaraan?: string;
  nopol?: string;
}

export function PlatResultCard({ data }: { data: PlatData }) {
  const [copied, setCopied] = useState(false);

  const fullWilayahText = data.subWilayah
    ? `${data.wilayah} (${data.subWilayah})`
    : data.wilayah;

  const handleCopy = () => {
    const text = `Plat: ${data.nopol || data.kode}\nKode: ${data.kode}\nWilayah: ${fullWilayahText}\nPolda: ${data.polda}\nJenis: ${data.jenisKendaraan || "-"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in overflow-hidden border-2 border-border bg-card shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-border bg-muted/50 px-3.5 py-2.5 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 sm:h-8 sm:w-8 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
            <Car className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground">
            Detail Plat Kendaraan
          </span>
          <span className="font-mono text-[11px] sm:text-xs font-bold text-foreground bg-card px-2 py-0.5 border-2 border-border shadow-xs">
            Kode: {data.kode}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 items-center gap-1 border-2 border-border bg-card px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-foreground shadow-xs transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none shrink-0"
        >
          {copied ? <Check className="h-3 w-3 text-foreground" /> : <Copy className="h-3 w-3 text-foreground" />}
          <span>{copied ? "Tersalin" : "Salin Data"}</span>
        </button>
      </div>

      <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        {/* Nopol Graphic Badge */}
        {data.nopol && (
          <div className="mx-auto max-w-[220px] sm:max-w-[260px] border-2 border-border bg-primary px-3 py-2 text-center shadow-xs">
            <span className="font-mono text-lg sm:text-xl font-bold tracking-[0.2em] text-primary-foreground">
              {data.nopol}
            </span>
          </div>
        )}

        {/* Grid Details */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Main Region */}
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Wilayah Karesidenan</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.wilayah}</span>
          </div>

          {/* Sub Region (Kota/Kab) Highlighted */}
          <div className="border-2 border-border bg-muted/40 p-3">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-foreground" />
                Sub-Wilayah (Kota / Kab Spesifik)
              </span>
            </div>
            <span className="font-bold text-xs sm:text-sm text-foreground">
              {data.subWilayah ? (
                <span>{data.subWilayah}</span>
              ) : (
                <span className="text-muted-foreground font-normal text-xs">
                  Ketik huruf akhir plat (contoh: ALW) untuk deteksi
                </span>
              )}
            </span>
          </div>

          {/* Vehicle Type */}
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Jenis Kendaraan</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">
              {data.jenisKendaraan ? data.jenisKendaraan : "—"}
            </span>
          </div>

          {/* Police Dept */}
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Kepolisian Daerah</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.polda} ({data.pulau})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
