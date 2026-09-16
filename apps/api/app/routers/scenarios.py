"""Scenario catalog and creation.

Phase 1 returns an in-memory catalog so the API contract is real. Persistence to
Postgres and scenario generation from the TLC demand model land in later phases.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException

from app.schemas import Scenario, ScenarioCreate

router = APIRouter(prefix="/scenarios", tags=["scenarios"])

# In-memory catalog (Phase 1). Replaced by Postgres-backed storage later.
_SCENARIOS: dict[str, Scenario] = {
    "nyc-manhattan-weekday-100av": Scenario(
        id="nyc-manhattan-weekday-100av",
        name="Manhattan weekday · 100 AVs",
        city="New York City",
        service_area="Manhattan",
        fleet_size=100,
        strategy="optimized",
        seed=42,
        description="Representative Manhattan weekday, 5-minute demand intervals, 100 synthetic electric AVs.",
    ),
}


@router.get("", response_model=list[Scenario])
def list_scenarios() -> list[Scenario]:
    return list(_SCENARIOS.values())


@router.get("/{scenario_id}", response_model=Scenario)
def get_scenario(scenario_id: str) -> Scenario:
    scenario = _SCENARIOS.get(scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario


@router.post("", response_model=Scenario, status_code=201)
def create_scenario(payload: ScenarioCreate) -> Scenario:
    scenario_id = f"{payload.name.lower().replace(' ', '-')}-{uuid.uuid4().hex[:8]}"
    scenario = Scenario(
        id=scenario_id,
        name=payload.name,
        city=payload.city,
        service_area=payload.service_area,
        fleet_size=payload.fleet_size,
        strategy=payload.strategy,
        seed=payload.seed,
    )
    _SCENARIOS[scenario_id] = scenario
    return scenario
