import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Shuffle,
  TrendingDown,
  XCircle,
  Bookmark,
  Clock,
  BarChart3,
  Settings,
  Wrench,
  Search,
  GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/random", label: "Random Practice", icon: Shuffle },
  { to: "/weak-topics", label: "Weak Topics", icon: TrendingDown },
  { to: "/incorrect", label: "Incorrect Questions", icon: XCircle },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/due-review", label: "Due for Review", icon: Clock },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/manager", label: "Question Manager", icon: Wrench },
  { to: "/settings", label: "Settings", icon: Settings },
];

// Smaller set for the mobile bottom bar - only the most-used destinations fit comfortably.
const MOBILE_ITEMS = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/random", label: "Random", icon: Shuffle },
  { to: "/statistics", label: "Stats", icon: BarChart3 },
  { to: "/settings", label: "More", icon: Settings },
];

export default function Layout() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <div className="mb-6 flex items-center gap-2 px-2">
            <GraduationCap className="h-7 w-7 text-brand-600" />
            <div>
              <p className="text-sm font-bold leading-tight">MBBS MCQ</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Practice Platform</p>
            </div>
          </div>
          <NavLink
            to="/search"
            className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400"
          >
            <Search className="h-4 w-4" />
            Search questions, topics...
          </NavLink>
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile top bar */}
        <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand-600" />
            <p className="text-sm font-bold">MBBS MCQ</p>
          </div>
          <NavLink to="/search" aria-label="Search" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Search className="h-5 w-5" />
          </NavLink>
        </header>

        {/* Main content */}
        <main className="min-h-screen w-full flex-1 px-4 pb-24 pt-16 md:px-8 md:pb-8 md:pt-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-slate-200 bg-white/95 py-1.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
        {MOBILE_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-medium ${
                isActive ? "text-brand-600" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
