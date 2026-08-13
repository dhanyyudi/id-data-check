import type { Metadata } from "next";
import Link from "next/link";
import { FileSpreadsheet } from "lucide-react";
import { NikSearch } from "@/components/nik/nik-search";
import { NikFormat } from "@/components/nik/nik-format";
import { PageShell } from "@/components/layout/page-shell";
import { FaqSection } from "@/components/ui/faq-section";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Baca NIK Online: Cek Tanggal Lahir dan Kode Wilayah KTP",
  description:
    "Cek NIK online gratis. Masukkan 16 digit NIK KTP untuk melihat provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir secara otomatis.",
  keywords: [
    "cek NIK online",
    "baca NIK",
    "cek tanggal lahir dari NIK",
    "arti 16 digit NIK",
    "cek NIK KTP",
    "kode wilayah NIK",
  ],
  alternates: {
    canonical: `${SITE_URL}/nik`,
  },
  openGraph: {
    title: "Baca NIK Online: Cek Tanggal Lahir dan Detail KTP",
    description:
      "Baca 16 digit NIK KTP secara gratis. Tampilkan provinsi, kota, kecamatan, jenis kelamin, dan tanggal lahir.",
    url: `${SITE_URL}/nik`,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
  },
};

const faqItems = [
  {
    question: "Bagaimana cara cek NIK online?",
    answer:
      "Ketik 16 digit NIK pada kolom input di atas. Detail seperti provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir langsung ditampilkan secara otomatis.",
  },
  {
    question: "Apakah NIK yang saya masukkan disimpan?",
    answer:
      "Tidak. Proses pembacaan NIK berjalan langsung di browser kamu. NIK tidak pernah dikirim ke server dan tidak disimpan di mana pun.",
  },
  {
    question: "Punya banyak NIK sekaligus?",
    answer:
      "Gunakan halaman Batch NIK untuk mengolah ratusan NIK dari satu berkas CSV sekaligus: pilih kolom NIK, pilih kolom hasil, lalu unduh CSV hasilnya. Seluruhnya juga diproses di browser kamu.",
  },
  {
    question: "Apa saja yang bisa dilihat dari sebuah NIK?",
    answer:
      "NIK memuat kode wilayah (provinsi, kabupaten/kota, kecamatan), tanggal lahir, jenis kelamin (ditambah 40 untuk perempuan), dan nomor urut pendaftaran.",
  },
  {
    question: "Apakah bisa cek nama atau alamat lengkap dari NIK?",
    answer:
      "Tidak. NIK tidak memuat nama, alamat jalan, atau nomor telepon. Pencocokan identitas resmi hanya bisa dilakukan via Dukcapil.",
  },
];

export default function NikPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageShell
        breadcrumb="Pembaca NIK"
        subtitle="Nomor Induk Kependudukan"
        title="Baca dan Periksa NIK"
        description="Masukkan 16 digit NIK untuk membaca provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir."
      >
        <NikSearch />
        <Link
          href="/batch"
          className="mt-4 flex items-center gap-3 border-2 border-border bg-card p-4 shadow-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground">
              Punya banyak NIK sekaligus?
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Olah ratusan NIK dari satu berkas CSV lewat Batch NIK. Semuanya tetap di browser kamu.
            </p>
          </div>
        </Link>
        <NikFormat />
        <FaqSection title="Pertanyaan yang sering ditanyakan" items={faqItems} />
      </PageShell>
    </>
  );
}
