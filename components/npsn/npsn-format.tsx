import { Info } from "lucide-react";

export function NpsnFormat() {
  return (
    <section className="mt-8 sm:mt-10 border-2 border-border bg-card p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
        <h2 className="font-head text-xs sm:text-sm text-foreground uppercase">
          Mengenai Nomor Pokok Sekolah Nasional (NPSN)
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4 text-xs leading-relaxed text-muted-foreground">
        <p>
          NPSN adalah kode pengenal 8 digit unik yang diterbitkan oleh Pusat Data dan Teknologi Informasi (Pusdatin) Kemendikbudristek untuk seluruh satuan pendidikan aktif di Indonesia.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
          <div className="border-2 border-border bg-muted/40 p-3 text-center">
            <span className="font-mono text-base sm:text-lg font-bold text-foreground block">213.000+</span>
            <span className="text-[11px] font-semibold text-foreground mt-0.5 block">Sekolah Terdaftar</span>
          </div>
          <div className="border-2 border-border bg-muted/40 p-3 text-center">
            <span className="font-mono text-base sm:text-lg font-bold text-foreground block">8 Digit</span>
            <span className="text-[11px] font-semibold text-foreground mt-0.5 block">Nomor Unik Permanen</span>
          </div>
          <div className="border-2 border-border bg-muted/40 p-3 text-center">
            <span className="font-mono text-base sm:text-lg font-bold text-foreground block">Semua Jenjang</span>
            <span className="text-[11px] font-semibold text-foreground mt-0.5 block">PAUD s/d SMA / SMK</span>
          </div>
        </div>
      </div>
    </section>
  );
}
