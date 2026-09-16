"use client";

import { FleetPreview } from "@/components/map/FleetPreview";
import { useDashboard } from "@/lib/store";

export function MapPanel() {
  const showDemand = useDashboard((s) => s.showDemand);
  const showRepositioning = useDashboard((s) => s.showRepositioning);
  const toggleDemand = useDashboard((s) => s.toggleDemand);
  const toggleRepositioning = useDashboard((s) => s.toggleRepositioning);

  return (
    <section aria-label="Fleet map" className="relative flex min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
            Manhattan operations
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <label className="flex cursor-pointer items-center gap-1.5 text-[var(--fg-muted)]">
            <input
              type="checkbox"
              checked={showDemand}
              onChange={toggleDemand}
              className="accent-[var(--mint)]"
            />
            Demand
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 text-[var(--fg-muted)]">
            <input
              type="checkbox"
              checked={showRepositioning}
              onChange={toggleRepositioning}
              className="accent-[var(--mint)]"
            />
            Repositioning
          </label>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <FleetPreview fill />

        {showDemand && (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(420px 260px at 42% 40%, rgba(87,155,255,0.18), transparent 70%), radial-gradient(360px 220px at 62% 58%, rgba(246,184,75,0.12), transparent 70%)",
            }}
          />
        )}

        <div className="absolute right-3 top-3 rounded border border-[var(--border)] bg-[var(--bg)]/85 px-2.5 py-1.5 text-[10px] leading-relaxed text-[var(--fg-faint)] backdrop-blur-sm">
          Static preview · MapLibre + live playback land in Phase 6
        </div>
      </div>
    </section>
  );
}
