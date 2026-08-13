import Link from "next/link";
import { Database } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

// Entri /kodepos dan /npsn disembunyikan sampai database Turso fork ini siap; lihat plan/05.
const siteLinks = [
  { href: "/", label: "Beranda" },
  { href: "/nik", label: "NIK" },
  { href: "/batch", label: "Batch" },
  { href: "/plat", label: "Plat" },
];

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 border-t border-zinc-200 bg-white py-8 sm:py-10">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-950 text-white shadow-xs">
              <Database className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-950 leading-none">
                {SITE_NAME}
              </span>
              <span className="text-[11px] font-medium text-zinc-500 mt-0.5">
                Kumpulan alat baca data identitas dan wilayah Indonesia
              </span>
            </div>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold text-zinc-600 transition-colors hover:text-zinc-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-xs text-zinc-500 font-medium">
          <p className="text-[11px]">
            Dibuat untuk pengembang dan kebutuhan data publik Indonesia.
          </p>
          <span className="text-[11px]">© {new Date().getFullYear()} {SITE_NAME}</span>
        </div>
      </div>
    </footer>
  );
}
