import type { Metadata } from "next";
import { BatchTool } from "@/components/batch";
import { PageShell } from "@/components/layout/page-shell";
import { FaqSection } from "@/components/ui/faq-section";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Batch NIK: Olah Ratusan NIK dari CSV Sekaligus",
  description:
    "Olah NIK massal dari berkas CSV langsung di browser: provinsi, kabupaten/kota, kecamatan, tanggal lahir, umur, jenis kelamin, dan status validitas. Tanpa unggah data.",
  keywords: [
    "olah nik massal",
    "konversi nik ke tanggal lahir",
    "csv nik",
    "batch nik",
    "validasi nik massal",
    "nik csv excel",
  ],
  alternates: {
    canonical: `${SITE_URL}/batch`,
  },
  openGraph: {
    title: "Batch NIK: Olah Ratusan NIK dari CSV Sekaligus",
    description:
      "Unggah CSV berisi NIK, pilih kolom, dan dapatkan provinsi, kabupaten/kota, kecamatan, tanggal lahir, umur, dan jenis kelamin. 100% di browser.",
    url: `${SITE_URL}/batch`,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
  },
};

const faqItems = [
  {
    question: "Apakah berkas CSV saya diunggah ke server?",
    answer:
      "Tidak. Seluruh pembacaan berkas, pengolahan NIK, dan pembuatan hasil berjalan langsung di browser kamu. Berkas tidak pernah dikirim ke server mana pun, tidak tersimpan, dan tidak dicatat.",
  },
  {
    question: "Bagaimana cara memakai fitur batch NIK?",
    answer:
      "Pilih berkas CSV, tentukan kolom yang berisi NIK, pilih kolom hasil yang diinginkan (provinsi, kabupaten/kota, kecamatan, tanggal lahir, umur, jenis kelamin, nomor urut, status), lalu tekan Proses. Hasil bisa diunduh sebagai CSV atau disalin sebagai TSV.",
  },
  {
    question: "Kenapa desa/kelurahan tidak bisa dihasilkan dari NIK?",
    answer:
      "NIK hanya menyandikan kode provinsi (digit 1–2), kabupaten/kota (digit 3–4), dan kecamatan (digit 5–6). Tidak ada digit yang memuat desa atau kelurahan, jadi keluaran berhenti di tingkat kecamatan.",
  },
  {
    question: "Apa arti status OK, Perlu Dicek, dan Tidak Valid?",
    answer:
      "OK berarti NIK terbaca lengkap dan umurnya wajar. Perlu Dicek berarti NIK terbaca, tetapi ada yang mencurigakan, misalnya umur di bawah 17 atau di atas 100 tahun, atau kode kecamatan tidak ditemukan (bisa karena pemekaran wilayah). Tidak Valid berarti NIK tidak bisa diproses, misalnya panjangnya bukan 16 digit, memuat huruf, atau tanggal lahirnya mustahil.",
  },
  {
    question: "Apakah kolom asli di berkas saya berubah?",
    answer:
      "Tidak. Semua kolom asli dipertahankan utuh, dan kolom hasil ditambahkan di paling kanan. Nama kolom hasil bisa kamu ubah sebelum ekspor supaya tidak bentrok dengan kolom yang sudah ada.",
  },
];

export default function BatchPage() {
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
        breadcrumb="Batch NIK"
        subtitle="Pemrosesan Massal"
        title="Olah Banyak NIK Sekaligus"
        description="Unggah berkas CSV berisi NIK, lalu dapatkan provinsi, kabupaten/kota, kecamatan, tanggal lahir, umur, jenis kelamin, dan status validitas untuk setiap baris. Seluruhnya diproses di browser kamu."
      >
        <BatchTool />
        <FaqSection title="Pertanyaan yang sering ditanyakan" items={faqItems} />
      </PageShell>
    </>
  );
}
