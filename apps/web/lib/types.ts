/**
 * Shared domain types for the AVantage frontend.
 *
 * These mirror the backend API contracts. Runtime validation of API responses is
 * handled separately with Zod (see lib/schemas.ts) — TypeScript alone does not
 * guarantee that a backend response matches its declared interface.
 */

export type VehicleStatus =
  | "idle"
  | "pickup"
  | "on_trip"
  | "repositioning"
  | "charging";

export type Policy =
  | "baseline"
  | "optimized_dispatch"
  | "optimized_repositioning"
  | "fully_optimized";

export interface VehicleSnapshot {
  vehicleId: string;
  timestampMs: number;
  longitude: number;
  latitude: number;
  status: VehicleStatus;
  batterySoc: number;
  routeId: string | null;
  progress: number;
}

export interface FleetMetrics {
  timestampMs: number;
  completedTrips: number;
  generatedRequests: number;
  realizedRevenueUsd: number;
  variableCostsUsd: number;
  contributionMarginUsd: number;
  occupiedMiles: number;
  emptyMiles: number;
  deployedVehicleHours: number;
  meanPickupEtaMinutes: number | null;
}

export interface SimulationScenario {
  id: string;
  name: string;
  datasetId: string;
  seed: number;
  fleetSize: number;
  policy: Policy;
  startTime: string;
  endTime: string;
  status: "pending" | "running" | "completed" | "failed";
}

export interface ScenarioSummary {
  id: string;
  name: string;
  city: string;
  service_area: string;
  fleet_size: number;
  strategy: "baseline" | "optimized";
  seed: number;
  description: string;
}

/** Status → design token mapping. Never rely on color alone to convey state. */
export const STATUS_META: Record<
  VehicleStatus,
  { label: string; token: string; icon: string }
> = {
  idle: { label: "Idle", token: "var(--fg-muted)", icon: "○" },
  on_trip: { label: "On trip", token: "var(--blue)", icon: "●" },
  pickup: { label: "Pickup", token: "var(--mint)", icon: "◐" },
  repositioning: { label: "Repositioning", token: "var(--amber)", icon: "◆" },
  charging: { label: "Charging", token: "var(--purple)", icon: "◈" },
};
