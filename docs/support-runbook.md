# HexaPay Support Runbook

Last Updated: April 30, 2026

## Purpose

This runbook is for first-line support and operations staff handling HexaPay production issues.

## Severity Levels

- `SEV-1`
  Payroll blocked, all users down, backup/restore failure during an active incident
- `SEV-2`
  Major feature failure for one company, partial login outage, payroll calculations unavailable for a subset of users
- `SEV-3`
  Single-user issue, reporting/export problem, cosmetic issue, non-blocking defect

## First Response Checklist

1. Confirm the affected company, user, and time of issue.
2. Confirm whether the backend is reachable:

```powershell
npm run ops:health
```

3. Confirm whether the issue is:
   backend outage
   database outage
   payroll logic/data issue
   backup/restore issue
   desktop client issue
4. Check the latest audit trail for the affected flow if relevant.
5. Capture:
   exact error message
   affected payroll period
   affected employee or company
   timestamp

## Common Incidents

### Backend Unreachable

Symptoms:

- desktop app cannot sign in
- backend requests fail
- `/health` is not `ok`

Actions:

1. Run `npm run ops:health`
2. Confirm the backend service/process is running
3. Confirm Mongo connectivity
4. Restart backend only after capturing the current failure state
5. If health stays red, escalate to infrastructure owner

### MongoDB Connectivity Failure

Symptoms:

- backend startup fails
- health check fails on Mongo
- write operations stop working

Actions:

1. Confirm `MONGO_URI`
2. Check Mongo service or managed cluster status
3. Check network access and credentials
4. Do not run destructive cleanup during an active outage
5. Escalate as `SEV-1` if payroll or login is blocked

### Backup Failure

Symptoms:

- nightly backup job fails
- no recent encrypted files in `backend/storage/backups`
- `npm run ops:backup:drill` fails

Actions:

1. Check `BACKUP_ENCRYPTION_KEY`
2. Check S3 credentials and bucket access
3. Run:

```powershell
npm run ops:backup:drill
```

4. If the drill fails, escalate immediately
5. Do not declare the system safe until one successful drill has completed

### Company Restore Request

Actions:

1. Confirm the requesting user is an authorized admin
2. Confirm the target company and backup file
3. Prefer staging verification if the backup is old or the request is high-risk
4. Use the in-app `Restore Backup` action
5. Confirm that HexaPay created the rollback backup
6. Re-verify login, employees, payroll history, and latest payroll view

### Payroll Data Discrepancy

Actions:

1. Confirm payroll period and salary type
2. Confirm whether the run is draft, approved, or posted
3. Check whether advances, bonuses, allowances, or loans were involved
4. Confirm whether the issue is in:
   taxable pay
   statutory deductions
   payment frequency
   paid-state history
5. Escalate to application owner if calculations are inconsistent with the saved payroll item

## Escalation

- `Infrastructure owner`
  backend service, Mongo, storage, alerting
- `Application owner`
  payroll logic, restore logic, UI regressions, validation behavior
- `Support owner`
  user coordination, incident communication, issue tracking

Escalate immediately for:

- failed restore
- missing recent backups
- payroll blocked near payday
- company-wide login failure

## Post-Incident Checklist

1. Record the root cause
2. Record the impacted companies and period
3. Record what was restored/restarted/changed
4. Confirm whether follow-up code or ops work is required
5. Update [C:/Users/User/Documents/Hexapay/docs/launch-readiness.md](C:/Users/User/Documents/Hexapay/docs/launch-readiness.md) if the incident exposed a release gap
