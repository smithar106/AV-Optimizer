import type { MetricsSummary } from "@/lib/schemas";

type Row = {
  label: string;
  baseline: string;
  optimized: string;
  delta: string;
  better: "up" | "down";
};

function fmt(v: number | null, digits = 0, prefix = "", suffix = ""): string {
  if (v === null || v === undefined) return "—";
  return `${prefix}${v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}${suffix}`;
}

export function PerformancePanel({ summary }: { summary: MetricsSummary | null }) {
  if (!summary) {
    return (
      <section aria-labelledby="perf-heading" className="border-b border-[var(--border)] py-6">
        <h2 id="perf-heading" className="text-[13px] font-semibold tracking-tight">
          Performance · baseline vs optimized
        </h2>
        <p className="mt-2 text-[12px] text-[var(--fg-muted)]">
          Results unavailable. The API could not be reached.
        </p>
      </section>
    );
  }

  const b = summary.baseline;
  const o = summary.optimized;
  const d = summary.deltas;

  const rows: Row[] = [
    {
      label: "Contribution margin",
      baseline: fmt(b.contribution_usd, 0, "$"),
      optimized: fmt(o.contribution_usd, 0, "$"),
      delta: fmt(d.contribution_usd, 0, "+$"),
      better: "up",
    },
    {
      label: "Margin / vehicle-hour",
      baseline: fmt(b.contribution_per_vehicle_hour, 2, "$"),
      optimized: fmt(o.contribution_per_vehicle_hour, 2, "$"),
      delta: fmt(
        (o.contribution_per_vehicle_hour ?? 0) - (b.contribution_per_vehicle_hour ?? 0),
        2,
        "+$",
      ),
      better: "up",
    },
    {
      label: "Demand fulfillment",
      baseline: fmt(b.demand_fulfillment, 1, "", "%"),
      optimized: fmt(o.demand_fulfillment, 1, "", "%"),
      delta: fmt(d.demand_fulfillment, 1, "+", " pp"),
      better: "up",
    },
    {
      label: "Requests served",
      baseline: fmt(b.served, 0),
      optimized: fmt(o.served, 0),
      delta: fmt(o.served - b.served, 0, "+"),
      better: "up",
    },
    {
      label: "Empty-mile ratio",
      baseline: fmt(b.empty_mile_ratio, 2),
      optimized: fmt(o.empty_mile_ratio, 2),
      delta: fmt(d.empty_mile_ratio, 2),
      better: "down",
    },
    {
      label: "Average pickup ETA",
      baseline: fmt(b.avg_pickup_eta_min, 1, "", " min"),
      optimized: fmt(o.avg_pickup_eta_min, 1, "", " min"),
      delta: fmt(d.avg_pickup_eta_min, 1, "", " min"),
      better: "down",
    },
    {
      label: "P90 pickup ETA",
      baseline: fmt(b.p90_pickup_eta_min, 1, "", " min"),
      optimized: fmt(o.p90_pickup_eta_min, 1, "", " min"),
      delta: fmt((o.p90_pickup_eta_min ?? 0) - (b.p90_pickup_eta_min ?? 0), 1, "", " min"),
      better: "down",
    },
    {
      label: "Energy consumed",
      baseline: fmt(b.energy_kwh, 0, "", " kWh"),
      optimized: fmt(o.energy_kwh, 0, "", " kWh"),
      delta: fmt((o.energy_kwh ?? 0) - (b.energy_kwh ?? 0), 0, "", " kWh"),
      better: "down",
    },
  ];

  return (
    <section aria-labelledby="perf-heading" className="border-b border-[var(--border)] py-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="perf-heading" className="text-[13px] font-semibold tracking-tight">
            Performance · baseline vs optimized
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--fg-muted)]">
            Same {summary.fleet_size} vehicles and demand scenarios. Paired across the
            same requests.
          </p>
        </div>
        <div className="tabular text-[11px] text-[var(--fg-faint)]">
          {summary.dataset_id} · seed included
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-[var(--border)]">
        <table className="w-full min-w-[560px] text-left text-[12px]">
          <thead className="border-b border-[var(--border)] text-[10px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            <tr>
              <th className="px-4 py-2.5 font-medium">Metric</th>
              <th className="px-4 py-2.5 font-medium">Baseline</th>
              <th className="px-4 py-2.5 font-medium">Optimized</th>
              <th className="px-4 py-2.5 text-right font-medium">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="px-4 py-2.5 text-[var(--fg-muted)]">{r.label}</td>
                <td className="tabular px-4 py-2.5 text-[var(--fg-muted)]">{r.baseline}</td>
                <td className="tabular px-4 py-2.5">{r.optimized}</td>
                <td
                  className="tabular px-4 py-2.5 text-right"
                  style={{ color: "var(--mint)" }}
                >
                  {r.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg-faint)]">
        Contribution margin = revenue − energy − distance − time − transaction costs.
        Revenue is recognized only for completed rides. Fixed ownership costs are
        reported separately. Illustrative synthetic assumptions.
      </p>
    </section>
  );
}
