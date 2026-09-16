/**
 * API client.
 *
 * Resolution order for the base URL:
 *   1. API_URL              — server-side, Railway private networking
 *   2. NEXT_PUBLIC_API_URL  — browser-accessible URL
 *   3. http://localhost:8000 — local development
 *
 * Responses are validated with Zod at the boundary (see lib/schemas.ts).
 */
import { healthSchema, scenarioListSchema, type Health, type ScenarioSummary } from "./schemas";

const BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export const API_BASE = BASE_URL;

async function get<T>(path: string, parse: (data: unknown) => T, revalidate = 30): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return parse(await res.json());
}

export function getHealth(): Promise<Health> {
  return get("/health", (d) => healthSchema.parse(d), 10);
}

export function getScenarios(): Promise<ScenarioSummary[]> {
  return get("/scenarios", (d) => scenarioListSchema.parse(d), 60);
}
