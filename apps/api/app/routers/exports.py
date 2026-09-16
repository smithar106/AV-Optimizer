"""Export endpoints for reproducible results."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/exports", tags=["exports"])


@router.get("/{run_id}")
def export_run(run_id: str) -> dict:
    raise HTTPException(
        status_code=501,
        detail="Exports (JSON/CSV of events, decisions, and metrics) arrive in Phase 7.",
    )
