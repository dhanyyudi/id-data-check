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
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-950 mb-4">
            <Zap className="h-3.5 w-3.5 text-zinc-950" />
            <span>Kumpulan alat baca data wilayah Indonesia</span>
          </div>

          <h1 className="text-[2.25rem] leading-tight sm:text-[3.25rem] font-black tracking-tight text-zinc-950">
            {siteWords.join(" ")}{" "}
            <span className="underline decoration-zinc-300 underline-offset-8">{siteLastWord}</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 max-w-2xl">
            Platform untuk membaca Nomor Induk Kependudukan (NIK) satu per satu atau massal dari berkas CSV, serta kode plat nomor kendaraan.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <Link
              href="/nik"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95"
            >
              <span>Coba Cek NIK</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/batch"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-xs transition-colors hover:bg-zinc-100"
            >
              <FileSpreadsheet className="h-4 w-4 text-zinc-950" />
              <span>Coba Batch NIK</span>
            </Link>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mt-10 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs text-center">
            {stats.map((s) => (
              <div key={s.label} className="p-2">
                <div className="text-xl sm:text-2xl font-black font-mono tracking-tight tabular text-zinc-950">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-600 mt-0.5 font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="mt-10 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <h2 className="text-base font-bold tracking-tight text-zinc-950 mb-3">
            Pilih Modul Pembaca
          </h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-950 hover:bg-zinc-50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white shadow-xs">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-950 border border-zinc-300">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-zinc-950 flex items-center justify-between">
                    <span>{f.title}</span>
                    <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-950" />
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-600">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-xs font-mono">
                  <span className="text-zinc-500 font-sans text-[11px]">Contoh:</span>
                  <span className="text-zinc-950 font-bold tabular">{f.example}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Developer API Info Box */}
        <section className="mt-10 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <div className="rounded-2xl border border-zinc-300 bg-zinc-100/70 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Database className="h-4 w-4 text-zinc-950" />
              <h2 className="text-sm font-bold text-zinc-950">REST API dan Integrasi</h2>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Pembacaan NIK juga tersedia sebagai REST API:
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono font-bold">
              <span className="bg-white text-zinc-950 px-2.5 py-1 rounded-md border border-zinc-300 shadow-xs">POST /api/v1/nik</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
