"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IdCard, Car, Home, FileSpreadsheet } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

// Entri /kodepos dan /npsn disembunyikan sampai database Turso fork ini siap; lihat plan/05.
const items = [
  { href: "/", label: "Beranda", Icon: Home },
  { href: "/nik", label: "NIK", Icon: IdCard },
  { href: "/batch", label: "Batch", Icon: FileSpreadsheet },
  { href: "/plat", label: "Plat", Icon: Car },
];

export function NavDock() {
  const pathname = usePathname();

  return (
    <Dock iconSize={44} iconMagnification={56} iconDistance={100}>
      {items.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <DockIcon
            key={href}
            className={isActive ? "bg-primary/10 ring-1 ring-primary/30" : ""}
          >
            <Link
              href={href}
              className="flex items-center justify-center w-full h-full"
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          </DockIcon>
        );
      })}
    </Dock>
  );
}
