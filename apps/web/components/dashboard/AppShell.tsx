"use client";

import { useEffect } from "react";
import { NavRail } from "./NavRail";
import { ScenarioPanel } from "./ScenarioPanel";
import { KpiRibbon } from "./KpiRibbon";
import { MapPanel } from "./MapPanel";
import { IntelligencePanel } from "./IntelligencePanel";
import { PlaybackBar } from "./PlaybackBar";
import { useDashboard, DAY_END_MS } from "@/lib/store";
import type { CompareResult, DataManifest, DemoMeta, FleetMetrics, ScenarioSummary } from "@/lib/schemas";

const POLICY_LABELS: Record<string, string> = {
  baseline: "Baseline",
  optimized_dispatch: "Optimized dispatch",
  optimized_repositioning: "Nearest + reposition",
  fully_optimized: "Fully optimized",
};

export function AppShell({
  scenarios,
  demo,
  manifest,
  metrics,
  comparison,
}: {
  scenarios: ScenarioSummary[];
  demo: DemoMeta | null;
  manifest: DataManifest | null;
  metrics: FleetMetrics | null;
  comparison: CompareResult | null;
}) {
  const policy = useDashboard((s) => s.policy);
  const setPolicy = useDashboard((s) => s.setPolicy);
  const playing = useDashboard((s) => s.playing);

  // Single playback clock: advance simulated time at the selected speed.
  // Reads live values from the store so the interval is not recreated each tick.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const s = useDashboard.getState();
      const next = s.timeMs + 1000 * s.speed;
      if (next >= DAY_END_MS) {
        s.pause();
      } else {
        s.seek(next);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const scenario = scenarios[0];
  const fleetSize = scenario?.fleet_size ?? demo?.fleet_size ?? 100;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4">
        <div className="flex items-center gap-4">
          <span className="text-[15px] font-semibold tracking-tight">AVantage</span>
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)] sm:inline">
            Simulation
          </span>
          <span className="hidden text-[12px] text-[var(--fg-muted)] md:inline">
            {scenario?.name ?? "Manhattan operations"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="tabular hidden text-[11px] text-[var(--fg-faint)] sm:inline">
            {scenario?.seed != null ? `seed ${scenario.seed}` : ""}
          </span>
          <span className="rounded-sm border border-[var(--border-strong)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--mint)]">
            {POLICY_LABELS[policy] ?? policy}
          </span>
        </div>
      </header>

      <KpiRibbon fleetSize={fleetSize} metrics={metrics} />

      {/* Workspace grid: nav · scenario · map · intelligence */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[56px_minmax(0,1fr)_320px] xl:grid-cols-[56px_280px_minmax(0,1fr)_320px]">
        <NavRail />
        <div className="hidden xl:flex">
          <ScenarioPanel
            scenarios={scenarios}
            demo={demo}
            manifest={manifest}
            policy={policy}
            onPolicyChange={setPolicy}
          />
        </div>
        <MapPanel />
        <div className="hidden lg:flex">
          <IntelligencePanel metrics={metrics} comparison={comparison} />
        </div>
      </div>

      <PlaybackBar />
    </div>
  );
}
