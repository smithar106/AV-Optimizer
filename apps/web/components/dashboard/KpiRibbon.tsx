"use client";

import type { FleetMetrics } from "@/lib/schemas";

type Kpi = {
  label: string;
  value: string;
  unit?: string;
  token?: string;
};

function fmt(v: number | null | undefined, digits = 0, prefix = ""): string | null {
  if (v === null || v === undefined) return null;
  return `${prefix}${v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function KpiRibbon({
  fleetSize,
  metrics,
}: {
  fleetSize: number;
  metrics: FleetMetrics | null;
}) {
  const m = metrics ?? {};

  const kpis: Kpi[] = [
    { label: "Vehicles", value: String(fleetSize), token: "var(--fg)" },
    {
      label: "Margin",
      value: fmt(m.contributionMarginUsd, 0, "$") ?? "—",
      token: "var(--mint)",
    },
    { label: "Served", value: fmt(m.completedTrips) ?? "—", token: "var(--blue)" },
    {
      label: "Empty mi",
      value: fmt(m.emptyMiles, 0) ?? "—",
      token: "var(--amber)",
    },
    {
      label: "Fulfillment",
      value: fmt(m.demand_fulfillment, 0) ?? "—",
      unit: m.demand_fulfillment != null ? "%" : undefined,
      token: "var(--fg)",
    },
    {
      label: "Avg ETA",
      value: fmt(m.meanPickupEtaMinutes, 1) ?? "—",
      unit: m.meanPickupEtaMinutes != null ? "min" : undefined,
      token: "var(--fg)",
    },
  ];

  const pending = metrics === null;

  return (
    <section
      aria-label="Key performance indicators"
      className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--bg)] sm:grid-cols-6"
    >
      {kpis.map((k) => (
        <div
          key={k.label}
          className="flex flex-col justify-center border-r border-[var(--border)] px-4 py-2.5 last:border-r-0"
        >
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
            {k.label}
          </div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="tabular text-[18px]" style={{ color: k.token }}>
              {k.value}
            </span>
            {k.unit && (
              <span className="text-[11px] text-[var(--fg-faint)]">{k.unit}</span>
            )}
          </div>
        </div>
      ))}
      {pending && (
        <div className="col-span-3 flex items-center border-t border-[var(--border)] px-4 py-1.5 text-[11px] text-[var(--fg-faint)] sm:col-span-6">
          Metrics populate when a simulation run completes. This build shows the
          command-center shell with the API contract wired.
        </div>
      )}
    </section>
  );
}
