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

export const demoMetaSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  city: z.string(),
  service_area: z.string(),
  fleet_size: z.number(),
  default_scenario_id: z.string(),
  optimization: z.string(),
  objective: z.string(),
  verified: z.boolean(),
  note: z.string(),
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

export const dataManifestSchema = z.object({
  schema_version: z.string(),
  simulation_version: z.string(),
  scenario_id: z.string(),
  dataset_id: z.string(),
  seed: z.number(),
  dataset_checksum: z.string().nullable(),
  generated_at: z.string().nullable(),
  sources: z.array(
    z.object({ name: z.string(), role: z.string(), status: z.string() }),
  ),
  note: z.string(),
});

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

export const snapshotsSchema = z.object({
  run_id: z.string(),
  snapshots: z.array(
    z.object({
      timestampMs: z.number(),
      vehicles: z.array(vehicleSnapshotSchema),
    }),
  ),
  note: z.string().optional(),
});

export const routesSchema = z.object({
  run_id: z.string(),
  routes: z.array(
    z.object({
      routeId: z.string(),
      coordinates: z.array(z.tuple([z.number(), z.number()])),
    }),
  ),
  note: z.string().optional(),
});

export const eventsSchema = z.object({
  run_id: z.string(),
  events: z.array(
    z.object({
      timestampMs: z.number(),
      kind: z.string(),
      vehicleId: z.string().nullable().optional(),
      detail: z.string(),
    }),
  ),
  note: z.string().optional(),
});

export const metricsSchema = z.object({
  timestampMs: z.number().nullable().optional(),
  completedTrips: z.number().nullable().optional(),
  generatedRequests: z.number().nullable().optional(),
  realizedRevenueUsd: z.number().nullable().optional(),
  variableCostsUsd: z.number().nullable().optional(),
  contributionMarginUsd: z.number().nullable().optional(),
  occupiedMiles: z.number().nullable().optional(),
  emptyMiles: z.number().nullable().optional(),
  deployedVehicleHours: z.number().nullable().optional(),
  meanPickupEtaMinutes: z.number().nullable().optional(),
  contribution_margin_per_vehicle_hour: z.number().nullable().optional(),
  revenue_per_vehicle_hour: z.number().nullable().optional(),
  demand_fulfillment: z.number().nullable().optional(),
  empty_mile_ratio: z.number().nullable().optional(),
  utilization: z.number().nullable().optional(),
  service_coverage: z.number().nullable().optional(),
  energy_kwh: z.number().nullable().optional(),
  unserved_requests: z.number().nullable().optional(),
});
export const compareSchema = z.object({
  scenario_id: z.string(),
  seeds: z.array(z.number()),
  policies: z.array(
    z.object({
      policy: z.string(),
      label: z.string(),
      metrics: z.unknown().nullable(),
    }),
  ),
  note: z.string().optional(),
});

export const tripRecordSchema = z.object({
  record_id: z.number(),
  request_id: z.number(),
  strategy: z.enum(["baseline", "optimized"]),
  request_time: z.string(),
  origin_zone: z.number(),
  origin_name: z.string(),
  destination_zone: z.number(),
  destination_name: z.string(),
  distance_mi: z.number(),
  duration_min: z.number(),
  fare_usd: z.number(),
  pickup_eta_min: z.number(),
  empty_miles: z.number(),
  total_miles: z.number(),
  served: z.boolean(),
  contribution_usd: z.number(),
});

export const recordsResponseSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  rows: z.array(tripRecordSchema),
});

const strategyMetricsSchema = z.object({
  strategy: z.string(),
  generated_requests: z.number(),
  served: z.number(),
  unserved: z.number(),
  demand_fulfillment: z.number().nullable(),
  revenue_usd: z.number().nullable(),
  contribution_usd: z.number().nullable(),
  contribution_per_vehicle_hour: z.number().nullable(),
  empty_mile_ratio: z.number().nullable(),
  avg_pickup_eta_min: z.number().nullable(),
  p90_pickup_eta_min: z.number().nullable(),
  total_miles: z.number().nullable(),
  energy_kwh: z.number().nullable(),
});

export const metricsSummarySchema = z.object({
  dataset_id: z.string().nullable(),
  fleet_size: z.number().nullable(),
  day_hours: z.number().nullable(),
  baseline: strategyMetricsSchema,
  optimized: strategyMetricsSchema,
  deltas: z.object({
    contribution_usd: z.number(),
    demand_fulfillment: z.number(),
    empty_mile_ratio: z.number(),
    avg_pickup_eta_min: z.number(),
  }),
});

export type Health = z.infer<typeof healthSchema>;
export type DemoMeta = z.infer<typeof demoMetaSchema>;
export type ScenarioSummary = z.infer<typeof scenarioSummarySchema>;
export type DataManifest = z.infer<typeof dataManifestSchema>;
export type VehicleSnapshot = z.infer<typeof vehicleSnapshotSchema>;
export type SnapshotsResponse = z.infer<typeof snapshotsSchema>;
export type RoutesResponse = z.infer<typeof routesSchema>;
export type EventsResponse = z.infer<typeof eventsSchema>;
export type FleetMetrics = z.infer<typeof metricsSchema>;
export type CompareResult = z.infer<typeof compareSchema>;
export type TripRecord = z.infer<typeof tripRecordSchema>;
export type RecordsResponse = z.infer<typeof recordsResponseSchema>;
export type MetricsSummary = z.infer<typeof metricsSummarySchema>;
