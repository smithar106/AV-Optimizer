"use client";

import { useEffect } from "react";
import { KpiRow } from "./KpiRow";
import { FleetMap } from "./FleetMap";
import { Timeline } from "./Timeline";
import { PerformancePanel } from "./PerformancePanel";
import { RecordsTable } from "./RecordsTable";
import { DAY_END_MS, useDashboard, type Strategy } from "@/lib/store";
import type { MetricsSummary, TripRecord } from "@/lib/schemas";

export function Dashboard({
  summary,
  records,
  scenarioName,
  fleetSize,
}: {
  summary: MetricsSummary | null;
  records: TripRecord[];
  scenarioName: string;
  fleetSize: number;
}) {
  const strategy = useDashboard((s) => s.strategy);
  const setStrategy = useDashboard((s) => s.setStrategy);
  const playing = useDashboard((s) => s.playing);

  // Single playback clock.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const s = useDashboard.getState();
      const next = s.timeMs + 1000 * s.speed;
      if (next >= DAY_END_MS) s.pause();
      else s.seek(next);
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const strategyRecords = records.filter((r) => r.strategy === strategy);

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-baseline gap-3">
            <span className="text-[15px] font-semibold tracking-tight">AVantage</span>
            <span className="text-[12px] text-[var(--fg-muted)]">{scenarioName}</span>
            <span className="tabular hidden text-[11px] text-[var(--fg-faint)] sm:inline">
              {fleetSize} AVs
            </span>
          </div>

          <label className="flex items-center gap-2 text-[12px]">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
              Policy
            </span>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as Strategy)}
              className="rounded border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1.5 text-[12px] text-[var(--fg)]"
            >
              <option value="optimized">Optimized dispatch</option>
              <option value="baseline">Nearest feasible</option>
            </select>
          </label>
        </div>
      </header>

      <KpiRow summary={summary} strategy={strategy} />

      <main className="mx-auto max-w-7xl px-5">
        <FleetMap fleetSize={fleetSize} />
        <Timeline records={strategyRecords} />
        <PerformancePanel summary={summary} />
        <RecordsTable records={strategyRecords} strategy={strategy} />
      </main>
    </div>
  );
}
