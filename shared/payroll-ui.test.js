const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const html = fs.readFileSync(path.join(__dirname, "..", "Index.html"), "utf8")
const renderer = fs.readFileSync(path.join(__dirname, "..", "js", "rendered.js"), "utf8")

test("payroll history tab is rendered next to payroll run", () => {
  const payrollRunIndex = html.indexOf('data-payroll-tab-target="payrollRun"')
  const payrollHistoryIndex = html.indexOf('data-payroll-tab-target="payrollHistory"')

  assert.notEqual(payrollRunIndex, -1)
  assert.notEqual(payrollHistoryIndex, -1)
  assert.ok(payrollHistoryIndex > payrollRunIndex)
  assert.match(html, /id="payrollHistoryArea"/)
})

test("payroll history exposes daily, weekly, monthly filters and past-payroll selector", () => {
  assert.match(html, /id="payrollSalaryType"[\s\S]*?<option>Daily<\/option>/)
  assert.match(html, /data-payroll-history-view="daily"/)
  assert.match(html, /data-payroll-history-view="weekly"/)
  assert.match(html, /data-payroll-history-view="monthly"/)
  assert.match(html, /id="payrollHistorySelect"/)
})

test("payroll renderer exposes confirm paid action hooks", () => {
  assert.match(renderer, /Confirm Paid/)
  assert.match(renderer, /data-payroll-pay-action="confirm"/)
  assert.match(renderer, /data-payroll-history-run-id=/)
  assert.match(renderer, /doesPayrollRunMatchHistoryView/)
})

test("fully paid payrolls advance the payroll view to the next due period", () => {
  assert.match(renderer, /function advanceToNextPayrollDue\(completedRun\)/)
  assert.match(renderer, /const payrollCompleted = Number\(result\?\.run\?\.itemCount \|\| 0\) > 0 && Number\(result\?\.run\?\.unpaidItemCount \|\| 0\) === 0/)
  assert.match(renderer, /const nextPayrollSelection = payrollCompleted \? advanceToNextPayrollDue\(result\.run\) : null/)
  assert.match(renderer, /if\(nextPayrollSelection\)/)
  assert.match(renderer, /await renderPayrollSection\(\)/)
  assert.match(renderer, /showNotificationPopup\("Payroll Complete", `\$\{completedLabel\} payroll is fully paid\. Now showing \$\{nextPayrollSelection\.label\}\.`\)/)
})

test("payroll completion uses the in-app notification popup", () => {
  assert.match(html, /id="notificationToastHost"/)
  assert.match(renderer, /function showNotificationPopup\(title, message\)/)
  assert.match(renderer, /notificationToastHost\.appendChild\(toast\)/)
})

test("switching payroll filters reopens saved runs instead of forcing regeneration", () => {
  assert.match(renderer, /function preparePayrollSelectionChange\(\)/)
  assert.match(renderer, /appSettings\.payroll\.forceRegenerate = false/)
  assert.doesNotMatch(renderer, /payrollDueSelect\.addEventListener\("change", \(\) => \{[\s\S]*appSettings\.payroll\.forceRegenerate = true[\s\S]*\}\)/)
})

test("employee salary history table is driven by actual payroll items", () => {
  assert.match(renderer, /function getEmployeeActualSalaryHistory\(employee\)/)
  assert.match(renderer, /getPayrollItems\(\)/)
  assert.match(renderer, /formatPayrollPeriodLabel\(period, salaryType\)/)
  assert.match(renderer, /\.filter\(\(item\) => \{\s*const payrollRun = getPayrollRunById\(item\.runId\)\s*return Boolean\(item\.paid \|\| item\.signed \|\| item\.paidAt \|\| String\(payrollRun\?\.status \|\| ""\)\.trim\(\)\.toLowerCase\(\) === "posted"\)\s*\}\)/)
  assert.match(renderer, /if\(hasRealBackendSession\(\)\)\{\s*return \[\]\s*\}/)
  assert.match(renderer, /function ensureEmployeePayrollHistoryLoaded\(employee\)/)
  assert.match(renderer, /await window\.HexaPayApi\.getPayrollRun\(run\.id\)/)
  assert.match(renderer, /Loading salary history\.\.\./)
  assert.match(renderer, /No salary history recorded yet\./)
})
