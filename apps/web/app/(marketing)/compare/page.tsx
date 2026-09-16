const policies = [
  { id: "A", dispatch: "Nearest feasible", reposition: "None", role: "Baseline" },
  { id: "B", dispatch: "Optimized", reposition: "None", role: "Dispatch effect" },
  { id: "C", dispatch: "Nearest feasible", reposition: "Optimized", role: "Repositioning effect" },
  { id: "D", dispatch: "Optimized", reposition: "Optimized", role: "Full strategy" },
];

const kpis = [
  "Contribution margin / vehicle-hour",
  "Realized contribution margin",
  "Demand fulfillment",
  "Average pickup ETA",
  "P90 pickup ETA",
  "Empty-mile ratio",
  "Utilization",
  "Revenue / vehicle-hour",
  "Service coverage",
  "Energy consumption (kWh)",
  "Unserved demand",
];

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Compare optimization strategies
      </h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
        A controlled experiment: the same fleet, demand, prices, travel times, and
        operating assumptions, given to different dispatch and repositioning policies.
        Results are reported as paired differences across independent demand seeds —
        not a single favorable run.
      </p>

      <div className="panel mt-8 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-[var(--border)] text-[11px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
            <tr>
              <th className="px-4 py-3 font-medium">Policy</th>
              <th className="px-4 py-3 font-medium">Dispatch</th>
              <th className="px-4 py-3 font-medium">Repositioning</th>
              <th className="px-4 py-3 font-medium">Isolates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {policies.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <span className="tabular font-medium">{p.id}</span>
                </td>
                <td className="px-4 py-3 text-[var(--fg-muted)]">{p.dispatch}</td>
                <td className="px-4 py-3 text-[var(--fg-muted)]">{p.reposition}</td>
                <td className="px-4 py-3 text-[var(--fg-faint)]">{p.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <div className="text-[13px] font-semibold">Reported KPIs</div>
          <ul className="mt-3 flex flex-col gap-1.5 text-[13px] text-[var(--fg-muted)]">
            {kpis.map((k) => (
              <li key={k} className="flex items-center gap-2">
                <span className="text-[var(--fg-faint)]">—</span>
                {k}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <div className="text-[13px] font-semibold">Experiment design</div>
          <ul className="mt-3 flex flex-col gap-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
            <li>· At least 20 independent demand seeds per policy.</li>
            <li>· Identical initial vehicle locations and battery levels.</li>
            <li>· Identical request arrivals, origins, and destinations.</li>
            <li>· Identical fares, travel-time estimates, and charging rules.</li>
            <li>· Paired differences reported with distribution, not a best case.</li>
            <li>· Ablations over demand capture, fleet size, electricity price, and repositioning cost.</li>
          </ul>
        </div>
      </div>

      <div className="panel mt-8 p-5">
        <div className="text-[12px] text-[var(--fg-faint)]">
          Phase 1 foundation: the comparison contract is defined in the API
          (<span className="tabular">POST /api/v1/compare</span>). Paired-seed results
          render here in Phase 5. No improvement is assumed — if the optimized strategy
          performs worse in some scenarios, those results are shown.
        </div>
      </div>
    </div>
  );
}
