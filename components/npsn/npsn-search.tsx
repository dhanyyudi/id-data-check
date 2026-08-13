"use client";

import { useState, useRef, useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Search } from "lucide-react";
import { SegmentedInput, type Segment } from "@/components/ui";
import { NpsnResultCard } from "./npsn-result-card";

const NPSN_SEGMENTS: Segment[] = [
  { id: "npsn", label: "NPSN", maxLength: 8, type: "numeric", placeholder: "20104775" },
];

type Mode = "npsn" | "nama";

function mapRow(r: any) {
  return {
    npsn: r.npsn,
    nama: r.sekolah,
    jenjang: r.bentuk,
    status: r.status === "N" ? "Negeri" : r.status === "S" ? "Swasta" : r.status ?? "—",
    alamat: r.alamatJalan,
    kabupaten: r.kabupatenKota,
    provinsi: r.propinsi,
    kecamatan: r.kecamatan,
    lintang: r.lintang,
    bujur: r.bujur,
  };
}

export function NpsnSearch() {
  const [mode, setMode] = useState<Mode>("npsn");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const trpc = useTRPC();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  useEffect(() => {
    setQuery("");
    setDebounced("");
  }, [mode]);

  const npsnEnabled = mode === "npsn" && debounced.length === 8;
  const npsnQ = useQuery(trpc.npsn.byNpsn.queryOptions(debounced, { enabled: npsnEnabled }));

  const namaEnabled = mode === "nama" && debounced.length >= 2;
  const namaQ = useQuery(trpc.npsn.search.queryOptions(debounced, { enabled: namaEnabled }));

  const loading =
    (mode === "npsn" && npsnQ.isLoading && npsnEnabled) ||
    (mode === "nama" && namaQ.isLoading && namaEnabled);

  const error =
    mode === "npsn"
      ? (npsnQ.error as any)?.message ?? ""
      : (namaQ.error as any)?.message ?? "";

  const results: any[] =
    mode === "npsn"
      ? npsnQ.data ? [npsnQ.data] : []
      : namaQ.data ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Input Box */}
      <div className="border-2 border-border bg-card p-3.5 sm:p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
            Pencarian Sekolah
          </label>

          {/* Mode Switcher */}
          <div className="flex gap-1 bg-muted p-0.5 sm:p-1 border-2 border-border">
            <button
              type="button"
              onClick={() => setMode("npsn")}
              className={`px-2 py-1 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold transition-all border-2 ${
                mode === "npsn"
                  ? "border-border bg-primary text-primary-foreground shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              8 Digit NPSN
            </button>
            <button
              type="button"
              onClick={() => setMode("nama")}
              className={`px-2 py-1 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold transition-all border-2 ${
                mode === "nama"
                  ? "border-border bg-primary text-primary-foreground shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Nama Sekolah
            </button>
          </div>
        </div>

        {mode === "npsn" ? (
          <SegmentedInput segments={NPSN_SEGMENTS} value={query} onChange={setQuery} />
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama sekolah (contoh: SMAN 1 Bandung)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="min-h-[12rem]">
        {loading && (
          <div className="animate-pulse border-2 border-border bg-card p-4 space-y-3 shadow-md">
            <div className="h-4 w-32 bg-muted" />
            <div className="h-16 bg-muted" />
          </div>
        )}

        {error && !loading && (
          <div className="border-2 border-destructive bg-destructive/10 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-destructive">{error}</p>
          </div>
        )}

        {results.length > 0 && !error && !loading && (
          <div className="space-y-2.5 sm:space-y-3">
            {results.map((r) => (
              <NpsnResultCard key={r.npsn} data={mapRow(r)} />
            ))}
          </div>
        )}

        {query.length < 2 && !loading && results.length === 0 && (
          <div className="border-2 border-dashed border-border bg-card p-6 sm:p-8 text-center shadow-md">
            <div className="mx-auto flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border-2 border-border bg-primary text-primary-foreground mb-2 sm:mb-3 shadow-xs">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground">Menunggu Input Sekolah</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Cari data sekolah berdasarkan 8 digit kode NPSN atau nama sekolah di atas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
