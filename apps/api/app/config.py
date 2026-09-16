"""Runtime configuration (environment-driven)."""
from __future__ import annotations

import os
from dataclasses import dataclass, field


def _bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


def _cors_origins() -> list[str]:
    return [o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str = "AVantage API"
    version: str = "0.1.0"
    environment: str = field(default_factory=lambda: os.environ.get("ENVIRONMENT", "development"))

    # Comma-separated list of allowed origins, or "*" for development.
    cors_origins: list[str] = field(default_factory=_cors_origins)

    # Optional managed Postgres (Railway provides DATABASE_URL).
    database_url: str = field(default_factory=lambda: os.environ.get("DATABASE_URL", ""))

    # Scenario execution guardrails (Phase 1 placeholders; enforced in later phases).
    max_simulation_seconds: int = field(
        default_factory=lambda: int(os.environ.get("MAX_SIMULATION_SECONDS", "300"))
    )
    max_vehicles: int = field(default_factory=lambda: int(os.environ.get("MAX_VEHICLES", "500")))

    debug: bool = field(default_factory=lambda: _bool(os.environ.get("DEBUG"), False))


settings = Settings()
