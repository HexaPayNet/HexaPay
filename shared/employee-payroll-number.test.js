const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const {
  buildCompanyPayrollPrefix,
  formatEmployeePayrollNumber,
  parseEmployeePayrollSequence
} = require("../backend/services/employee-number.service")

const html = fs.readFileSync(path.join(__dirname, "..", "Index.html"), "utf8")
const renderer = fs.readFileSync(path.join(__dirname, "..", "js", "rendered.js"), "utf8")
const api = fs.readFileSync(path.join(__dirname, "..", "js", "api.js"), "utf8")
const exportController = fs.readFileSync(path.join(__dirname, "..", "backend", "controllers", "export.controller.js"), "utf8")

test("company payroll prefix uses company initials", () => {
  assert.equal(buildCompanyPayrollPrefix("Trident Millers Ltd"), "TML")
  assert.equal(buildCompanyPayrollPrefix("  HexaPay Kenya Limited "), "HKL")
})

test("employee payroll numbers are zero-padded", () => {
  assert.equal(formatEmployeePayrollNumber("TML", 1), "TML00001")
  assert.equal(formatEmployeePayrollNumber("tml", 39), "TML00039")
})

test("employee payroll sequence parser reads the numeric suffix", () => {
  assert.equal(parseEmployeePayrollSequence("TML00038", "TML"), 38)
  assert.equal(parseEmployeePayrollSequence("ABC00102"), 102)
  assert.equal(parseEmployeePayrollSequence("TMLABC", "TML"), null)
})

test("employee profile exposes the payroll number after unpaid balance", () => {
  assert.match(html, /id="profileEmpUnpaidBalance"[\s\S]*id="profileEmpPayrollNumber"/)
  assert.match(renderer, /const profileEmpPayrollNumber = document\.getElementById\("profileEmpPayrollNumber"\)/)
  assert.match(renderer, /profileEmpPayrollNumber\.value = meta\.employeeNumber \|\| ""/)
})

test("frontend employee state preserves employee numbers and default sorting uses them", () => {
  assert.match(api, /employeeNumber: employee\.employee_number \|\| employee\.employeeNumber \|\| ""/)
  assert.match(renderer, /employeeNumber = ""/)
  assert.match(renderer, /employees\.sort\(sortEmployeesByPayrollNumber\)/)
})

test("payroll export includes payroll number before employee name", () => {
  assert.match(exportController, /"Payroll Number",\s*"Employee Name"/)
  assert.match(exportController, /employee\?\.employeeNumber \|\| "",\s*employee\?\.fullName \|\| ""/)
})

test("employee-based exports are sorted by payroll number", () => {
  assert.match(exportController, /Employee\.find\(employeeQuery\)\.lean\(\)\)\.sort\(compareEmployeesByPayrollNumber\)/)
  assert.match(exportController, /const sortedItems = \[\.\.\.items\]\.sort\(\(leftItem, rightItem\) =>/)
  assert.match(exportController, /comparePayrollItemsByEmployeeNumber\(leftItem, rightItem, employeeMap\)/)
})
