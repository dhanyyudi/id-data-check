import { describe, expect, it } from "vitest";
import { computeVisibleRange } from "./window";

describe("computeVisibleRange", () => {
  it("memasukkan seluruh baris saat total di bawah ambang", () => {
    expect(
      computeVisibleRange({ total: 10, scrollTop: 0, viewportHeight: 600 })
    ).toEqual({ start: 0, end: 10 });
  });

  it("memasukkan seluruh baris tepat pada ambang", () => {
    expect(
      computeVisibleRange({ total: 2000, scrollTop: 99999, viewportHeight: 600 })
    ).toEqual({ start: 0, end: 2000 });
  });

  it("mengikuti posisi gulir di atas ambang", () => {
    const range = computeVisibleRange({
      total: 6000,
      scrollTop: 60000,
      viewportHeight: 600,
    });
    expect(range.start).toBe(1480);
    expect(range.end).toBe(1535);
    expect(range.end).toBeGreaterThan(range.start);
  });

  it("regresi 65f8ef9: scrollTop sisa dari daftar panjang dengan daftar terfilter lebih pendek tidak menghasilkan rentang kosong", () => {
    const range = computeVisibleRange({
      total: 3000,
      scrollTop: 239604,
      viewportHeight: 600,
    });
    expect(range.end).toBeGreaterThan(range.start);
    expect(range.start).toBeLessThan(3000);
    expect(range.end).toBeLessThanOrEqual(3000);
    expect(range).toEqual({ start: 2999, end: 3000 });
  });

  it("selalu memuat minimal satu baris meskipun scrollTop ekstrem", () => {
    const range = computeVisibleRange({
      total: 2500,
      scrollTop: 999999,
      viewportHeight: 600,
    });
    expect(range.end).toBeGreaterThan(range.start);
  });

  it("memakai tinggi 600 saat viewportHeight nol", () => {
    const range = computeVisibleRange({
      total: 6000,
      scrollTop: 0,
      viewportHeight: 0,
    });
    expect(range.start).toBe(0);
    expect(range.end).toBe(35);
  });

  it("menghormati rowHeight dan overscan yang disuntikkan", () => {
    const range = computeVisibleRange({
      total: 3000,
      scrollTop: 1000,
      viewportHeight: 200,
      rowHeight: 50,
      overscan: 5,
    });
    expect(range.start).toBe(15);
    expect(range.end).toBe(29);
  });
});
