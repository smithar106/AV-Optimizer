/**
 * Dashboard playback + selection state (Zustand).
 *
 * Server data (records, metrics) lives in TanStack Query / server components and is
 * deliberately not copied here. This store holds only the playback clock and the
 * selected strategy, so a single clock drives the timeline and the trip list.
 */
import { create } from "zustand";

export type PlaybackSpeed = 1 | 5 | 20 | 60;
export type Strategy = "baseline" | "optimized";

interface DashboardState {
  playing: boolean;
  speed: PlaybackSpeed;
  timeMs: number;
  strategy: Strategy;

  pause: () => void;
  toggle: () => void;
  setSpeed: (s: PlaybackSpeed) => void;
  seek: (ms: number) => void;
  setStrategy: (s: Strategy) => void;
}

// Representative simulated day: 08:30 → 22:00.
export const DAY_START_MS = 8.5 * 60 * 60 * 1000;
export const DAY_END_MS = 22 * 60 * 60 * 1000;

export const useDashboard = create<DashboardState>((set) => ({
  playing: false,
  speed: 5,
  timeMs: DAY_START_MS,
  strategy: "optimized",

  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  setSpeed: (speed) => set({ speed }),
  seek: (ms) => set({ timeMs: Math.max(DAY_START_MS, Math.min(ms, DAY_END_MS)) }),
  setStrategy: (strategy) => set({ strategy }),
}));

/** Format a millisecond offset from midnight as HH:MM. */
export function formatClock(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
