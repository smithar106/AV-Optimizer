/**
 * Runtime validation of API responses.
 *
 * The backend is a separate service; a TypeScript interface does not guarantee the
 * wire format. Validate at the boundary and fail loudly in development.
 */
import { z } from "zod";

export const healthSchema = z.object({
  status: z.string(),
  service: z.string(),
  version: z.string(),
  environment: z.string(),
});

export const scenarioSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  service_area: z.string(),
  fleet_size: z.number(),
  strategy: z.enum(["baseline", "optimized"]),
  seed: z.number(),
  description: z.string(),
});

export const scenarioListSchema = z.array(scenarioSummarySchema);

export const vehicleStatusSchema = z.enum([
  "idle",
  "pickup",
  "on_trip",
  "repositioning",
  "charging",
]);

export const policySchema = z.enum([
  "baseline",
  "optimized_dispatch",
  "optimized_repositioning",
  "fully_optimized",
]);

export const vehicleSnapshotSchema = z.object({
  vehicleId: z.string(),
  timestampMs: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  status: vehicleStatusSchema,
  batterySoc: z.number(),
  routeId: z.string().nullable(),
  progress: z.number(),
});

export const fleetMetricsSchema = z.object({
  timestampMs: z.number(),
  completedTrips: z.number(),
  generatedRequests: z.number(),
  realizedRevenueUsd: z.number(),
  variableCostsUsd: z.number(),
  contributionMarginUsd: z.number(),
  occupiedMiles: z.number(),
  emptyMiles: z.number(),
  deployedVehicleHours: z.number(),
  meanPickupEtaMinutes: z.number().nullable(),
});

export const simulationScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  datasetId: z.string(),
  seed: z.number(),
  fleetSize: z.number(),
  policy: policySchema,
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
});

export type Health = z.infer<typeof healthSchema>;
export type ScenarioSummary = z.infer<typeof scenarioSummarySchema>;
export type VehicleSnapshot = z.infer<typeof vehicleSnapshotSchema>;
export type FleetMetrics = z.infer<typeof fleetMetricsSchema>;
export type SimulationScenario = z.infer<typeof simulationScenarioSchema>;
