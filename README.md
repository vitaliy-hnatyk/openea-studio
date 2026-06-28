# OpenEA Studio

Frontend-first Enterprise Architecture / Application Portfolio MVP.

## Current features

- Dark enterprise architecture dashboard UI
- React Flow architecture canvas
- Move nodes and save node positions
- Create integrations by dragging from one node handle to another
- Delete integrations from the canvas
- Zoom / pan / fit view / minimap
- Auto-layout button
- CRUD editing for:
  - Applications
  - Integrations
  - Business capabilities
  - Technology items
- JSON import/export
- IndexedDB persistence for frontend-only usage
- Optional Spring Boot + PostgreSQL backend skeleton for multi-user deployment

## Frontend stack

- React
- Vite
- TypeScript
- React Flow (`@xyflow/react`)
- IndexedDB

## Run frontend

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build frontend

```bash
npm run build
npm run preview
```

## Storage

The frontend now stores the architecture repository in browser IndexedDB:

```text
Database: openea-studio-db
Object store: repositories
Current record: current
```

If IndexedDB is not available, it falls back to `localStorage`.

Older `localStorage` data is migrated automatically on first load.

## Backend stack

The `backend/` folder contains a Spring Boot + PostgreSQL backend skeleton:

```text
Frontend: React + Vite + TypeScript
Backend: Java / Spring Boot
Database: PostgreSQL
Auth: Basic Auth now, JWT-ready structure later
```

Run PostgreSQL:

```bash
cd backend/docker
docker compose up -d
```

Run backend:

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

Demo Basic Auth:

```text
Username: admin
Password: admin123
```

Main API:

```text
GET    /api/repository
PUT    /api/repository
GET    /api/applications
POST   /api/applications
PUT    /api/applications/{id}
DELETE /api/applications/{id}
GET    /api/integrations
POST   /api/integrations
PUT    /api/integrations/{id}
DELETE /api/integrations/{id}
GET    /api/capabilities
POST   /api/capabilities
PUT    /api/capabilities/{id}
DELETE /api/capabilities/{id}
GET    /api/technologies
POST   /api/technologies
PUT    /api/technologies/{id}
DELETE /api/technologies/{id}
```

## Next backend integration step

The frontend is currently offline-first with IndexedDB. Next step is to add a storage adapter selector:

```text
IndexedDB mode: local browser storage
API mode: sync repository with Spring Boot backend
```
