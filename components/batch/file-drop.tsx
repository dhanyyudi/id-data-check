"use client";

import { useRef, useState } from "react";
import { FileUp, ShieldCheck, Upload } from "lucide-react";

interface Props {
  onFile: (file: File) => void;
  onError: (message: string) => void;
  busy?: boolean;
}

export function FileDrop({ onFile, onError, busy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const accept = (file: File | undefined | null) => {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      onError(
        "Berkas harus berformat .csv. Simpan berkas lain sebagai CSV dari Sheets atau Excel, lalu coba lagi."
      );
      return;
    }
    onFile(file);
  };

  const loadExample = async () => {
    try {
      const res = await fetch("/contoh-nik.csv");
      if (!res.ok) throw new Error("Gagal mengunduh berkas contoh.");
      const text = await res.text();
      const file = new File([text], "contoh-nik.csv", {
        type: "text/csv;charset=utf-8",
      });
      onFile(file);
    } catch {
      onError("Gagal memuat berkas contoh. Coba muat ulang halaman.");
    }
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Pilih atau seret berkas CSV"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-card p-8 text-center shadow-md transition-all sm:p-10 ${
          dragging
            ? "border-border bg-muted/50"
            : "border-border hover:bg-muted/30"
        }`}
      >
        <div className="grid h-11 w-11 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-bold text-foreground">
          Seret berkas CSV ke sini, atau klik untuk memilih
        </p>
        <p className="text-xs text-muted-foreground">
          Berkas .csv (maks. 20 MB), diproses sepenuhnya di browser.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            accept(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 border-2 border-border bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          <FileUp className="h-4 w-4" />
          Pilih Berkas CSV
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={loadExample}
          className="inline-flex h-11 items-center text-xs font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:opacity-50"
        >
          Coba berkas contoh →
        </button>
      </div>

      <div className="flex items-start gap-2 border-2 border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
        <span>
          <strong className="font-bold text-foreground">Berkas diproses di browser kamu.</strong>{" "}
          Tidak ada yang diunggah ke server.
        </span>
      </div>
    </div>
  );
}
