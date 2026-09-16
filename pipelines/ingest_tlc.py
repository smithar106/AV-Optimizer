"""Ingest NYC TLC trip records (Phase 2).

Downloads monthly Parquet snapshots, filters to the modeled service area, and writes
a normalized intermediate table for demand construction.

Usage (Phase 2):
    python pipelines/ingest_tlc.py --month 2024-05 --area manhattan
"""
from __future__ import annotations


def main() -> None:
    raise SystemExit(
        "Phase 2: implement DuckDB ingest of TLC Parquet (filter, validate, normalize)."
    )


if __name__ == "__main__":
    main()
