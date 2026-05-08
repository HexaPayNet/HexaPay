const fs = require("fs")
const path = require("path")

const dotenv = require("dotenv")

dotenv.config({
  path: path.resolve(__dirname, "../.env")
})

const rootDir = path.resolve(__dirname, "..")

function hasValue(value){
  return typeof value === "string"
    ? value.trim().length > 0
    : Boolean(value)
}

function isPlaceholderSecret(value){
  const normalized = String(value || "").trim().toLowerCase()
  return !normalized ||
    normalized.includes("change-me") ||
    normalized.includes("replace-this") ||
    normalized.includes("your-") ||
    normalized === "secret"
}

function buildCheck(name, passed, detail){
  return { name, passed, detail }
}

function getCorsOrigins(){
  return String(process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function main(){
  const checks = []
  const nodeEnv = String(process.env.NODE_ENV || "development").trim().toLowerCase()
  const mongoUri = String(process.env.MONGO_URI || "").trim()
  const jwtSecret = String(process.env.JWT_SECRET || "").trim()
  const backupEncryptionKey = String(process.env.BACKUP_ENCRYPTION_KEY || "").trim()
  const corsOrigins = getCorsOrigins()

  checks.push(buildCheck(
    "node_env",
    nodeEnv === "production",
    `NODE_ENV=${nodeEnv || "(unset)"}`
  ))

  checks.push(buildCheck(
    "mongo_uri",
    hasValue(mongoUri),
    mongoUri ? "MONGO_URI is configured." : "MONGO_URI is missing."
  ))

  checks.push(buildCheck(
    "jwt_secret",
    !isPlaceholderSecret(jwtSecret) && jwtSecret.length >= 24,
    jwtSecret ? "JWT secret is set." : "JWT secret is missing."
  ))

  checks.push(buildCheck(
    "backup_encryption_key",
    !isPlaceholderSecret(backupEncryptionKey) && backupEncryptionKey.length >= 24,
    backupEncryptionKey ? "Backup encryption key is set." : "Backup encryption key is missing."
  ))

  checks.push(buildCheck(
    "cors_origins",
    corsOrigins.length > 0 && !corsOrigins.includes("*"),
    corsOrigins.length ? `Configured origins: ${corsOrigins.join(", ")}` : "CORS_ORIGINS is not configured."
  ))

  const requiredBackupEnvNames = [
    "BACKUP_S3_BUCKET",
    "BACKUP_S3_REGION",
    "BACKUP_S3_ACCESS_KEY_ID",
    "BACKUP_S3_SECRET_ACCESS_KEY"
  ]
  const missingBackupEnvNames = requiredBackupEnvNames.filter((name) => !hasValue(process.env[name]))
  checks.push(buildCheck(
    "backup_remote_target",
    missingBackupEnvNames.length === 0,
    missingBackupEnvNames.length
      ? `Missing: ${missingBackupEnvNames.join(", ")}`
      : "Remote backup target variables are configured."
  ))

  const desktopEnvPath = path.join(rootDir, "hexapay.desktop.env")
  checks.push(buildCheck(
    "desktop_env_file",
    fs.existsSync(desktopEnvPath),
    fs.existsSync(desktopEnvPath)
      ? "Desktop runtime env file exists."
      : "hexapay.desktop.env is missing."
  ))

  const docsRequired = [
    path.join(rootDir, "docs", "production-operations.md"),
    path.join(rootDir, "docs", "support-runbook.md"),
    path.join(rootDir, "docs", "cloud-backup-setup.md"),
    path.join(rootDir, "docs", "alerting-matrix.md"),
    path.join(rootDir, "docs", "production-cutover-checklist.md"),
    path.join(rootDir, "docs", "desktop-release-signing.md")
  ]
  const missingDocs = docsRequired.filter((targetPath) => !fs.existsSync(targetPath))
  checks.push(buildCheck(
    "ops_runbooks",
    missingDocs.length === 0,
    missingDocs.length
      ? `Missing: ${missingDocs.map((targetPath) => path.basename(targetPath)).join(", ")}`
      : "Production operations runbooks are present."
  ))

  const summary = {
    ok: checks.every((check) => check.passed),
    checked_at: new Date().toISOString(),
    checks
  }

  const serialized = JSON.stringify(summary, null, 2) + "\n"
  if(summary.ok){
    process.stdout.write(serialized)
    return
  }

  process.stderr.write(serialized)
  process.exit(1)
}

main()
