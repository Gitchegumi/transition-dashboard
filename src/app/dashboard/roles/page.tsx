import Link from "next/link";
import { getCompanies, getRoles, isActiveRole, daysOpen } from "@/lib/nocodb";
import StatusBadge from "@/components/StatusBadge";

export const revalidate = 60;

export default async function RolesPage() {
  const [companies, roles] = await Promise.all([getCompanies(), getRoles()]);

  const companyMap = new Map(companies.map((c) => [c.Id, c.Company]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
        <p className="mt-1 text-sm text-slate-500">
          {roles.length} total roles tracked
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Company</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Location</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Compensation</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles
              .sort((a, b) => {
                // Active first, then by date found (newest)
                const aActive = isActiveRole(a) ? 1 : 0;
                const bActive = isActiveRole(b) ? 1 : 0;
                if (aActive !== bActive) return bActive - aActive;
                return (
                  new Date(b["Date Found"] || 0).getTime() -
                  new Date(a["Date Found"] || 0).getTime()
                );
              })
              .map((role) => (
                <tr key={role.Id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/roles/${role.Id}`}
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {role["Role Title"]}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {companyMap.get(role.Companies_id) || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{role.Location || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {role["Compensation Range"] || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={role.Status} />
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {isActiveRole(role) ? daysOpen(role) : "—"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

