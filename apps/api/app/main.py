"""AVantage API — FastAPI application entry point.

Phase 1: foundation. Health endpoint + the full API surface as contract stubs.
Simulation, optimization, forecasting, routing, and economics modules land in
later phases per the roadmap.
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import compare, exports, health, scenarios, simulations

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=(
        "Autonomous fleet revenue intelligence — simulation and optimization API. "
        "Demonstration city: New York City · 100 synthetic AVs."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"
app.include_router(health.router, prefix=API_PREFIX)
app.include_router(scenarios.router, prefix=API_PREFIX)
app.include_router(simulations.router, prefix=API_PREFIX)
app.include_router(compare.router, prefix=API_PREFIX)
app.include_router(exports.router, prefix=API_PREFIX)


@app.get("/")
def root() -> dict:
    return {
        "service": settings.app_name,
        "version": settings.version,
        "docs": "/docs",
        "health": f"{API_PREFIX}/health",
    }
