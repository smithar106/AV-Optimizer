# Frontend

Design system, dashboard architecture, and component responsibilities.

## Visual identity

Premium fleet operations command center: the visual sophistication of an autonomous
vehicle control room with the analytical depth of an operations research platform.
The map is the hero, optimization is the story, and the financial comparison is the
payoff.

### Design tokens

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#101827` | Main application |
| Surface | `#172337` | Panels and cards |
| Elevated | `#213149` | Active controls |
| Mint (primary) | `#3BE3B2` | Optimization, success, primary actions |
| Blue | `#579BFF` | Passenger trips |
| Amber | `#F6B84B` | Repositioning |
| Purple | `#B69CFF` | Charging |
| Red | `#F87171` | Unserved demand, alerts |
| Text | `#F8FAFC` | Primary text |
| Muted | `#A8B6CA` | Secondary text |

Typography: Geist, with tabular numerals (`.tabular`) for financial and operational
metrics. Restrained aesthetic: dark surfaces, thin borders, no gradients, no glowing
neon. Mint is reserved for meaningful actions.

## Dashboard layout

A single, scannable command center with clear sections rather than a panel for every
metric. Controls are deliberately minimal: one policy selector and the playback
controls.

| Section | Value |
| --- | --- |
| Header | Brand, scenario, policy selector (optimized / nearest feasible) |
| KPI row | Margin / veh-hr, contribution, served, fulfillment, empty-mile ratio, ETA |
| Fleet operations | The map (hero) plus a status breakdown |
| Simulated day | Play/pause, speed, scrub, and the next 45 minutes of requests |
| Performance | Baseline vs optimized comparison with deltas |
| Trip records | The 1,000-record synthetic dataset, filtered by policy |

Responsive: a single column on mobile, two columns for the map and comparison at
`lg`. The map preview is a static SVG until MapLibre lands (Phase 6).

## Component responsibilities

| Component | Responsibility | Data source |
| --- | --- | --- |
| Dashboard | Layout + policy selection + playback clock | UI state |
| KpiRow | Primary performance metrics | `/metrics` |
| FleetMap | Fleet preview + status breakdown | Static preview |
| Timeline | Playback controls + upcoming requests | Playback state + records |
| PerformancePanel | Baseline vs optimized comparison | `/metrics` |
| RecordsTable | Trip-level records | `/records` |

## State architecture

Server state (TanStack Query / server components) is kept separate from playback
state and selection state (Zustand). A single playback clock drives the timeline and
the upcoming-requests list — there are no separate timers.

## Demo dataset

`apps/api/data/trips.json` holds 1,000 synthetic trip records: 500 requests evaluated
under both the nearest-feasible baseline and the demand-aware optimized policy (paired
by `request_id`). It is generated deterministically by
`pipelines/generate_demo.py` and served by `GET /api/v1/records` and
`GET /api/v1/metrics`.

## Accessibility

- Keyboard-operable playback controls with visible focus rings.
- Status is never conveyed by color alone — every status has a label and an icon.
- `aria-pressed` on toggles; `aria-label` on icon buttons and the scrubber.
- `prefers-reduced-motion` disables transitions and animations.

## Performance

- The landing page uses a static SVG fleet preview — it does not download MapLibre or
  the route dataset.
- The dashboard and map are the only heavy surfaces; MapLibre will be dynamically
  imported when it lands (Phase 6).
- API calls are proxied through server components; internal Railway hostnames are never
  exposed in the browser bundle.

## Build order

| Step | Scope | Status |
| --- | --- | --- |
| 01 | Landing page (brand, responsive layout, product preview) | Done |
| 02 | Dashboard shell (four-column layout, KPI ribbon, panels) | Done |
| 03 | Map and fleet (MapLibre, 100 vehicles, status layers) | Next |
| 04 | Playback engine (animation, timeline, event log, KPIs) | Pending |
| 05 | Optimization intelligence (solver results, decisions) | Pending |
| 06 | Strategy comparison (validated outcomes) | Pending |
| 07 | Production polish (a11y, performance, testing) | Pending |
