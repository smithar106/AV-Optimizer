import Link from "next/link";
import { getScenarios } from "@/lib/api";

export const dynamic = "force-dynamic";

const fleetStatus = [
  { label: "Available", value: "—", tone: "var(--green)" },
  { label: "Passenger trips", value: "—", tone: "var(--accent)" },
  { label: "Repositioning", value: "—", tone: "var(--blue)" },
  { label: "Charging", value: "—", tone: "var(--fg-muted)" },
];

const economics = [
  { label: "Contribution margin / vehicle-hour", value: "—" },
  { label: "Realized contribution margin", value: "—" },
  { label: "Revenue / vehicle-hour", value: "—" },
  { label: "Empty-mile ratio", value: "—" },
  { label: "Utilization", value: "—" },
  { label: "Demand fulfillment", value: "—" },
];

export default async function SimulatePage() {
  let scenarioName = "Manhattan weekday · 100 AVs";
  let fleetSize = 100;
  try {
    const scenarios = await getScenarios();
    if (scenarios.length > 0) {
      scenarioName = scenarios[0].name;
      fleetSize = scenarios[0].fleet_size;
    }
  } catch {
    // fall back to defaults; the dashboard shell still renders
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      {/* Header strip */}
      <div className="panel mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="text-[15px] font-semibold tracking-tight">AVantage</div>
          <div className="text-[12px] text-[var(--fg-muted)]">
            New York City · Digital fleet twin
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]">
          <Stat label="Fleet" value={`${fleetSize} AVs`} />
          <Stat label="Time" value="08:30" mono />
          <Stat label="Strategy" value="Optimized" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
              Status
            </span>
            <span className="rounded-sm border border-[var(--border-strong)] px-2 py-0.5 text-[11px] text-[var(--fg-muted)]">
              Replay · precomputed
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Map + controls */}
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-5 border-b border-[var(--border)] px-4">
            {["Fleet", "Demand", "Economics"].map((t, i) => (
              <button
                key={t}
                className={`-mb-px border-b-2 py-3 text-[13px] ${
                  i === 0
                    ? "border-[var(--accent)] text-[var(--fg)]"
                    : "border-transparent text-[var(--fg-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Map placeholder — MapLibre GL JS arrives in Phase 6 */}
          <div className="relative flex aspect-[4/3] items-center justify-center bg-[#0e1116]">
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative text-center">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                Static geographic preview
              </div>
              <div className="mt-2 text-[13px] text-[var(--fg-muted)]">
                Animated synthetic vehicle positions render here with MapLibre.
              </div>
              <div className="mt-1 text-[12px] text-[var(--fg-faint)]">
                Implemented in Phase 6 · Interactive map
              </div>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border)] px-4 py-3 text-[12px]">
            <button className="rounded border border-[var(--border-strong)] px-3 py-1.5 text-[var(--fg)]">
              ▶ Play
            </button>
            <div className="flex items-center gap-1">
              {["1×", "5×", "20×", "60×"].map((s, i) => (
                <button
                  key={s}
                  className={`rounded px-2 py-1 ${
                    i === 0
                      ? "bg-[var(--bg-elevated)] text-[var(--fg)]"
                      : "text-[var(--fg-muted)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="h-1 flex-1 min-w-[120px] rounded bg-[var(--bg-elevated)]">
              <div className="h-1 w-[35%] rounded bg-[var(--accent)]" />
            </div>
            <span className="tabular text-[var(--fg-faint)]">08:30 / 22:00</span>
            <div className="flex items-center gap-3 text-[var(--fg-muted)]">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" disabled /> Demand
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" disabled /> Repositioning
              </label>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          <div className="panel p-4">
            <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
              Fleet status
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fleetStatus.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: s.tone }}
                    />
                    <span className="text-[12px] text-[var(--fg-muted)]">{s.label}</span>
                  </div>
                  <div className="tabular mt-1 text-lg">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
              Economics
            </div>
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {economics.map((e) => (
                <div key={e.label} className="flex items-center justify-between py-2">
                  <span className="text-[12px] text-[var(--fg-muted)]">{e.label}</span>
                  <span className="tabular text-[13px]">{e.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <div className="text-[12px] text-[var(--fg-muted)]">
              Scenario
            </div>
            <div className="mt-1 text-[13px]">{scenarioName}</div>
            <Link
              href="/compare"
              className="mt-3 inline-block text-[12px] text-[var(--accent)] hover:opacity-90"
            >
              Compare against baseline →
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-[var(--fg-faint)]">
        Phase 1 foundation: dashboard shell wired to the API contract. The simulation
        engine, OR-Tools optimization, and animated map arrive in Phases 2–6.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
        {label}
      </span>
      <span className={`text-[13px] ${mono ? "tabular" : ""}`}>{value}</span>
    </div>
  );
}
