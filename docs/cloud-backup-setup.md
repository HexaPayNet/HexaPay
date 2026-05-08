# Cloud Backup Setup

HexaPay can now create an encrypted MongoDB backup file and upload it to any S3-compatible object store. This is the recommended pilot setup for keeping payroll data off the desktop machines while still having an off-site copy.

## What it does

- Reads the Mongo database directly from `MONGO_URI`
- Dumps every non-system collection into one JSON payload
- Compresses it with gzip
- Encrypts it with AES-256-GCM
- Uploads it to an S3-compatible bucket
- Optionally prunes older backups based on retention days

## Required `.env` values

Add these to `C:\Users\User\Documents\Hexapay\.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hexapay
BACKUP_ENCRYPTION_KEY=replace-this-with-a-long-random-secret-passphrase
BACKUP_S3_BUCKET=your-backup-bucket
BACKUP_S3_REGION=your-region
BACKUP_S3_ACCESS_KEY_ID=your-access-key
BACKUP_S3_SECRET_ACCESS_KEY=your-secret-key
```

## Optional `.env` values

Use these when needed:

```env
BACKUP_NAME=hexapay-pilot
BACKUP_LOCAL_DIR=backend/storage/backups
BACKUP_RETENTION_DAYS=30
BACKUP_S3_PREFIX=hexapay-backups
BACKUP_S3_ENDPOINT=
BACKUP_S3_FORCE_PATH_STYLE=false
BACKUP_EXCLUDE_COLLECTIONS=
```

Notes:

- `BACKUP_S3_ENDPOINT` is optional for AWS S3, but useful for Backblaze B2 S3 or Cloudflare R2.
- `BACKUP_S3_FORCE_PATH_STYLE=true` is sometimes required by S3-compatible providers.
- `BACKUP_ENCRYPTION_KEY` should be long and unique. Do not reuse the JWT secret.

## Commands

Create and upload a backup:

```powershell
npm run backup:cloud
```

Create a backup locally without uploading:

```powershell
npm run backup:cloud -- --skip-upload
```

Create and upload a backup without deleting old remote backups:

```powershell
npm run backup:cloud -- --skip-prune
```

Inspect an encrypted backup file:

```powershell
npm run backup:inspect -- "C:\path\to\backup-file.json.gz.enc"
```

Run the Windows helper script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-cloud-backup.ps1
```

Run a full backup drill:

```powershell
npm run ops:backup:drill
```

## Windows Task Scheduler

Recommended pilot schedule: once every night on the backend machine.

Program/script:

```text
powershell.exe
```

Arguments:

```text
-ExecutionPolicy Bypass -File "C:\Users\User\Documents\Hexapay\scripts\run-cloud-backup.ps1"
```

Start in:

```text
C:\Users\User\Documents\Hexapay
```

## Where files land

- Local encrypted backup copies: `C:\Users\User\Documents\Hexapay\backend\storage\backups`
- Task logs: `C:\Users\User\Documents\Hexapay\backend\storage\backup-logs`

## Restore verification

The inspection command does not restore the database, but it proves:

- the file can be decrypted
- the gzip payload is valid
- the collection names and counts are readable

For pilot safety, run one backup and one inspection before relying on the schedule.

For production safety, also run a weekly backup drill and a monthly restore rehearsal.
