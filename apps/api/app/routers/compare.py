"""Policy comparison endpoint.

Phase 1 establishes the contract. Paired-seed comparison over the four ablation
policies (A: nearest/no-reposition, B: optimized/no-reposition, C: nearest/
reposition, D: optimized/reposition) is implemented in Phase 5.
"""
from __future__ import annotations

from fastapi import APIRouter

from app.schemas import CompareRequest

router = APIRouter(tags=["compare"])

_POLICY_LABELS = {
    "A": "Nearest feasible · no repositioning",
    "B": "Optimized dispatch · no repositioning",
    "C": "Nearest feasible · optimized repositioning",
    "D": "Optimized dispatch · optimized repositioning",
}


@router.post("/compare")
def compare(payload: CompareRequest) -> dict:
    return {
        "scenario_id": payload.scenario_id,
        "seeds": payload.seeds,
        "policies": [
            {"policy": p, "label": _POLICY_LABELS.get(p, p), "metrics": None}
            for p in payload.policies
        ],
        "note": "Paired-seed comparison is implemented in Phase 5.",
    }
