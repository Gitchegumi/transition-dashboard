"use client";

export default function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const styles: Record<string, string> = {
    saved: "bg-emerald-100 text-emerald-700",
    active: "bg-emerald-100 text-emerald-700",
    maybe: "bg-amber-100 text-amber-700",
    closed: "bg-rose-100 text-rose-700",
    rejected: "bg-slate-100 text-slate-600",
    declined: "bg-slate-100 text-slate-600",
    filled: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[s] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}
