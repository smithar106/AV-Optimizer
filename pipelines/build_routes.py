"""Precompute OSRM travel-time and distance matrices (Phase 2/6).

Runs a local OSRM instance (never the public demo server) to build zone-to-zone
matrices and route geometry used by the simulator and the map.

Usage (Phase 2):
    python pipelines/build_routes.py --zones data/synthetic/zones.geojson
"""
from __future__ import annotations


def main() -> None:
    raise SystemExit("Phase 2: implement OSRM matrix + geometry preprocessing.")


if __name__ == "__main__":
    main()
