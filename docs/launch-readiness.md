# HexaPay Launch Readiness

Last Updated: April 30, 2026

## Completed

- **DONE** Electron hardening
  `nodeIntegration: false`, `contextIsolation: true`, and a preload-only bridge are in place to reduce renderer risk.
- **DONE** Startup health gate
  The desktop app now waits on the backend `/health` check before opening the main window.
- **DONE** Core backend coverage
  Backend modules exist for auth, memberships, employees, departments, contracts, attendance, leave, holidays, payroll, settings, exports, and backups.
- **DONE** Real backend exports
  Export endpoints now generate real CSV and backup files instead of placeholder metadata-only jobs.
- **DONE** Expanded payroll logic
  Payroll generation includes financial rules, statutory deductions, structure changes, and loan deductions.
- **DONE** Role-based authorization foundation
  Backend access control now supports `ADMIN`, `MANAGER`, and `VIEWER` with explicit route guards.
- **DONE** Sensitive-action audit logging
  Audit records are now written for login/logout, employee changes, approvals/rejections, payroll actions, settings changes, exports, and backup creation.
- **DONE** Smoke pilot passing
  The pilot smoke flow exists and has passed end-to-end validation for the current stack.
- **DONE** Backend health endpoint
  `/health` is live and is already used by the Electron startup flow.
- **DONE** Repeatable verification workflow
  `npm test` now runs deterministic syntax and shared regression checks without depending on the default `node --test` worker behavior.
- **DONE** Release preparation script
  `npm run release:prep` now runs syntax checks, shared tests, Windows packaging, and pilot smoke validation in one repeatable command.

## In Progress

- **IN PROGRESS** Frontend-to-backend migration
  Many live backend paths are wired, and packaged builds no longer silently fall back to mock data, but the remaining demo-safe fallback paths still need a final production cleanup pass.
- **IN PROGRESS** Validation hardening
  Core validators are now real for major flows, but validation still needs a final coverage sweep across all remaining routes and payloads.
- **IN PROGRESS** Production config tightening
  Production startup now enforces strong JWT secrets and explicit CORS origins, but the actual production secrets still need to be populated on the release host.
- **IN PROGRESS** Launch checklist verification
  The app is strong enough for internal testing, but the full production regression pass is not complete yet.

## Remaining Blockers

- **DONE** Backup restore workflow
  Company-scoped backup restore now exists, including rollback snapshot creation before restore.
- **DONE** Production operations baseline
  Production env scaffolding, health checks, backup drill scripts, and support/operations runbooks now exist in the repo.
- **IN PROGRESS** Production logging and monitoring
  Operational health checks and backup monitoring scripts now exist, but external alert routing and hosted observability still need to be provisioned.
- **IN PROGRESS** Desktop signing and release distribution
  Release signing policy and readiness checks now exist, but the production signing certificate and signed release host still need to be provisioned.
- **NOT STARTED** Full release regression pass
  Core business flows still need one clean production-style pass before launch signoff.
- **IN PROGRESS** Frontend cleanup of remaining demo-safe behavior
  Risky silent fallback paths are now blocked in packaged and live-backend sessions, but a final pass is still needed to remove or isolate the remaining development-only mock paths before production.

## Optional Improvements

- **OPTIONAL** Audit log viewing tools
  Audit records are stored, but there is not yet an admin UI or report screen for browsing them.
- **OPTIONAL** First-run and empty-state polish
  Internal users can work through the app, but onboarding and empty states can still be cleaned up.
- **OPTIONAL** Desktop packaging polish
  Installer flow is working, but release packaging can still be tightened with final production defaults and signing strategy.

## Release Recommendation

- **DONE** Ready for internal testing
  The current build is suitable for controlled testing on live backend data paths.
- **NOT READY** Ready for production launch
  Production should still wait for external infrastructure provisioning, hosted alert routing, and a final regression pass.
