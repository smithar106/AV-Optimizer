# Data sources

| Source | Purpose | Implementation |
| --- | --- | --- |
| [NYC TLC trip records](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) | Historical demand, trip duration, origin/destination, fares | Download Parquet snapshots |
| [NYC taxi zones](https://data.cityofnewyork.us/Transportation/NYC-Taxi-Zones/8meu-9met) | Geographic demand boundaries | GeoJSON preprocessing |
| [OpenStreetMap](https://www.openstreetmap.org/) | Street network and map geometry | Licensed map data |
| [OSRM](https://project-osrm.org/) | Road travel times and route geometry | Precompute routing matrices |
| Synthetic fleet generator | Vehicle positions, states, battery levels | Deterministic Python generator |
| [Open-Meteo](https://open-meteo.com/) | Optional weather scenarios | Later integration |

## Selection

For the initial reproducible release:

- One documented month of historical trips.
- Service area restricted to Manhattan.
- Airport trips and records outside the modeled area excluded.
- One representative weekday for playback.
- Demand aggregated into 5-minute intervals.
- Retain origin zone, destination zone, request time, duration, distance, fare proxy.

Yellow taxi records first (trip-level fare fields). High-volume for-hire vehicle data
is added later as a separate demand-calibration experiment rather than mixing
incompatible fare definitions.

## Licensing & redistribution

- **TLC trip records** are published by NYC; review the current terms before
  redistributing processed extracts.
- **NYC taxi-zone geography**: the metadata does not specify a license — review
  applicable terms before redistributing processed geography.
- **OpenStreetMap**: geographic data is open (ODbL); attribution required.
- **OSM tile servers**: the public tile servers have a separate usage policy, limited
  capacity, and no availability guarantee. Use a compliant provider with a suitable
  free allowance, or host a small, appropriately licensed regional tile set.
- **OSRM public demo server**: not suitable as an unrestricted production routing
  backend. Use locally precomputed OSRM outputs.

## Pipeline

```
Raw TLC Parquet
   → DuckDB preprocessing (filter · validate · aggregate · sample)
   → Demand model (5-minute origin–destination demand)
   → Synthetic request generator (seeded Poisson)
   → Simulation input snapshot (versioned · seeded · reusable)
```

Preprocessing runs locally; a compact, legally redistributable sample is committed to
`data/synthetic/` with provenance recorded in `data/manifests/`. Full-year TLC data is
never processed during Railway startup.

> Taxi trips are a proxy for potential AV demand, not observed AV demand. The assumed
> fraction captured by the hypothetical AV service is a user-adjustable parameter.
