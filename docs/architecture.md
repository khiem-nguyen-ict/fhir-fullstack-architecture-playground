# Architecture

```
┌───────────┐   GraphQL    ┌─────────┐   REST/JSON   ┌──────────────────┐   SQL   ┌────────────┐
│  React    │ ───────────▶ │  BFF    │ ─────────────▶│ Patient Service  │ ──────▶ │ Postgres   │
│ frontend  │ ◀─────────── │ (Apollo)│ ◀──────────────│ (Spring Boot)    │ ◀────── │ (or H2)    │
└───────────┘   queries/   └─────────┘   patients     └──────────────────┘         └────────────┘
                mutations                 + FHIR Patient/Bundle JSON
```

## Layers

1. **React frontend** (`frontend/`) — talks only to the BFF, only in
   GraphQL. It never knows about REST, FHIR, or the database directly.
   This keeps the UI's data contract stable even if the backend
   topology changes.

2. **GraphQL BFF** (`bff/`) — a Backend-for-Frontend that exposes a
   schema tailored to the UI (`Patient`, `PatientInput`) and adapts it
   onto whatever the upstream Patient Service offers. Today that's a
   single REST call per resolver; in a larger system the BFF is the
   natural place to add response shaping, batching/caching (e.g.
   DataLoader), auth, and aggregation across multiple backend
   services without leaking that complexity to the frontend.

3. **Patient Service** (`services/patient-service/`) — the system of
   record for `Patient` data. It owns the database and exposes two
   API surfaces:
   - `/api/patients` — simple REST CRUD, easy for the BFF (or tests)
     to call.
   - `/fhir/Patient` — the same data shaped as a FHIR R4 `Patient`
     resource / `searchset` `Bundle`, via `FhirMapper`. This is the
     seam where a real deployment would either delegate straight to
     a FHIR server (e.g. HAPI FHIR) or run this service *in front of*
     one, translating between an internal model and FHIR resources at
     the boundary — which is what `FhirMapper` stands in for here.

4. **Database** — Postgres in the Docker Compose stack; falls back to
   in-memory H2 automatically when the service is run standalone, so
   no infrastructure is required just to try it out.

## Why split BFF and Patient Service?

The BFF layer means the frontend's GraphQL contract is decoupled from
how many backend services actually exist. As this playground grows
(e.g. an `Observation` or `Practitioner` service), the BFF schema can
absorb new types and stitch them together without every client
needing to know about new internal services or REST endpoints.

## Extending towards a real FHIR server

To swap `patient-service`'s own Postgres-backed CRUD for a real FHIR
server (HAPI FHIR, etc.):

- Point `FhirMapper`'s callers at the FHIR server's `/Patient`
  endpoint instead of the local repository, or
- Run patient-service purely as a thin FHIR client and drop the JPA
  layer entirely, keeping `/api/patients` as a simplified facade over
  FHIR `Patient` resources for the BFF.

Either way, the BFF and frontend are unaffected — they only ever see
the `Patient` GraphQL type.
