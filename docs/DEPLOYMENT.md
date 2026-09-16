# Deployment (Railway)

Two services plus a managed Postgres database in one Railway project.

| Service | Root directory | Exposure |
| --- | --- | --- |
| web | `apps/web` | Public |
| api | `apps/api` | Private |
| Postgres | managed database | Private |

## Services

Each app ships a Dockerfile, so Railway builds from the service's root directory.

### api (`apps/api`)

- Builds `Dockerfile` (python:3.12-slim), runs `uvicorn app.main:app` on `$PORT`.
- Health check: `GET /api/v1/health`.
- Environment:
  - `ENVIRONMENT=production`
  - `CORS_ORIGINS` — comma-separated origins (the public web domain).
  - `DATABASE_URL` — injected by the Postgres plugin.
  - `MAX_SIMULATION_SECONDS`, `MAX_VEHICLES` — execution guardrails.

### web (`apps/web`)

- Builds `Dockerfile` (node:22-slim, Next.js standalone output), runs `node server.js` on `$PORT`.
- Environment:
  - `API_URL` — server-side API base, e.g. `http://<api-service>.railway.internal:8000`.
  - `NEXT_PUBLIC_API_URL` — optional browser-accessible API base.

The web service reaches the API over Railway private networking; the API is not
exposed publicly.

## Setup

1. Create a Railway project named `avantage`.
2. Add **PostgreSQL** (provides `DATABASE_URL`).
3. Add service **api** from the repo, root directory `apps/api`, generate a domain
   (optional; private is sufficient) and set `ENVIRONMENT=production` +
   `CORS_ORIGINS`.
4. Add service **web** from the repo, root directory `apps/web`, set `API_URL` to the
   API's private domain and expose a public domain.
5. Deploy. The public URL serves the frontend; it calls the API over the private
   network.

## Local equivalent

```bash
docker compose up --build
```

## Cost notes

Railway's Free tier includes a small monthly resource credit; the Hobby tier has a
monthly base fee that counts toward usage. Actual spend depends on CPU, memory,
storage, and traffic. The default public demo serves precomputed scenarios so visitors
do not each trigger an OR-Tools run.
