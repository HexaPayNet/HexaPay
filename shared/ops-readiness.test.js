const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
)
const launchReadinessSource = fs.readFileSync(path.join(__dirname, "..", "docs", "launch-readiness.md"), "utf8")
const productionOpsSource = fs.readFileSync(path.join(__dirname, "..", "docs", "production-operations.md"), "utf8")
const supportRunbookSource = fs.readFileSync(path.join(__dirname, "..", "docs", "support-runbook.md"), "utf8")
const alertingMatrixSource = fs.readFileSync(path.join(__dirname, "..", "docs", "alerting-matrix.md"), "utf8")
const cutoverChecklistSource = fs.readFileSync(path.join(__dirname, "..", "docs", "production-cutover-checklist.md"), "utf8")

test("package scripts expose production operations commands", () => {
  assert.equal(packageJson.scripts["ops:health"], "node scripts/ops-health-check.js")
  assert.equal(packageJson.scripts["ops:backup:drill"], "node scripts/backup-drill.js")
  assert.equal(packageJson.scripts["ops:readiness"], "node scripts/ops-readiness.js")
})

test("production operations docs cover monitoring and backup drills", () => {
  assert.match(productionOpsSource, /npm run ops:health/)
  assert.match(productionOpsSource, /npm run ops:backup:drill/)
  assert.match(productionOpsSource, /MongoDB Baseline/)
  assert.match(supportRunbookSource, /SEV-1/)
  assert.match(supportRunbookSource, /Company Restore Request/)
  assert.match(alertingMatrixSource, /Backend `\/health` fails/)
  assert.match(cutoverChecklistSource, /install-ops-scheduled-tasks\.ps1/)
})

test("launch readiness reflects the new operations baseline", () => {
  assert.match(launchReadinessSource, /\*\*DONE\*\* Backup restore workflow/)
  assert.match(launchReadinessSource, /\*\*DONE\*\* Production operations baseline/)
})
