import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const lastModified = new Date();

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/nik`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/batch`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // /kodepos dan /npsn disembunyikan sampai database Turso fork ini siap.
    // Kembalikan kedua rute begitu tabel kodepos dan sekolah sudah terisi.
    {
      url: `${baseUrl}/plat`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  return routes;
}
