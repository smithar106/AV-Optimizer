"""Build the 5-minute origin-destination demand model (Phase 2).

Aggregates normalized trips into lambda-hat by (origin zone, destination zone, interval),
applies the market-capture parameter alpha, and writes a versioned demand snapshot.

Usage (Phase 2):
    python pipelines/build_demand.py --input data/raw/trips.parquet --out data/synthetic/demand.json
"""
from __future__ import annotations


def main() -> None:
    raise SystemExit("Phase 2: implement demand aggregation and snapshot export.")


if __name__ == "__main__":
    main()
