const fs = require("fs/promises")
const path = require("path")
const crypto = require("crypto")
const zlib = require("zlib")

const dotenv = require("dotenv")

dotenv.config({
  path: path.resolve(__dirname, "../.env")
})

function decodeEnvelope(buffer){
  return JSON.parse(buffer.toString("utf8"))
}

function decryptEnvelope(envelope, secret){
  const salt = Buffer.from(envelope.salt, "base64")
  const iv = Buffer.from(envelope.iv, "base64")
  const tag = Buffer.from(envelope.tag, "base64")
  const ciphertext = Buffer.from(envelope.data, "base64")
  const key = crypto.scryptSync(secret, salt, 32)
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)

  decipher.setAuthTag(tag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ])
}

async function inspectCloudBackup(filePath, secret = process.env.BACKUP_ENCRYPTION_KEY){
  if(!filePath){
    throw new Error("Usage: node scripts/inspect-cloud-backup.js <backup-file-path>")
  }

  if(!secret){
    throw new Error("Missing BACKUP_ENCRYPTION_KEY.")
  }

  const envelopeBuffer = await fs.readFile(path.resolve(filePath))
  const envelope = decodeEnvelope(envelopeBuffer)
  const compressed = decryptEnvelope(envelope, secret)
  const payload = JSON.parse(zlib.gunzipSync(compressed).toString("utf8"))

  const summary = {
    meta: payload.meta,
    collections: payload.collections.map((collection) => ({
      name: collection.name,
      document_count: collection.document_count
    }))
  }

  return summary
}

async function main(){
  const summary = await inspectCloudBackup(process.argv[2])
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
}

if(require.main === module){
  main().catch((error) => {
    process.stderr.write(`Backup inspection failed: ${error.message}\n`)
    process.exit(1)
  })
}

module.exports = {
  inspectCloudBackup
}
