import React from "react";

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 ${className}`}>
      <div
        className="h-2 rounded-full bg-brand-600 transition-all"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function Badge({
  children,
  color = "slate",
}: {
  children: React.ReactNode;
  color?: "slate" | "green" | "red" | "amber" | "brand";
}) {
  const colors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    brand: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  as: Comp = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Comp
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants: Record<string, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-300",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
