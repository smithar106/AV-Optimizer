# Architecture

## System overview

```
GitHub repository
  source · CI · versioned datasets
            │
            ▼
Railway project: avantage
  ┌───────────────────────────┐     private network     ┌──────────────────────────┐
  │ web (Next.js)             │ ──────────────────────▶ │ api (FastAPI)            │
  │ apps/web · public domain  │                         │ apps/api · simulation,   │
  │ MapLibre · Recharts       │ ◀────────────────────── │ OR-Tools optimization    │
  └───────────────────────────┘                         └────────────┬─────────────┘
                                                                     │
                                                          ┌──────────▼───────────┐
                                                          │ PostgreSQL           │
                                                          │ scenarios · results  │
                                                          └──────────────────────┘
```

## Services

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, TypeScript, Tailwind |
| Mapping | MapLibre GL JS |
| Visualization | Recharts |
| Backend | FastAPI, Python |
| Optimization | Google OR-Tools |
| Simulation | Custom deterministic discrete-event engine |
| Data processing | DuckDB, Pandas, GeoPandas |
| Routing | OSRM preprocessing |
| Database | PostgreSQL |
| Testing | Pytest, Vitest, Playwright |
| Deployment | Railway |
| CI/CD | GitHub Actions |

## Repository layout

```
apps/
  web/    Next.js app (app router, components/{map,dashboard,simulator,controls}, lib)
  api/    FastAPI app (routers, simulation, optimization, forecasting, economics,
          routing, schemas, models) + tests
pipelines/  ingest_tlc.py · build_demand.py · build_routes.py · generate_demo.py
data/       synthetic/ (compact samples) · manifests/ (provenance)
docs/       PRD · ARCHITECTURE · OPTIMIZATION · METHODOLOGY · DATA_SOURCES · DEPLOYMENT
```

## API surface

| Endpoint | Method | Function |
| --- | --- | --- |
| `/api/v1/health` | GET | Health check |
| `/api/v1/scenarios` | GET | Available scenarios |
| `/api/v1/scenarios` | POST | Create scenario |
| `/api/v1/simulations` | POST | Run bounded simulation |
| `/api/v1/simulations/{id}` | GET | Run status |
| `/api/v1/simulations/{id}/events` | GET | Event log |
| `/api/v1/simulations/{id}/snapshots` | GET | Playback data |
| `/api/v1/simulations/{id}/metrics` | GET | KPI results |
| `/api/v1/compare` | POST | Compare policies |
| `/api/v1/exports/{id}` | GET | Download results |

Initial implementation uses synchronous bounded jobs or a small process pool with
persisted run status. A dedicated worker is added only when measured workloads justify
it. The optimization service enforces execution timeouts, request-size limits, and
concurrency limits.

## Separation of concerns

The simulation engine is independent of the visualization. The simulator runs
server-side, emits a deterministic event log, and exports playback snapshots; the
frontend interpolates vehicle positions between timestamped route coordinates. This
keeps the engine testable and the map replaceable.

## Cost-conscious design

Precompute the default simulation offline (100 vehicles, 5-second playback snapshots,
one representative day, compressed JSON/binary, only relevant route segments) and
serve it without invoking OR-Tools per visitor. The simulator uses 1-second internal
events while exporting less frequent playback snapshots.

## Phase status

Phase 1 (foundation) implements the service split, the API contract, CI, and Railway
deployment. The frontend build order's steps 01 (landing page) and 02 (dashboard shell)
are complete: the fleet operations command center, playback timeline, and interaction
modes render against the API contract. Domain modules (`simulation`, `optimization`,
`forecasting`, `economics`, `routing`, `models`) are present as typed packages to be
filled in Phases 2–7.

The dashboard's map currently uses the same static SVG fleet preview as the landing
page; MapLibre and live playback arrive in Phase 6.
