"use client";

import { useState, useEffect, useMemo, type ComponentProps } from "react";
import { FileText, RotateCcw } from "lucide-react";
import { SegmentedInput, type Segment } from "@/components/ui";
import { NikResultCard } from "@/components/nik";
import { loadNikParser, type NikParser } from "@/lib/nik/parse-client";

type CardData = ComponentProps<typeof NikResultCard>["data"];

const SEGMENTS: Segment[] = [
  { id: "prov", label: "Provinsi", maxLength: 2, type: "numeric", placeholder: "32" },
  { id: "kab", label: "Kab/Kota", maxLength: 2, type: "numeric", placeholder: "04" },
  { id: "kec", label: "Kecamatan", maxLength: 2, type: "numeric", placeholder: "21" },
  { id: "tgl", label: "Tgl Lahir", maxLength: 6, type: "numeric", placeholder: "450190" },
  { id: "urut", label: "No. Urut", maxLength: 4, type: "numeric", placeholder: "0001" },
];

const TOTAL_LENGTH = 16;

const LOAD_ERROR_MSG =
  "Gagal memuat data wilayah. Periksa koneksi internet kamu, lalu coba lagi.";

export function NikSearch() {
  const [query, setQuery] = useState("");
  const [parser, setParser] = useState<NikParser | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadNikParser()
      .then((p) => {
        if (!cancelled) setParser(() => p);
      })
      .catch(() => {
        if (!cancelled) setLoadError(LOAD_ERROR_MSG);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const retry = () => {
    setParser(null);
    setLoadError("");
    loadNikParser()
      .then((p) => setParser(() => p))
      .catch(() => setLoadError(LOAD_ERROR_MSG));
  };

  const parsed = useMemo(() => {
    if (query.length >= 2 && parser) {
      try {
        return {
          data: parser(query) as unknown as CardData,
          error: "",
        };
      } catch (e) {
        return {
          data: null as CardData | null,
          error: e instanceof Error ? e.message : "Gagal membaca NIK",
        };
      }
    }
    return { data: null as CardData | null, error: "" };
  }, [query, parser]);

  const data = parsed.data;
  const error = parsed.error;

  const loading = !parser && !loadError;
  const isFull = query.length >= TOTAL_LENGTH;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Input Box */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-3.5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700">
            Ketik NIK 16 Digit
          </label>
          <span
            className={`font-mono text-[11px] sm:text-xs font-bold tabular ${
              isFull ? "text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300" : "text-zinc-500"
            }`}
          >
            {query.length}/{TOTAL_LENGTH}
          </span>
        </div>

        <SegmentedInput segments={SEGMENTS} value={query} onChange={setQuery} />

        <p className="mt-3 text-[11px] sm:text-xs text-zinc-500">
          Tempel atau ketik NIK. Hasil provinsi, kota, dan tanggal lahir dibaca secara langsung di browser kamu.
        </p>
      </div>

      {/* Result Container */}
      <div className="min-h-[12rem]">
        {loading && (
          <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-xs">
            <div className="h-4 w-32 rounded bg-zinc-200" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-14 rounded-xl bg-zinc-100" />
              <div className="h-14 rounded-xl bg-zinc-100" />
            </div>
          </div>
        )}

        {loadError && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-700 shadow-xs transition-colors hover:bg-red-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Coba Lagi
            </button>
          </div>
        )}

        {error && !loading && !loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {query.length >= 2 && data && !error && !loading && !loadError && (
          <NikResultCard data={data} segments={SEGMENTS} value={query} />
        )}

        {query.length < 2 && !loading && !loadError && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 sm:p-8 text-center shadow-xs">
            <div className="mx-auto flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-950 text-white mb-2 sm:mb-3 shadow-xs">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-zinc-950">Menunggu Input NIK</p>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
              Ketik minimal 2 digit NIK di atas untuk mulai membaca detail data wilayah.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
