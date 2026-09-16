# Methodology

## Demand model

For each origin zone `i`, destination zone `j`, and 5-minute interval `t`, estimate the
historical arrival rate:

```
λ̂_ijt = observed_trips_ijt / number_of_comparable_intervals
```

Apply a configurable market-capture parameter `α`:

```
λ_ijt^AV = α · λ̂_ijt
```

Synthetic requests are drawn with a seeded Poisson process. Historical data determines
the demand *pattern*; the synthetic generator determines the specific requests
encountered by both dispatch policies — so policies face identical arrivals.

If forecasting is introduced, use chronological training/evaluation periods. Never
train on the evaluation day's future observations.

## Fleet

100 synthetic electric AVs. Each vehicle has exactly one state at any time: `idle`,
`pickup`, `reposition`, `on_trip`, `charging`. An occupied vehicle cannot accept a new
request. Repositioning incurs real modeled travel time and cost — no teleporting.
Battery state of charge decreases with distance; sub-threshold vehicles charge before
returning to service.

## Contribution margin

```
CM = R_completed − C_energy − C_distance − C_time − C_transaction
```

- Revenue recognized only for completed rides.
- Energy costs include occupied **and** empty travel.
- Distance costs represent incremental wear and maintenance, excluding energy (no
  double counting).
- Time costs are modeled variable operating expenses.
- Transaction costs are assumed payment/platform fees.

Fixed ownership costs are reported separately as an optional fleet-level operating-profit
scenario. Contribution margin is **not** net profit.

## Illustrative unit economics

| Parameter | Value |
| --- | --- |
| Average operator fare | $18 |
| Electricity cost | $0.18 / kWh |
| Non-energy cost | $0.12 / mile |
| Occupied miles | 6 |
| Empty miles | 2 |
| Energy consumption | 0.32 kWh / mile |
| Transaction & other variable cost | $3.00 |

Illustrative contribution per completed ride ≈ $13.58, excluding fixed costs and any
separately modeled time-based expense. Every parameter is editable and documented. No
company-specific operating cost is invented or presented as fact.

## Evaluation

Baselines: **Nearest Feasible** (closest eligible vehicle, ETA + battery constraints,
chronological, no repositioning) and nearest-feasible with demand-proportional
repositioning.

Both policies run on the same historical demand-derived scenarios with common random
seeds and identical initial locations, battery levels, request arrivals, origin/
destination pairs, fare assumptions, travel-time estimates, and charging assumptions.
Test at least 20 independent demand seeds and report paired differences.

**Primary KPI:** contribution margin per vehicle-hour = realized contribution margin /
total deployed vehicle-hours.

**Secondary KPIs:** demand fulfillment, average pickup ETA, P90 pickup ETA, empty-mile
ratio, utilization, revenue per vehicle-hour, service coverage, energy consumption.

Unserved demand is reported alongside margin. An optimizer should not appear successful
simply because it declines less profitable passengers. No improvement is guaranteed —
if the optimized strategy performs worse in some scenarios, those results are shown.
