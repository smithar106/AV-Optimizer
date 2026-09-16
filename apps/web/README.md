# AVantage Web

Next.js (App Router) + TypeScript + Tailwind frontend for AVantage.

## Structure

```
app/
  layout.tsx            Root: fonts, providers, design tokens
  (marketing)/          Public pages with header/footer chrome
    page.tsx            Landing
    compare/            Strategy comparison
    methodology/        Methodology
  simulate/             Full-screen fleet operations command center
components/
  providers.tsx         TanStack Query provider
  map/FleetPreview.tsx  Lightweight SVG fleet preview (landing + map placeholder)
  dashboard/            AppShell, NavRail, ScenarioPanel, KpiRibbon, MapPanel,
                        IntelligencePanel, PlaybackBar
lib/
  api.ts                Transport + boundary validation
  schemas.ts            Zod schemas for every API response
  types.ts              Shared domain types + status metadata
  store.ts              Zustand playback + UI state (single playback clock)
```

## State architecture

- **Server state** — scenarios, snapshots, metrics, routes, events — fetched and
  cached with TanStack Query. Not copied into the client store.
- **Playback state** — simulated time, speed, playing, policy — a single clock in the
  Zustand store drives every map layer and KPI chart.
- **UI state** — selected vehicle, active mode, overlays, panel visibility.

## Development

```bash
npm install
API_URL=http://localhost:8000 npm run dev
```

Requires the API running on `:8000` (see `../api`).

## Build

```bash
npm run build   # standalone output for the Docker image
npm run lint
```

`API_URL` is read at runtime (Railway private networking); a placeholder keeps the
build hermetic. See `../../docs/DEPLOYMENT.md`.
