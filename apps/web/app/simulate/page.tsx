import { Dashboard } from "@/components/dashboard/Dashboard";
import { getMetricsSummary, getRecords, getScenarios } from "@/lib/api";
import type { MetricsSummary, ScenarioSummary, TripRecord } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export default async function SimulatePage() {
  let summary: MetricsSummary | null = null;
  let records: TripRecord[] = [];
  let scenarios: ScenarioSummary[] = [];

  try {
    [summary, records, scenarios] = await Promise.all([
      getMetricsSummary(),
      getRecords(undefined, 1000, 0).then((r) => r.rows),
      getScenarios(),
    ]);
  } catch {
    // The dashboard renders empty states if the API is unreachable.
  }

  const scenarioName = scenarios[0]?.name ?? "Manhattan weekday · 100 AVs";
  const fleetSize = summary?.fleet_size ?? scenarios[0]?.fleet_size ?? 100;

  return (
    <Dashboard
      summary={summary}
      records={records}
      scenarioName={scenarioName}
      fleetSize={fleetSize}
    />
  );
}
