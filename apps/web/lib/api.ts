/**
 * API client.
 *
 * Resolution order for the base URL:
 *   1. API_URL              — server-side, Railway private networking
 *   2. NEXT_PUBLIC_API_URL  — browser-accessible URL
 *   3. http://localhost:8000 — local development
 *
 * Server state is fetched through TanStack Query in components; these helpers are
 * the transport + boundary validation layer. Responses are validated with Zod.
 */
import {
  compareSchema,
  demoMetaSchema,
  dataManifestSchema,
  eventsSchema,
  healthSchema,
  metricsSchema,
  routesSchema,
  scenarioListSchema,
  snapshotsSchema,
  type CompareResult,
  type DataManifest,
  type DemoMeta,
  type EventsResponse,
  type FleetMetrics,
  type Health,
  type RoutesResponse,
  type ScenarioSummary,
  type SnapshotsResponse,
} from "./schemas";

const BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export const API_BASE = BASE_URL;

async function get<T>(
  path: string,
  parse: (data: unknown) => T,
  revalidate = 30,
): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return parse(await res.json());
}

export function getHealth(): Promise<Health> {
  return get("/health", (d) => healthSchema.parse(d), 10);
}

export function getDemo(): Promise<DemoMeta> {
  return get("/demo", (d) => demoMetaSchema.parse(d), 60);
}

export function getScenarios(): Promise<ScenarioSummary[]> {
  return get("/scenarios", (d) => scenarioListSchema.parse(d), 60);
}

export function getDataManifest(): Promise<DataManifest> {
  return get("/data-manifest", (d) => dataManifestSchema.parse(d), 60);
}

export function getMetrics(runId: string): Promise<FleetMetrics> {
  return get(`/simulations/${runId}/metrics`, (d) => metricsSchema.parse(d), 5);
}

export function getSnapshots(runId: string): Promise<SnapshotsResponse> {
  return get(`/simulations/${runId}/snapshots`, (d) => snapshotsSchema.parse(d), 5);
}

export function getRoutes(runId: string): Promise<RoutesResponse> {
  return get(`/simulations/${runId}/routes`, (d) => routesSchema.parse(d), 30);
}

export function getEvents(runId: string): Promise<EventsResponse> {
  return get(`/simulations/${runId}/events`, (d) => eventsSchema.parse(d), 5);
}

export async function postCompare(body: {
  scenario_id: string;
  policies?: string[];
  seeds?: number[];
  duration_minutes?: number;
}): Promise<CompareResult> {
  const res = await fetch(`${BASE_URL}/api/v1/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API /compare -> ${res.status}`);
  return compareSchema.parse(await res.json());
}
