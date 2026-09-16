const sections = [
  {
    title: "The question",
    body: "Can demand-aware dispatch and repositioning improve modeled fleet contribution margin while maintaining passenger service standards? AVantage does not claim to solve the entire economics of autonomous mobility — it tests one specific, measurable proposition.",
  },
  {
    title: "Demand model",
    body: "Historical NYC TLC trip records are aggregated into 5-minute origin–destination demand. A configurable market-capture parameter α scales historical demand to the hypothetical AV service. Synthetic requests are drawn with a seeded Poisson process so every policy sees identical arrivals.",
  },
  {
    title: "Fleet",
    body: "100 synthetic electric AVs with explicit operational states — idle, pickup, repositioning, on trip, charging. Battery state of charge decreases with distance; vehicles below the operating threshold are unavailable until charged. The charging rule is identical across policies.",
  },
  {
    title: "Optimization",
    body: "A two-stage rolling-horizon approach every five simulated minutes: (1) dispatch — assign vehicles to requests maximizing modeled contribution including future positioning value, and (2) repositioning — move remaining idle supply toward forecast demand. Solved with Google OR-Tools.",
  },
  {
    title: "Contribution margin",
    body: "CM = revenue from completed rides − energy − distance − time − transaction costs. Revenue is recognized only for completed rides. Expected contribution used for decisions is reported separately from realized contribution measured by the simulator.",
  },
  {
    title: "Baselines & evaluation",
    body: "A nearest-feasible baseline and a demand-proportional repositioning baseline isolate whether improvements come from better dispatch, better repositioning, or both. Policies are compared on identical scenarios with paired differences across many seeds.",
  },
];

const assumptions = [
  ["Average operator fare", "$18"],
  ["Electricity cost", "$0.18 / kWh"],
  ["Non-energy cost", "$0.12 / mile"],
  ["Occupied miles (illustrative)", "6"],
  ["Empty miles (illustrative)", "2"],
  ["Energy consumption", "0.32 kWh / mile"],
  ["Transaction & other variable cost", "$3.00"],
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Methodology</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
        AVantage is a portfolio project. It reconstructs demand patterns from a
        documented public dataset, runs a mathematically defined policy against a
        credible baseline, and calculates contribution margin from explicit, editable
        assumptions.
      </p>

      <div className="mt-8 grid gap-px bg-[var(--border)] md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="bg-[var(--bg)] p-5">
            <div className="text-[13px] font-semibold">{s.title}</div>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <div className="text-[13px] font-semibold">Unit-economics assumptions</div>
          <div className="mt-3 flex flex-col divide-y divide-[var(--border)]">
            {assumptions.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[var(--fg-muted)]">{label}</span>
                <span className="tabular text-[13px]">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[var(--fg-faint)]">
            Illustrative synthetic assumptions. Every parameter is editable and
            documented. No company-specific operating cost is presented as fact.
          </p>
        </div>

        <div className="panel p-5">
          <div className="text-[13px] font-semibold">Data sources</div>
          <ul className="mt-3 flex flex-col gap-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
            <li>· NYC TLC trip records — historical demand, duration, distance, fares.</li>
            <li>· NYC taxi zones — geographic demand boundaries.</li>
            <li>· OpenStreetMap — street network and map geometry.</li>
            <li>· OSRM — precomputed road travel times and route geometry.</li>
            <li>· Open-Meteo — optional weather scenarios (later).</li>
          </ul>
          <p className="mt-3 text-[12px] text-[var(--fg-faint)]">
            Taxi trips are a proxy for potential AV demand, not observed AV demand. The
            assumed capture fraction is user-adjustable.
          </p>
        </div>
      </div>
    </div>
  );
}
