"use client";

import { DAY_END_MS, DAY_START_MS, formatClock, useDashboard, type PlaybackSpeed } from "@/lib/store";
import type { TripRecord } from "@/lib/schemas";

const SPEEDS: PlaybackSpeed[] = [1, 5, 20, 60];

function clockMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function Timeline({ records }: { records: TripRecord[] }) {
  const playing = useDashboard((s) => s.playing);
  const speed = useDashboard((s) => s.speed);
  const timeMs = useDashboard((s) => s.timeMs);
  const toggle = useDashboard((s) => s.toggle);
  const setSpeed = useDashboard((s) => s.setSpeed);
  const seek = useDashboard((s) => s.seek);

  const nowMin = Math.floor(timeMs / 60000);
  const upcoming = records
    .filter((r) => {
      const t = clockMinutes(r.request_time);
      return t >= nowMin && t < nowMin + 45;
    })
    .slice(0, 6);

  return (
    <section aria-labelledby="timeline-heading" className="border-b border-[var(--border)] py-6">
      <h2 id="timeline-heading" className="mb-3 text-[13px] font-semibold tracking-tight">
        Simulated day
      </h2>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-9 w-9 items-center justify-center rounded bg-[var(--elevated)] hover:bg-[var(--surface)]"
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

            <span className="tabular text-[13px] text-[var(--fg)]">
              {formatClock(timeMs)}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[var(--fg-faint)]">
            <span>08:30</span>
            <span>22:00</span>
          </div>
        </div>

        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
            Next 45 min
          </div>
          <ul className="mt-2 flex flex-col divide-y divide-[var(--border)]">
            {upcoming.length === 0 && (
              <li className="py-2 text-[11px] text-[var(--fg-faint)]">
                No requests scheduled in this window.
              </li>
            )}
            {upcoming.map((r) => (
              <li key={r.record_id} className="flex items-center justify-between py-1.5">
                <span className="tabular text-[11px] text-[var(--fg-muted)]">
                  {r.request_time}
                </span>
                <span className="truncate text-[11px] text-[var(--fg-muted)]">
                  {r.origin_name}
                </span>
                <span className="tabular text-[11px]">
                  {r.served ? `$${r.fare_usd.toFixed(0)}` : "unserved"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
