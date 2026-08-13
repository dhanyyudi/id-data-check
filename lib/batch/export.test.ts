import { describe, expect, it } from "vitest";
import { buildDelimited, suggestFilename, toCsvWithBom, toTsv } from "./export";

const headers = ["A", "B"];
const rows = [
  ["a,b", "c"],
  ['x"y', "d"],
  ["baris\nsatu", "e"],
  ["tab\tsini", "f"],
];

describe("buildDelimited", () => {
  it("sel bermuatan delimiter dikutip", () => {
    const out = buildDelimited(["A"], [["a,b"]], ",");
    expect(out).toBe('A\r\n"a,b"');
  });

  it("kutip di dalam sel di-escape jadi ganda", () => {
    const out = buildDelimited(["A"], [['x"y']], ",");
    expect(out).toBe('A\r\n"x""y"');
  });

  it("newline di dalam sel dikutip dan dipertahankan", () => {
    const out = buildDelimited(["A"], [["baris\nsatu"]], ",");
    expect(out).toBe('A\r\n"baris\nsatu"');
  });
});

describe("toCsvWithBom", () => {
  it("keluaran diawali BOM", () => {
    const out = toCsvWithBom(headers, rows);
    expect(out.charCodeAt(0)).toBe(0xfeff);
  });

  it("sel bermuatan koma, kutip, dan newline ter-escape benar", () => {
    const out = toCsvWithBom(headers, rows);
    expect(out).toContain('"a,b",c\r\n');
    expect(out).toContain('"x""y",d\r\n');
    expect(out).toContain('"baris\nsatu",e\r\n');
  });
});

describe("toTsv", () => {
  it("tab dan newline di dalam sel diganti spasi", () => {
    const out = toTsv(headers, rows);
    expect(out).toBe(
      "A\tB\r\n" +
        "a,b\tc\r\n" +
        '"x""y"\td\r\n' +
        "baris satu\te\r\n" +
        "tab sini\tf"
    );
  });
});

describe("suggestFilename", () => {
  it("menyisipkan akhiran hasil nik", () => {
    expect(suggestFilename("data.csv")).toBe("data-hasil-nik.csv");
    expect(suggestFilename("DATA.CSV")).toBe("DATA-hasil-nik.csv");
    expect(suggestFilename("arsip")).toBe("arsip-hasil-nik.csv");
  });
});
