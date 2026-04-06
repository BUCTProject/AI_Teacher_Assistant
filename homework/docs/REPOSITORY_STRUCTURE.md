# Repository Structure

## Goal

This repository should read like a two-application workspace, not a flat dump of unrelated files. The conventions below define where new files should go and which directories are considered generated versus source-of-truth.

## Top-Level Layout

| Path | Role | Notes |
|------|------|-------|
| `backend/` | FastAPI backend | Owns API routes, services, models, migrations, and backend test suites. |
| `frontend/` | React frontend | Owns pages, components, hooks, styles, i18n, and frontend test suites. |
| `docs/` | Stable documentation | Product, setup, debugging, reports, and governed planning artifacts. |
| `scripts/` | Root orchestration | Thin wrappers that delegate into backend/frontend workflows. |
| `public/` | Root-level static assets | Keep only if they are still needed by root tooling or deployment. |
| `config/`, `models/`, `file_manager/`, `uploads/`, `shrimp_data/` | Legacy/shared project assets | Treat carefully; do not move without confirming runtime ownership. |
| `temp/` | Scratch workspace | Local-only, ignored from git. |
| `outputs/runtime/` | Runtime receipts | Local-only evidence and session artifacts, ignored from git. |

## Placement Rules

1. New product code goes under `backend/` or `frontend/`, not the repository root.
2. Root scripts should orchestrate existing app commands; they should not duplicate backend or frontend business logic.
3. Stable human-facing documentation belongs in `docs/`.
4. Generated test caches, scratch folders, and one-off runtime receipts belong under ignored paths such as `temp/` or `outputs/runtime/`.
5. Backup files such as `*.bak` should not be added as intentional project artifacts.

## Existing Repository Realities

- The repo already contains some legacy root files and directories. This document does not reclassify them automatically.
- The root `package.json` should remain a workspace convenience entrypoint, not a second frontend package.
- `frontend/package.json` remains the authoritative manifest for frontend dependencies.
- Backend Python dependency management remains inside `backend/`.

## Recommended Workflow

### Start the stack

```bash
npm run dev
```

### Frontend-only

```bash
npm run frontend:start
npm run frontend:build
npm run frontend:test
```

### Backend-only

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

## Change Review Checklist

- Does this file live under the correct app or documentation directory?
- Is this artifact source-of-truth, or should it be generated/ignored instead?
- Is the repository root being used only for shared orchestration, docs, or legacy compatibility?
- If a new top-level directory is being introduced, is its ownership and retention policy documented?
