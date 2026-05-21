"use client";

export default function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const styles: Record<string, string> = {
    saved: "bg-emerald-900/50 text-emerald-300",
    active: "bg-emerald-900/50 text-emerald-300",
    maybe: "bg-amber-900/50 text-amber-300",
    closed: "bg-rose-900/50 text-rose-300",
    rejected: "bg-slate-800 text-slate-400",
    declined: "bg-slate-800 text-slate-400",
    filled: "bg-slate-800 text-slate-400",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[s] || "bg-slate-800 text-slate-400"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}
