# 2026-04-06 Project Tidy

## Summary

Perform a low-risk repository organization pass for the current workspace so contributors can understand the root entrypoints, directory ownership, and generated-artifact boundaries without moving application code.

## Goal

Reduce repository ambiguity at the root level and document a stable structure for ongoing development.

## Deliverable

- Updated root-level repository guide.
- A dedicated repository structure document.
- Root workspace scripts that make frontend and shared startup flows discoverable.
- Ignore rules for generated local artifacts and scratch space.
- Governed runtime artifacts for this `vibe` run.

## Constraints

- Do not perform high-risk directory moves or broad file deletion.
- Do not revert or overwrite existing user changes in the dirty worktree.
- Avoid touching already modified `frontend/package.json` and `frontend/package-lock.json`.
- Keep application behavior unchanged; focus on organization, documentation, and workspace hygiene.

## Acceptance Criteria

- Root README explains the repository as a workspace and points to authoritative subdirectories.
- A stable structure document exists under `docs/`.
- Root `package.json` exposes usable workspace scripts for common root-level actions.
- `.gitignore` covers local runtime output, scratch directories, and obvious generated caches currently causing noise.
- New governed requirement/plan artifacts exist for traceability.

> Fill the anti-drift fields once here. Downstream governed plan and completion surfaces should reuse them rather than restate them.

## Primary Objective

Improve repository navigability and hygiene without changing product functionality.

## Non-Objective Proxy Signals

- Large diff size.
- Rewriting many files without improving clarity.
- Moving directories just to make the tree look cleaner.
- Claiming the repository is fully normalized when only low-risk governance cleanup was performed.

## Validation Material Role

Repository files, `git status`, and startup manifests are validation inputs only. They do not justify changing runtime ownership boundaries unless the codebase already reflects that ownership.

## Anti-Proxy-Goal-Drift Tier

Lightweight brownfield cleanup with documentation and workspace-entrypoint emphasis.

## Intended Scope

Root-level docs, root-level workspace scripts, ignore rules, and runtime receipts.

## Abstraction Layer Target

Repository organization and developer workflow surface.

## Completion State

Low-risk cleanup complete, with root-level navigation and generated-artifact policy made explicit.

## Generalization Evidence Bundle

- Updated README and repository structure document.
- Updated root `package.json`.
- Updated `.gitignore`.
- Verification that the new root scripts parse correctly and the diff stays within the declared scope.

## Non-Goals

- Refactoring backend or frontend application logic.
- Changing dependency graphs inside the frontend app manifest.
- Deleting legacy tracked files.
- Reorganizing backend or frontend directories physically.

## Autonomy Mode

Interactive governed with inferred assumptions and no extra confirmation because the scope is low-risk and documentation-first.

## Assumptions

- “整理项目” means repository housekeeping and structure clarification, not large-scale codebase migration.
- Existing uncommitted changes outside this scope belong to the user and must remain untouched.
- `temp/` and runtime receipts are local working artifacts rather than canonical project content.

## Evidence Inputs

- Repository root listing.
- Current `git status --short --branch`.
- Existing `README.md`, `.gitignore`, `package.json`, `frontend/package.json`, and `scripts/dev-start.js`.
