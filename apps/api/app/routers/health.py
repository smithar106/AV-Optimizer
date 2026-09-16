"""Health and readiness endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from app.config import settings
from app.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        service=settings.app_name,
        version=settings.version,
        environment=settings.environment,
    )


@router.get("/health/ready")
def ready() -> dict:
    """Readiness probe — verifies optional dependencies without failing the pod."""
    return {
        "status": "ok",
        "database_configured": bool(settings.database_url),
    }
