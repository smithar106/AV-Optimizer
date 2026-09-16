"""Runtime configuration (environment-driven)."""
from __future__ import annotations

import os


def _bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


class Settings:
    app_name: str = "AVantage API"
    version: str = "0.1.0"
    environment: str = os.environ.get("ENVIRONMENT", "development")

    # Comma-separated list of allowed origins, or "*" for development.
    cors_origins: list[str] = [
        o.strip()
        for o in os.environ.get("CORS_ORIGINS", "*").split(",")
        if o.strip()
    ]

    # Optional managed Postgres (Railway provides DATABASE_URL).
    database_url: str = os.environ.get("DATABASE_URL", "")

    # Scenario execution guardrails (Phase 1 placeholders; enforced in later phases).
    max_simulation_seconds: int = int(os.environ.get("MAX_SIMULATION_SECONDS", "300"))
    max_vehicles: int = int(os.environ.get("MAX_VEHICLES", "500"))

    debug: bool = _bool(os.environ.get("DEBUG"), False)


settings = Settings()
