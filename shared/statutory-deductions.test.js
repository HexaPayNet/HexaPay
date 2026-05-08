const test = require("node:test")
const assert = require("node:assert/strict")

const {
  calculatePayrollPreview,
  calculateTaxablePay,
  calculateStatutoryDeductions,
  normalizeIncomeItems,
  validateGrossSalaryInput
} = require("./statutory-deductions")

test("taxable income items are included in taxable pay", () => {
  const items = normalizeIncomeItems([
    { label: "Basic Salary", amount: 50000, taxable: true, category: "basic_salary" },
    { label: "House Allowance", amount: 10000, taxable: true, category: "house_allowance" }
  ])

  assert.equal(calculateTaxablePay(items), 60000)
})

test("non-taxable income items are excluded from taxable pay", () => {
  const items = normalizeIncomeItems([
    { label: "Basic Salary", amount: 50000, taxable: true, category: "basic_salary" },
    { label: "Reimbursement", amount: 5000, taxable: false, category: "reimbursement" }
  ])

  assert.equal(calculateTaxablePay(items), 50000)
})

test("total deductions are summed correctly", () => {
  const deductions = calculateStatutoryDeductions({
    grossSalary: 100000,
    taxablePay: 100000,
    customDeductions: 2000
  })

  assert.equal(
    deductions.totalEmployeeDeductions,
    deductions.paye + deductions.shif + deductions.nssf + deductions.housingLevy + deductions.customDeductions
  )
})

test("PAYE is calculated after SHIF, NSSF, and Housing Levy are deducted", () => {
  const deductions = calculateStatutoryDeductions({
    grossSalary: 100000,
    taxablePay: 100000
  })

  assert.equal(deductions.shif, 2750)
  assert.equal(deductions.nssf, 6000)
  assert.equal(deductions.housingLevy, 1500)
  assert.equal(deductions.payeTaxableBase, 89750)
  assert.equal(deductions.paye, 19308.35)
})

test("PAYE base is derived from gross salary after SHIF, NSSF, and Housing Levy", () => {
  const deductions = calculateStatutoryDeductions({
    grossSalary: 100000,
    taxablePay: 50000
  })

  assert.equal(deductions.rawTaxablePay, 50000)
  assert.equal(deductions.payeTaxableBase, 89750)
  assert.equal(deductions.paye, 19308.35)
})

test("NSSF uses the 108,000 upper earnings limit for employee contributions", () => {
  const deductions = calculateStatutoryDeductions({
    grossSalary: 150000,
    taxablePay: 150000
  })

  assert.equal(deductions.nssf, 6480)
})

test("net pay is calculated correctly", () => {
  const result = calculatePayrollPreview({
    grossSalary: 100000,
    customDeductions: 1500
  })

  assert.equal(result.taxablePay, 89750)
  assert.equal(result.netPay, result.grossSalary - result.deductions.totalEmployeeDeductions)
})

test("statutory deductions remain separate from custom deductions", () => {
  const result = calculatePayrollPreview({
    grossSalary: 100000,
    customDeductions: 1500
  })

  assert.equal(result.deductions.customDeductions, 1500)
  assert.equal(
    result.deductions.totalEmployeeDeductions,
    result.deductions.paye + result.deductions.shif + result.deductions.nssf + result.deductions.housingLevy + 1500
  )
})

test("gross salary validation rejects empty and invalid values", () => {
  assert.match(validateGrossSalaryInput(""), /gross salary/i)
  assert.match(validateGrossSalaryInput("0"), /greater than zero/i)
  assert.equal(validateGrossSalaryInput("55000"), "")
})
