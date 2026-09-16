import type { TripRecord } from "@/lib/schemas";

const MAX_ROWS = 250;

export function RecordsTable({
  records,
  strategy,
}: {
  records: TripRecord[];
  strategy: string;
}) {
  const shown = records.slice(0, MAX_ROWS);

  return (
    <section aria-labelledby="records-heading" className="py-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="records-heading" className="text-[13px] font-semibold tracking-tight">
            Trip records
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--fg-muted)]">
            {records.length.toLocaleString()} hypothetical trips · {strategy} policy
          </p>
        </div>
        <div className="text-[11px] text-[var(--fg-faint)]">
          Showing {shown.length.toLocaleString()} of {records.length.toLocaleString()}
        </div>
      </div>

      <div className="max-h-[460px] overflow-auto rounded border border-[var(--border)]">
        <table className="w-full min-w-[760px] text-left text-[12px]">
          <thead className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] text-[10px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
            <tr>
              <th className="px-3 py-2.5 font-medium">Time</th>
              <th className="px-3 py-2.5 font-medium">Origin</th>
              <th className="px-3 py-2.5 font-medium">Destination</th>
              <th className="px-3 py-2.5 text-right font-medium">Mi</th>
              <th className="px-3 py-2.5 text-right font-medium">Min</th>
              <th className="px-3 py-2.5 text-right font-medium">Empty mi</th>
              <th className="px-3 py-2.5 text-right font-medium">ETA</th>
              <th className="px-3 py-2.5 text-right font-medium">Fare</th>
              <th className="px-3 py-2.5 text-right font-medium">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {shown.map((r) => (
              <tr key={r.record_id} className={r.served ? "" : "opacity-50"}>
                <td className="tabular px-3 py-2 text-[var(--fg-muted)]">{r.request_time}</td>
                <td className="px-3 py-2 text-[var(--fg-muted)]">{r.origin_name}</td>
                <td className="px-3 py-2 text-[var(--fg-muted)]">{r.destination_name}</td>
                <td className="tabular px-3 py-2 text-right">{r.distance_mi.toFixed(1)}</td>
                <td className="tabular px-3 py-2 text-right">{r.duration_min}</td>
                <td className="tabular px-3 py-2 text-right">{r.empty_miles.toFixed(1)}</td>
                <td className="tabular px-3 py-2 text-right">
                  {r.pickup_eta_min.toFixed(1)}
                </td>
                <td className="tabular px-3 py-2 text-right">
                  {r.served ? `$${r.fare_usd.toFixed(2)}` : "—"}
                </td>
                <td
                  className="tabular px-3 py-2 text-right"
                  style={{ color: r.served ? "var(--mint)" : "var(--fg-faint)" }}
                >
                  {r.served ? `$${r.contribution_usd.toFixed(2)}` : "unserved"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
