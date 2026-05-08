const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const html = fs.readFileSync(path.join(__dirname, "..", "Index.html"), "utf8")
const renderer = fs.readFileSync(path.join(__dirname, "..", "js", "rendered.js"), "utf8")
const api = fs.readFileSync(path.join(__dirname, "..", "js", "api.js"), "utf8")

test("employee add and edit forms expose weekly payment type and payment structure controls", () => {
  assert.match(html, /id="empType"[\s\S]*?<option>Weekly<\/option>/)
  assert.match(html, /id="profileEmpType"[\s\S]*?<option>Weekly<\/option>/)
  assert.match(html, /id="empPaymentBasis"/)
  assert.match(html, /id="profileEmpPaymentBasis"/)
  assert.match(html, /Attendance Dependent/)
})

test("payroll run exposes a daily salary type view", () => {
  assert.match(html, /id="payrollSalaryType"[\s\S]*?<option>Daily<\/option>/)
  assert.match(renderer, /function getPayrollDueOptions\(salaryType\)/)
  assert.match(renderer, /normalizedSalaryType === "Daily"/)
  assert.match(api, /return "Daily"/)
})

test("payroll structure removes edit type and keeps the advance and bonus tab", () => {
  assert.match(html, />Advance and Bonus<\/button>/)
  assert.doesNotMatch(html, /Edit type/)
  assert.doesNotMatch(html, /id="structureEditType"/)
  assert.doesNotMatch(html, /Salary change/)
  assert.doesNotMatch(html, /id="structureEmployeeSalary"/)
  assert.doesNotMatch(html, /id="updateStructureSalaryButton"/)
  assert.match(html, /id="structureDeductionType"[\s\S]*?<option>Advance<\/option>[\s\S]*?<option>Loan<\/option>/)
  assert.match(html, /id="structureAllowanceType"[\s\S]*?<option>Bonus<\/option>[\s\S]*?<option>Allowance<\/option>/)
  assert.match(renderer, /function getStructureTargetDetails\(\)/)
  assert.match(renderer, /function getStructureChangeStatusText\(change\)/)
  assert.match(renderer, /Pending next unpaid salary/)
  assert.doesNotMatch(renderer, /structureEditType/)
  assert.doesNotMatch(renderer, /updateStructureEmployeeSalary/)
  assert.doesNotMatch(renderer, /Failed to update employee loan settings from payroll structure/)
})

test("payment structure is carried through renderer and api helpers", () => {
  assert.match(renderer, /paymentBasis/)
  assert.match(renderer, /normalizeEmployeePaymentBasisValue/)
  assert.match(renderer, /syncEmployeePaymentBasisControl/)
  assert.match(api, /payment_basis/)
  assert.match(api, /normalizeEmployeePaymentBasis/)
})

test("edit employee action adopts the primary button style when an employee is selected", () => {
  assert.match(html, /id="addEmployeeBtn" class="btn-primary"/)
  assert.match(html, /id="editEmployee" class="btn-disabled" disabled/)
  assert.match(renderer, /editEmployeeBtn\.classList\.toggle\("btn-primary", hasSelectedEmployee\)/)
})
