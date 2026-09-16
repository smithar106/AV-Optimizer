import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AVantage — Autonomous Fleet Revenue Intelligence",
  description:
    "An open-source fleet simulation and optimization platform: can demand-aware dispatch and repositioning improve autonomous fleet contribution margin?",
};

const nav = [
  { href: "/", label: "Overview" },
  { href: "/simulate", label: "Simulation" },
  { href: "/compare", label: "Compare" },
  { href: "/methodology", label: "Methodology" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--border)]">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">
                AVantage
              </span>
              <span className="hidden text-[11px] uppercase tracking-[0.14em] text-[var(--fg-faint)] sm:inline">
                Fleet revenue intelligence
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-[13px]">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-5 py-6 text-[12px] text-[var(--fg-faint)]">
            Portfolio project · NYC demonstration · synthetic fleet and illustrative
            economics. Not affiliated with any AV operator.
          </div>
        </footer>
      </body>
    </html>
  );
}
