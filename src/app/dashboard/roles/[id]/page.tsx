import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoleById, getCompanies } from "@/lib/nocodb";

export const revalidate = 60;

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roleId = parseInt(id, 10);
  if (isNaN(roleId)) return notFound();

  const [role, companies] = await Promise.all([
    getRoleById(roleId),
    getCompanies(),
  ]);

  if (!role) return notFound();

  const company = companies.find((c) => c.Id === role.Companies_id);
  const isActive = !["closed", "rejected", "declined", "filled"].includes(
    (role.Status || "").toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/roles" className="hover:text-slate-900 hover:underline">
          ← Roles
        </Link>
        <span>/</span>
        <span className="text-slate-900">{role["Role Title"]}</span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{role["Role Title"]}</h1>
            <p className="mt-1 text-slate-500">
              {company?.Company || "Unknown"} · {role["Role Family"] || "—"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {role.Status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Location" value={role.Location || "—"} />
          <DetailField label="Remote Status" value={role["Remote Status"] || "—"} />
          <DetailField
            label="Compensation"
            value={role["Compensation Range"] || "—"}
          />
          <DetailField label="Fit Rating" value={role["Fit Rating"] || "—"} />
          <DetailField
            label="Apply Decision"
            value={role["Apply Decision"] || "—"}
          />
          <DetailField
            label="Cover Letter"
            value={role["Cover Letter Needed"] ? "Yes" : "No"}
          />
          <DetailField label="Date Found" value={role["Date Found"] || "—"} />
          <DetailField label="Posted Date" value={role["Posted Date"] || "—"} />
          <DetailField
            label="Clearance Required"
            value={role["Clearance Required"] ? "Yes" : "No"}
          />
        </div>

        {role["Positioning Notes"] && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-900">Notes</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {role["Positioning Notes"]}
            </p>
          </div>
        )}

        {role["Posting URL"] && (
          <div className="mt-6">
            <a
              href={role["Posting URL"]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Posting →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
