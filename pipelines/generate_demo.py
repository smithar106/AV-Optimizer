"""Generate the precomputed demo dataset (Phase 2 preview).

Produces `data/synthetic/trips.json`: 1000 hypothetical trip records across a
Manhattan weekday, evaluated under two strategies (nearest-feasible baseline and
demand-aware optimized). Requests are paired — each request appears once per
strategy with the same origin, destination, and request time — so the two policies
can be compared as paired observations.

Deterministic (seeded). This is illustrative synthetic data, not observed AV demand.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Co-located with the API service so it ships inside the API container.
OUT = ROOT / "apps" / "api" / "data" / "trips.json"

SEED = 20260826
N_REQUESTS = 500  # × 2 strategies = 1000 records

# Representative Manhattan TLC taxi zones.
ZONES = [
    (4, "Alphabet City"), (12, "Battery Park"), (13, "Battery Park City"),
    (24, "Bloomingdale"), (41, "Central Harlem"), (42, "Central Harlem North"),
    (43, "Central Park"), (45, "Chelsea"), (48, "Clinton East"),
    (50, "Clinton West"), (68, "East Chelsea"), (74, "East Harlem North"),
    (75, "East Harlem South"), (79, "East Village"), (87, "Flatiron"),
    (88, "Financial District"), (90, "Flatiron"), (100, "Garment District"),
    (107, "Gramercy"), (113, "Greenwich Village"), (114, "Greenwich Village North"),
    (116, "Hamilton Heights"), (120, "Hudson Sq"), (125, "Kips Bay"),
    (127, "Lenox Hill"), (128, "Lincoln Square East"), (137, "Lower East Side"),
    (140, "Manhattan Valley"), (141, "Marble Hill"), (142, "Meatpacking"),
    (143, "Midtown Center"), (144, "Midtown East"), (148, "Midtown North"),
    (151, "Midtown South"), (152, "Morningside Heights"), (153, "Murray Hill"),
    (158, "NoHo"), (161, "Nolita"), (162, "North Chelsea"), (163, "Penn Station"),
    (164, "Port Authority"), (166, "Randalls Island"), (170, "Roosevelt Island"),
    (186, "SoHo"), (194, "Sutton Place"), (202, "Times Sq"), (209, "Tribeca"),
    (211, "Turtle Bay"), (224, "Upper East Side North"), (229, "Upper East Side South"),
    (230, "Upper West Side North"), (231, "Upper West Side South"), (232, "Washington Heights North"),
    (233, "Washington Heights South"), (234, "West Chelsea"), (236, "West Concourse"),
    (237, "West Village"), (238, "Yorkville East"), (239, "Yorkville West"),
    (243, "Midtown"), (244, "Hudson Yards"), (246, "West Village South"),
    (249, "World Trade Center"), (261, "Old Astoria"), (262, "Long Island City"),
    (263, "Astoria"),
]

# Unit economics (illustrative — see docs/METHODOLOGY.md).
KWH_PER_MILE = 0.32
ELECTRICITY_USD_PER_KWH = 0.18
NON_ENERGY_USD_PER_MILE = 0.12
TRANSACTION_USD = 3.00

FLEET_SIZE = 100
DAY_HOURS = 13.5  # 08:30 → 22:00


def _peak_factor(hour: int) -> float:
    """AM/PM peak multiplier for fares."""
    if 7 <= hour <= 9 or 16 <= hour <= 19:
        return 1.0
    if 10 <= hour <= 15:
        return 0.55
    return 0.2


def generate() -> dict:
    rng = random.Random(SEED)
    records: list[dict] = []
    rid = 0

    for request_id in range(1, N_REQUESTS + 1):
        minute_of_day = rng.randint(510, 1320)  # 08:30 → 22:00
        hour, minute = divmod(minute_of_day, 60)
        request_time = f"{hour:02d}:{minute:02d}"

        origin = rng.choice(ZONES)
        dest = rng.choice(ZONES)
        while dest[0] == origin[0]:
            dest = rng.choice(ZONES)

        occupied_miles = round(rng.uniform(0.8, 7.5), 1)
        duration_min = max(4, round(occupied_miles * rng.uniform(3.0, 4.4)))
        peak = 1.0 + 0.3 * _peak_factor(hour)
        fare = round((3.0 + 2.5 * occupied_miles + 0.45 * duration_min) * peak, 2)

        for strategy in ("baseline", "optimized"):
            rid += 1
            if strategy == "baseline":
                empty_miles = round(rng.uniform(1.0, 4.6), 1)
                pickup_eta = round(empty_miles * rng.uniform(2.1, 3.2), 1)
                served = rng.random() < 0.86
            else:
                empty_miles = round(rng.uniform(0.3, 2.1), 1)
                pickup_eta = round(empty_miles * rng.uniform(1.7, 2.7), 1)
                served = rng.random() < 0.94

            total_miles = occupied_miles + empty_miles
            energy = total_miles * KWH_PER_MILE * ELECTRICITY_USD_PER_KWH
            distance_cost = total_miles * NON_ENERGY_USD_PER_MILE
            trip_fare = fare if served else 0.0
            contribution = (
                round(trip_fare - energy - distance_cost - TRANSACTION_USD, 2)
                if served
                else 0.0
            )

            records.append({
                "record_id": rid,
                "request_id": request_id,
                "strategy": strategy,
                "request_time": request_time,
                "origin_zone": origin[0],
                "origin_name": origin[1],
                "destination_zone": dest[0],
                "destination_name": dest[1],
                "distance_mi": occupied_miles,
                "duration_min": duration_min,
                "fare_usd": trip_fare,
                "pickup_eta_min": pickup_eta,
                "empty_miles": empty_miles,
                "total_miles": round(total_miles, 1),
                "served": served,
                "contribution_usd": contribution,
            })

    return {
        "dataset_id": "nyc-manhattan-weekday-synthetic-v1",
        "seed": SEED,
        "fleet_size": FLEET_SIZE,
        "day_hours": DAY_HOURS,
        "requests": N_REQUESTS,
        "records": records,
        "assumptions": {
            "kwh_per_mile": KWH_PER_MILE,
            "electricity_usd_per_kwh": ELECTRICITY_USD_PER_KWH,
            "non_energy_usd_per_mile": NON_ENERGY_USD_PER_MILE,
            "transaction_usd": TRANSACTION_USD,
        },
        "note": (
            "Illustrative synthetic data. Taxi-trip patterns are a proxy for potential AV "
            "demand, not observed AV demand."
        ),
    }


def main() -> None:
    payload = generate()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2))
    print(f"wrote {len(payload['records'])} records to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
