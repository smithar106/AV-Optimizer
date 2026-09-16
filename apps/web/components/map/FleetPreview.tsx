import { STATUS_META, type VehicleStatus } from "@/lib/types";

/**
 * Lightweight Manhattan fleet preview for the landing page.
 *
 * Deliberately a static SVG rather than MapLibre: the landing page must not
 * download the map bundle or the full route dataset. Deterministic (seeded) so
 * server and client renders match. The full interactive MapLibre map lives in the
 * dashboard (Phase 6).
 */

const WIDTH = 640;
const HEIGHT = 520;

// Simple deterministic PRNG (mulberry32) — stable across renders.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dot = { x: number; y: number; status: VehicleStatus; r: number };

// Manhattan is a long, tilted island. Approximate with a rotated grid envelope.
function buildFleet(count = 100): Dot[] {
  const rand = rng(20260826);
  const distribution: [VehicleStatus, number][] = [
    ["on_trip", 0.34],
    ["idle", 0.3],
    ["pickup", 0.14],
    ["repositioning", 0.14],
    ["charging", 0.08],
  ];
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    // Sample within a rotated rectangle representing Manhattan.
    const u = rand();
    const v = rand();
    const along = (u - 0.5) * 460; // length of the island
    const across = (v - 0.5) * 150; // width
    const angle = (-29 * Math.PI) / 180;
    const x = WIDTH / 2 + along * Math.cos(angle) - across * Math.sin(angle);
    const y = HEIGHT / 2 + along * Math.sin(angle) + across * Math.cos(angle);

    // Weighted status pick
    let roll = rand();
    let status: VehicleStatus = "idle";
    for (const [s, w] of distribution) {
      if (roll < w) {
        status = s;
        break;
      }
      roll -= w;
    }
    dots.push({ x, y, status, r: status === "on_trip" ? 3.4 : 2.8 });
  }
  return dots;
}

function counts(dots: Dot[]): Record<VehicleStatus, number> {
  const out: Record<VehicleStatus, number> = {
    idle: 0,
    on_trip: 0,
    pickup: 0,
    repositioning: 0,
    charging: 0,
  };
  for (const d of dots) out[d.status] += 1;
  return out;
}

export function FleetPreview({ fill = false }: { fill?: boolean }) {
  const dots = buildFleet(100);
  const c = counts(dots);

  if (fill) {
    return (
      <div className="absolute inset-0 bg-[#0c1420]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          role="img"
          aria-label="Preview of 100 synthetic autonomous vehicles distributed across Manhattan, colored by operating status."
        >
          {renderIsland()}
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={STATUS_META[d.status].token}
              opacity={d.status === "idle" ? 0.6 : 0.95}
            />
          ))}
        </svg>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1.5 rounded border border-[var(--border)] bg-[var(--bg)]/85 px-3 py-2 backdrop-blur-sm">
          {(Object.keys(STATUS_META) as VehicleStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[11px]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: STATUS_META[s].token }}
              />
              <span className="text-[var(--fg-muted)]">{STATUS_META[s].label}</span>
              <span className="tabular text-[var(--fg)]">{c[s]}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--mint)" }}
          />
          Manhattan digital twin
        </div>
        <div className="tabular text-[11px] text-[var(--fg-faint)]">
          100 synthetic AVs
        </div>
      </div>

      <div className="relative bg-[#0c1420]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Static preview of 100 synthetic autonomous vehicles distributed across Manhattan, colored by operating status."
        >
          {renderIsland()}
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={STATUS_META[d.status].token}
              opacity={d.status === "idle" ? 0.65 : 0.95}
            />
          ))}
        </svg>

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1.5 rounded border border-[var(--border)] bg-[var(--bg)]/85 px-3 py-2 backdrop-blur-sm">
          {(Object.keys(STATUS_META) as VehicleStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[11px]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: STATUS_META[s].token }}
              />
              <span className="text-[var(--fg-muted)]">{STATUS_META[s].label}</span>
              <span className="tabular text-[var(--fg)]">{c[s]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderIsland() {
  return (
    <g transform={`rotate(-29 ${WIDTH / 2} ${HEIGHT / 2})`} opacity="0.9">
      <rect
        x={WIDTH / 2 - 232}
        y={HEIGHT / 2 - 78}
        width={464}
        height={156}
        rx={10}
        fill="#0f1a2a"
        stroke="var(--border)"
      />
      {Array.from({ length: 11 }).map((_, i) => {
        const x = WIDTH / 2 - 232 + (i + 1) * (464 / 12);
        return (
          <line
            key={`a${i}`}
            x1={x}
            y1={HEIGHT / 2 - 78}
            x2={x}
            y2={HEIGHT / 2 + 78}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.55"
          />
        );
      })}
      {Array.from({ length: 5 }).map((_, i) => {
        const y = HEIGHT / 2 - 78 + (i + 1) * (156 / 6);
        return (
          <line
            key={`s${i}`}
            x1={WIDTH / 2 - 232}
            y1={y}
            x2={WIDTH / 2 + 232}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.45"
          />
        );
      })}
    </g>
  );
}
