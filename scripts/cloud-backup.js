const fs = require("fs/promises")
const path = require("path")
const crypto = require("crypto")
const zlib = require("zlib")

const dotenv = require("dotenv")
const mongoose = require("mongoose")
const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand
} = require("@aws-sdk/client-s3")

dotenv.config({
  path: path.resolve(__dirname, "../.env")
})

const DEFAULT_LOCAL_DIR = path.resolve(__dirname, "../backend/storage/backups")

function getRequiredEnv(name){
  const value = process.env[name]
  if(!value){
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getBooleanEnv(name, fallback = false){
  const value = process.env[name]
  if(typeof value === "undefined"){
    return fallback
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase())
}

function getNumberEnv(name, fallback){
  const value = process.env[name]
  if(typeof value === "undefined" || value === ""){
    return fallback
  }

  const parsed = Number(value)
  if(Number.isNaN(parsed)){
    throw new Error(`Environment variable ${name} must be a valid number.`)
  }

  return parsed
}

function slugify(value){
  return String(value || "hexapay")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "hexapay"
}

function formatTimestamp(date){
  return date.toISOString()
    .replace(/:/g, "-")
    .replace(/\.\d{3}Z$/, "Z")
}

function createS3Client(){
  const region = process.env.BACKUP_S3_REGION || process.env.AWS_REGION || "auto"
  const accessKeyId = process.env.BACKUP_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.BACKUP_S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
  const endpoint = process.env.BACKUP_S3_ENDPOINT || undefined

  if(!accessKeyId || !secretAccessKey){
    throw new Error("Missing S3 credentials. Set BACKUP_S3_ACCESS_KEY_ID and BACKUP_S3_SECRET_ACCESS_KEY.")
  }

  return new S3Client({
    region,
    endpoint,
    forcePathStyle: getBooleanEnv("BACKUP_S3_FORCE_PATH_STYLE", false),
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })
}

function createEncryptedEnvelope(payloadBuffer, secret){
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(12)
  const key = crypto.scryptSync(secret, salt, 32)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const ciphertext = Buffer.concat([cipher.update(payloadBuffer), cipher.final()])
  const tag = cipher.getAuthTag()

  return Buffer.from(JSON.stringify({
    version: 1,
    algorithm: "aes-256-gcm",
    compression: "gzip",
    kdf: "scrypt",
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: ciphertext.toString("base64")
  }, null, 2))
}

async function collectCollections(db, excludedCollections){
  const collections = await db.listCollections({}, { nameOnly: true }).toArray()
  const names = collections
    .map((collection) => collection.name)
    .filter((name) => !name.startsWith("system."))
    .filter((name) => !excludedCollections.has(name))

  const results = []
  for(const name of names){
    const documents = await db.collection(name).find({}).toArray()
    results.push({
      name,
      document_count: documents.length,
      documents
    })
  }

  return results
}

function buildPayload({ databaseName, mongoUri, collections }){
  const redactedMongoUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@")

  return {
    meta: {
      created_at: new Date().toISOString(),
      app: "HexaPay",
      type: "mongodb-backup",
      version: 1,
      database_name: databaseName,
      source: redactedMongoUri
    },
    collections
  }
}

async function uploadBackup({
  client,
  bucket,
  key,
  body,
  metadata
}){
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentLength: body.length,
    ContentType: "application/octet-stream",
    Metadata: metadata
  }))
}

async function pruneExpiredBackups({
  client,
  bucket,
  prefix,
  retentionDays
}){
  if(retentionDays <= 0){
    return 0
  }

  const threshold = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)
  const keysToDelete = []
  let continuationToken

  do{
    const page = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken
    }))

    for(const item of page.Contents || []){
      if(item.LastModified && item.LastModified.getTime() < threshold){
        keysToDelete.push({ Key: item.Key })
      }
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : null
  } while(continuationToken)

  const deletedCount = keysToDelete.length
  while(keysToDelete.length){
    const batch = keysToDelete.splice(0, 1000)
    await client.send(new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: batch,
        Quiet: true
      }
    }))
  }

  return deletedCount
}

async function runCloudBackup(options = {}){
  const skipUpload = options.skipUpload === true
  const skipPrune = options.skipPrune === true
  const mongoUri = options.mongoUri || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hexapay"
  const encryptionKey = options.encryptionKey || getRequiredEnv("BACKUP_ENCRYPTION_KEY")
  const backupName = slugify(options.backupName || process.env.BACKUP_NAME || "hexapay")
  const localDir = path.resolve(options.localDir || process.env.BACKUP_LOCAL_DIR || DEFAULT_LOCAL_DIR)
  const retentionDays = options.retentionDays ?? getNumberEnv("BACKUP_RETENTION_DAYS", 30)
  const excludedCollections = new Set(
    String(options.excludedCollections || process.env.BACKUP_EXCLUDE_COLLECTIONS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  )

  await fs.mkdir(localDir, { recursive: true })

  await mongoose.connect(mongoUri)
  const db = mongoose.connection.db

  try{
    const collections = await collectCollections(db, excludedCollections)
    const payload = buildPayload({
      databaseName: db.databaseName,
      mongoUri,
      collections
    })
    const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(payload, null, 2)))
    const encrypted = createEncryptedEnvelope(compressed, encryptionKey)
    const createdAt = new Date()
    const year = String(createdAt.getUTCFullYear())
    const month = String(createdAt.getUTCMonth() + 1).padStart(2, "0")
    const fileName = `${backupName}-mongo-${formatTimestamp(createdAt)}.json.gz.enc`
    const localFilePath = path.join(localDir, fileName)

    await fs.writeFile(localFilePath, encrypted)

    const result = {
      local_file: localFilePath,
      size_bytes: encrypted.length,
      collections: collections.length,
      documents: collections.reduce((total, collection) => total + collection.document_count, 0)
    }

    if(!skipUpload){
      const bucket = getRequiredEnv("BACKUP_S3_BUCKET")
      const prefix = String(process.env.BACKUP_S3_PREFIX || "hexapay-backups").replace(/\/+$/, "")
      const objectKey = `${prefix}/${year}/${month}/${fileName}`
      const client = createS3Client()

      await uploadBackup({
        client,
        bucket,
        key: objectKey,
        body: encrypted,
        metadata: {
          app: "hexapay",
          encrypted: "true",
          compression: "gzip",
          database: db.databaseName
        }
      })

      result.bucket = bucket
      result.object_key = objectKey

      if(!skipPrune){
        result.pruned = await pruneExpiredBackups({
          client,
          bucket,
          prefix: `${prefix}/`,
          retentionDays
        })
      }
    }

    return result
  } finally{
    await mongoose.disconnect()
  }
}

async function main(){
  const result = await runCloudBackup({
    skipUpload: process.argv.includes("--skip-upload"),
    skipPrune: process.argv.includes("--skip-prune")
  })
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

if(require.main === module){
  main().catch((error) => {
    process.stderr.write(`Cloud backup failed: ${error.message}\n`)
    process.exit(1)
  })
}

module.exports = {
  runCloudBackup
}
