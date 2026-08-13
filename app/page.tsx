import type { Metadata } from "next";
import Link from "next/link";
import { IdCard, Car, FileSpreadsheet, ArrowRight, Database, Zap } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME}: Pembaca dan Validasi Data Identitas Indonesia`,
  description:
    "Aplikasi web terbuka untuk membaca 16 digit NIK (satuan atau massal dari CSV) dan kode plat nomor kendaraan Indonesia.",
  keywords: [
    "cek NIK",
    "pembaca NIK",
    "baca NIK",
    "olah NIK massal",
    "batch NIK",
    "csv nik",
    "plat nomor",
    "cek plat nomor",
    "kode plat nomor",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME}: Pembaca Data Identitas Indonesia`,
    description:
      "Aplikasi web terbuka untuk membaca NIK (satuan atau massal dari CSV) dan kode plat nomor kendaraan Indonesia.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
  },
};

const features = [
  {
    href: "/nik",
    icon: IdCard,
    title: "Pembaca NIK",
    desc: "Baca 16 digit NIK KTP: Provinsi, Kabupaten/Kota, Kecamatan, Jenis Kelamin, dan Tanggal Lahir.",
    example: "3204214501900001",
    badge: "16 Digit NIK",
  },
  {
    href: "/batch",
    icon: FileSpreadsheet,
    title: "Batch NIK",
    desc: "Olah ratusan NIK dari satu berkas CSV sekaligus. Hasilnya bisa diunduh sebagai CSV atau disalin.",
    example: "contoh-nik.csv",
    badge: "Olah Massal CSV",
  },
  {
    href: "/plat",
    icon: Car,
    title: "Plat Nomor",
    desc: "Cek kode plat kendaraan: Wilayah pendaftaran, Polda, dan pulau dari 61 kode plat.",
    example: "B 1234 XYZ",
    badge: "61 Kode Plat",
  },
];

const stats = [
  { value: "38", label: "Provinsi" },
  { value: "514", label: "Kabupaten/Kota" },
  { value: "7.265", label: "Kecamatan" },
  { value: "61", label: "Kode Plat Nomor" },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    description:
      "Satu alat untuk membaca NIK satuan dan massal dari CSV, serta kode plat nomor kendaraan Indonesia.",
  };

  const siteWords = SITE_NAME.split(" ");
  const siteLastWord = siteWords.pop() ?? "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero Section */}
        <section className="animate-fade-up text-center sm:text-left">
          <div className="inline-flex items-center gap-2 border-2 border-border bg-accent px-3 py-1 text-xs font-bold text-foreground mb-4">
            <Zap className="h-3.5 w-3.5 text-foreground" />
            <span>Kumpulan alat baca data wilayah Indonesia</span>
          </div>

          <h1 className="font-head text-[2.25rem] leading-tight sm:text-[3.25rem] text-foreground">
            {siteWords.join(" ")}{" "}
            <span className="underline decoration-primary underline-offset-8">{siteLastWord}</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            Platform untuk membaca Nomor Induk Kependudukan (NIK) satu per satu atau massal dari berkas CSV, serta kode plat nomor kendaraan.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <Link
              href="/nik"
              className="inline-flex items-center gap-2 border-2 border-border bg-primary px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <span>Coba Cek NIK</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/batch"
              className="inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-foreground shadow-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <FileSpreadsheet className="h-4 w-4 text-foreground" />
              <span>Coba Batch NIK</span>
            </Link>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mt-10 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 border-2 border-border bg-card p-4 shadow-md text-center">
            {stats.map((s) => (
              <div key={s.label} className="p-2">
                <div className="text-xl sm:text-2xl font-mono tracking-tight tabular text-foreground">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="mt-10 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <h2 className="font-head text-base text-foreground mb-3">
            Pilih Modul Pembaca
          </h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group flex flex-col justify-between border-2 border-border bg-card p-5 shadow-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="grid h-9 w-9 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-muted text-foreground border-2 border-border">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center justify-between">
                    <span>{f.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between bg-muted border-2 border-border px-3 py-1.5 text-xs font-mono">
                  <span className="text-muted-foreground font-sans text-[11px]">Contoh:</span>
                  <span className="text-foreground font-bold tabular">{f.example}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Developer API Info Box */}
        <section className="mt-10 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <div className="border-2 border-border bg-muted/50 p-5 shadow-md">
            <div className="flex items-center gap-2 mb-1.5">
              <Database className="h-4 w-4 text-foreground" />
              <h2 className="font-head text-sm text-foreground">REST API dan Integrasi</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pembacaan NIK juga tersedia sebagai REST API:
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono font-bold">
              <span className="bg-card text-foreground px-2.5 py-1 border-2 border-border shadow-xs">POST /api/v1/nik</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
