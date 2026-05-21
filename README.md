# Transition Dashboard

Army-to-civilian job search tracker. Reads from NocoDB and renders companies,
roles, and stats.

## Required Env Vars

| Variable | Required | Description |
|----------|----------|-------------|
| `NOCO_BASE` | ✅ | NocoDB host, e.g. `noco.gitchegumi.com` |
| `NOCO_DB_API_KEY` | ✅ | NocoDB API token |

## Local Dev

```bash
cp .env.example .env
npm install
npm run dev
```

## Container

```bash
docker build -t ghcr.io/Gitchegumi/transition-dashboard:latest .
docker run -p 3000:3000 \
  -e NOCO_BASE=noco.gitchegumi.com \
  -e NOCO_DB_API_KEY=*** \
  ghcr.io/Gitchegumi/transition-dashboard:latest
```

## TrueNAS Deploy (Docker Compose)

```yaml
services:
  transition-dashboard:
    image: ghcr.io/Gitchegumi/transition-dashboard:latest
    ports:
      - "3000:3000"
    environment:
      - NOCO_BASE=noco.gitchegumi.com
      - NOCO_DB_API_KEY=${NOCO…KEY}
```

## GitHub Secrets for Actions

Only two secrets needed in **Settings → Secrets → Actions**:

- `NOCO_BASE`
- `NOCO_DB_API_KEY`

## Pages

- `/` → redirects to `/dashboard`
- `/dashboard` — overview, stats, recent roles
- `/dashboard/companies` — company list
- `/dashboard/roles` — role list with sort/filter
- `/dashboard/roles/[id]` — role detail
