import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageShellProps {
  breadcrumb: string;
  subtitle: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function PageShell({
  breadcrumb,
  subtitle,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
        <Link href="/" className="hover:text-foreground transition-colors font-medium">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground font-semibold">{breadcrumb}</span>
      </nav>

      {/* Header Info */}
      <div className="animate-fade-up">
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-foreground bg-accent px-2.5 py-0.5 border-2 border-border">
          {subtitle}
        </span>
        <h1 className="font-head text-[2rem] leading-tight sm:text-[2.5rem] text-foreground mt-2.5">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="mt-6 sm:mt-8 animate-fade-up" style={{ animationDelay: "80ms" }}>
        {children}
      </div>
    </main>
  );
}
