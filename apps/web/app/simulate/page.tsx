import { AppShell } from "@/components/dashboard/AppShell";
import { getDataManifest, getDemo, getScenarios } from "@/lib/api";
import type {
  CompareResult,
  DataManifest,
  DemoMeta,
  FleetMetrics,
  ScenarioSummary,
} from "@/lib/schemas";

export const dynamic = "force-dynamic";

export default async function SimulatePage() {
  let scenarios: ScenarioSummary[] = [];
  let demo: DemoMeta | null = null;
  let manifest: DataManifest | null = null;
  const metrics: FleetMetrics | null = null; // populated when a run completes
  const comparison: CompareResult | null = null;

  try {
    [scenarios, demo, manifest] = await Promise.all([
      getScenarios(),
      getDemo(),
      getDataManifest(),
    ]);
  } catch {
    // The shell still renders with empty states if the API is unreachable.
  }

  return (
    <AppShell
      scenarios={scenarios}
      demo={demo}
      manifest={manifest}
      metrics={metrics}
      comparison={comparison}
    />
  );
}
