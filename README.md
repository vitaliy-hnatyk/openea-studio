# OpenEA Studio

Frontend MVP for an Enterprise Architecture / Application Portfolio Management tool inspired by LeanIX, Ardoq and BiZZdesign-style dashboards.

## Features

- Dark enterprise dashboard UI
- Application portfolio list
- Architecture canvas with application nodes and integration lines
- Application details panel
- Incoming/outgoing dependency counters
- Roadmap panel
- Status and domain filters
- JSON export/import
- Local browser persistence through localStorage
- No backend required for the MVP

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Main stack

- React
- TypeScript
- Vite
- CSS Modules-style plain CSS
- lucide-react icons

## Project structure

```text
src/
  components/
    ArchitectureCanvas.tsx
    ApplicationDetails.tsx
    ApplicationsTable.tsx
    Header.tsx
    RoadmapPanel.tsx
    Sidebar.tsx
    Toolbar.tsx
  data/
    sampleData.ts
  store/
    useArchitectureStore.ts
  types/
    architecture.ts
  utils/
    graph.ts
  styles/
    global.css
```

## Next improvements

- React Flow drag/drop editor
- IndexedDB instead of localStorage
- Backend API with PHP/CodeIgniter or Java Spring Boot
- User roles and comments
- CSV/Excel import
- ArchiMate export
- AI architecture summary
