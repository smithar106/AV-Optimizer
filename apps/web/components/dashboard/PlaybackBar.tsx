"use client";

import { DAY_START_MS, DAY_END_MS, formatClock, useDashboard, type PlaybackSpeed } from "@/lib/store";

const SPEEDS: PlaybackSpeed[] = [1, 5, 20, 60];

export function PlaybackBar() {
  const playing = useDashboard((s) => s.playing);
  const speed = useDashboard((s) => s.speed);
  const timeMs = useDashboard((s) => s.timeMs);
  const toggle = useDashboard((s) => s.toggle);
  const setSpeed = useDashboard((s) => s.setSpeed);
  const seek = useDashboard((s) => s.seek);

  const span = DAY_END_MS - DAY_START_MS;
  const pct = Math.round(((timeMs - DAY_START_MS) / span) * 100);

  return (
    <section
      aria-label="Playback and event stream"
      className="grid grid-cols-1 border-t border-[var(--border)] bg-[var(--bg)] lg:grid-cols-[minmax(0,1fr)_420px]"
    >
      {/* Timeline */}
      <div className="flex flex-col justify-center gap-2 border-b border-[var(--border)] px-4 py-2.5 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause playback" : "Play playback"}
            className="flex h-8 w-8 items-center justify-center rounded bg-[var(--elevated)] text-[var(--fg)] hover:bg-[var(--surface)]"
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <div className="flex items-center gap-0.5" role="group" aria-label="Playback speed">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                aria-pressed={s === speed}
                className={`tabular rounded px-2 py-1 text-[11px] ${
                  s === speed
                    ? "bg-[var(--elevated)] text-[var(--fg)]"
                    : "text-[var(--fg-faint)] hover:text-[var(--fg-muted)]"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          <input
            type="range"
            min={DAY_START_MS}
            max={DAY_END_MS}
            step={60000}
            value={timeMs}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Scrub simulated time"
            className="h-1 flex-1 cursor-pointer accent-[var(--mint)]"
          />

          <span className="tabular text-[12px] text-[var(--fg-muted)]">
            {formatClock(timeMs)} / {formatClock(DAY_END_MS)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[var(--fg-faint)]">
          <span>Simulated timeline · 08:30 → 22:00</span>
          <span className="tabular">{pct}%</span>
        </div>
      </div>

      {/* Event stream */}
      <div className="flex min-h-0 flex-col px-4 py-2.5">
        <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
          Event stream
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex h-full items-center justify-center rounded border border-[var(--border)] p-4 text-center text-[11px] leading-relaxed text-[var(--fg-faint)]">
            No events recorded. Trip, repositioning, and decision events populate when a
            simulation run completes.
          </div>
        </div>
      </div>
    </section>
  );
}
