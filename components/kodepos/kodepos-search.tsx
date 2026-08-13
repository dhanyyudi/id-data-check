"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import { SegmentedInput, type Segment } from "@/components/ui";
import { KodeposResultCard } from "@/components/kodepos/kodepos-result-card";

const LeafletMap = dynamic(
  () => import("@/components/kodepos/leaflet-map").then((m) => m.LeafletMap),
  { ssr: false }
);

const SEGMENTS: Segment[] = [
  { id: "wil", label: "Wilayah", maxLength: 1, type: "numeric", placeholder: "4" },
  { id: "kab", label: "Kab/Kota", maxLength: 2, type: "numeric", placeholder: "01" },
  { id: "kec", label: "Kecamatan", maxLength: 1, type: "numeric", placeholder: "1" },
  { id: "kel", label: "Kelurahan", maxLength: 1, type: "numeric", placeholder: "5" },
];

type SearchMode = "code" | "name";

export function KodeposSearch() {
  const [mode, setMode] = useState<SearchMode>("code");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const trpc = useTRPC();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebounced(query);
      setExpandedIndex(null);
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  useEffect(() => {
    setQuery("");
    setDebounced("");
    setExpandedIndex(null);
  }, [mode]);

  const isCodeMode = mode === "code";
  const codeEnabled = isCodeMode && debounced.length === 5;
  const codeNum = Number.parseInt(debounced);
  const codeQ = useQuery(
    trpc.kodepos.byCode.queryOptions(codeNum, { enabled: codeEnabled && !Number.isNaN(codeNum) })
  );

  const isNameMode = mode === "name";
  const nameEnabled = isNameMode && debounced.trim().length >= 2;
  const nameQ = useQuery(
    trpc.kodepos.search.queryOptions(debounced.trim(), { enabled: nameEnabled })
  );

  const loading = (isCodeMode && codeQ.isLoading && codeEnabled) || (isNameMode && nameQ.isLoading && nameEnabled);
  const error = isCodeMode ? (codeQ.error as any)?.message ?? "" : (nameQ.error as any)?.message ?? "";

  const dataList = isCodeMode ? codeQ.data ?? [] : nameQ.data ?? [];
  const results = dataList.map((r) => ({
    kelurahan: r.village,
    kecamatan: r.district,
    kabupaten: r.regency,
    provinsi: r.province,
    kode_pos: r.code,
    latitude: r.latitude,
    longitude: r.longitude,
  }));

  const isFullCode = isCodeMode && query.length >= 5;

  return (
    <div className="space-y-6">
      <div className="border-2 border-border bg-card p-4 sm:p-6 shadow-md space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
            {isCodeMode ? "Pencarian 5 Digit Kode Pos" : "Pencarian Nama Daerah"}
          </label>

          <div className="flex gap-1 bg-muted p-1 border-2 border-border">
            <button
              type="button"
              onClick={() => setMode("code")}
              className={`px-3 py-3 text-[11px] sm:text-xs font-bold transition-all border-2 ${
                isCodeMode
                  ? "border-border bg-primary text-primary-foreground shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              5 Digit Angka
            </button>
            <button
              type="button"
              onClick={() => setMode("name")}
              className={`px-3 py-3 text-[11px] sm:text-xs font-bold transition-all border-2 ${
                isNameMode
                  ? "border-border bg-primary text-primary-foreground shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Nama Daerah
            </button>
          </div>
        </div>

        {isCodeMode ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Input Segmen Kode Pos</span>
              <span
                className={`font-mono text-[11px] sm:text-xs font-bold tabular ${
                  isFullCode ? "text-foreground bg-muted px-2 py-0.5 border-2 border-border" : "text-muted-foreground"
                }`}
              >
                {query.length}/5
              </span>
            </div>
            <SegmentedInput segments={SEGMENTS} value={query} onChange={setQuery} />
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ketik nama kelurahan, kecamatan, atau kota (contoh: Braga, Coblong, Bandung)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full min-h-11 text-xs sm:text-sm font-medium pl-9 pr-3.5 py-2.5 sm:py-3 border-2 border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        )}

        <p className="text-[11px] sm:text-xs text-muted-foreground">
          {isCodeMode
            ? "Masukkan 5 digit kode pos untuk mencari kelurahan dan lokasi peta."
            : "Ketik minimal 2 huruf nama kelurahan/kecamatan/kota untuk mencari kode posnya."}
        </p>
      </div>

      <div className="min-h-[14rem]">
        {loading && (
          <div className="animate-pulse border-2 border-border bg-card p-6 space-y-3 shadow-md">
            <div className="h-4 w-32 bg-muted" />
            <div className="h-20 bg-muted" />
          </div>
        )}

        {error && !loading && (
          <div className="border-2 border-destructive bg-destructive/10 p-4">
            <p className="text-xs sm:text-sm font-semibold text-destructive">{error}</p>
          </div>
        )}

        {results.length > 0 && !error && !loading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-muted-foreground px-1">
              <span>Ditemukan {results.length} lokasi</span>
              <span>Klik kartu untuk buka peta</span>
            </div>
            {results.map((r, i) => (
              <KodeposResultCard
                key={i}
                data={r}
                expanded={expandedIndex === i}
                onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
                MapComponent={LeafletMap}
              />
            ))}
          </div>
        )}

        {!query && !loading && results.length === 0 && (
          <div className="border-2 border-dashed border-border bg-card p-6 sm:p-8 text-center shadow-md">
            <div className="mx-auto flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center border-2 border-border bg-primary text-primary-foreground mb-2.5 sm:mb-3 shadow-xs">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground">Menunggu Input Pencarian</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {isCodeMode
                ? "Masukkan 5 digit kode pos di atas untuk mencari data lokasi kelurahan dan peta."
                : "Ketik nama kelurahan, kecamatan, atau kota untuk menemukan kode posnya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
