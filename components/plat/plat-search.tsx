"use client";

import { useState, useRef, useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Car } from "lucide-react";
import { PlatResultCard } from "./plat-result-card";

const VALID = /^[A-Z]{1,2}$|^[A-Z]{1,2} \d{1,4}$|^[A-Z]{1,2} \d{1,4} [A-Z]{1,3}$/;

export function PlatSearch() {
  const [raw, setRaw] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const trpc = useTRPC();

  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(raw), 400);
    return () => clearTimeout(timerRef.current);
  }, [raw]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const ch = e.key;
    if (ch.length !== 1) return;

    const parts = raw.split(" ");
    const kode = parts[0] || "";
    const angka = parts[1] || "";
    const seri = parts[2] || "";
    const spaces = parts.length - 1;
    const active = spaces === 0 ? "kode" : spaces === 1 ? "angka" : "seri";

    if (ch === " ") {
      if (spaces >= 2) { e.preventDefault(); return; }
      if (active === "kode" && kode.length === 0) { e.preventDefault(); return; }
      if (active === "angka" && angka.length === 0) { e.preventDefault(); return; }
      return;
    }

    const isLetter = /^[A-Za-z]$/.test(ch);
    const isDigit = /^[0-9]$/.test(ch);
    if (!isLetter && !isDigit) { e.preventDefault(); return; }

    if (active === "kode" && kode.length === 2 && isDigit) {
      e.preventDefault();
      setRaw(raw + " " + ch.toUpperCase());
      return;
    }

    if (active === "angka" && angka.length === 4 && isLetter) {
      e.preventDefault();
      setRaw(raw + " " + ch.toUpperCase());
      return;
    }

    if (active === "kode" && kode.length >= 2) { e.preventDefault(); return; }
    if (active === "angka" && angka.length >= 4) { e.preventDefault(); return; }
    if (active === "seri" && seri.length >= 3) { e.preventDefault(); return; }

    if (active === "kode" && !isLetter) { e.preventDefault(); return; }
    if (active === "angka" && !isDigit) { e.preventDefault(); return; }
    if (active === "seri" && !isLetter) { e.preventDefault(); return; }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRaw(e.target.value.toUpperCase());
  }

  const valid = VALID.test(debounced);
  const showErr = debounced.length >= 3 && !valid;
  const enabled = debounced.length >= 1 && valid;

  const q = useQuery(trpc.plat.read.queryOptions(debounced, { enabled }));
  const loading = q.isLoading && enabled;
  const apiError = (q.error as any)?.message ?? "";
  const data = q.data
    ? {
        kode: q.data.kode,
        wilayah: q.data.wilayah,
        polda: q.data.polda,
        pulau: q.data.pulau,
        subWilayah: q.data.subWilayah,
        jenisKendaraan: q.data.jenisKendaraan,
        nopol: debounced.includes(" ") ? debounced : undefined,
      }
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="border-2 border-border bg-card p-3.5 sm:p-6 shadow-md space-y-3">
        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground block">
          Ketik Kode Plat Nomor
        </label>
        <input
          type="text"
          placeholder="Contoh: B 1234 UXX atau BK"
          value={raw}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="w-full font-mono text-base sm:text-lg tracking-wider px-3.5 py-2.5 sm:py-3 border-2 border-border bg-card text-foreground text-center placeholder:font-sans placeholder:text-xs placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
        <p className="text-[11px] sm:text-xs text-muted-foreground text-center">
          Ketik kode wilayah (contoh: B atau D), angka registrasi, dan seri akhir (contoh: UXX) untuk membaca kota/kabupaten spesifik.
        </p>
      </div>

      {showErr && (
        <p className="text-xs font-semibold text-destructive text-center">
          Format tidak valid: Harus diawali 1–2 huruf kode wilayah (contoh: B, D, BK)
        </p>
      )}

      <div className="min-h-[12rem]">
        {loading && (
          <div className="animate-pulse border-2 border-border bg-card p-4 space-y-3 shadow-md">
            <div className="h-4 w-32 bg-muted" />
            <div className="h-16 bg-muted" />
          </div>
        )}

        {apiError && (
          <div className="border-2 border-destructive bg-destructive/10 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-destructive">{apiError}</p>
          </div>
        )}

        {data && valid && !loading && !apiError && <PlatResultCard data={data} />}

        {!raw && !loading && !data && (
          <div className="border-2 border-dashed border-border bg-card p-6 sm:p-8 text-center shadow-md">
            <div className="mx-auto flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border-2 border-border bg-primary text-primary-foreground mb-2 sm:mb-3 shadow-xs">
              <Car className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground">Menunggu Input Kode Plat</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Ketik plat kendaraan (misal `B 1234 UXX` atau `D 1234 AF`) untuk membaca sub-wilayah kota/kabupaten dan jenis kendaraan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
