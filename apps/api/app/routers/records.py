"""Precomputed demo records and aggregate metrics.

Serves the synthetic 1000-record dataset (500 paired requests × baseline/optimized)
and the derived per-strategy summary used by the dashboard's KPI row and comparison.
"""
from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Query

from app import data

router = APIRouter(tags=["records"])


@router.get("/records")
def list_records(
    strategy: Literal["baseline", "optimized"] | None = None,
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> dict:
    rows = data.records(strategy)
    window = rows[offset : offset + limit]
    return {
        "total": len(rows),
        "limit": limit,
        "offset": offset,
        "rows": window,
    }


@router.get("/metrics")
def metrics() -> dict:
    return data.summary()
