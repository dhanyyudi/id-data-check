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
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white p-8 text-center shadow-xs transition-colors sm:p-10 ${
          dragging
            ? "border-zinc-950 bg-zinc-50"
            : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
        }`}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-950 text-white shadow-xs">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-bold text-zinc-950">
          Seret berkas CSV ke sini, atau klik untuk memilih
        </p>
        <p className="text-xs text-zinc-500">
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
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
        >
          <FileUp className="h-4 w-4" />
          Pilih Berkas CSV
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={loadExample}
          className="text-xs font-semibold text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline disabled:opacity-50"
        >
          Coba berkas contoh →
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-100/70 px-3 py-2.5 text-xs text-zinc-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-950" />
        <span>
          <strong className="font-bold text-zinc-950">Berkas diproses di browser kamu.</strong>{" "}
          Tidak ada yang diunggah ke server.
        </span>
      </div>
    </div>
  );
}
