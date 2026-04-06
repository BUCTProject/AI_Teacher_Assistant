# 2026-04-06 Project Tidy Execution Plan

## Execution Summary

Execute a serial, low-risk repository-organization pass focused on root-level clarity, documentation, and generated-artifact hygiene.

## Frozen Inputs

- Requirement doc: `docs/requirements/2026-04-06-project-tidy.md`
- Current dirty worktree must be preserved.
- Existing frontend manifest changes are outside this task's write scope.

## Anti-Proxy-Goal-Drift Controls

Prefill from the frozen requirement doc where available. Only diverge with explicit justification.

### Primary Objective

Improve repository navigability and hygiene without changing product functionality.

### Non-Objective Proxy Signals

- Large or flashy reorganization diff.
- Moving code between directories.
- Treating generated receipts as source-of-truth.

### Validation Material Role

Use repo files and command output to verify organization changes; do not infer permission for structural migration from them.

### Declared Tier

Lightweight brownfield cleanup.

### Intended Scope

Root README, root package manifest, ignore rules, repository structure doc, runtime receipts.

### Abstraction Layer Target

Repository organization and workflow surface.

### Completion State Target

Workspace entrypoints and structure are documented, generated artifacts are ignored, and no app logic was changed.

### Generalization Evidence Plan

- Inspect resulting diff.
- Confirm root `package.json` scripts can be read by Node.
- Confirm files were added under the planned documentation paths.

## Internal Grade Decision

`L`

Reason: the task spans multiple artifacts and requires governed planning, but it does not justify XL parallel execution or application-level refactoring.

## Wave Plan

### Wave 1

- Create governed runtime artifacts for skeleton and intent.
- Freeze requirement and plan documents.

### Wave 2

- Update root `package.json` with workspace scripts.
- Update `.gitignore` with generated-artifact policy.
- Rewrite root `README.md` as a repository entrypoint.
- Add `docs/REPOSITORY_STRUCTURE.md`.

### Wave 3

- Run minimal verification commands.
- Write execution and cleanup receipts.

## Ownership Boundaries

- Root-governed lane only.
- Write scope: `README.md`, `.gitignore`, root `package.json`, `docs/`, `outputs/runtime/`.
- No subagents.
- No edits inside already modified frontend manifests.

## Verification Commands

```powershell
node -p "Object.keys(require('./package.json').scripts).join(', ')"
git diff --stat -- README.md .gitignore package.json docs
git status --short
```

## Rollback Plan

- Revert only the files in the declared write scope if this cleanup needs to be undone.
- Do not revert unrelated dirty files already present before this task.

## Phase Cleanup Contract

- Record verification results in a phase receipt.
- Record that no destructive cleanup was performed.
- Leave runtime receipts under `outputs/runtime/`.
- Downgrade completion language if verification fails or if any scope drift occurs.
