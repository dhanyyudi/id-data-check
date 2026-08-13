/**
 * Generate the slim wilayah dataset (levels 1-3 only) used in the browser.
 * Usage: bun run gen:wilayah-slim
 *
 * Reads lib/data/wilayah.ts as text and extracts level 1-3 records with a
 * regex, so this script never imports the 7 MB module into memory as JS.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "..");

const sourcePath = path.join(ROOT, "lib/data/wilayah.ts");
const targetPath = path.join(ROOT, "lib/data/wilayah-slim.generated.ts");

const EXPECTED_COUNT = 7817;

const source = fs.readFileSync(sourcePath, "utf8");

const regex = /\{ kode: "([\d.]+)", nama: "([^"]*)", level: (\d)/g;

const entries = new Map<string, string>();
let match: RegExpExecArray | null;

while ((match = regex.exec(source)) !== null) {
  const kode = match[1];
  const nama = match[2];
  const level = Number(match[3]);
  if (level > 3) continue;
  if (entries.has(kode) && entries.get(kode) !== nama) {
    throw new Error(
      `Name mismatch for duplicate kode "${kode}": "${entries.get(kode)}" vs "${nama}"`
    );
  }
  entries.set(kode, nama);
}

const count = entries.size;
if (count !== EXPECTED_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_COUNT} slim records, got ${count}. ` +
      `Refusing to write ${targetPath}.`
  );
}

const flat = Object.fromEntries(entries);

const header = [
  "// AUTO-GENERATED oleh scripts/gen-wilayah-slim.ts — JANGAN EDIT MANUAL.",
  "// Sumber: lib/data/wilayah.ts (level 1-3 saja, tanpa kelurahan).",
  "// Regenerate: bun run gen:wilayah-slim",
].join("\n");

const content = `${header}
export const WILAYAH_SLIM_JSON = ${JSON.stringify(JSON.stringify(flat))};
export const WILAYAH_SLIM_COUNT = ${count};
`;

fs.writeFileSync(targetPath, content, "utf8");

const sizeKb = (Buffer.byteLength(content, "utf8") / 1024).toFixed(1);
console.log(`Wrote ${path.basename(targetPath)}: ${count} records, ${sizeKb} KB`);
