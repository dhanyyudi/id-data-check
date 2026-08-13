"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BatchResult } from "@/lib/batch/run";
import type { NikStatus } from "@/lib/nik/status";

interface Props {
  result: BatchResult;
  filter: NikStatus | null;
}

const ROW_HEIGHT = 40;
const OVERSCAN = 20;
const WINDOW_THRESHOLD = 2000;

export function ResultTable({ result, filter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const filteredIndexes = useMemo(() => {
    const indexes: number[] = [];
    for (let i = 0; i < result.statuses.length; i++) {
      if (filter === null || result.statuses[i] === filter) {
        indexes.push(i);
      }
    }
    return indexes;
  }, [result, filter]);

  const windowed = filteredIndexes.length > WINDOW_THRESHOLD;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setViewportHeight(el.clientHeight);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visibleRange = useMemo(() => {
    if (!windowed) {
      return { start: 0, end: filteredIndexes.length };
    }
    const height = viewportHeight || 600;
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const end = Math.min(
      filteredIndexes.length,
      Math.ceil((scrollTop + height) / ROW_HEIGHT) + OVERSCAN
    );
    return { start, end };
  }, [windowed, filteredIndexes.length, scrollTop, viewportHeight]);

  const rowClass = (status: NikStatus) =>
    status === "TIDAK VALID"
      ? "bg-red-50 hover:bg-red-100/70"
      : status === "PERLU DICEK"
        ? "bg-amber-50 hover:bg-amber-100/70"
        : "bg-white hover:bg-zinc-50";

  const topSpacer = visibleRange.start * ROW_HEIGHT;
  const bottomSpacer =
    (filteredIndexes.length - visibleRange.end) * ROW_HEIGHT;

  return (
    <div
      ref={containerRef}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="max-h-[60vh] overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-xs"
    >
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10">
          <tr className="bg-zinc-100/95 backdrop-blur">
            <th className="border-b border-zinc-200 px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Baris
            </th>
            {result.outHeaders.map((header, i) => (
              <th
                key={i}
                className="whitespace-nowrap border-b border-zinc-200 px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-zinc-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topSpacer > 0 && (
            <tr style={{ height: topSpacer }} aria-hidden="true" />
          )}
          {filteredIndexes
            .slice(visibleRange.start, visibleRange.end)
            .map((rowIndex) => {
              const status = result.statuses[rowIndex];
              const cells = result.outRows[rowIndex];
              return (
                <tr
                  key={rowIndex}
                  className={`${rowClass(status)} transition-colors`}
                  style={{ height: ROW_HEIGHT }}
                >
                  <td className="border-b border-zinc-100 px-3 py-2 align-middle font-mono text-[10px] font-bold tabular text-zinc-400">
                    {rowIndex + 2}
                  </td>
                  {cells.map((cell, c) => (
                    <td
                      key={c}
                      className="max-w-[16rem] border-b border-zinc-100 px-3 py-2 align-middle font-medium text-zinc-800"
                    >
                      <div className="truncate" title={cell}>
                        {cell === "" ? (
                          <span className="text-zinc-300">—</span>
                        ) : (
                          cell
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          {bottomSpacer > 0 && (
            <tr style={{ height: bottomSpacer }} aria-hidden="true" />
          )}
        </tbody>
      </table>
    </div>
  );
}
