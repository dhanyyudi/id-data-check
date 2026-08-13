export interface VisibleRange {
  start: number;
  end: number;
}

export interface WindowInput {
  total: number;
  scrollTop: number;
  viewportHeight: number;
  rowHeight?: number;
  overscan?: number;
  threshold?: number;
}

export const ROW_HEIGHT = 40;
export const OVERSCAN = 20;
export const WINDOW_THRESHOLD = 2000;

/**
 * Rentang baris yang perlu dirender pada tabel berjendela.
 * Murni dan bebas React supaya bisa diuji langsung.
 */
export function computeVisibleRange({
  total,
  scrollTop,
  viewportHeight,
  rowHeight = ROW_HEIGHT,
  overscan = OVERSCAN,
  threshold = WINDOW_THRESHOLD,
}: WindowInput): VisibleRange {
  if (total <= threshold) {
    return { start: 0, end: total };
  }

  const height = viewportHeight || 600;

  // Dijepit juga di sini, karena wadah yang lebih pendek dari viewport-nya
  // tidak pernah memicu event scroll yang akan mengoreksi state.
  const start = Math.min(
    Math.max(0, total - 1),
    Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  );
  const end = Math.min(
    total,
    Math.max(start + 1, Math.ceil((scrollTop + height) / rowHeight) + overscan)
  );

  return { start, end };
}
