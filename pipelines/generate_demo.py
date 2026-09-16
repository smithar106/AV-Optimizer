"""Generate the precomputed default demo scenario (Phase 7).

Runs the simulator offline for the default scenario and writes compact playback
snapshots + metrics so the public app never invokes OR-Tools per visitor.

Usage (Phase 7):
    python pipelines/generate_demo.py --scenario nyc-manhattan-weekday-100av
"""
from __future__ import annotations


def main() -> None:
    raise SystemExit("Phase 7: implement offline demo generation + snapshot export.")


if __name__ == "__main__":
    main()
