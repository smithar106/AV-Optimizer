# Optimization

Two-stage rolling-horizon approach, solved with Google OR-Tools. Re-optimized every
five simulated minutes.

## 4.1 Dispatch

Decision variable `x_vr ∈ {0,1}` = 1 if vehicle `v` serves request `r`.

Symbols:

| Symbol | Meaning |
| --- | --- |
| `F_r` | expected operator fare revenue |
| `D_vr^pickup` | empty pickup miles |
| `D_r^trip` | occupied trip miles |
| `c_m` | variable operating cost per mile |
| `c_t` | incremental operating cost per minute |
| `T_vr^pickup` | pickup time |
| `V_vr` | estimated future positioning value |
| `P_r` | penalty for leaving request `r` unserved |

Assignment contribution:

```
M_vr = F_r − c_m (D_vr^pickup + D_r^trip) − c_t T_vr^service + V_vr
```

Dispatch objective:

```
maximize  Σ_{v,r} M_vr x_vr  −  Σ_r P_r u_r
```

Constraints:

```
Σ_v x_vr + u_r = 1     ∀ r        (each request served at most once, or penalized)
Σ_r x_vr ≤ 1           ∀ v        (each vehicle serves at most one request)
```

Additional feasibility rules reject assignments violating pickup ETA, battery reserve,
vehicle availability, or service-area boundaries.

> The penalty `P_r` is an optimization preference, not a cash expense. It is reported
> separately from realized financial contribution. Future positioning value `V_vr` is a
> forecast-derived heuristic; realized revenue is measured only when trips occur.

## 4.2 Repositioning

Decision variable `y_ij ∈ ℤ≥0` = number of idle vehicles moved from zone `i` to `j`.

Let `s_i` be idle supply, `d̂_j` forecast demand, `c_ij` repositioning cost, and `h_j`
shortage variables.

```
minimize  Σ_{i,j} c_ij y_ij  +  Σ_j w_j h_j
```

Subject to:

```
Σ_j y_ij ≤ s_i
h_j ≥ d̂_j − ( s_j − Σ_{k≠j} y_jk + Σ_{i≠j} y_ij )
h_j ≥ 0
```

Vehicles staying in their current zone are counted separately to prevent
double-counting supply. Repositioning cost includes travel time, distance, energy, and
the opportunity cost of removing supply from an origin zone.

## 4.3 Rolling-horizon execution

Every five simulated minutes:

1. **Observe** — available vehicles, outstanding requests, battery, positions.
2. **Dispatch** — solve feasible vehicle-to-request assignments.
3. **Forecast** — estimate demand over the next 30 minutes.
4. **Reposition** — optimize remaining idle supply across zones.
5. **Advance** — execute trips, update vehicles, recognize revenue, incur costs.
6. **Record** — decisions, events, state changes, KPI snapshots.

The model distinguishes **expected** contribution (used for decision-making) from
**realized** contribution (calculated by the simulator).

## Policies (ablation)

| Policy | Dispatch | Repositioning |
| --- | --- | --- |
| A | Nearest feasible | None |
| B | Optimized | None |
| C | Nearest feasible | Optimized |
| D | Optimized | Optimized |

Policy D is the full strategy. A/B/C isolate which component drives any measured
improvement.

## Sensitivity

Vary demand capture (`α`), fleet size, electricity price, and repositioning cost. Report
distributions across seeds, not a single run.
