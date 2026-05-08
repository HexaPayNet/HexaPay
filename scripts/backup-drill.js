const { runCloudBackup } = require("./cloud-backup")
const { inspectCloudBackup } = require("./inspect-cloud-backup")

function sumCollectionDocuments(collections){
  return collections.reduce((total, collection) => total + Number(collection.document_count || 0), 0)
}

async function main(){
  const backupSummary = await runCloudBackup({
    skipUpload: true
  })

  if(!backupSummary.local_file){
    throw new Error("Backup drill did not produce a local backup file.")
  }

  const inspectionSummary = await inspectCloudBackup(backupSummary.local_file)

  const drillSummary = {
    ok: true,
    checked_at: new Date().toISOString(),
    generated_backup: {
      path: backupSummary.local_file,
      size_bytes: backupSummary.size_bytes
    },
    payload: {
      meta: inspectionSummary.meta,
      collection_count: Array.isArray(inspectionSummary.collections) ? inspectionSummary.collections.length : 0,
      document_count: sumCollectionDocuments(inspectionSummary.collections || [])
    }
  }

  process.stdout.write(`${JSON.stringify(drillSummary, null, 2)}\n`)
}

main().catch((error) => {
  process.stderr.write(JSON.stringify({
    ok: false,
    checked_at: new Date().toISOString(),
    error: error.message
  }, null, 2) + "\n")
  process.exit(1)
})
