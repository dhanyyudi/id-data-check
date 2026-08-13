"use client";

import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp, Copy, Check, Navigation } from "lucide-react";

interface KodeposResult {
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: number;
  latitude: number | null;
  longitude: number | null;
}

export function KodeposResultCard({
  data,
  expanded,
  onToggle,
  MapComponent,
}: {
  data: KodeposResult;
  expanded: boolean;
  onToggle: () => void;
  MapComponent: React.ComponentType<{ lat: number; lng: number; name: string }>;
}) {
  const [copied, setCopied] = useState(false);
  const hasCoords = typeof data.latitude === "number" && typeof data.longitude === "number";

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${data.kelurahan}, ${data.kecamatan}, ${data.kabupaten}, ${data.provinsi} ${data.kode_pos}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in overflow-hidden border-2 border-border bg-card shadow-md">
      <div className="flex items-center justify-between border-b-2 border-border bg-muted/50 px-3.5 py-2.5 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-6 w-6 sm:h-8 sm:w-8 shrink-0 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground truncate">
            {data.kelurahan}
          </span>
          <span className="font-mono text-[11px] sm:text-xs font-bold tabular text-foreground bg-card px-2 py-0.5 border-2 border-border shadow-xs shrink-0">
            {data.kode_pos}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex min-h-11 items-center gap-1 border-2 border-border bg-card px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-foreground shadow-xs transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none"
            title="Salin Alamat"
          >
            {copied ? (
              <Check className="h-3 w-3 text-foreground" />
            ) : (
              <Copy className="h-3 w-3 text-foreground" />
            )}
            <span>{copied ? "Tersalin" : "Salin Alamat"}</span>
          </button>

          {hasCoords && (
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex h-11 w-11 items-center justify-center border-2 border-border bg-card p-1 sm:px-2 sm:py-1.5 text-[11px] sm:text-xs font-bold text-foreground hover:bg-muted"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      <div className="p-3.5 sm:p-5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Kecamatan</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.kecamatan}</span>
          </div>
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Kabupaten / Kota</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.kabupaten}</span>
          </div>
          <div className="border-2 border-border bg-background p-3">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Provinsi</span>
            <span className="font-bold text-xs sm:text-sm text-foreground">{data.provinsi}</span>
          </div>
        </div>

        {hasCoords && (
          <div className="mt-2.5 flex items-center justify-between border-2 border-border bg-muted/40 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-mono text-foreground">
            <span className="flex items-center gap-1 font-bold text-foreground">
              <Navigation className="h-3 w-3 text-foreground" />
              Koordinat:
            </span>
            <span className="font-bold text-foreground tabular">
              {data.latitude!.toFixed(6)}, {data.longitude!.toFixed(6)}
            </span>
          </div>
        )}

        {expanded && hasCoords && (
          <div className="mt-3 h-48 sm:h-56 w-full overflow-hidden border-2 border-border shadow-xs">
            <MapComponent lat={data.latitude!} lng={data.longitude!} name={data.kelurahan} />
          </div>
        )}
      </div>
    </div>
  );
}
