"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Icon({ d, className = "w-4 h-4" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

type NavLinkItem = { label: string; href: "/" | "/compare-trends"; icon: string };
type NavButtonItem = { label: string; icon: string };
type NavItem = NavLinkItem | NavButtonItem;

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  },
  {
    label: "Compare Trends",
    href: "/compare-trends",
    icon: "M3 3v18h18M8 17l4-8 4 4 4-6",
  },
  {
    label: "AI Insights",
    icon: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z",
  },
  {
    label: "Search History",
    icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
  {
    label: "Alerts",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9",
  },
  {
    label: "Exports",
    icon: "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-zinc-900 border-r border-zinc-800/60 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18M8 17l4-8 4 4 4-6" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-zinc-100 text-sm tracking-tight leading-none">Trends</div>
            <div className="text-xs text-zinc-500 mt-0.5">Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = "href" in item && item.href === pathname;
          const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all border-l-2 ${
            active
              ? "bg-violet-600/15 text-violet-400 border-violet-500 pl-[10px]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border-transparent"
          }`;

          if ("href" in item) {
            return (
              <Link key={item.label} href={item.href} className={className}>
                <Icon d={item.icon} className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          }

          return (
            <button key={item.label} type="button" className={className}>
              <Icon d={item.icon} className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5 pt-4 border-t border-zinc-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span className="text-xs text-zinc-400">Localhost</span>
          </div>
          <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700/50">dev</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500/70" />
          <span className="text-xs text-zinc-500">SerpAPI</span>
        </div>
      </div>
    </aside>
  );
}
