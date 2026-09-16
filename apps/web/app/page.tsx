import Link from "next/link";
import { getHealth, type Health } from "@/lib/api";

const facts = [
  { label: "Demonstration city", value: "New York City" },
  { label: "Fleet", value: "100 synthetic AVs" },
  { label: "Primary objective", value: "Contribution margin" },
  { label: "Optimization", value: "Dispatch + repositioning" },
];

const actions = [
  {
    href: "/simulate",
    title: "Explore fleet simulation",
    body: "Watch a synthetic fleet move across Manhattan and follow the economics as it runs.",
  },
  {
    href: "/compare",
    title: "Compare optimization strategies",
    body: "Nearest-vehicle baseline vs. demand-aware dispatch, under identical conditions.",
  },
  {
    href: "/methodology",
    title: "Explore the methodology",
    body: "The demand model, optimization formulation, and contribution-margin assumptions.",
  },
];

export default async function Home() {
  let health: Health | null = null;
  let healthError = false;
  try {
    health = await getHealth();
  } catch {
    healthError = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="border-b border-[var(--border)] py-14">
        <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
          <span>Open-source fleet simulation</span>
          <span aria-hidden>·</span>
          <span>Operations research</span>
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Can demand-aware dispatch improve autonomous fleet contribution margin?
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
          Fleet profitability is not simply a function of the number of vehicles or
          rides. It depends on which requests are served, how far vehicles travel
          empty, where idle capacity is positioned, and whether those decisions
          compromise future service. AVantage makes those trade-offs visible through a
          real optimization engine, a simulated fleet, and a reproducible financial
          model.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/simulate"
            className="rounded bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-black transition-opacity hover:opacity-90"
          >
            Explore fleet simulation
          </Link>
          <Link
            href="/compare"
            className="rounded border border-[var(--border-strong)] px-4 py-2 text-[13px] font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-elevated)]"
          >
            Compare strategies
          </Link>
          <Link
            href="/methodology"
            className="rounded border border-[var(--border-strong)] px-4 py-2 text-[13px] font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-elevated)]"
          >
            Methodology
          </Link>
        </div>
      </section>

      {/* Facts */}
      <section className="grid grid-cols-2 gap-px border-b border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="bg-[var(--bg)] px-1 py-5">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
              {f.label}
            </div>
            <div className="mt-1 text-[15px] font-medium">{f.value}</div>
          </div>
        ))}
      </section>

      {/* Actions */}
      <section className="grid gap-4 py-10 md:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="panel group flex flex-col justify-between p-5 transition-colors hover:border-[var(--border-strong)]"
          >
            <div>
              <div className="text-[15px] font-semibold">{a.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {a.body}
              </p>
            </div>
            <div className="mt-5 text-[12px] text-[var(--fg-faint)] transition-colors group-hover:text-[var(--accent)]">
              Open →
            </div>
          </Link>
        ))}
      </section>

      {/* Status strip */}
      <section className="panel mb-14 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="text-[12px] text-[var(--fg-muted)]">
          System status · API and simulation services
        </div>
        <div className="flex items-center gap-3 text-[12px]">
          {health ? (
            <>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--green)" }}
                />
                {health.service} v{health.version} · {health.environment}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: healthError ? "var(--red)" : "var(--fg-faint)" }}
              />
              API unavailable
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
