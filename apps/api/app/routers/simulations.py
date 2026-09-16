"""Simulation lifecycle endpoints.

Phase 1 establishes the contract and an in-memory run registry. The discrete-event
engine, OR-Tools dispatch/repositioning, and precomputed playback snapshots are
implemented in Phases 2–5.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException

from app.schemas import Metrics, SimulationRequest, SimulationStatus

router = APIRouter(prefix="/simulations", tags=["simulations"])

_RUNS: dict[str, dict] = {}


@router.post("", response_model=SimulationStatus, status_code=202)
def create_simulation(payload: SimulationRequest) -> SimulationStatus:
    run_id = uuid.uuid4().hex[:12]
    _RUNS[run_id] = {
        "id": run_id,
        "scenario_id": payload.scenario_id,
        "strategy": payload.strategy,
        "seed": payload.seed,
        "duration_minutes": payload.duration_minutes,
        "status": "queued",
        "progress": 0.0,
    }
    return SimulationStatus(
        id=run_id,
        scenario_id=payload.scenario_id,
        strategy=payload.strategy,
        status="queued",
        progress=0.0,
        message="Simulation engine is implemented in Phase 2.",
    )


def _get_run(run_id: str) -> dict:
    run = _RUNS.get(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return run


@router.get("/{run_id}", response_model=SimulationStatus)
def get_simulation(run_id: str) -> SimulationStatus:
    run = _get_run(run_id)
    return SimulationStatus(
        id=run["id"],
        scenario_id=run["scenario_id"],
        strategy=run["strategy"],
        status=run["status"],
        progress=run["progress"],
    )


@router.get("/{run_id}/events")
def get_events(run_id: str) -> dict:
    _get_run(run_id)
    return {"run_id": run_id, "events": [], "note": "Event log arrives with the Phase 2 engine."}


@router.get("/{run_id}/snapshots")
def get_snapshots(run_id: str) -> dict:
    _get_run(run_id)
    return {"run_id": run_id, "snapshots": [], "note": "Playback snapshots arrive with the Phase 6 map."}


@router.get("/{run_id}/metrics", response_model=Metrics)
def get_metrics(run_id: str) -> Metrics:
    _get_run(run_id)
    return Metrics()
