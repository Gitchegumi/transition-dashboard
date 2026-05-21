/**
 * NocoDB API client — talks to the job-search database.
 * Env vars: NOCO_BASE, NOCO_DB_API_KEY
 */

const NOCO_BASE = process.env.NOCO_BASE || "noco.gitchegumi.com";
const NOCO_TOKEN = process.env.NOCO_DB_API_KEY;

const COMPANIES_TABLE = "mzr7b7t2fkkppgz";
const ROLES_TABLE = "m8i09vns0626vfv";

export interface NocoCompany {
  Id: number;
  Company: string;
  "Company Type": string;
  Status: string;
  Priority: string;
  "Target Fit": string;
}

export interface NocoRole {
  Id: number;
  "Role Title": string;
  "Role Family": string;
  Location: string;
  "Remote Status": string;
  "Compensation Range": string;
  "Clearance Required": boolean;
  "Posted Date": string;
  "Fit Rating": string;
  "Apply Decision": string;
  "Cover Letter Needed": boolean;
  "Positioning Notes": string;
  Status: string;
  "Date Found": string;
  "Closing Date": string | null;
  Companies_id: number;
  "Posting URL": string;
  // Linked company (expanded via query)
  Companies?: { Company: string };
}

export interface DashboardStats {
  totalRoles: number;
  activeRoles: number;
  closedRoles: number;
  avgDaysOpen: number;
  totalCompanies: number;
  companiesWithOpenRoles: number;
  rolesByCompany: Record<string, number>;
}

async function nocoReq<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  if (!NOCO_TOKEN) {
    throw new Error("NOCO_DB_API_KEY not configured");
  }

  const url = `https://${NOCO_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "xc-token": NOCO_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NocoDB ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

async function getAllRecords<T>(tableId: string): Promise<T[]> {
  const rows: T[] = [];
  let offset = 0;
  const limit = 200;

  while (true) {
    const data = await nocoReq<{ list: T[]; pageInfo?: { isLastPage?: boolean } }>(
      "GET",
      `/api/v2/tables/${tableId}/records?offset=${offset}&limit=${limit}`
    );

    const list = data.list || [];
    if (!list.length) break;
    rows.push(...list);

    if (data.pageInfo?.isLastPage) break;
    offset += limit;
  }

  return rows;
}

export async function getCompanies(): Promise<NocoCompany[]> {
  return getAllRecords<NocoCompany>(COMPANIES_TABLE);
}

export async function getRoles(): Promise<NocoRole[]> {
  return getAllRecords<NocoRole>(ROLES_TABLE);
}

export async function getRoleById(id: number): Promise<NocoRole | null> {
  try {
    const data = await nocoReq<{ list: NocoRole[] }>(
      "GET",
      `/api/v2/tables/${ROLES_TABLE}/records?where=(Id,eq,${id})&limit=1`
    );
    return data.list?.[0] || null;
  } catch {
    return null;
  }
}

export function isActiveRole(role: NocoRole): boolean {
  const status = (role.Status || "").toLowerCase();
  return !["closed", "rejected", "declined", "filled"].includes(status);
}

export function daysOpen(role: NocoRole): number {
  const dateFound = role["Date Found"];
  if (!dateFound) return 0;
  const days = Math.floor(
    (new Date().getTime() - new Date(dateFound).getTime()) / 86400000
  );
  return Math.max(0, days);
}

export function computeStats(roles: NocoRole[], companies: NocoCompany[]): DashboardStats {
  const active = roles.filter(isActiveRole);
  const closed = roles.filter((r) => !isActiveRole(r));

  const openDays = active.map(daysOpen).filter((d) => d > 0);
  const avgDays = openDays.length
    ? Math.round(openDays.reduce((a, b) => a + b, 0) / openDays.length)
    : 0;

  const companyMap = new Map<number, string>();
  for (const c of companies) {
    companyMap.set(c.Id, c.Company);
  }

  const rolesByCompany: Record<string, number> = {};
  for (const r of active) {
    const name = companyMap.get(r.Companies_id) || "Unknown";
    rolesByCompany[name] = (rolesByCompany[name] || 0) + 1;
  }

  return {
    totalRoles: roles.length,
    activeRoles: active.length,
    closedRoles: closed.length,
    avgDaysOpen: avgDays,
    totalCompanies: companies.length,
    companiesWithOpenRoles: Object.keys(rolesByCompany).length,
    rolesByCompany,
  };
}
