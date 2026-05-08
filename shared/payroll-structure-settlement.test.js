const test = require("node:test")
const assert = require("node:assert/strict")

const payrollController = require("../backend/controllers/payroll.controller.js")

const {
  getStructureChangeSettlementMode,
  isStructureChangeSettled,
  calculateStructureAdjustmentsForEmployee,
  buildUpdatedLoanProfileAfterPayment
} = payrollController.__test

test("one-time structure changes stay one-time while loans use installment settlement mode", () => {
  assert.equal(getStructureChangeSettlementMode({ type: "Advance" }), "one_time")
  assert.equal(getStructureChangeSettlementMode({ type: "Bonus" }), "one_time")
  assert.equal(getStructureChangeSettlementMode({ type: "Allowance" }), "one_time")
  assert.equal(getStructureChangeSettlementMode({ type: "Loan", loan_details: { enabled: true } }), "loan")
})

test("structure adjustments skip settled, reserved, and loan changes", () => {
  const run = { salaryType: "monthly" }
  const employee = {
    _id: "emp-1",
    fullName: "Fortune Omondi",
    departmentId: "dept-1",
    roleTitle: "Supervisor"
  }
  const state = {
    status: "approved",
    changes: [
      {
        id: "bonus-1",
        kind: "allowance",
        type: "Bonus",
        amount: 5000,
        taxable: true,
        income_category: "bonus",
        salary_type: "monthly",
        scope: "Individual",
        target_employee_id: "emp-1"
      },
      {
        id: "advance-1",
        kind: "deduction",
        type: "Advance",
        amount: 2000,
        salary_type: "monthly",
        scope: "Individual",
        target_employee_id: "emp-1",
        settled_at: "2026-04-30T10:00:00.000Z"
      },
      {
        id: "loan-1",
        kind: "deduction",
        type: "Loan",
        amount: 2500,
        salary_type: "monthly",
        scope: "Individual",
        target_employee_id: "emp-1",
        loan_details: {
          enabled: true,
          installment_amount: 2500
        }
      }
    ]
  }

  const activeAdjustments = calculateStructureAdjustmentsForEmployee(run, employee, state, new Set())
  assert.equal(activeAdjustments.allowancesTotal, 5000)
  assert.equal(activeAdjustments.deductionsTotal, 0)
  assert.equal(activeAdjustments.allowanceBreakdown.length, 1)
  assert.equal(activeAdjustments.allowanceBreakdown[0].changeId, "bonus-1")

  const reservedAdjustments = calculateStructureAdjustmentsForEmployee(run, employee, state, new Set(["bonus-1::emp-1"]))
  assert.equal(reservedAdjustments.allowancesTotal, 0)
  assert.equal(reservedAdjustments.deductionsTotal, 0)
})

test("one-time structure changes only apply to the matching salary frequency and reserve the next unpaid run", () => {
  const employee = {
    _id: "emp-1",
    fullName: "Fortune Omondi",
    departmentId: "dept-1",
    roleTitle: "Supervisor"
  }
  const state = {
    status: "approved",
    changes: [
      {
        id: "daily-bonus",
        kind: "allowance",
        type: "Bonus",
        amount: 400,
        salary_type: "daily",
        scope: "Individual",
        target_employee_id: "emp-1"
      },
      {
        id: "weekly-bonus",
        kind: "allowance",
        type: "Bonus",
        amount: 1400,
        salary_type: "weekly",
        scope: "Individual",
        target_employee_id: "emp-1"
      },
      {
        id: "monthly-advance",
        kind: "deduction",
        type: "Advance",
        amount: 2500,
        salary_type: "monthly",
        scope: "Individual",
        target_employee_id: "emp-1"
      }
    ]
  }

  const dailyAdjustments = calculateStructureAdjustmentsForEmployee({ salaryType: "daily" }, employee, state, new Set())
  assert.equal(dailyAdjustments.allowancesTotal, 400)
  assert.equal(dailyAdjustments.deductionsTotal, 0)
  assert.equal(dailyAdjustments.allowanceBreakdown[0].changeId, "daily-bonus")

  const reservedDailyAdjustments = calculateStructureAdjustmentsForEmployee({ salaryType: "daily" }, employee, state, new Set(["daily-bonus::emp-1"]))
  assert.equal(reservedDailyAdjustments.allowancesTotal, 0)

  const weeklyAdjustments = calculateStructureAdjustmentsForEmployee({ salaryType: "weekly" }, employee, state, new Set())
  assert.equal(weeklyAdjustments.allowancesTotal, 1400)
  assert.equal(weeklyAdjustments.deductionsTotal, 0)
  assert.equal(weeklyAdjustments.allowanceBreakdown[0].changeId, "weekly-bonus")

  const monthlyAdjustments = calculateStructureAdjustmentsForEmployee({ salaryType: "monthly" }, employee, state, new Set())
  assert.equal(monthlyAdjustments.allowancesTotal, 0)
  assert.equal(monthlyAdjustments.deductionsTotal, 2500)
  assert.equal(monthlyAdjustments.deductionBreakdown[0].changeId, "monthly-advance")
})

test("loan payments advance installments and settle when the last deduction is paid", () => {
  const pendingResult = buildUpdatedLoanProfileAfterPayment({
    enabled: true,
    sourceChangeId: "loan-change-1",
    balanceAmount: 10000,
    installmentAmount: 2500,
    totalInstallments: 4,
    installmentsPaid: 1,
    installmentsRemaining: 3,
    nextDeductionDate: "2026-04-30"
  }, {
    deductionBreakdown: [{
      sourceType: "employee_loan",
      amount: 2500,
      changeId: "loan-change-1"
    }]
  }, {
    period: "2026-04",
    salaryType: "monthly"
  })

  assert.equal(pendingResult.settled, false)
  assert.equal(pendingResult.loanProfile.installmentsPaid, 2)
  assert.equal(pendingResult.loanProfile.installmentsRemaining, 2)
  assert.equal(pendingResult.loanProfile.balanceAmount, 7500)
  assert.ok(pendingResult.loanProfile.nextDeductionDate instanceof Date)
  assert.equal(isStructureChangeSettled({ settled_at: "2026-04-30T10:00:00.000Z" }), true)

  const settledResult = buildUpdatedLoanProfileAfterPayment({
    enabled: true,
    sourceChangeId: "loan-change-1",
    balanceAmount: 2500,
    installmentAmount: 2500,
    totalInstallments: 1,
    installmentsPaid: 0,
    installmentsRemaining: 1,
    nextDeductionDate: "2026-04-30"
  }, {
    deductionBreakdown: [{
      sourceType: "employee_loan",
      amount: 2500,
      changeId: "loan-change-1"
    }]
  }, {
    period: "2026-04",
    salaryType: "monthly"
  })

  assert.equal(settledResult.settled, true)
  assert.equal(settledResult.loanProfile.enabled, false)
  assert.equal(settledResult.loanProfile.installmentsRemaining, 0)
  assert.equal(settledResult.loanProfile.balanceAmount, 0)
  assert.equal(settledResult.loanProfile.nextDeductionDate, null)
})
