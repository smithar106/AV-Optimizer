import { FleetPreview } from "@/components/map/FleetPreview";
import { STATUS_META, type VehicleStatus } from "@/lib/types";

const ORDER: VehicleStatus[] = ["on_trip", "idle", "pickup", "repositioning", "charging"];

/**
 * Fleet operations: the map (hero) plus a compact status legend. The vehicle
 * positions are a static preview until MapLibre playback lands (Phase 6); the
 * status breakdown shown is illustrative of a mid-day fleet.
 */
export function FleetMap({ fleetSize }: { fleetSize: number }) {
  const counts: Record<VehicleStatus, number> = {
    on_trip: Math.round(fleetSize * 0.34),
    idle: Math.round(fleetSize * 0.3),
    pickup: Math.round(fleetSize * 0.14),
    repositioning: Math.round(fleetSize * 0.14),
    charging: Math.round(fleetSize * 0.08),
  };

  return (
    <section aria-labelledby="fleet-heading" className="border-b border-[var(--border)] py-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="fleet-heading" className="text-[13px] font-semibold tracking-tight">
            Fleet operations
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--fg-muted)]">
            {fleetSize} synthetic autonomous vehicles across Manhattan
          </p>
        </div>
        <div className="text-[11px] text-[var(--fg-faint)]">
          Static preview · live MapLibre playback lands in Phase 6
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative h-[380px] overflow-hidden rounded border border-[var(--border)]">
          <FleetPreview fill />
        </div>

        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
            Status breakdown
          </div>
          <ul className="mt-3 flex flex-col divide-y divide-[var(--border)]">
            {ORDER.map((s) => (
              <li key={s} className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2 text-[12px] text-[var(--fg-muted)]">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: STATUS_META[s].token }}
                  />
                  {STATUS_META[s].label}
                </span>
                <span className="tabular text-[13px]">{counts[s]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg-faint)]">
            Status is never conveyed by color alone. Vehicle-level states populate with
            the playback engine.
          </p>
        </div>
      </div>
    </section>
  );
}
