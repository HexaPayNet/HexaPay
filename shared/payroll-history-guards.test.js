const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const apiSource = fs.readFileSync(path.join(__dirname, "..", "js", "api.js"), "utf8")
const payrollControllerSource = fs.readFileSync(path.join(__dirname, "..", "backend", "controllers", "payroll.controller.js"), "utf8")

test("live payroll reopening preserves paid historical runs instead of regenerating them", () => {
  assert.match(apiSource, /const currentRunStatus = String\(currentPayload\?\.run\?\.status \|\| matchingRun\.status \|\| ""\)\.trim\(\)\.toLowerCase\(\)/)
  assert.match(apiSource, /const hasPaidItems = Number\(currentPayload\?\.run\?\.paidItemCount \|\| 0\) > 0/)
  assert.match(apiSource, /if\(currentRunStatus === "posted" \|\| hasPaidItems\)\{\s*state\.payroll\.workspace\.forceRegenerate = false\s*return structuredClone\(currentPayload\)\s*\}/)
})

test("backend blocks regeneration of runs that already have paid items", () => {
  assert.match(payrollControllerSource, /const paidItemCount = await PayrollItem\.countDocuments\(\{\s*payrollRunId: payrollRun\._id,\s*signed: true\s*\}\)/)
  assert.match(payrollControllerSource, /code: "PAYROLL_RUN_HAS_PAID_ITEMS"/)
  assert.match(payrollControllerSource, /message: "Payroll runs with paid items cannot be regenerated\."/)
})
