"""Pydantic schemas shared across routers."""
from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    service: str
    version: str
    environment: str


class Scenario(BaseModel):
    id: str
    name: str
    city: str = "New York City"
    service_area: str = "Manhattan"
    fleet_size: int = 100
    strategy: Literal["baseline", "optimized"] = "optimized"
    seed: int = 42
    description: str = ""


class ScenarioCreate(BaseModel):
    name: str
    city: str = "New York City"
    service_area: str = "Manhattan"
    fleet_size: int = Field(default=100, ge=1, le=500)
    strategy: Literal["baseline", "optimized"] = "optimized"
    seed: int = 42
    demand_capture_alpha: float = Field(default=1.0, ge=0.0, le=1.0)


class SimulationRequest(BaseModel):
    scenario_id: str
    strategy: Literal["baseline", "optimized"] = "optimized"
    duration_minutes: int = Field(default=60, ge=5, le=1440)
    seed: int = 42


class SimulationStatus(BaseModel):
    id: str
    scenario_id: str
    strategy: str
    status: Literal["queued", "running", "complete", "failed"]
    progress: float = 0.0
    message: str = ""


class Metrics(BaseModel):
    contribution_margin_per_vehicle_hour: float | None = None
    realized_contribution_margin: float | None = None
    demand_fulfillment: float | None = None
    avg_pickup_eta_min: float | None = None
    p90_pickup_eta_min: float | None = None
    empty_mile_ratio: float | None = None
    utilization: float | None = None
    revenue_per_vehicle_hour: float | None = None
    service_coverage: float | None = None
    energy_kwh: float | None = None
    unserved_requests: int | None = None


class CompareRequest(BaseModel):
    scenario_id: str
    policies: list[Literal["A", "B", "C", "D"]] = ["A", "D"]
    seeds: list[int] = [42]
    duration_minutes: int = Field(default=60, ge=5, le=1440)


class ApiError(BaseModel):
    detail: str
    context: dict[str, Any] | None = None
