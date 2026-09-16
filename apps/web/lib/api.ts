/**
 * API client.
 *
 * Resolution order for the base URL:
 *   1. API_URL              — server-side, Railway private networking (e.g. http://avantage-api.railway.internal)
 *   2. NEXT_PUBLIC_API_URL  — browser-accessible URL
 *   3. http://localhost:8000 — local development
 */
const BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export const API_BASE = BASE_URL;

export type Health = {
  status: string;
  service: string;
  version: string;
  environment: string;
};

export type Scenario = {
  id: string;
  name: string;
  city: string;
  service_area: string;
  fleet_size: number;
  strategy: "baseline" | "optimized";
  seed: number;
  description: string;
};

async function get<T>(path: string, revalidate = 30): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

export function getHealth(): Promise<Health> {
  return get<Health>("/health", 10);
}

export function getScenarios(): Promise<Scenario[]> {
  return get<Scenario[]>("/scenarios", 60);
}
