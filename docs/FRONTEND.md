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

Desktop-first at 1440px; responsive down to mobile. The workspace is a CSS grid:

```
nav(56px) · scenario(280px) · map(flex) · intelligence(320px)
```

with a header, a KPI ribbon, and a bottom playback timeline + event stream.

| Breakpoint | Behavior |
| --- | --- |
| ≥1280px | Full four-column command center |
| 1024–1279px | Scenario panel hidden; nav + map + intelligence |
| <1024px | Map + KPI + timeline; mode rail becomes a horizontal row |

## Component responsibilities

| Component | Responsibility | Data source |
| --- | --- | --- |
| AppShell | Responsive dashboard layout | UI state |
| NavRail | Interaction modes | UI state |
| ScenarioPanel | Configuration + assumptions | Scenario API |
| KpiRibbon | Primary performance metrics | Simulation metrics |
| MapPanel / FleetPreview | Vehicle positions and status | Playback snapshots (Phase 6) |
| IntelligencePanel | Fleet status, vehicle drawer, mode content | Vehicle + event data |
| PlaybackBar | Play, pause, speed, scrub, event stream | Playback state |

## State architecture

Server state (TanStack Query) is kept separate from playback state and UI state
(Zustand). A single playback clock drives every map layer and KPI chart — there are no
separate timers for the map, charts, and event stream.

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
