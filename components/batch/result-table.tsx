"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BatchResult } from "@/lib/batch/run";
import type { NikStatus } from "@/lib/nik/status";
import {
  computeVisibleRange,
  ROW_HEIGHT,
} from "@/lib/batch/window";

interface Props {
  result: BatchResult;
  filter: NikStatus | null;
}

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

  // A scrollTop left over from a longer list would point past the end of a
  // freshly filtered one. Scrolling the container natively also fires onScroll,
  // which is what puts the state back in sync.
  useEffect(() => {
    const el = containerRef.current;
    if (el && el.scrollTop !== 0) el.scrollTop = 0;
  }, [filter]);

  const visibleRange = useMemo(
    () =>
      computeVisibleRange({
        total: filteredIndexes.length,
        scrollTop,
        viewportHeight,
      }),
    [filteredIndexes.length, scrollTop, viewportHeight]
  );

  const rowClass = (status: NikStatus) =>
    status === "TIDAK VALID"
      ? "bg-destructive/10 hover:bg-destructive/15"
      : status === "PERLU DICEK"
        ? "bg-primary/40 hover:bg-primary/60"
        : "bg-card hover:bg-muted/50";

  const topSpacer = visibleRange.start * ROW_HEIGHT;
  const bottomSpacer =
    (filteredIndexes.length - visibleRange.end) * ROW_HEIGHT;

  return (
    <div
      ref={containerRef}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="max-h-[60vh] overflow-auto border-2 border-border bg-card shadow-md"
    >
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10">
          <tr className="bg-muted border-b-2 border-border">
            <th className="px-3 py-2.5 text-left text-[10px] font-head uppercase tracking-wider text-foreground">
              Baris
            </th>
            {result.outHeaders.map((header, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-3 py-2.5 text-left text-[10px] font-head uppercase tracking-wider text-foreground"
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
                  <td className="border-b border-border px-3 py-2 align-middle font-mono text-[10px] font-bold tabular text-muted-foreground">
                    {rowIndex + 2}
                  </td>
                  {cells.map((cell, c) => (
                    <td
                      key={c}
                      className="max-w-[16rem] border-b border-border px-3 py-2 align-middle font-medium text-foreground"
                    >
                      <div className="truncate" title={cell}>
                        {cell === "" ? (
                          <span className="text-muted-foreground/60">—</span>
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
