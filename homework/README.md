# AI Teaching Assistant

AI Teaching Assistant is a full-stack teaching support platform with a FastAPI backend and a React frontend. This repository currently behaves like a small monorepo: the application code lives in `backend/` and `frontend/`, while the repository root provides shared docs, startup scripts, and workspace-level hygiene.

## Repository Entry Points

Use the repository root when you want one stable place to start from:

```bash
# Start frontend + backend together
npm run dev

# Check local environment assumptions
npm run check:env

# Frontend-only commands from the root
npm run frontend:start
npm run frontend:build
npm run frontend:test
```

You can still work directly inside each app:

```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm start
```

## Structure

```text
.
├── backend/                  FastAPI service, database, tests, scripts
├── frontend/                 React application
├── docs/                     Stable project documentation
├── scripts/                  Root-level helpers such as dev startup and env checks
├── public/                   Legacy/static root assets
├── temp/                     Local scratch space, ignored from version control
└── outputs/runtime/          Runtime receipts and generated evidence, ignored
```

For a more detailed map of what belongs where, see [docs/REPOSITORY_STRUCTURE.md](docs/REPOSITORY_STRUCTURE.md).

## What Lives Where

- `backend/`: API routes, services, models, migrations, backend tests, backend-specific scripts.
- `frontend/`: React pages, components, hooks, types, i18n resources, frontend tests.
- `docs/`: user/developer documentation plus governed requirement and execution-plan artifacts.
- `scripts/`: root orchestration scripts that should stay thin and delegate into `backend/` or `frontend/`.
- `temp/` and `outputs/runtime/`: generated or local-only working directories that should not become source-of-truth.

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL if you want full backend integration

### Backend

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Common Docs

- [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md)
- [docs/DEBUGGING_GUIDE.md](docs/DEBUGGING_GUIDE.md)
- [docs/SYSTEM_TESTING_REPORT.md](docs/SYSTEM_TESTING_REPORT.md)
- [docs/USER_INTERFACE_GUIDE.md](docs/USER_INTERFACE_GUIDE.md)
- [TODO.md](TODO.md)
- [TODO_zh-CN.md](TODO_zh-CN.md)

## Maintenance Notes

- Treat the repository root as orchestration and documentation space, not as a second app.
- Prefer adding new frontend dependencies inside `frontend/package.json` and new backend dependencies inside `backend/requirements*.txt` or `backend/pyproject.toml`.
- Keep generated files, caches, scratch directories, and runtime receipts out of version control unless they are intentional documentation artifacts.

## License

MIT. See [LICENSE](LICENSE).
