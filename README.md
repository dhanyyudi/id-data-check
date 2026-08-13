# Cek Data Indonesia

Aplikasi web untuk membaca dan memvalidasi data identitas Indonesia: Nomor Induk
Kependudukan (NIK) satu per satu atau massal dari berkas CSV, serta kode plat
nomor kendaraan. Seluruh pemrosesan NIK berjalan langsung di browser, tanpa
unggahan ke server.

URL live: <https://id-data-check.gislabs.workers.dev>

---

## Fitur yang berjalan

- **Pembaca NIK** (`/nik`): membaca 16 digit NIK KTP menjadi provinsi,
  kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir. Data wilayah
  (7.817 record level 1 sampai 3) dimuat sekali ke browser.
- **Batch NIK** (`/batch`): mengolah ratusan NIK dari satu berkas CSV, dengan
  pilihan kolom hasil, lima format tanggal lahir, umur, dan status validitas.
  Hasil diunduh sebagai CSV atau disalin sebagai TSV. Berkas tidak pernah
  meninggalkan browser.
- **Plat Nomor** (`/plat`): membaca 61 kode plat wilayah beserta Polda dan
  pulau, termasuk sub-wilayah kota/kabupaten dari huruf seri.

**Kode Pos dan NPSN belum aktif di fork ini.** Kedua halaman butuh database
Turso yang belum tersedia, jadi keduanya disembunyikan dari navigasi dan
sitemap sementara. Pemulihannya dicatat di `plan/07-data-recovery-runbook.md`.

Endpoint REST yang tersedia: `POST /api/v1/nik`.

---

## Menjalankan secara lokal

```bash
bun install
bun dev
```

Uji, lint, dan pemeriksaan salinan:

```bash
bun run test
bun run lint
bun run check:copy
```

## Deploy

Deploy manual:

```bash
bun run deploy
```

Push ke `master` memicu deploy otomatis lewat Workers Builds. Branch lain
mendapat preview URL lewat `wrangler versions upload`.

---

## Sumber data

Data wilayah (provinsi, kabupaten/kota, kecamatan) berasal dari
[`cahyadsn/wilayah`](https://github.com/cahyadsn/wilayah) sesuai Kepmendagri.
Data plat nomor disimpan sebagai tabel statis di `lib/data/plat.ts`.

Komponen UI memakai registry [neobrutalism.com](https://neobrutalism.com) (MIT),
varian Base UI.

---

## Asal fork

Repo ini fork dari `SaukiFutaki/indonesian-data-reader`. Hulu belum menetapkan
lisensi, jadi kode yang diwarisi dari sana tidak membawa izin pemakaian ulang
secara tersurat. Keputusan lisensi ada di tangan pemegang hak ciptanya.

---

## Menulis teks antarmuka

Semua teks yang dilihat pengguna ada di `app/` dan `components/`, ditulis dalam
Bahasa Indonesia. Komentar kode dan nama variabel tetap dalam bahasa Inggris.
Saat menulis atau mengubah salinan:

- **Jangan pernah memakai em dash (`—`) atau tanda hubung berspasi (` - `)**
  sebagai penghubung kalimat, pemisah klausa, atau pengantar penjelasan. Pakai
  kalimat baru, kata sambung (`karena`, `yang`, `sehingga`, `dan`, `tetapi`),
  titik dua saat memperkenalkan daftar atau definisi, atau tanda kurung.
- Tanda hubung hanya boleh untuk empat hal: kata majemuk, kata ulang bahasa
  Indonesia, rentang (pakai en dash, misal `5%–10%`), dan awalan.
- Pakai `dan`, bukan `&`, di dalam prosa.

Jalankan `bun run check:copy` untuk memverifikasi aturan salinan sebelum commit.
