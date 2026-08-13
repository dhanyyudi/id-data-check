"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/site";

// Entri /kodepos dan /npsn disembunyikan sampai database Turso fork ini siap; lihat plan/05.
const navItems = [
  { href: "/nik", label: "NIK" },
  { href: "/batch", label: "Batch NIK" },
  { href: "/plat", label: "Plat" },
];

function toggleTheme() {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");
  root.classList.toggle("dark", next);
  try {
    localStorage.setItem("theme", next ? "dark" : "light");
  } catch {
    // Penyimpanan bisa ditolak dalam mode privat; pilihan sesi tetap berlaku.
  }
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <div className="grid h-9 w-9 place-items-center bg-primary border-2 border-border shadow-xs">
              <Database className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-head text-sm tracking-tight text-foreground leading-none">
                {SITE_NAME}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground mt-1">
                Pembaca data publik Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-3 text-xs font-bold transition-all border-2",
                    isActive
                      ? "bg-primary border-border shadow-xs text-primary-foreground"
                      : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Ganti mode gelap atau terang"
              className="h-11 w-11 border-border bg-card"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 dark:hidden" />
            </Button>

            {/* Mobile Toggle Button */}
            <div className="flex md:hidden items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                className="h-11 w-11 border-border bg-card"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-border bg-card px-4 py-3 animate-fade-in">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-3 py-3 text-xs font-bold transition-colors border-2",
                pathname === "/"
                  ? "bg-primary border-border text-primary-foreground"
                  : "border-transparent text-foreground hover:bg-accent"
              )}
            >
              Beranda
            </Link>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-3 text-xs font-bold transition-colors flex items-center justify-between border-2",
                    isActive
                      ? "bg-primary border-border text-primary-foreground"
                      : "border-transparent text-foreground hover:bg-accent"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 bg-foreground" />}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
