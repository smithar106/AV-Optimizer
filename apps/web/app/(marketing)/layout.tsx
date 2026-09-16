import Link from "next/link";

const GITHUB_URL = "https://github.com/smithar106/AV-Optimizer";

const nav = [
  { href: "/simulate", label: "Simulator" },
  { href: "/methodology", label: "Methodology" },
];

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-baseline gap-2.5">
            <span className="text-[16px] font-semibold tracking-tight">AVantage</span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)] sm:inline">
              Fleet intelligence
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-[13px]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              GitHub
            </a>
            <Link
              href="/simulate"
              className="rounded bg-[var(--mint)] px-3.5 py-1.5 text-[12px] font-semibold text-[#08130f] transition-opacity hover:opacity-90"
            >
              Explore simulation
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[12px] text-[var(--fg-faint)]">
          <div className="max-w-2xl leading-relaxed">
            Research simulation. Historical demand patterns and hypothetical vehicles.
            Illustrative economics. Not affiliated with any autonomous vehicle operator.
          </div>
          <div className="flex items-center gap-5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--fg-muted)]"
            >
              GitHub
            </a>
            <a
              href={`${GITHUB_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--fg-muted)]"
            >
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
