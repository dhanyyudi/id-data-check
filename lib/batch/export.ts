function quoteCell(cell: string, delimiter: string): string {
  if (
    cell.includes(delimiter) ||
    cell.includes('"') ||
    cell.includes("\r") ||
    cell.includes("\n")
  ) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

export function buildDelimited(
  headers: string[],
  rows: string[][],
  delimiter: string
): string {
  const lines = [headers.map((h) => quoteCell(h, delimiter)).join(delimiter)];

  for (const row of rows) {
    lines.push(row.map((c) => quoteCell(c, delimiter)).join(delimiter));
  }

  return lines.join("\r\n");
}

export function toCsvWithBom(headers: string[], rows: string[][]): string {
  return "\uFEFF" + buildDelimited(headers, rows, ",");
}

export function toTsv(headers: string[], rows: string[][]): string {
  const sanitize = (cell: string) =>
    cell.replace(/[\t\r\n]/g, " ");
  const cleanHeaders = headers.map(sanitize);
  const cleanRows = rows.map((row) => row.map(sanitize));
  return buildDelimited(cleanHeaders, cleanRows, "\t");
}

export function downloadText(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function suggestFilename(original: string): string {
  const base = original.replace(/\.csv$/i, "");
  return `${base}-hasil-nik.csv`;
}
