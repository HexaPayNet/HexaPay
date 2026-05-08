const fs = require("fs/promises")
const path = require("path")
const http = require("http")
const https = require("https")

const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config({
  path: path.resolve(__dirname, "../.env")
})

const DEFAULT_BACKUP_DIR = path.resolve(__dirname, "../backend/storage/backups")
const DEFAULT_PORT = Number(process.env.PORT || 4000)
const DEFAULT_HEALTH_URL = process.env.OPS_HEALTH_URL || `http://127.0.0.1:${DEFAULT_PORT}/health`
const DEFAULT_BACKUP_MAX_AGE_HOURS = Number(process.env.BACKUP_MAX_AGE_HOURS || 30)

function toIso(value){
  if(!value){
    return null
  }

  const date = value instanceof Date
    ? value
    : new Date(value)

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString()
}

function readBooleanEnv(name, fallback = false){
  const value = process.env[name]
  if(typeof value === "undefined"){
    return fallback
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase())
}

function readNumberEnv(name, fallback){
  const value = process.env[name]
  if(value === undefined || value === ""){
    return fallback
  }

  const parsed = Number(value)
  if(!Number.isFinite(parsed)){
    throw new Error(`${name} must be a valid number.`)
  }

  return parsed
}

function requestJson(urlString, timeoutMs = 5000){
  return new Promise((resolve, reject) => {
    const url = new URL(urlString)
    const client = url.protocol === "https:" ? https : http
    const request = client.request(url, {
      method: "GET",
      timeout: timeoutMs
    }, (response) => {
      let body = ""

      response.setEncoding("utf8")
      response.on("data", (chunk) => {
        body += chunk
      })
      response.on("end", () => {
        if(response.statusCode < 200 || response.statusCode >= 300){
          reject(new Error(`Health endpoint returned status ${response.statusCode}.`))
          return
        }

        try{
          resolve(JSON.parse(body))
        } catch (_error){
          reject(new Error("Health endpoint did not return valid JSON."))
        }
      })
    })

    request.on("timeout", () => {
      request.destroy(new Error("Health endpoint timed out."))
    })
    request.on("error", reject)
    request.end()
  })
}

async function checkMongo(){
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hexapay"
  const startedAt = Date.now()

  await mongoose.connect(mongoUri, {
    autoIndex: false
  })

  try{
    const pingResult = await mongoose.connection.db.admin().ping()
    return {
      ok: pingResult?.ok === 1,
      latency_ms: Date.now() - startedAt,
      database: mongoose.connection.db.databaseName
    }
  } finally {
    await mongoose.disconnect()
  }
}

async function checkBackendHealth(){
  const payload = await requestJson(DEFAULT_HEALTH_URL, readNumberEnv("OPS_HEALTH_TIMEOUT_MS", 5000))

  return {
    ok: payload?.status === "ok",
    url: DEFAULT_HEALTH_URL,
    payload
  }
}

async function checkLocalBackups(){
  const backupDir = path.resolve(process.env.BACKUP_LOCAL_DIR || DEFAULT_BACKUP_DIR)
  const required = readBooleanEnv("OPS_REQUIRE_LOCAL_BACKUP", process.env.NODE_ENV === "production")
  const maxAgeHours = readNumberEnv("BACKUP_MAX_AGE_HOURS", DEFAULT_BACKUP_MAX_AGE_HOURS)
  let files = []

  try{
    files = await fs.readdir(backupDir, { withFileTypes: true })
  } catch (error){
    if(required){
      throw new Error(`Backup directory is unavailable: ${backupDir}`)
    }

    return {
      ok: true,
      required,
      directory: backupDir,
      count: 0,
      newest_backup_at: null,
      age_hours: null,
      warning: "Backup directory not found, but local backup checks are not required in this environment."
    }
  }

  const backupFiles = []
  for(const file of files){
    if(!file.isFile() || !file.name.endsWith(".enc")){
      continue
    }

    const absolutePath = path.join(backupDir, file.name)
    const stats = await fs.stat(absolutePath)
    backupFiles.push({
      name: file.name,
      path: absolutePath,
      modifiedAt: stats.mtime
    })
  }

  backupFiles.sort((left, right) => right.modifiedAt.getTime() - left.modifiedAt.getTime())
  const newest = backupFiles[0] || null

  if(!newest){
    if(required){
      throw new Error(`No local encrypted backup files were found in ${backupDir}.`)
    }

    return {
      ok: true,
      required,
      directory: backupDir,
      count: 0,
      newest_backup_at: null,
      age_hours: null
    }
  }

  const ageHours = (Date.now() - newest.modifiedAt.getTime()) / (1000 * 60 * 60)
  if(required && ageHours > maxAgeHours){
    throw new Error(`Newest local backup is ${ageHours.toFixed(2)} hours old, exceeding the ${maxAgeHours}-hour threshold.`)
  }

  return {
    ok: true,
    required,
    directory: backupDir,
    count: backupFiles.length,
    newest_backup_at: newest.modifiedAt.toISOString(),
    newest_backup_file: newest.name,
    age_hours: Number(ageHours.toFixed(2)),
    max_age_hours: maxAgeHours
  }
}

async function main(){
  const checks = {
    backend: null,
    mongo: null,
    backups: null
  }

  try{
    checks.backend = await checkBackendHealth()
    checks.mongo = await checkMongo()
    checks.backups = await checkLocalBackups()
  } catch (error){
    const summary = {
      ok: false,
      checked_at: new Date().toISOString(),
      error: error.message,
      checks
    }

    process.stderr.write(`${JSON.stringify(summary, null, 2)}\n`)
    process.exit(1)
  }

  const summary = {
    ok: Boolean(checks.backend?.ok && checks.mongo?.ok && checks.backups?.ok),
    checked_at: new Date().toISOString(),
    checks
  }

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
}

main().catch((error) => {
  process.stderr.write(JSON.stringify({
    ok: false,
    checked_at: toIso(new Date()),
    error: error.message
  }, null, 2) + "\n")
  process.exit(1)
})
