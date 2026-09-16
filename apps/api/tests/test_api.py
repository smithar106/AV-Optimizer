"""Health and contract tests (Phase 1)."""
from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["service"] == "AVantage API"


def test_root() -> None:
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["health"] == "/api/v1/health"


def test_scenarios_list() -> None:
    resp = client.get("/api/v1/scenarios")
    assert resp.status_code == 200
    scenarios = resp.json()
    assert any(s["id"] == "nyc-manhattan-weekday-100av" for s in scenarios)


def test_create_scenario() -> None:
    resp = client.post("/api/v1/scenarios", json={"name": "Test Scenario", "fleet_size": 50})
    assert resp.status_code == 201
    assert resp.json()["fleet_size"] == 50


def test_simulation_lifecycle_stub() -> None:
    created = client.post(
        "/api/v1/simulations",
        json={"scenario_id": "nyc-manhattan-weekday-100av", "strategy": "optimized"},
    )
    assert created.status_code == 202
    run_id = created.json()["id"]

    status = client.get(f"/api/v1/simulations/{run_id}")
    assert status.status_code == 200
    assert status.json()["status"] == "queued"

    assert client.get(f"/api/v1/simulations/{run_id}/metrics").status_code == 200
    assert client.get(f"/api/v1/simulations/{run_id}/events").status_code == 200


def test_compare_contract() -> None:
    resp = client.post("/api/v1/compare", json={"scenario_id": "nyc-manhattan-weekday-100av"})
    assert resp.status_code == 200
    assert len(resp.json()["policies"]) == 2
