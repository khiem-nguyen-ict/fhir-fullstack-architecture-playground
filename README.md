# FHIR Full-Stack Architecture Playground

## Table of Contents
- [Components](#components)
- [Run the full circle demo (Docker)](#run-the-full-circle-demo-docker)
- [Run each piece locally (no Docker)](#run-each-piece-locally-no-docker)
- [E2E Testing](#e2e-testing)
- [Deploy to Render.com](#deploy-to-rendercom)
- [Quick smoke test (curl)](#quick-smoke-test-curl)
- [License](#license)
- [What is FHIR?](#what-is-fhir)
- [How this project demonstrates FHIR](#how-this-project-demonstrates-fhir)

A small, fully runnable reference stack demonstrating the flow:

```
React (frontend) → GraphQL BFF (bff) → Patient Service (services/patient-service) → FHIR-shaped data (Postgres / H2)
```

It's a playground for trying out architecture patterns around HL7 FHIR
without standing up a full FHIR server: `patient-service` owns the data
and exposes both a plain REST CRUD API and a `/fhir/Patient` read API
shaped like a real FHIR R4 `Patient` resource / `Bundle`. The service
also supports patient search through general search (`?search=<term>`) and
advanced field-specific filtering (`?filterField=field&filterValue=value`).

## Components

- **services/patient-service** — Spring Boot 3 (Java 17) service. Owns
  `Patient` records in Postgres (or in-memory H2 when run standalone).
  Exposes:
  - `GET/POST/PUT/DELETE /api/patients` — plain CRUD
  - `GET /api/patients?search=<term>` — general search across name, email, birthDate, gender, phone
  - `GET /api/patients?filterField=field&filterValue=value` — advanced search by specific fields (givenName, familyName, gender, birthDate, phone, email)
  - `GET /fhir/Patient`, `GET /fhir/Patient/{id}` — FHIR R4-shaped reads
  - `GET /health`
- **bff** — Node.js GraphQL gateway (Apollo Server) that exposes a
  `Patient` GraphQL type to the frontend and proxies to
  `patient-service`'s REST API.
- **frontend** — React + Vite single-page app. Lists patients, adds new
  ones, and deletes them — all the way through the GraphQL BFF to the
  Patient Service. In Docker Compose this runs as its own container on
  port 5173; on Render it is baked into the BFF container (see
  [Deploy to Render.com](#deploy-to-rendercom)).
- **infra/docker-compose.yml** — Runs Postgres + all three services
  together for a one-command full-circle demo.

## Run the full circle demo (Docker)

Requires Docker and Docker Compose.

```bash
cd infra
docker compose up --build
```

> **Note:** If you get an error like `failed to connect to the docker API at unix:///Users/apple/.docker/run/docker.sock`, start **Docker Desktop** (Applications → Docker Desktop) and wait for the whale icon to stop animating, then re-run the command.

Then open:

- Frontend: http://localhost:5173
- BFF GraphQL playground: http://localhost:4000
- Patient Service REST API: http://localhost:8081/api/patients
- Patient Service FHIR API: http://localhost:8081/fhir/Patient

The app seeds three demo patients on first boot. Add a patient in the
UI and watch it flow: React → GraphQL mutation → BFF → REST POST →
Patient Service → Postgres, then back out the other way as a FHIR
`Bundle` if you hit `/fhir/Patient` directly.

## Run each piece locally (no Docker)

**1. Patient Service** (uses in-memory H2 by default, no DB setup needed):

```bash
cd services/patient-service
mvn spring-boot:run
# -> listening on http://localhost:8081
```

**2. BFF**:

```bash
cd bff
npm install
npm start
# -> listening on http://localhost:4000
```

**3. Frontend**:

```bash
cd frontend
npm install
npm run dev
# -> listening on http://localhost:5173
```

## Deploy to Render.com

The repo includes an `infra/render.yaml` blueprint that provisions the full stack
on Render's free tier. In this setup the **frontend is embedded inside the
BFF** so only two web services plus one managed Postgres are needed.

### What gets created

| Service | Type | Plan | Notes |
|---------|------|------|-------|
| `fhir-postgres-db` | Managed Postgres | Free | |
| `patient-service` | Web (Docker) | Free | |
| `bff` | Web (Docker, multi-stage) | Free | Serves the UI and proxies GraphQL |
| `frontend` | Web (Docker) | Free | React + Vite app on port 5173 |

### Deploy

#### All-in-one (frontend embedded in BFF)

This is the default setup configured in `infra/render.yaml`. The BFF Docker image
builds the frontend with Vite and serves its static assets alongside the GraphQL
API.

1. Push this repo to GitHub.
2. In the Render Dashboard, click **New → Blueprint**.
3. Connect the repo and select the `infra/render.yaml` file.
4. Click **Apply** to provision all services.

Render will automatically wire environment variables between services:
- `patient-service` receives its database connection string from
  `fhir-postgres-db`.
- `bff` receives `PATIENT_SERVICE_URL` from `patient-service`.

#### Frontend as standalone service

If you want the frontend on its own URL (e.g. for faster static hosting or
independent scaling), add a fourth web service in Render:

- **Environment**: Docker
- **Root Directory**: `frontend`
- **Dockerfile Path**: `frontend/Dockerfile`
- **Port**: 5173

The frontend Dockerfile will serve the built React app via Vite's preview server.

## E2E Testing

Playwright E2E tests validate the full stack (frontend → BFF → patient-service) against real Docker services.

### Run E2E Tests Locally

```bash
# Terminal 1: Start all services
cd infra && docker compose up --build

# Terminal 2: Run tests
cd frontend
npm run test:e2e              # Run all tests
npm run test:e2e:ui           # Interactive UI mode
npm run test:e2e:debug        # Debug mode
npm run test:e2e -- --grep @smoke  # Smoke tests only
```

### How Tests Work

- **Smoke tests** (tagged `@smoke`): Run on every PR, verify core functionality (app loads, patient list renders, form submits)
- **Full E2E suite**: Manual trigger via GitHub Actions workflow dispatch, validates all features
- Tests clean up after themselves (create/delete test patients)
- Executes serially (`workers: 1`) to avoid database conflicts

### GitHub Actions

- **Pull Requests**: Smoke tests run automatically after frontend unit tests pass
- **Manual trigger**: Full E2E suite via Actions tab → "E2E Tests" → Run workflow

### Live URLs (after deploy)

- Frontend + BFF (served together): `https://<bff-service-name>.onrender.com`
- Patient Service REST API: `https://<patient-service-name>.onrender.com/api/patients`
- Patient Service FHIR API: `https://<patient-service-name>.onrender.com/fhir/Patient`

GraphQL is available at `https://<bff-service-name>.onrender.com/graphql`.

## Live Demo Links

- Live Patient Service: https://patient-service-lzty.onrender.com
- Live BFF: https://bff-3fpu.onrender.com
- Live Frontend App: https://frontend-sgar.onrender.com

> **Note:** Free-tier services on Render spin down after 15 minutes of inactivity.
> To run the demo successfully, please start the services in this order:
> 1. Patient Service: open https://patient-service-lzty.onrender.com
> 2. BFF: open https://bff-3fpu.onrender.com
> 3. Frontend App: open https://frontend-sgar.onrender.com
>
> Otherwise, the frontend app may be unable to load data.

## Quick smoke test (curl)

```bash
# REST CRUD on patient-service directly
curl http://localhost:8081/api/patients

# General search across multiple fields
curl "http://localhost:8081/api/patients?search=jo"

# Advanced search by specific fields
curl "http://localhost:8081/api/patients?filterField=gender&filterValue=male"
curl "http://localhost:8081/api/patients?filterField=birthDate&filterValue=2024"

# FHIR-shaped bundle
curl http://localhost:8081/fhir/Patient

# GraphQL via the BFF
 curl -X POST http://localhost:4000/graphql \
   -H 'Content-Type: application/json' \
   -d '{"query":"{ patients(search: \"jo\") { totalCount patients { id fullName } } }"}'

 # GraphQL with advanced filtering
 curl -X POST http://localhost:4000/graphql \
   -H 'Content-Type: application/json' \
   -d '{"query":"{ patients(filterField: [\"gender\", \"birthDate\"], filterValue: [\"male\", \"2024\"]) { totalCount patients { id fullName gender birthDate } } }"}'
```

See `docs/architecture.md` for more on how the layers fit together.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## What is FHIR?
FHIR (Fast Healthcare Interoperability Resources) is a standard for exchanging healthcare information electronically.
It defines how healthcare information can be exchanged between different systems, regardless of how it is stored.
Learn more at the [official HL7 FHIR documentation](https://hl7.org/fhir/).

## How this project demonstrates FHIR
This project demonstrates a common pattern in healthcare applications: a frontend application that communicates with a backend through a Backend-for-Frontend (BFF) layer, which in turn interacts with a service that manages FHIR resources. Specifically, the `patient-service` exposes a FHIR-compliant endpoint (`/fhir/Patient`) that returns patient data in the FHIR JSON format, mimicking a real FHIR server. The BFF (GraphQL) and frontend consume this FHIR-shaped data, illustrating how a real-world application might interact with a FHIR server without the complexity of setting up a full FHIR server.
