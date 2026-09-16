"""Demo and data-provenance endpoints.

`/demo` gives the landing page lightweight metadata. `/data-manifest` carries the
schema/simulation version, seed, and dataset checksum so the map and the KPI cards
can never silently show different runs.
"""
from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(tags=["demo"])

# Bumped whenever the playback/event schema changes shape.
SCHEMA_VERSION = "0.1.0"
SIMULATION_VERSION = "0.1.0"
DATASET_ID = "nyc-tlc-yellow-2024-05-manhattan-weekday"


@router.get("/demo")
def demo() -> dict:
    return {
        "name": "AVantage",
        "tagline": "The next mile is a decision.",
        "city": "New York City",
        "service_area": "Manhattan",
        "fleet_size": 100,
        "default_scenario_id": "nyc-manhattan-weekday-100av",
        "optimization": "OR-Tools",
        "objective": "Contribution margin",
        "verified": False,
        "note": "Results are pending the optimization engine; no savings are claimed yet.",
    }


@router.get("/data-manifest")
def data_manifest() -> dict:
    return {
        "schema_version": SCHEMA_VERSION,
        "simulation_version": SIMULATION_VERSION,
        "scenario_id": "nyc-manhattan-weekday-100av",
        "dataset_id": DATASET_ID,
        "seed": 42,
        "dataset_checksum": None,
        "generated_at": None,
        "sources": [
            {"name": "NYC TLC trip records", "role": "historical demand", "status": "pending"},
            {"name": "NYC taxi zones", "role": "geographic boundaries", "status": "pending"},
            {"name": "OpenStreetMap", "role": "street network", "status": "pending"},
            {"name": "OSRM", "role": "travel times", "status": "pending"},
            {"name": "Synthetic fleet generator", "role": "vehicles", "status": "planned"},
        ],
        "note": "Phase 1 manifest. Dataset checksum and generation timestamp are populated in Phase 2.",
    }
