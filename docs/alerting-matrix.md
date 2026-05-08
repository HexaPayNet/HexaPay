# HexaPay Alerting Matrix

Last Updated: April 30, 2026

## Goal

This matrix defines what should alert in production, how severe it is, and who should be paged.

## Alert Sources

- `npm run ops:health`
- `npm run ops:backup:drill`
- MongoDB provider alerts
- operating system service/process monitoring

## Alert Matrix

| Condition | Severity | Trigger | Owner | Immediate Action |
| --- | --- | --- | --- | --- |
| Backend `/health` fails | SEV-1 | 2 consecutive failures | Infrastructure owner | Check backend process, logs, and Mongo connectivity |
| Mongo ping fails | SEV-1 | 1 failure | Infrastructure owner | Validate Mongo service or managed cluster state |
| No fresh local backup within threshold | SEV-1 | `BACKUP_MAX_AGE_HOURS` exceeded | Infrastructure owner | Run backup job and verify storage access |
| Backup drill fails | SEV-1 | 1 failure | Infrastructure owner + application owner | Stop release activity and verify backup chain |
| Replica lag above 60s | SEV-2 | Mongo provider alert | Infrastructure owner | Investigate cluster pressure and failover risk |
| Disk usage above 80% | SEV-2 | Mongo or host alert | Infrastructure owner | Expand storage or prune safely |
| Repeated payroll restore failures | SEV-2 | 2 failures in 24h | Application owner | Validate backup data and restore path |
| Single company payroll discrepancy | SEV-3 | support escalation | Application owner | Investigate payroll item/run data |

## Delivery Channels

Recommended production routing:

- `SEV-1`
  Pager/SMS plus email
- `SEV-2`
  Team chat plus email
- `SEV-3`
  Ticketing queue

## Scheduling Recommendations

- `ops:health`
  every 5 minutes
- cloud backup
  every night
- backup drill
  weekly
- restore rehearsal
  monthly in non-production

## Minimum Human Response Targets

- `SEV-1`
  acknowledge within 15 minutes
- `SEV-2`
  acknowledge within 1 hour
- `SEV-3`
  acknowledge within 1 business day
