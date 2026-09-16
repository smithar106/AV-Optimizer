import type { MetricsSummary } from "@/lib/schemas";
import type { Strategy } from "@/lib/store";

function fmt(v: number | null, digits = 0, prefix = "", suffix = ""): string {
  if (v === null || v === undefined) return "—";
  return `${prefix}${v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}${suffix}`;
}

export function KpiRow({
  summary,
  strategy,
}: {
  summary: MetricsSummary | null;
  strategy: Strategy;
}) {
  const m = summary?.[strategy] ?? null;

  const kpis = [
    {
      label: "Margin / veh-hr",
      value: fmt(m?.contribution_per_vehicle_hour ?? null, 2, "$"),
      token: "var(--mint)",
    },
    {
      label: "Contribution",
      value: fmt(m?.contribution_usd ?? null, 0, "$"),
      token: "var(--fg)",
    },
    {
      label: "Served",
      value: fmt(m?.served ?? null),
      token: "var(--blue)",
    },
    {
      label: "Fulfillment",
      value: fmt(m?.demand_fulfillment ?? null, 1, "", "%"),
      token: "var(--fg)",
    },
    {
      label: "Empty-mile ratio",
      value: fmt(m?.empty_mile_ratio ?? null, 2),
      token: "var(--amber)",
    },
    {
      label: "Avg pickup ETA",
      value: fmt(m?.avg_pickup_eta_min ?? null, 1, "", " min"),
      token: "var(--fg)",
    },
  ];

  return (
    <section
      aria-label="Key performance indicators"
      className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--bg)] sm:grid-cols-3 lg:grid-cols-6"
    >
      {kpis.map((k) => (
        <div
          key={k.label}
          className="border-b border-r border-[var(--border)] px-4 py-3 last:border-r-0 lg:border-b-0"
        >
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
            {k.label}
          </div>
          <div className="tabular mt-1 text-[20px]" style={{ color: k.token }}>
            {k.value}
          </div>
        </div>
      ))}
    </section>
  );
}
