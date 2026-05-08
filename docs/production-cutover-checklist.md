# HexaPay Production Cutover Checklist

Last Updated: April 30, 2026

## Before Cutover

1. Provision production MongoDB and create the app database user.
2. Populate production secrets from [C:/Users/User/Documents/Hexapay/.env.production.example](C:/Users/User/Documents/Hexapay/.env.production.example).
3. Configure `CORS_ORIGINS` with explicit production origins.
4. Validate object storage credentials for encrypted backups.
5. Run:

```powershell
npm test
npm run release:prep
npm run release:signing:check
npm run ops:readiness
```

6. Confirm the latest successful backup drill.
7. Review:
   [C:/Users/User/Documents/Hexapay/docs/production-operations.md](C:/Users/User/Documents/Hexapay/docs/production-operations.md)
   [C:/Users/User/Documents/Hexapay/docs/support-runbook.md](C:/Users/User/Documents/Hexapay/docs/support-runbook.md)
   [C:/Users/User/Documents/Hexapay/docs/alerting-matrix.md](C:/Users/User/Documents/Hexapay/docs/alerting-matrix.md)

## On the Backend Host

1. Deploy the current backend build and `.env`.
2. Confirm:

```powershell
npm run ops:health
```

3. Install scheduled tasks:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-ops-scheduled-tasks.ps1
```

4. Confirm the scheduled tasks exist:
   `HexaPay Cloud Backup`
   `HexaPay Ops Health Check`
   `HexaPay Backup Drill`

## Cutover Validation

1. Verify `/health` returns `ok`.
2. Verify admin login.
3. Verify company login.
4. Verify employee list loads.
5. Verify payroll run opens.
6. Trigger a fresh backup.
7. Confirm the backup file is created locally and, if configured, uploaded remotely.

## After Cutover

1. Watch alerts for the first 24 hours.
2. Review backup logs the next day.
3. Confirm the first scheduled backup completed.
4. Confirm the first scheduled health-check logs are being written.
5. Schedule a non-production restore rehearsal inside the first week.
