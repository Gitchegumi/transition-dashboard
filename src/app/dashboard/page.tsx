import { getCompanies, getRoles, computeStats, isActiveRole } from "@/lib/nocodb";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

export const revalidate = 60;

export default async function DashboardPage() {
  const [companies, roles] = await Promise.all([getCompanies(), getRoles()]);
  const stats = computeStats(roles, companies);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
        <p className="mt-1 text-sm text-slate-400">
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
        <h3 className="mb-4 text-lg font-semibold text-slate-100">Active Roles by Company</h3>
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-300">Company</th>
                <th className="px-4 py-3 text-right font-medium text-slate-300">Open Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {Object.entries(stats.rolesByCompany)
                .sort((a, b) => b[1] - a[1])
                .map(([company, count]) => (
                  <tr key={company} className="hover:bg-slate-800">
                    <td className="px-4 py-3 font-medium text-slate-100">{company}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-100">Recently Added</h3>
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
                className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">{role["Role Title"]}</p>
                    <p className="mt-0.5 text-sm text-slate-400">
                      {role.Companies?.Company || "Unknown"} ·{" "}
                      {role["Date Found"]}
                    </p>
                  </div>
                  <StatusBadge status={role.Status} />
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

