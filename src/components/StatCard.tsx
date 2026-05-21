"use client";

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  color: "blue" | "emerald" | "amber" | "rose";
}

export default function StatCard({ label, value, sub, color }: StatCardProps) {
  const colorMap = {
    blue: "bg-blue-900/50 text-blue-300",
    emerald: "bg-emerald-900/50 text-emerald-300",
    amber: "bg-amber-900/50 text-amber-300",
    rose: "bg-rose-900/50 text-rose-300",
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color].split(" ")[1]}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}
