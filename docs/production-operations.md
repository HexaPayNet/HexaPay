# HexaPay Production Operations

Last Updated: April 30, 2026

## Goal

This runbook is the operational baseline for a production HexaPay deployment. It covers MongoDB deployment, backend runtime expectations, monitoring, alerting, and backup operations.

## Target Production Topology

- `MongoDB`
  Use a managed MongoDB deployment or a three-node replica set. Do not run production on a standalone local Mongo instance.
- `HexaPay backend`
  Run the backend as a long-lived service on a dedicated application host or VM.
- `HexaPay desktop clients`
  Desktop users connect to the backend API; the packaged app should not be treated as the source of truth.
- `Object storage`
  Store encrypted Mongo backups in S3 or an S3-compatible provider.

## MongoDB Baseline

- Use a replica set or managed cluster.
- Enable authentication and create an app-specific database user.
- Restrict network access to the app host and approved admin IPs.
- Keep `autoIndex` off in production.
- Monitor:
  replication lag
  storage utilization
  connection count
  operation latency
  oplog size

Recommended minimums:

- Daily snapshots at the database layer
- Point-in-time recovery if the provider supports it
- Disk alert at `80%`
- CPU or sustained memory alert at `85%`
- Replica lag alert above `60s`

## Environment and Secrets

Use [C:/Users/User/Documents/Hexapay/.env.production.example](C:/Users/User/Documents/Hexapay/.env.production.example) as the production template.

Production rules:

- `NODE_ENV=production`
- `JWT_SECRET` must be unique and not reused anywhere else
- `BACKUP_ENCRYPTION_KEY` must be separate from `JWT_SECRET`
- `CORS_ORIGINS` must be explicit; never use `*`
- backup credentials must be scoped to the backup bucket only

## Monitoring and Alerting

### Service Health

Use:

```powershell
npm run ops:health
```

This checks:

- backend `/health`
- Mongo connectivity and ping
- local encrypted backup freshness

Use the exit code for alerting:

- `0` means healthy
- non-zero means alert

Recommended schedule:

- every 5 minutes on the backend host

Recommended alerts:

- backend health check failure
- Mongo ping failure
- no recent local backup within `BACKUP_MAX_AGE_HOURS`

### Configuration Readiness

Use:

```powershell
npm run ops:readiness
```

This validates:

- production env mode
- JWT secret presence
- backup encryption key presence
- explicit CORS origins
- remote backup target variables
- core operations runbooks

Run this before every production release.

## Backup Operations

Primary backup command:

```powershell
npm run backup:cloud
```

Health drill command:

```powershell
npm run ops:backup:drill
```

The drill:

- creates a local encrypted Mongo backup
- decrypts and inspects it
- confirms the payload is readable

Recommended schedule:

- nightly encrypted backup upload
- weekly backup drill
- monthly restore rehearsal in a non-production environment

## Restore Operations

Application-level restore:

- Use the `Restore Backup` action in HexaPay settings for company-scoped `.hexa` backups.
- HexaPay automatically creates a rollback snapshot before restore.

Database-level disaster recovery:

- restore the latest encrypted Mongo backup into a staging or recovery database
- verify collection counts and app login
- only then promote the recovered environment

## Release-Day Checklist

1. Run `npm test`
2. Run `npm run release:prep`
3. Run `npm run release:signing:check`
4. Run `npm run ops:readiness`
5. Run `npm run ops:health`
6. Confirm the latest successful cloud backup
7. Confirm the latest successful backup drill
8. Confirm alert routing is active

## Ownership

- `Application owner`
  Maintains release readiness, app config, and backup restore workflow
- `Infrastructure owner`
  Maintains Mongo uptime, object storage, monitoring, and alert routing
- `Support owner`
  Handles first response, incident triage, and escalation
