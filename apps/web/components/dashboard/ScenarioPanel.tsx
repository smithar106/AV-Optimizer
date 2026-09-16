"use client";

import type { DataManifest, DemoMeta, ScenarioSummary } from "@/lib/schemas";

const POLICIES = [
  { id: "baseline", label: "Nearest feasible", note: "A · no repositioning" },
  { id: "optimized_dispatch", label: "Optimized dispatch", note: "B · no repositioning" },
  {
    id: "optimized_repositioning",
    label: "Nearest + reposition",
    note: "C · repositioning",
  },
  { id: "fully_optimized", label: "Fully optimized", note: "D · dispatch + reposition" },
];

const assumptions = [
  ["Average operator fare", "$18"],
  ["Electricity", "$0.18 / kWh"],
  ["Non-energy cost", "$0.12 / mi"],
  ["Energy use", "0.32 kWh / mi"],
  ["Transaction cost", "$3.00"],
];

export function ScenarioPanel({
  scenarios,
  demo,
  manifest,
  policy,
  onPolicyChange,
}: {
  scenarios: ScenarioSummary[];
  demo: DemoMeta | null;
  manifest: DataManifest | null;
  policy: string;
  onPolicyChange: (p: string) => void;
}) {
  const scenario = scenarios[0];

  return (
    <aside
      aria-label="Scenario configuration"
      className="flex flex-col gap-4 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg)] p-4"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
          Scenario
        </div>
        <div className="mt-1.5 text-[14px] font-medium">
          {scenario?.name ?? "Manhattan weekday · 100 AVs"}
        </div>
        <div className="mt-1 text-[12px] text-[var(--fg-muted)]">
          {scenario?.city ?? "New York City"} · {scenario?.service_area ?? "Manhattan"}
        </div>
        {demo && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-sm border border-[var(--border-strong)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            {demo.verified ? "Verified" : "Preview"}
          </div>
        )}
      </div>

      <div className="h-px bg-[var(--border)]" />

      <fieldset>
        <legend className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
          Strategy
        </legend>
        <div className="mt-2 flex flex-col gap-1">
          {POLICIES.map((p) => {
            const active = p.id === policy;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPolicyChange(p.id)}
                aria-pressed={active}
                className={`rounded border px-2.5 py-2 text-left transition-colors ${
                  active
                    ? "border-[var(--mint)] bg-[var(--surface)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px]">{p.label}</span>
                  {active && (
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--mint)" }}
                    />
                  )}
                </div>
                <div className="mt-0.5 text-[10px] text-[var(--fg-faint)]">{p.note}</div>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="h-px bg-[var(--border)]" />

      <div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
          Assumptions
        </div>
        <dl className="mt-2 flex flex-col divide-y divide-[var(--border)]">
          {assumptions.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <dt className="text-[11px] text-[var(--fg-muted)]">{k}</dt>
              <dd className="tabular text-[11px]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="h-px bg-[var(--border)]" />

      <button
        type="button"
        disabled
        title="Bounded custom runs arrive with the optimization engine"
        className="rounded border border-[var(--border-strong)] px-3 py-2 text-[12px] text-[var(--fg-faint)]"
      >
        Run custom scenario
      </button>

      {manifest && (
        <div className="mt-auto text-[10px] leading-relaxed text-[var(--fg-faint)]">
          <div>schema {manifest.schema_version}</div>
          <div>seed {manifest.seed}</div>
          <div className="truncate" title={manifest.dataset_id}>
            {manifest.dataset_id}
          </div>
        </div>
      )}
    </aside>
  );
}
