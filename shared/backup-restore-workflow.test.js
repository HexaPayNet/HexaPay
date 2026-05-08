const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const exportValidators = require("../backend/validators/export.validators")
const { normalizeBackupPayload } = require("../backend/services/backup.service")

const apiSource = fs.readFileSync(path.join(__dirname, "..", "js", "api.js"), "utf8")
const routeSource = fs.readFileSync(path.join(__dirname, "..", "backend", "routes", "export.routes.js"), "utf8")

function validate(schema, req){
  return schema.validate({
    params: req?.params || {},
    body: req?.body || {},
    query: req?.query || {}
  })
}

test("backup restore validation requires exactly one restore source", () => {
  const missingSourceErrors = validate(exportValidators.restoreBackup, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {}
  })
  const duplicateSourceErrors = validate(exportValidators.restoreBackup, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      backup_job_id: "507f1f77bcf86cd799439012",
      backup_json: {}
    }
  })

  assert.ok(missingSourceErrors.some((error) => error.field === "body.backup_job_id"))
  assert.ok(duplicateSourceErrors.some((error) => error.field === "body.backup_job_id"))
  assert.ok(duplicateSourceErrors.some((error) => error.field === "body.backup_json"))
})

test("backup restore validation accepts either backup_job_id or backup_json", () => {
  const backupJobErrors = validate(exportValidators.restoreBackup, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      backup_job_id: "507f1f77bcf86cd799439012"
    }
  })
  const backupJsonErrors = validate(exportValidators.restoreBackup, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      backup_json: {
        meta: {
          format: "hexa-json",
          version: 2
        },
        company: {
          name: "Restore Co",
          email: "restore@example.com"
        }
      }
    }
  })

  assert.deepEqual(backupJobErrors, [])
  assert.deepEqual(backupJsonErrors, [])
})

test("legacy backup payloads normalize approval arrays into the current restore shape", () => {
  const normalized = normalizeBackupPayload({
    meta: {
      format: "hexa-json",
      version: 1
    },
    company: {
      name: "Restore Co",
      email: "restore@example.com"
    },
    users: [
      {
        id: "507f1f77bcf86cd799439021",
        email: "admin@example.com",
        display_name: "Admin User"
      }
    ],
    memberships: [
      {
        id: "507f1f77bcf86cd799439031",
        user_id: "507f1f77bcf86cd799439021",
        role: "ADMIN",
        status: "active"
      }
    ],
    attendance_logs: [
      {
        id: "507f1f77bcf86cd799439041",
        employee_id: "507f1f77bcf86cd799439051",
        approvals: [
          {
            approverUserId: "507f1f77bcf86cd799439021",
            approvedAt: "2026-04-30T08:00:00.000Z"
          }
        ]
      }
    ]
  })

  assert.equal(normalized.meta.version, 1)
  assert.equal(normalized.attendance_logs[0].approval.approver_user_id, "507f1f77bcf86cd799439021")
  assert.equal(normalized.attendance_logs[0].approval.approved_at, "2026-04-30T08:00:00.000Z")
})

test("desktop client and backend routes expose the backup restore workflow", () => {
  assert.match(routeSource, /router\.post\("\/:companyId\/backups\/restore"/)
  assert.match(apiSource, /async restoreBackup\(backupPayload\)/)
  assert.match(apiSource, /async restoreBackupByJobId\(backupJobId\)/)
})
