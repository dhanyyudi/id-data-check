import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// NEXT_PUBLIC_* is resolved while the app is built, but the site URL only
// lived in wrangler.jsonc as a runtime binding. A build therefore fell back to
// localhost and could bake it into canonical tags, Open Graph URLs, robots.txt
// and the sitemap without anything failing. Read the same value here so the
// build and the Worker never disagree, and keep wrangler.jsonc the single
// place the URL is written.
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  try {
    const raw = readFileSync(join(process.cwd(), "wrangler.jsonc"), "utf8");
    // Only strips whole-line comments, so "https://" inside a value survives.
    const siteUrl = JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ""))?.vars
      ?.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
  } catch {
    // Deliberately swallowed: lib/site.ts still falls back to localhost, which
    // is what a local `next dev` without wrangler.jsonc should get.
  }
}

if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not set and could not be read from wrangler.jsonc. " +
      "Building without it would bake http://localhost:3000 into canonical " +
      "URLs, Open Graph tags, robots.txt and the sitemap."
  );
}

const nextConfig: NextConfig = {};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
