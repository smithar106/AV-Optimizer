"use client";

import { useDashboard, type DashboardMode } from "@/lib/store";

type Mode = { id: DashboardMode; label: string; icon: React.ReactNode };

const icon = (path: string) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

const modes: Mode[] = [
  { id: "fleet", label: "Fleet operations", icon: icon("M3 12h4l2-7 4 14 2-7h6") },
  { id: "demand", label: "Demand intelligence", icon: icon("M3 17l5-5 4 4 9-9") },
  { id: "decisions", label: "Optimization decisions", icon: icon("M12 3v18M3 12h18") },
  { id: "revenue", label: "Revenue intelligence", icon: icon("M4 19V5m0 14h16M8 15l3-4 3 2 4-6") },
  { id: "comparison", label: "Strategy comparison", icon: icon("M4 6h7v12H4zM13 6h7v12h-7z") },
];

export function NavRail() {
  const mode = useDashboard((s) => s.mode);
  const setMode = useDashboard((s) => s.setMode);

  return (
    <nav
      aria-label="Dashboard modes"
      className="flex flex-col items-center gap-1 border-r border-[var(--border)] bg-[var(--bg)] py-3"
    >
      {modes.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={active}
            aria-label={m.label}
            title={m.label}
            className={`flex h-11 w-11 items-center justify-center rounded transition-colors ${
              active
                ? "bg-[var(--elevated)] text-[var(--mint)]"
                : "text-[var(--fg-faint)] hover:bg-[var(--surface)] hover:text-[var(--fg-muted)]"
            }`}
          >
            {m.icon}
          </button>
        );
      })}
    </nav>
  );
}
