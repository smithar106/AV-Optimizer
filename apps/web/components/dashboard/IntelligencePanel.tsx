"use client";

import { STATUS_META, type VehicleStatus } from "@/lib/types";
import { useDashboard } from "@/lib/store";
import type { CompareResult, FleetMetrics } from "@/lib/schemas";

const STATUS_ORDER: VehicleStatus[] = [
  "idle",
  "on_trip",
  "pickup",
  "repositioning",
  "charging",
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-[var(--fg-muted)]">{label}</span>
      <span className="tabular text-[12px]">{value}</span>
    </div>
  );
}

export function IntelligencePanel({
  metrics,
  comparison,
}: {
  metrics: FleetMetrics | null;
  comparison: CompareResult | null;
}) {
  const mode = useDashboard((s) => s.mode);
  const selectedVehicleId = useDashboard((s) => s.selectedVehicleId);
  const selectVehicle = useDashboard((s) => s.selectVehicle);

  return (
    <aside
      aria-label="Fleet intelligence"
      className="flex min-h-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--bg)]"
    >
      {mode === "fleet" && (
        <>
          <Section title="Fleet status">
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {STATUS_ORDER.map((s) => (
                <div key={s} className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2 text-[11px] text-[var(--fg-muted)]">
                    <span aria-hidden className="text-[10px]">
                      {STATUS_META[s].icon}
                    </span>
                    {STATUS_META[s].label}
                  </span>
                  <span className="tabular text-[12px] text-[var(--fg-faint)]">—</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Selected vehicle">
            {selectedVehicleId ? (
              <VehicleDrawer vehicleId={selectedVehicleId} onClose={() => selectVehicle(null)} />
            ) : (
              <p className="text-[11px] leading-relaxed text-[var(--fg-faint)]">
                Select a vehicle on the map to inspect its state, battery, trip, and the
                recorded solver decision.
              </p>
            )}
          </Section>
        </>
      )}

      {mode === "demand" && (
        <Section title="Demand intelligence">
          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
            Origin–destination demand intensity by 5-minute interval. The demand heatmap
            overlay is available on the map; the dataset lands with the Phase 2 pipeline.
          </p>
          <div className="mt-3 flex flex-col divide-y divide-[var(--border)]">
            <Row label="Intervals" value="5 min" />
            <Row label="Capture (α)" value="1.0" />
            <Row label="Forecast horizon" value="30 min" />
          </div>
        </Section>
      )}

      {mode === "decisions" && (
        <Section title="Optimization decisions">
          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
            Each assignment and repositioning move is recorded with its solver inputs.
            Explanations are read from the decision log — never invented after the fact.
          </p>
          <div className="mt-3 rounded border border-[var(--border)] p-3 text-[11px] leading-relaxed text-[var(--fg-faint)]">
            No decisions recorded. The OR-Tools engine lands in Phase 5.
          </div>
        </Section>
      )}

      {mode === "revenue" && (
        <Section title="Revenue intelligence">
          <div className="flex flex-col divide-y divide-[var(--border)]">
            <Row
              label="Realized revenue"
              value={metrics?.realizedRevenueUsd != null ? `$${metrics.realizedRevenueUsd.toLocaleString()}` : "—"}
            />
            <Row
              label="Variable costs"
              value={metrics?.variableCostsUsd != null ? `$${metrics.variableCostsUsd.toLocaleString()}` : "—"}
            />
            <Row
              label="Contribution margin"
              value={metrics?.contributionMarginUsd != null ? `$${metrics.contributionMarginUsd.toLocaleString()}` : "—"}
            />
            <Row
              label="Revenue / veh-hr"
              value={metrics?.revenue_per_vehicle_hour != null ? `$${metrics.revenue_per_vehicle_hour}` : "—"}
            />
            <Row
              label="Utilization"
              value={metrics?.utilization != null ? `${metrics.utilization}%` : "—"}
            />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg-faint)]">
            CM = revenue − energy − distance − time − transaction costs. Fixed costs are
            reported separately.
          </p>
        </Section>
      )}

      {mode === "comparison" && (
        <Section title="Strategy comparison">
          {comparison ? (
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {comparison.policies.map((p) => (
                <div key={p.policy} className="py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]">{p.label}</span>
                    <span className="tabular text-[12px] text-[var(--fg-faint)]">—</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
              Paired-seed comparison across policies A/B/C/D. Results render when the
              optimization engine is connected (Phase 5).
            </p>
          )}
        </Section>
      )}
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[var(--border)] p-4">
      <h2 className="mb-3 text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function VehicleDrawer({
  vehicleId,
  onClose,
}: {
  vehicleId: string;
  onClose: () => void;
}) {
  return (
    <div className="rounded border border-[var(--border-strong)] bg-[var(--surface)] p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="tabular text-[14px] font-medium">{vehicleId}</div>
          <div className="text-[10px] text-[var(--fg-faint)]">Synthetic autonomous vehicle</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close vehicle details"
          className="text-[var(--fg-faint)] hover:text-[var(--fg)]"
        >
          ✕
        </button>
      </div>
      <div className="mt-3 flex flex-col divide-y divide-[var(--border)]">
        <Row label="Battery" value="—" />
        <Row label="State" value="—" />
        <Row label="Current trip" value="—" />
        <Row label="ETA" value="—" />
      </div>
      <div className="mt-3 rounded border border-[var(--border)] p-2.5 text-[10px] leading-relaxed text-[var(--fg-faint)]">
        Decision explanation: assigned because the modeled expected contribution and
        pickup feasibility satisfied the dispatch objective.
        <div className="mt-1.5 opacity-80">
          Illustrative. In production this text comes from the recorded solver inputs and
          decisions.
        </div>
      </div>
    </div>
  );
}
