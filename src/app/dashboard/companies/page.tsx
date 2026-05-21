import { getCompanies } from "@/lib/nocodb";

export const revalidate = 60;

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Companies</h2>
        <p className="mt-1 text-sm text-slate-500">
          {companies.length} employers tracked
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Company</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Target Fit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies
              .sort((a, b) => a.Company.localeCompare(b.Company))
              .map((company) => (
                <tr key={company.Id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{company.Company}</td>
                  <td className="px-4 py-3 text-slate-600">{company["Company Type"]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        company.Status?.toLowerCase() === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {company.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{company.Priority}</td>
                  <td className="px-4 py-3 text-slate-600">{company["Target Fit"]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
