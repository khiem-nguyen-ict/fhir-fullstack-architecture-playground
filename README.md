# FHIR Full-Stack Architecture Playground

A small, fully runnable reference stack demonstrating the flow:

```
React (frontend) → GraphQL BFF (bff) → Patient Service (services/patient-service) → FHIR-shaped data (Postgres / H2)
```

It's a playground for trying out architecture patterns around HL7 FHIR
without standing up a full FHIR server: `patient-service` owns the data
and exposes both a plain REST CRUD API and a `/fhir/Patient` read API
shaped like a real FHIR R4 `Patient` resource / `Bundle`.

## Components

- **services/patient-service** — Spring Boot 3 (Java 17) service. Owns
  `Patient` records in Postgres (or in-memory H2 when run standalone).
  Exposes:
  - `GET/POST/PUT/DELETE /api/patients` — plain CRUD
  - `GET /fhir/Patient`, `GET /fhir/Patient/{id}` — FHIR R4-shaped reads
  - `GET /health`
- **bff** — Node.js GraphQL gateway (Apollo Server) that exposes a
  `Patient` GraphQL type to the frontend and proxies to
  `patient-service`'s REST API.
- **frontend** — React + Vite single-page app. Lists patients, adds new
  ones, and deletes them — all the way through the GraphQL BFF to the
  Patient Service.
- **infra/docker-compose.yml** — Runs Postgres + all three services
  together for a one-command full-circle demo.

## Run the full circle demo (Docker)

Requires Docker and Docker Compose.

```bash
cd infra
docker compose up --build
```

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

## Quick smoke test (curl)

```bash
# REST CRUD on patient-service directly
curl http://localhost:8081/api/patients

# FHIR-shaped bundle
curl http://localhost:8081/fhir/Patient

# GraphQL via the BFF
curl -X POST http://localhost:4000/ \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ patients { id fullName email } }"}'
```

See `docs/architecture.md` for more on how the layers fit together.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
