"use client";

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  color: "blue" | "emerald" | "amber" | "rose";
}

export default function StatCard({ label, value, sub, color }: StatCardProps) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color].split(" ")[1]}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}
