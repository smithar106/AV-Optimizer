/**
 * Shared UI + playback state (Zustand).
 *
 * Server state (scenarios, snapshots, metrics, routes) lives in TanStack Query and
 * is deliberately NOT copied here. This store holds only client state: the playback
 * clock and the UI selection. A single playback clock drives every map layer and KPI
 * chart — there are no separate timers.
 */
import { create } from "zustand";

export type DashboardMode =
  | "fleet"
  | "demand"
  | "decisions"
  | "revenue"
  | "comparison";

export type PlaybackSpeed = 1 | 5 | 20 | 60;

interface DashboardState {
  // playback
  playing: boolean;
  speed: PlaybackSpeed;
  timeMs: number;
  durationMs: number;

  // ui
  mode: DashboardMode;
  policy: string;
  selectedVehicleId: string | null;
  showDemand: boolean;
  showRepositioning: boolean;
  panelsOpen: boolean;

  // actions
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setSpeed: (s: PlaybackSpeed) => void;
  seek: (ms: number) => void;
  setDuration: (ms: number) => void;
  setMode: (m: DashboardMode) => void;
  setPolicy: (p: string) => void;
  selectVehicle: (id: string | null) => void;
  toggleDemand: () => void;
  toggleRepositioning: () => void;
  togglePanels: () => void;
}

// Representative simulated day: 08:30 → 22:00.
export const DAY_START_MS = 8.5 * 60 * 60 * 1000;
export const DAY_END_MS = 22 * 60 * 60 * 1000;

export const useDashboard = create<DashboardState>((set) => ({
  playing: false,
  speed: 5,
  timeMs: DAY_START_MS,
  durationMs: DAY_END_MS - DAY_START_MS,

  mode: "fleet",
  policy: "fully_optimized",
  selectedVehicleId: null,
  showDemand: false,
  showRepositioning: true,
  panelsOpen: true,

  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  setSpeed: (speed) => set({ speed }),
  seek: (ms) => set({ timeMs: Math.max(0, Math.min(ms, DAY_END_MS)) }),
  setDuration: (durationMs) => set({ durationMs }),
  setMode: (mode) => set({ mode }),
  setPolicy: (policy) => set({ policy }),
  selectVehicle: (selectedVehicleId) => set({ selectedVehicleId }),
  toggleDemand: () => set((s) => ({ showDemand: !s.showDemand })),
  toggleRepositioning: () => set((s) => ({ showRepositioning: !s.showRepositioning })),
  togglePanels: () => set((s) => ({ panelsOpen: !s.panelsOpen })),
}));

/** Format a millisecond offset from midnight as HH:MM. */
export function formatClock(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
