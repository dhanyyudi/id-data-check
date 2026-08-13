import type { Metadata } from "next";
import { Archivo_Black, Geist_Mono, Space_Grotesk } from "next/font/google";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Baca dan validasi data identitas Indonesia: NIK, kode pos, plat nomor, dan NPSN. Gratis dan cepat. Pembacaan NIK berjalan langsung di browser.",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TRPCReactProvider>
          <TooltipProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
