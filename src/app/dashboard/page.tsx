import { getCompanies, getRoles, computeStats } from "@/lib/nocodb";

export const revalidate = 60;

export default async function DashboardPage() {
  const [companies, roles] = await Promise.all([getCompanies(), getRoles()]);
  const stats = computeStats(roles, companies);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tracking {stats.activeRoles} active roles across {stats.companiesWithOpenRoles} companies
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Roles"
          value={stats.totalRoles}
          sub={`${stats.activeRoles} active · ${stats.closedRoles} closed`}
          color="blue"
        />
        <StatCard
          label="Active Roles"
          value={stats.activeRoles}
          sub={`Avg ${stats.avgDaysOpen} days open`}
          color="emerald"
        />
        <StatCard
          label="Companies"
          value={stats.companiesWithOpenRoles}
          sub={`of ${stats.totalCompanies} tracked`}
          color="amber"
        />
        <StatCard
          label="Closed / Declined"
          value={stats.closedRoles}
          sub="archived roles"
          color="rose"
        />
      </div>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Active Roles by Company</h3>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Company</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Open Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(stats.rolesByCompany)
                .sort((a, b) => b[1] - a[1])
                .map(([company, count]) => (
                  <tr key={company} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{company}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recently Added</h3>
        <div className="space-y-3">
          {roles
            .filter((r) => r["Date Found"])
            .sort(
              (a, b) =>
                new Date(b["Date Found"]).getTime() -
                new Date(a["Date Found"]).getTime()
            )
            .slice(0, 5)
            .map((role) => (
              <div
                key={role.Id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{role["Role Title"]}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {role.Companies?.Company || "Unknown"} ·{" "}
                      {role["Date Found"]}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isActiveRole(role)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {role.Status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  color: "blue" | "emerald" | "amber" | "rose";
}) {
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

function isActiveRole(role: { Status?: string }) {
  const s = (role.Status || "").toLowerCase();
  return !["closed", "rejected", "declined", "filled"].includes(s);
}
