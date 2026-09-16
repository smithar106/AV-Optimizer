import Link from "next/link";
import { FleetPreview } from "@/components/map/FleetPreview";

const GITHUB_URL = "https://github.com/smithar106/AV-Optimizer";

const previewFacts = [
  { label: "Vehicles", value: "100" },
  { label: "Service area", value: "Manhattan" },
  { label: "Optimization", value: "OR-Tools" },
  { label: "Objective", value: "Margin" },
];

const problem = [
  {
    title: "Idle capacity in the wrong place",
    body: "A vehicle waiting where demand has already passed earns nothing, and a request two minutes away goes unserved.",
  },
  {
    title: "Empty miles that still cost money",
    body: "Every repositioning move consumes energy and vehicle time. Without a demand-aware policy, that travel is unproductive.",
  },
  {
    title: "High-value trips that shrink coverage",
    body: "Chasing the best fare can pull supply away from an area about to need it, trading today's revenue for tomorrow's service.",
  },
];

const solution = [
  {
    name: "Dispatch",
    body: "Assign vehicles to requests by modeled contribution — fare, pickup distance, trip distance, time, and future positioning value — not by proximity alone.",
    token: "var(--blue)",
  },
  {
    name: "Demand forecasting",
    body: "Estimate demand over the next 30 minutes from historical patterns so idle supply can be positioned before requests arrive.",
    token: "var(--mint)",
  },
  {
    name: "Repositioning",
    body: "Move remaining idle vehicles toward forecast demand, weighing repositioning cost against the opportunity cost of leaving an area.",
    token: "var(--amber)",
  },
];

const methodology = [
  {
    title: "Demand model",
    body: "NYC TLC trip records aggregated into 5-minute origin–destination demand, scaled by a configurable market-capture parameter and drawn as a seeded Poisson process.",
  },
  {
    title: "Synthetic fleet",
    body: "100 hypothetical electric AVs with explicit operational states — idle, pickup, repositioning, on trip, charging — and battery that depletes with distance.",
  },
  {
    title: "Optimization",
    body: "A two-stage rolling-horizon solve every five simulated minutes: dispatch assignments, then reposition remaining idle supply. Solved with Google OR-Tools.",
  },
  {
    title: "Contribution margin",
    body: "CM = revenue − energy − distance − time − transaction costs. Revenue is recognized only for completed rides; fixed costs are reported separately.",
  },
];

const kpiRow = [
  "Contribution margin / vehicle-hour",
  "Realized contribution margin",
  "Demand fulfillment",
  "Empty-mile ratio",
  "Average & P90 pickup ETA",
  "Service coverage",
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-5">
      {/* Hero */}
      <section className="border-b border-[var(--border)] py-16 sm:py-20">
        <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          <span className="rounded-sm border border-[var(--border-strong)] px-2 py-0.5">
            Open source
          </span>
          <span>Autonomous fleet intelligence</span>
        </div>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          The next mile is a decision.
        </h1>
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--fg-muted)]">
          Simulate 100 autonomous vehicles across New York City. Optimize dispatch and
          repositioning. Discover how operational decisions change fleet economics.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/simulate"
            className="rounded bg-[var(--mint)] px-5 py-2.5 text-[13px] font-semibold text-[#08130f] transition-opacity hover:opacity-90"
          >
            Explore the simulation
          </Link>
          <Link
            href="/methodology"
            className="rounded border border-[var(--border-strong)] px-5 py-2.5 text-[13px] font-medium text-[var(--fg)] transition-colors hover:bg-[var(--surface)]"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Product preview */}
      <section className="grid gap-8 border-b border-[var(--border)] py-14 lg:grid-cols-[1.55fr_1fr]">
        <FleetPreview />
        <div className="flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
            Fleet status
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Optimize the decisions behind every ride.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--fg-muted)]">
            Compare dispatch strategies, repositioning policies, and modeled
            contribution margin using identical demand scenarios — the same fleet,
            requests, prices, and travel times for every policy.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4 lg:grid-cols-2">
            {previewFacts.map((f) => (
              <div key={f.label} className="bg-[var(--surface)] px-3 py-3.5">
                <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
                  {f.label}
                </div>
                <div className="tabular mt-1 text-[15px]">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-[var(--border)] py-14">
        <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
          The problem
        </div>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">
          Idle vehicles and unmet demand can exist at the same time.
        </h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
          {problem.map((p) => (
            <div key={p.title} className="bg-[var(--surface)] p-5">
              <div className="text-[14px] font-semibold">{p.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="border-b border-[var(--border)] py-14">
        <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
          The approach
        </div>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">
          A demand-aware policy, compared against a credible baseline.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {solution.map((s) => (
            <div key={s.name} className="panel p-5">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: s.token }}
                />
                <span className="text-[14px] font-semibold">{s.name}</span>
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="border-b border-[var(--border)] py-14">
        <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
          Results
        </div>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">
          Verified experiment metrics appear here.
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
          No savings are claimed until the optimization engine produces results and they
          are checked against the simulation event log. Until then, this section shows
          the evaluation design — not a headline number.
        </p>
        <div className="mt-8 grid gap-px overflow-hidden rounded border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {kpiRow.map((k) => (
            <div
              key={k}
              className="flex items-center justify-between bg-[var(--surface)] px-4 py-3.5"
            >
              <span className="text-[13px] text-[var(--fg-muted)]">{k}</span>
              <span className="tabular text-[13px] text-[var(--fg-faint)]">—</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-[var(--fg-faint)]">
          Paired differences across ≥20 independent demand seeds · policies A/B/C/D to
          isolate dispatch vs. repositioning effects.
        </p>
      </section>

      {/* Methodology */}
      <section className="py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
              Methodology
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Data, equations, and explicit assumptions.
            </h2>
          </div>
          <Link
            href="/methodology"
            className="text-[13px] text-[var(--mint)] hover:opacity-90"
          >
            Read the methodology →
          </Link>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
          {methodology.map((m) => (
            <div key={m.title} className="bg-[var(--surface)] p-5">
              <div className="text-[14px] font-semibold">{m.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {m.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-[var(--border-strong)] px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--surface)]"
          >
            View source on GitHub
          </a>
          <Link
            href="/compare"
            className="rounded border border-[var(--border-strong)] px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--surface)]"
          >
            Compare strategies
          </Link>
        </div>
      </section>
    </div>
  );
}
