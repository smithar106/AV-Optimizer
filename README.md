# AVantage — Autonomous Fleet Revenue Intelligence

An open-source fleet simulation and optimization platform exploring how autonomous
vehicle operators can improve **contribution margin** through smarter dispatch and
repositioning.

**Demonstration city:** New York City · **Fleet:** 100 synthetic AVs ·
**Primary objective:** contribution margin · **Optimization:** dispatch + repositioning.

> Portfolio project. All fleet, demand, and economic data are synthetic or
> illustrative. Not affiliated with, and does not reproduce, any operator's
> proprietary dispatch system.

---

## The product thesis

Fleet profitability is not simply a function of the number of vehicles or rides. It
also depends on which requests are served, how far vehicles travel empty, where idle
capacity is positioned, and whether those decisions compromise future service.

AVantage makes those trade-offs visible through a real optimization engine, a
simulated fleet moving across an interactive map, and a reproducible financial model.

The strongest demonstration is a controlled experiment: give a baseline dispatcher and
an optimized dispatcher the same fleet, demand, prices, travel times, and operating
assumptions, then compare results.

---

## Repository structure

```
AVantage/
├── apps/
│   ├── web/            # Next.js · TypeScript · Tailwind · MapLibre (Phase 6)
│   └── api/            # FastAPI · simulation · OR-Tools optimization
├── pipelines/          # TLC ingest, demand build, routing, demo generation
├── data/
│   ├── synthetic/      # compact, redistributable samples
│   └── manifests/      # dataset manifests + provenance
├── docs/               # PRD, architecture, optimization, methodology, sources, deployment
├── .github/workflows/  # CI
├── docker-compose.yml
└── Makefile
```

---

## Local development

Requires Python 3.11+, Node 20+.

### API

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health: http://localhost:8000/api/v1/health · Docs: http://localhost:8000/docs

### Web

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000.

---

## Tests

```bash
make test          # API pytest + web lint/build
```

---

## Deployment (Railway)

Two services plus a managed Postgres database, all in one Railway project:

| Service | Root directory | Exposure |
| --- | --- | --- |
| web | `apps/web` | Public |
| api | `apps/api` | Private |
| Postgres | managed | Private |

The web service reaches the API over Railway private networking via `API_URL`
(e.g. `http://<api-service>.railway.internal:8000`). See `docs/DEPLOYMENT.md`.

---

## Roadmap

| Phase | Scope | Exit criterion |
| --- | --- | --- |
| 1 · Foundation | Monorepo, FastAPI, Next.js, Railway, CI | Public frontend + healthy backend deployed |
| 2 · NYC data pipeline | TLC ingest, DuckDB, demand model | Reproducible demand snapshot committed |
| 3 · Synthetic fleet | Vehicle schema, states, battery, charging | Deterministic fleet generator + tests |
| 4 · Baseline dispatcher | Nearest-feasible policy | Baseline KPI run reproducible |
| 5 · Optimization engine | OR-Tools dispatch + repositioning | Solver-driven results checked vs. event log |
| 6 · Interactive map | MapLibre, playback, controls | Animated fleet + synced metrics |
| 7 · Evaluation dashboard | Paired-seed comparison, exports | Reproducible results + download |
| 8 · Portfolio release | Case study, polish, docs | Public launch |

Current status: **Phase 1 complete** (foundation + deployment).

---

## License

MIT — see [LICENSE](LICENSE).
