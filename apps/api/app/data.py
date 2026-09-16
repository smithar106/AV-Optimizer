"""Dataset loading for the precomputed demo.

The compact synthetic dataset is committed under data/synthetic and loaded once.
Heavy TLC preprocessing (DuckDB) replaces this in the full pipeline, but the
committed sample keeps the public demo fast and reproducible.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
TRIPS_PATH = DATA_DIR / "trips.json"


@lru_cache(maxsize=1)
def load_dataset() -> dict:
    if not TRIPS_PATH.exists():
        return {"records": [], "requests": 0, "fleet_size": 0, "day_hours": 0, "assumptions": {}}
    return json.loads(TRIPS_PATH.read_text())


def records(strategy: str | None = None) -> list[dict]:
    rows = load_dataset().get("records", [])
    if strategy:
        rows = [r for r in rows if r["strategy"] == strategy]
    return rows


def _percentile(values: list[float], pct: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    k = (len(ordered) - 1) * pct
    lo, hi = int(k), min(int(k) + 1, len(ordered) - 1)
    return round(ordered[lo] + (ordered[hi] - ordered[lo]) * (k - lo), 1)


def summarize(strategy: str) -> dict:
    ds = load_dataset()
    rows = records(strategy)
    generated = ds.get("requests", len(rows)) or len(rows)
    served = [r for r in rows if r["served"]]

    total_miles = sum(r["total_miles"] for r in rows)
    empty_miles = sum(r["empty_miles"] for r in rows)
    revenue = sum(r["fare_usd"] for r in served)
    contribution = sum(r["contribution_usd"] for r in served)
    energy = sum(r["total_miles"] * 0.32 for r in rows)
    etas = [r["pickup_eta_min"] for r in served]
    deployed_hours = (ds.get("fleet_size", 0) or 0) * (ds.get("day_hours", 0) or 0)

    return {
        "strategy": strategy,
        "generated_requests": generated,
        "served": len(served),
        "unserved": generated - len(served),
        "demand_fulfillment": round(100 * len(served) / generated, 1) if generated else None,
        "revenue_usd": round(revenue, 0),
        "contribution_usd": round(contribution, 0),
        "contribution_per_vehicle_hour": round(contribution / deployed_hours, 2) if deployed_hours else None,
        "empty_mile_ratio": round(empty_miles / total_miles, 2) if total_miles else None,
        "avg_pickup_eta_min": round(sum(etas) / len(etas), 1) if etas else None,
        "p90_pickup_eta_min": _percentile(etas, 0.9),
        "total_miles": round(total_miles, 0),
        "energy_kwh": round(energy, 0),
    }


def summary() -> dict:
    baseline = summarize("baseline")
    optimized = summarize("optimized")
    return {
        "dataset_id": load_dataset().get("dataset_id"),
        "fleet_size": load_dataset().get("fleet_size"),
        "day_hours": load_dataset().get("day_hours"),
        "baseline": baseline,
        "optimized": optimized,
        "deltas": {
            "contribution_usd": round(
                (optimized["contribution_usd"] or 0) - (baseline["contribution_usd"] or 0), 0
            ),
            "demand_fulfillment": round(
                (optimized["demand_fulfillment"] or 0) - (baseline["demand_fulfillment"] or 0), 1
            ),
            "empty_mile_ratio": round(
                (optimized["empty_mile_ratio"] or 0) - (baseline["empty_mile_ratio"] or 0), 2
            ),
            "avg_pickup_eta_min": round(
                (optimized["avg_pickup_eta_min"] or 0) - (baseline["avg_pickup_eta_min"] or 0), 1
            ),
        },
    }
