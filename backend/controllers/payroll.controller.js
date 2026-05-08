const { Company } = require("../utils/auth")
const PayrollRun = require("../models/PayrollRun")
const PayrollItem = require("../models/PayrollItem")
const Employee = require("../models/Employee")
const Department = require("../models/Department")
const AttendanceLog = require("../models/AttendanceLog")
const CompanySetting = require("../models/CompanySetting")
const CompanyMembership = require("../models/CompanyMembership")
const User = require("../models/User")
const FinancialRule = require("../models/FinancialRule")
const { AUDIT_ACTIONS, AUDIT_TARGETS, recordAuditEvent } = require("../services/audit.service")
const {
  calculatePayrollPreview,
  getCompanyStatutoryConfiguration
} = require("../services/statutory-deductions.service")

const PAYROLL_WORKFLOW_CONFIG = {
  structure: {
    settingKey: "payroll_structure_workflow",
    maxCount: 3,
    preferredRoles: ["ADMIN", "MANAGER"]
  },
  calendar: {
    settingKey: "payroll_calendar_workflow",
    maxCount: 2,
    preferredRoles: ["ADMIN", "MANAGER"]
  }
}

const PAYROLL_CALENDAR_SETTING_KEY = "payroll_calendar"

function serializeDepartmentSummary(department){
  if(!department){
    return null
  }

  return {
    id: String(department._id),
    name: department.name,
    salary_type: department.salaryType,
    status: department.status
  }
}

function serializeEmployeeSummary(employee){
  if(!employee){
    return null
  }

  return {
    id: String(employee._id),
    full_name: employee.fullName,
    role_title: employee.roleTitle,
    status: employee.status,
    department_id: employee.departmentId ? String(employee.departmentId) : null
  }
}

function serializePayrollRun(run, options = {}){
  if(!run){
    return null
  }

  const response = {
    id: String(run._id),
    company_id: String(run.companyId),
    department_scope_id: run.departmentScopeId ? String(run.departmentScopeId?._id || run.departmentScopeId) : null,
    generated_by_user_id: String(run.generatedByUserId),
    period: run.period,
    salary_type: run.salaryType,
    currency_code: run.currencyCode,
    status: run.status,
    totals: {
      base_salary: run.totals?.baseSalary || 0,
      allowances: run.totals?.allowances || 0,
      deductions: run.totals?.deductions || 0,
      net_pay: run.totals?.netPay || 0
    },
    approval: {
      approver_user_id: run.approval?.approverUserId ? String(run.approval.approverUserId) : null,
      rejection_reason: run.approval?.rejectionReason || "",
      approved_at: run.approvedAt || null,
      rejected_at: run.rejectedAt || null
    },
    generated_at: run.generatedAt
  }

  if(Object.prototype.hasOwnProperty.call(options, "item_count")){
    response.item_count = options.item_count
  }

  if(Object.prototype.hasOwnProperty.call(options, "paid_item_count")){
    response.paid_item_count = options.paid_item_count
  }

  if(Object.prototype.hasOwnProperty.call(options, "unpaid_item_count")){
    response.unpaid_item_count = options.unpaid_item_count
  }

  if(Object.prototype.hasOwnProperty.call(options, "last_paid_at")){
    response.last_paid_at = options.last_paid_at
  }

  if(options.department){
    response.department = serializeDepartmentSummary(options.department)
  }

  return response
}

function serializePayrollItem(item, options = {}){
  if(!item){
    return null
  }

  const grossPay = item.grossPay || roundCurrency(Number(item.baseSalary || 0) + Number(item.allowancesTotal || 0))
  const taxablePay = item.taxablePay || item.baseSalary || 0
  const payeTaxableBase = item.payeTaxableBase || item.breakdown?.payeTaxableBase || item.breakdown?.paye_taxable_base || taxablePay

  return {
    id: String(item._id),
    payroll_run_id: String(item.payrollRunId),
    company_id: String(item.companyId),
    employee_id: String(item.employeeId?._id || item.employeeId),
    department_id: item.departmentId ? String(item.departmentId?._id || item.departmentId) : null,
    base_salary: item.baseSalary,
    gross_pay: grossPay,
    taxable_pay: taxablePay,
    paye_taxable_base: payeTaxableBase,
    allowances_total: item.allowancesTotal,
    deductions_total: item.deductionsTotal,
    structure_allowances_total: item.structureAllowancesTotal || 0,
    financial_rule_allowances_total: item.financialRuleAllowancesTotal || 0,
    structure_deductions_total: item.structureDeductionsTotal || 0,
    statutory_deductions_total: item.statutoryDeductionsTotal || 0,
    financial_rule_deductions_total: item.financialRuleDeductionsTotal || 0,
    loan_deductions_total: item.loanDeductionsTotal || 0,
    allowance_breakdown: item.allowanceBreakdown || [],
    deduction_breakdown: item.deductionBreakdown || [],
    breakdown: {
      base_pay: item.baseSalary,
      gross_pay: grossPay,
      taxable_pay: taxablePay,
      paye_taxable_base: payeTaxableBase,
      structure_allowances: item.structureAllowancesTotal || 0,
      financial_rule_allowances: item.financialRuleAllowancesTotal || 0,
      total_allowances: item.allowancesTotal,
      structure_deductions: item.structureDeductionsTotal || 0,
      statutory_deductions: item.statutoryDeductionsTotal || 0,
      financial_rule_deductions: item.financialRuleDeductionsTotal || 0,
      loan_deductions: item.loanDeductionsTotal || 0,
      total_deductions: item.deductionsTotal,
      net_pay: item.netPay
    },
    net_pay: item.netPay,
    attendance_days: item.attendanceDays,
    approval_status: item.approvalStatus,
    signed: item.signed,
    paid: item.signed,
    paid_at: item.paidAt || null,
    paid_by_user_id: item.paidByUserId ? String(item.paidByUserId) : null,
    employee: options.employee ? serializeEmployeeSummary(options.employee) : undefined,
    department: options.department ? serializeDepartmentSummary(options.department) : undefined
  }
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getActiveDepartment(companyId, departmentId){
  if(!departmentId){
    return null
  }

  return Department.findOne({
    _id: departmentId,
    companyId,
    status: "active"
  })
}

function normalizeDepartmentSalaryType(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "daily"
  }

  if(normalizedValue === "weekly"){
    return "weekly"
  }

  return "monthly"
}

function normalizeEmployeePaymentType(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "daily"
  }

  if(normalizedValue === "weekly"){
    return "weekly"
  }

  return "monthly"
}

function normalizeEmployeePaymentBasis(paymentType, value){
  const normalizedPaymentType = normalizeEmployeePaymentType(paymentType)
  const normalizedValue = String(value || "").trim().toLowerCase()

  if(normalizedPaymentType === "daily"){
    return "attendance_dependent"
  }

  return normalizedValue === "attendance_dependent"
    ? "attendance_dependent"
    : "standard"
}

function getExpectedEmployeePaymentTypeForRun(run){
  return normalizeDepartmentSalaryType(run?.salaryType)
}

async function getPayrollRunForCompany(companyId, runId){
  return PayrollRun.findOne({
    _id: runId,
    companyId
  })
}

function parseMonthlyPeriodRange(period){
  const match = /^(\d{4})-(\d{2})$/.exec(String(period))
  if(!match){
    return null
  }

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const start = new Date(Date.UTC(year, monthIndex, 1))
  const end = new Date(Date.UTC(year, monthIndex + 1, 1))
  return { start, end }
}

function parseDailyPeriodRange(period){
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(period))
  if(!match){
    return null
  }

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const day = Number(match[3])
  const start = new Date(Date.UTC(year, monthIndex, day))
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 1)
  return { start, end }
}

function parseWeeklyPeriodRange(period){
  const match = /^(\d{4})-W(\d{2})$/.exec(String(period))
  if(!match){
    return null
  }

  const year = Number(match[1])
  const week = Number(match[2])

  const simple = new Date(Date.UTC(year, 0, 1 + ((week - 1) * 7)))
  const day = simple.getUTCDay() || 7
  const start = new Date(simple)
  if(day <= 4){
    start.setUTCDate(simple.getUTCDate() - day + 1)
  } else {
    start.setUTCDate(simple.getUTCDate() + 8 - day)
  }
  start.setUTCHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 7)

  return { start, end }
}

function getPeriodRange(period, salaryType){
  const normalizedSalaryType = normalizeDepartmentSalaryType(salaryType)

  if(normalizedSalaryType === "daily"){
    return parseDailyPeriodRange(period)
  }

  return normalizedSalaryType === "weekly"
    ? parseWeeklyPeriodRange(period)
    : parseMonthlyPeriodRange(period)
}

async function getRunEmployees(run){
  const expectedPaymentType = getExpectedEmployeePaymentTypeForRun(run)
  const baseEmployeeQuery = {
    companyId: run.companyId,
    status: "active",
    payrollStatus: { $ne: "inactive" },
    paymentType: expectedPaymentType
  }

  if(run.departmentScopeId){
    const scopedDepartment = await Department.findOne({
      _id: run.departmentScopeId,
      companyId: run.companyId,
      status: "active"
    })

    if(!scopedDepartment){
      return []
    }

    return Employee.find({
      ...baseEmployeeQuery,
      departmentId: scopedDepartment._id
    }).sort({ fullName: 1 })
  }

  return Employee.find(baseEmployeeQuery).sort({ fullName: 1 })
}

async function getApprovedAttendanceCounts(run, employees){
  if(!employees.length){
    return new Map()
  }

  const range = getPeriodRange(run.period, run.salaryType)
  if(!range){
    return new Map()
  }

  const employeeIds = employees.map((employee) => employee._id)
  const attendanceCounts = await AttendanceLog.aggregate([
    {
      $match: {
        companyId: run.companyId,
        employeeId: { $in: employeeIds },
        approvalStatus: "approved",
        date: {
          $gte: range.start,
          $lt: range.end
        }
      }
    },
    {
      $group: {
        _id: "$employeeId",
        count: { $sum: 1 }
      }
    }
  ])

  return new Map(attendanceCounts.map((entry) => [String(entry._id), entry.count]))
}

function normalizeStructureChangeSalaryType(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(!normalizedValue){
    return ""
  }

  if(normalizedValue === "daily"){
    return "daily"
  }

  return normalizedValue === "weekly" ? "weekly" : "monthly"
}

function roundCurrency(value){
  return Number(Number(value || 0).toFixed(2))
}

function getStructureChangeSettlementMode(change){
  const explicitMode = String(change?.settlement_mode || change?.settlementMode || "").trim().toLowerCase()
  if(explicitMode === "loan"){
    return "loan"
  }

  const lowerType = String(change?.type || "").trim().toLowerCase()
  return change?.loan_details?.enabled || lowerType.includes("loan")
    ? "loan"
    : "one_time"
}

function isLoanStructureChange(change){
  return getStructureChangeSettlementMode(change) === "loan"
}

function isOneTimeStructureChange(change){
  return getStructureChangeSettlementMode(change) === "one_time"
}

function isStructureChangeSettled(change){
  return Boolean(change?.settled_at || change?.settledAt)
}

function collectStructureChangeIdsFromEntries(entries = []){
  return entries.reduce((ids, entry) => {
    const changeId = String(entry?.changeId || "").trim()
    if(changeId){
      ids.push(changeId)
    }
    return ids
  }, [])
}

function collectPayrollItemStructureChangeIds(item){
  return [
    ...collectStructureChangeIdsFromEntries(item?.allowanceBreakdown || []),
    ...collectStructureChangeIdsFromEntries(item?.deductionBreakdown || [])
  ]
}

function buildStructureChangeReservationKey(changeId, employeeId){
  return `${String(changeId || "").trim()}::${String(employeeId || "").trim()}`
}

async function getReservedStructureChangeKeys(companyId, runId){
  const unpaidItems = await PayrollItem.find({
    companyId,
    signed: false,
    payrollRunId: { $ne: runId }
  }, {
    payrollRunId: 1,
    allowanceBreakdown: 1,
    deductionBreakdown: 1
  }).lean()

  if(!unpaidItems.length){
    return new Set()
  }

  const runIds = [...new Set(
    unpaidItems
      .map((item) => String(item.payrollRunId || ""))
      .filter(Boolean)
  )]

  const runs = await PayrollRun.find({
    _id: { $in: runIds },
    companyId
  }, {
    status: 1
  }).lean()

  const activeRunIds = new Set(
    runs
      .filter((run) => String(run.status || "").trim().toLowerCase() !== "rejected")
      .map((run) => String(run._id))
  )

  const reservedKeys = new Set()
  unpaidItems.forEach((item) => {
    if(!activeRunIds.has(String(item.payrollRunId || ""))){
      return
    }

    collectPayrollItemStructureChangeIds(item).forEach((changeId) => {
      reservedKeys.add(buildStructureChangeReservationKey(changeId, item.employeeId))
    })
  })

  return reservedKeys
}

function getAttendanceDependentRate(employee, paymentType){
  const normalizedPaymentType = normalizeEmployeePaymentType(paymentType)
  const salaryAmount = Number(employee?.salaryAmount || 0)

  if(normalizedPaymentType === "daily"){
    return salaryAmount
  }

  if(normalizedPaymentType === "weekly"){
    return roundCurrency(salaryAmount / 7)
  }

  return roundCurrency(salaryAmount / 30)
}

function calculateEmployeeBaseSalaryForRun(employee, attendanceCount){
  const paymentType = normalizeEmployeePaymentType(employee?.paymentType)
  const paymentBasis = normalizeEmployeePaymentBasis(paymentType, employee?.paymentBasis)
  const normalizedAttendanceCount = Math.max(0, Number(attendanceCount || 0))

  if(paymentType === "daily"){
    return {
      attendanceDays: normalizedAttendanceCount,
      baseSalary: roundCurrency(Number(employee?.salaryAmount || 0) * normalizedAttendanceCount)
    }
  }

  if(paymentBasis === "attendance_dependent"){
    return {
      attendanceDays: normalizedAttendanceCount,
      baseSalary: roundCurrency(getAttendanceDependentRate(employee, paymentType) * normalizedAttendanceCount)
    }
  }

  return {
    attendanceDays: 0,
    baseSalary: roundCurrency(employee?.salaryAmount || 0)
  }
}

function normalizeStructureScopeValue(value){
  return String(value || "").trim().toLowerCase()
}

function doesStructureChangeApplyToEmployee(change, employee){
  const scope = normalizeStructureScopeValue(change.scope)
  if(!scope){
    return false
  }

  if(scope === "individual"){
    if(change.target_employee_id && String(change.target_employee_id) === String(employee._id)){
      return true
    }

    return String(change.target_label || "").trim().toLowerCase() === String(employee.fullName || "").trim().toLowerCase()
  }

  if(scope === "position"){
    const changeRole = String(change.target_role_title || change.target_label || "").trim().toLowerCase()
    const employeeRole = String(employee.roleTitle || "").trim().toLowerCase()
    return Boolean(changeRole && employeeRole && employeeRole === changeRole)
  }

  if(scope === "departmental-bonus"){
    if(String(change.target_label || "").trim().toLowerCase() === "all departments"){
      return true
    }

    if(change.target_department_id && String(change.target_department_id) === String(employee.departmentId || "")){
      return true
    }
  }

  return false
}

function buildPayrollBreakdownEntry(change, amount, sourceType){
  return {
    sourceType,
    label: change.type || (sourceType === "allowance" ? "Allowance" : "Deduction"),
    amount: Number(amount || 0),
    changeId: String(change.id || ""),
    scope: change.scope || "",
    targetLabel: change.target_label || ""
  }
}

function buildFinancialRuleBreakdownEntry(rule, amount, sourceType){
  return {
    sourceType,
    label: rule.name || rule.ruleType || "Financial Rule",
    amount: roundCurrency(amount),
    changeId: "",
    scope: rule.scope || "company",
    targetLabel: ""
  }
}

function buildStatutoryBreakdownEntry(label, amount, sourceType){
  return {
    sourceType,
    label,
    amount: roundCurrency(amount),
    changeId: "",
    scope: "company",
    targetLabel: ""
  }
}

function resolveStructureChangeAmount(change){
  const loanDetails = change.loan_details || null
  const lowerType = String(change.type || "").trim().toLowerCase()

  if(loanDetails?.enabled || lowerType.includes("loan")){
    const installmentAmount = Number(loanDetails?.installmentAmount || loanDetails?.installment_amount || 0)
    if(installmentAmount > 0){
      return installmentAmount
    }
  }

  return Number(change.amount || 0)
}

function doesFinancialRuleApplyToEmployee(rule, employee){
  const scope = String(rule.scope || "").trim().toLowerCase()
  if(scope === "company"){
    return true
  }

  if(scope === "department"){
    return Boolean(rule.targetId && String(rule.targetId) === String(employee.departmentId || ""))
  }

  if(scope === "employee"){
    return Boolean(rule.targetId && String(rule.targetId) === String(employee._id))
  }

  return false
}

function isFinancialRuleEffectiveForRange(rule, range){
  if(!range){
    return true
  }

  const startTime = range.start.getTime()
  const endTime = range.end.getTime()
  const effectiveFrom = rule.effectiveFrom ? new Date(rule.effectiveFrom).getTime() : null
  const effectiveTo = rule.effectiveTo ? new Date(rule.effectiveTo).getTime() : null

  if(effectiveFrom !== null && effectiveFrom >= endTime){
    return false
  }

  if(effectiveTo !== null && effectiveTo < startTime){
    return false
  }

  return true
}

function calculateFinancialRuleAmount(rule, amountBase){
  if(String(rule.valueType || "").trim().toLowerCase() === "percentage"){
    return roundCurrency(Number(amountBase || 0) * (Number(rule.value || 0) / 100))
  }

  return roundCurrency(rule.value || 0)
}

function isFinancialRuleTaxable(rule){
  return rule?.taxable !== false
}

function getFinancialRuleIncomeCategory(rule){
  const normalizedType = String(rule?.ruleType || "").trim().toLowerCase()
  const category = String(rule?.incomeCategory || "").trim()
  if(category){
    return category
  }

  if(normalizedType === "bonus"){
    return "bonus"
  }

  if(normalizedType === "incentive"){
    return "incentive"
  }

  return "other_taxable_income"
}

function isStructureChangeTaxable(change){
  return change?.taxable !== false
}

function getStructureChangeIncomeCategory(change){
  return String(change?.income_category || "allowance").trim() || "allowance"
}

async function getActiveFinancialRulesForRun(run){
  const range = getPeriodRange(run.period, run.salaryType)
  const [rules, statutoryConfiguration] = await Promise.all([
    FinancialRule.find({
      companyId: run.companyId,
      status: "active"
    }).sort({ ruleType: 1, scope: 1, name: 1 }),
    getCompanyStatutoryConfiguration(run.companyId)
  ])

  return {
    range,
    rules: rules.filter((rule) =>
      String(rule.ruleType || "").trim().toLowerCase() !== "paye" &&
      isFinancialRuleEffectiveForRange(rule, range)
    ),
    statutoryConfiguration
  }
}

function getEmployeeApplicableFinancialRules(employee, rules){
  return rules.filter((rule) => doesFinancialRuleApplyToEmployee(rule, employee))
}

function calculateFinancialRuleAllowancesForEmployee(employee, baseSalary, applicableRules){
  const allowanceRules = applicableRules
    .filter((rule) => {
      const ruleType = String(rule.ruleType || "").trim().toLowerCase()
      return ruleType === "bonus" || ruleType === "incentive"
    })
  const allowanceEntries = allowanceRules
    .map((rule) => {
      const amount = calculateFinancialRuleAmount(rule, baseSalary)
      return {
        rule,
        amount,
        sourceType: String(rule.ruleType || "").trim().toLowerCase() === "bonus" ? "financial_bonus" : "financial_incentive"
      }
    })
    .filter((entry) => entry.amount > 0)

  const allowanceBreakdown = allowanceEntries.map((entry) =>
    buildFinancialRuleBreakdownEntry(entry.rule, entry.amount, entry.sourceType)
  )
  const incomeItems = allowanceEntries.map((entry) => ({
    label: entry.rule.name || entry.rule.ruleType || "Allowance",
    amount: entry.amount,
    taxable: isFinancialRuleTaxable(entry.rule),
    includedInGrossPay: true,
    category: getFinancialRuleIncomeCategory(entry.rule)
  }))

  return {
    allowanceBreakdown,
    incomeItems,
    allowancesTotal: allowanceBreakdown.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
  }
}

function calculateEmployeeLoanProfileDeduction(employee, range, salaryType, existingDeductionBreakdown = []){
  const financialProfile = employee.financialProfile || {}
  const loan = financialProfile.loan || {}
  const hasStructureLoan = existingDeductionBreakdown.some((entry) => String(entry.sourceType || "").toLowerCase() === "loan")

  if(hasStructureLoan || !loan.enabled){
    return null
  }

  const installmentAmount = Number(loan.installmentAmount || 0)
  if(installmentAmount <= 0){
    return null
  }

  const frequency = String(loan.installmentFrequency || "Monthly").trim().toLowerCase()
  if((frequency === "weekly" && salaryType !== "weekly") ||
     (frequency === "monthly" && salaryType !== "monthly")){
    return null
  }

  if(loan.nextDeductionDate && range){
    const nextDeductionTime = new Date(loan.nextDeductionDate).getTime()
    if(nextDeductionTime < range.start.getTime() || nextDeductionTime >= range.end.getTime()){
      return null
    }
  }

  return {
    sourceType: "employee_loan",
    label: loan.name || "Employee Loan",
    amount: roundCurrency(installmentAmount),
    changeId: String(loan.sourceChangeId || ""),
    scope: "employee_profile",
    targetLabel: employee.fullName
  }
}

function getPayrollRunRange(run){
  return getPeriodRange(run?.period, run?.salaryType) || null
}

function computeNextLoanDeductionDate(run, currentNextDeductionDate = null){
  const range = getPayrollRunRange(run)
  if(range?.end){
    return new Date(range.end)
  }

  if(!currentNextDeductionDate){
    return null
  }

  const nextDate = new Date(currentNextDeductionDate)
  if(Number.isNaN(nextDate.getTime())){
    return null
  }

  if(String(run?.salaryType || "").trim().toLowerCase() === "weekly"){
    nextDate.setUTCDate(nextDate.getUTCDate() + 7)
  } else {
    nextDate.setUTCMonth(nextDate.getUTCMonth() + 1)
  }

  return nextDate
}

function buildUpdatedLoanProfileAfterPayment(loanProfile, payrollItem, payrollRun){
  const normalizedLoan = loanProfile || {}
  const deductionEntries = (payrollItem?.deductionBreakdown || []).filter((entry) => {
    const sourceType = String(entry?.sourceType || "").trim().toLowerCase()
    return (sourceType === "employee_loan" || sourceType === "loan") && Number(entry?.amount || 0) > 0
  })

  if(!normalizedLoan.enabled || !deductionEntries.length){
    return null
  }

  const deductionAmount = roundCurrency(deductionEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0))
  if(deductionAmount <= 0){
    return null
  }

  const totalInstallments = Number(normalizedLoan.totalInstallments || 0)
  const currentInstallmentsPaid = Number(normalizedLoan.installmentsPaid || 0)
  const currentInstallmentsRemaining = Number(
    normalizedLoan.installmentsRemaining !== undefined
      ? normalizedLoan.installmentsRemaining
      : Math.max(0, totalInstallments - currentInstallmentsPaid)
  )
  const currentBalanceAmount = Number(normalizedLoan.balanceAmount || 0)

  const nextInstallmentsPaid = totalInstallments > 0
    ? Math.min(totalInstallments, currentInstallmentsPaid + 1)
    : currentInstallmentsPaid + 1
  const nextInstallmentsRemaining = currentInstallmentsRemaining > 0
    ? Math.max(0, currentInstallmentsRemaining - 1)
    : Math.max(0, totalInstallments - nextInstallmentsPaid)
  const nextBalanceAmount = currentBalanceAmount > 0
    ? Math.max(0, roundCurrency(currentBalanceAmount - deductionAmount))
    : 0

  const isSettled = (totalInstallments > 0 && nextInstallmentsRemaining <= 0) ||
    (currentBalanceAmount > 0 && nextBalanceAmount <= 0)
  const nextDeductionDate = isSettled
    ? null
    : computeNextLoanDeductionDate(payrollRun, normalizedLoan.nextDeductionDate || null)

  return {
    loanProfile: {
      ...normalizedLoan,
      enabled: !isSettled,
      installmentsPaid: nextInstallmentsPaid,
      installmentsRemaining: nextInstallmentsRemaining,
      balanceAmount: nextBalanceAmount,
      nextDeductionDate,
      sourceChangeId: normalizedLoan.sourceChangeId || String(deductionEntries[0]?.changeId || "")
    },
    settled: isSettled,
    settledChangeId: String(normalizedLoan.sourceChangeId || deductionEntries[0]?.changeId || ""),
    deductionAmount
  }
}

function calculateStatutoryAndFinancialDeductionsForEmployee(employee, payrollPreview, applicableRules, range, salaryType, existingDeductionBreakdown = []){
  const financialProfile = employee.financialProfile || {}
  const shouldApplyTaxFinancials = Boolean(financialProfile.applyTaxFinancials)
  const statutoryToggles = financialProfile.statutory || {}

  const statutoryBreakdown = []
  const deductions = shouldApplyTaxFinancials ? payrollPreview?.deductions || {} : {}

  if(Number(deductions.shif || 0) > 0){
    statutoryBreakdown.push(buildStatutoryBreakdownEntry("SHIF", deductions.shif, "statutory_shif"))
  }

  if(Number(deductions.nssf || 0) > 0){
    statutoryBreakdown.push(buildStatutoryBreakdownEntry("NSSF", deductions.nssf, "statutory_nssf"))
  }

  if(Number(deductions.housingLevy || 0) > 0){
    statutoryBreakdown.push(buildStatutoryBreakdownEntry("Housing Levy", deductions.housingLevy, "statutory_housing_levy"))
  }

  if(Number(deductions.paye || 0) > 0){
    statutoryBreakdown.push(buildStatutoryBreakdownEntry("PAYE", deductions.paye, "statutory_paye"))
  }

  const financialRuleDeductionBreakdown = applicableRules
    .filter((rule) => String(rule.ruleType || "").trim().toLowerCase() === "custom_deduction")
    .map((rule) => buildFinancialRuleBreakdownEntry(rule, calculateFinancialRuleAmount(rule, employee.salaryAmount), "financial_deduction"))
    .filter((entry) => entry.amount > 0)

  const loanEntry = calculateEmployeeLoanProfileDeduction(employee, range, salaryType, existingDeductionBreakdown)
  const loanBreakdown = loanEntry ? [loanEntry] : []

  return {
    statutoryBreakdown,
    statutoryDeductionsTotal: statutoryBreakdown.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
    financialRuleDeductionBreakdown,
    financialRuleDeductionsTotal: financialRuleDeductionBreakdown.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
    loanBreakdown,
    loanDeductionsTotal: loanBreakdown.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
  }
}

function calculateStructureAdjustmentsForEmployee(run, employee, approvedStructureState, reservedChangeKeys = new Set()){
  if(!approvedStructureState || approvedStructureState.status !== "approved"){
    return {
      allowanceBreakdown: [],
      allowanceIncomeItems: [],
      deductionBreakdown: [],
      allowancesTotal: 0,
      deductionsTotal: 0
    }
  }

  const allowanceBreakdown = []
  const allowanceIncomeItems = []
  const deductionBreakdown = []

  ;(approvedStructureState.changes || []).forEach((change) => {
    const changeSalaryType = normalizeStructureChangeSalaryType(change.salary_type)
    if(changeSalaryType && changeSalaryType !== run.salaryType){
      return
    }

    if(!doesStructureChangeApplyToEmployee(change, employee)){
      return
    }

     if(isStructureChangeSettled(change)){
      return
    }

    if(isOneTimeStructureChange(change) && reservedChangeKeys.has(buildStructureChangeReservationKey(change.id, employee?._id))){
      return
    }

    const amount = resolveStructureChangeAmount(change)
    if(amount <= 0){
      return
    }

    if(isLoanStructureChange(change)){
      return
    }

    if(String(change.kind || "").trim().toLowerCase() === "allowance"){
      allowanceBreakdown.push(buildPayrollBreakdownEntry(change, amount, "allowance"))
      allowanceIncomeItems.push({
        label: change.type || "Allowance",
        amount,
        taxable: isStructureChangeTaxable(change),
        includedInGrossPay: true,
        category: getStructureChangeIncomeCategory(change)
      })
      return
    }

    deductionBreakdown.push(buildPayrollBreakdownEntry(change, amount, String(change.type || "").trim().toLowerCase().includes("loan") ? "loan" : "deduction"))
  })

  return {
    allowanceBreakdown,
    allowanceIncomeItems,
    deductionBreakdown,
    allowancesTotal: allowanceBreakdown.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
    deductionsTotal: deductionBreakdown.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
  }
}

function buildPayrollItemPayload(run, employee, attendanceCount, approvedStructureState, financialRuleContext, reservedChangeKeys = new Set()){
  const payProfile = calculateEmployeeBaseSalaryForRun(employee, attendanceCount)
  const attendanceDays = payProfile.attendanceDays
  const baseSalary = payProfile.baseSalary
  const structureAdjustments = calculateStructureAdjustmentsForEmployee(run, employee, approvedStructureState, reservedChangeKeys)
  const applicableFinancialRules = getEmployeeApplicableFinancialRules(employee, financialRuleContext?.rules || [])
  const financialRuleAllowances = calculateFinancialRuleAllowancesForEmployee(
    employee,
    baseSalary,
    applicableFinancialRules
  )
  const incomeItems = [
    {
      label: "Basic Salary",
      amount: baseSalary,
      taxable: true,
      includedInGrossPay: true,
      category: "basic_salary"
    },
    ...structureAdjustments.allowanceIncomeItems,
    ...financialRuleAllowances.incomeItems
  ]
  const payrollPreview = calculatePayrollPreview({
    incomeItems,
    customDeductions: 0,
    config: financialRuleContext?.statutoryConfiguration || {},
    enabled: {
      paye: employee.financialProfile?.applyTaxFinancials && employee.financialProfile?.statutory?.paye !== false,
      shif: employee.financialProfile?.applyTaxFinancials && employee.financialProfile?.statutory?.shif !== false && employee.financialProfile?.statutory?.insurance !== false,
      nssf: employee.financialProfile?.applyTaxFinancials && employee.financialProfile?.statutory?.nssf !== false && employee.financialProfile?.statutory?.pension !== false,
      housingLevy: employee.financialProfile?.applyTaxFinancials && employee.financialProfile?.statutory?.housingLevy !== false
    }
  })
  const statutoryAndFinancialDeductions = calculateStatutoryAndFinancialDeductionsForEmployee(
    employee,
    payrollPreview,
    applicableFinancialRules,
    financialRuleContext?.range || null,
    run.salaryType,
    structureAdjustments.deductionBreakdown
  )

  const grossPay = roundCurrency(payrollPreview.grossSalary || (baseSalary + structureAdjustments.allowancesTotal + financialRuleAllowances.allowancesTotal))
  const taxablePay = roundCurrency(payrollPreview.taxablePay || baseSalary)
  const payeTaxableBase = roundCurrency(payrollPreview.deductions?.payeTaxableBase || taxablePay)
  const structureAllowancesTotal = roundCurrency(structureAdjustments.allowancesTotal || 0)
  const financialRuleAllowancesTotal = roundCurrency(financialRuleAllowances.allowancesTotal || 0)
  const structureDeductionsTotal = roundCurrency(structureAdjustments.deductionsTotal || 0)
  const statutoryDeductionsTotal = roundCurrency(statutoryAndFinancialDeductions.statutoryDeductionsTotal || 0)
  const financialRuleDeductionsTotal = roundCurrency(statutoryAndFinancialDeductions.financialRuleDeductionsTotal || 0)
  const loanDeductionsTotal = roundCurrency(statutoryAndFinancialDeductions.loanDeductionsTotal || 0)
  const allowancesTotal = roundCurrency(structureAllowancesTotal + financialRuleAllowancesTotal)
  const deductionsTotal = roundCurrency(structureDeductionsTotal + statutoryDeductionsTotal + financialRuleDeductionsTotal + loanDeductionsTotal)
  const netPay = roundCurrency(grossPay - deductionsTotal)

  return {
    payrollRunId: run._id,
    companyId: run.companyId,
    employeeId: employee._id,
    departmentId: employee.departmentId || null,
    baseSalary,
    grossPay,
    taxablePay,
    payeTaxableBase,
    allowancesTotal,
    deductionsTotal,
    structureAllowancesTotal,
    financialRuleAllowancesTotal,
    structureDeductionsTotal,
    statutoryDeductionsTotal,
    financialRuleDeductionsTotal,
    loanDeductionsTotal,
    allowanceBreakdown: [
      ...structureAdjustments.allowanceBreakdown,
      ...financialRuleAllowances.allowanceBreakdown
    ],
    deductionBreakdown: [
      ...structureAdjustments.deductionBreakdown,
      ...statutoryAndFinancialDeductions.statutoryBreakdown,
      ...statutoryAndFinancialDeductions.financialRuleDeductionBreakdown,
      ...statutoryAndFinancialDeductions.loanBreakdown
    ],
    netPay,
    attendanceDays,
    approvalStatus: "pending",
    signed: false
  }
}

async function hydratePayrollItems(companyId, items){
  const employeeIds = items.map((item) => item.employeeId).filter(Boolean)
  const departmentIds = items.map((item) => item.departmentId).filter(Boolean)

  const [employees, departments] = await Promise.all([
    Employee.find({
      _id: { $in: employeeIds },
      companyId
    }),
    Department.find({
      _id: { $in: departmentIds },
      companyId
    })
  ])

  const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))
  const departmentMap = new Map(departments.map((department) => [String(department._id), department]))

  return items.map((item) => serializePayrollItem(item, {
    employee: employeeMap.get(String(item.employeeId)) || null,
    department: item.departmentId ? departmentMap.get(String(item.departmentId)) || null : null
  }))
}

function calculateRunTotals(items){
  return items.reduce((totals, item) => ({
    baseSalary: totals.baseSalary + item.baseSalary,
    allowances: totals.allowances + item.allowancesTotal,
    deductions: totals.deductions + item.deductionsTotal,
    netPay: totals.netPay + item.netPay
  }), {
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    netPay: 0
  })
}

function calculatePayrollPaymentSummary(items){
  const paidItems = items.filter((item) => Boolean(item.signed))
  const lastPaidAt = paidItems
    .map((item) => item.paidAt || null)
    .filter(Boolean)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] || null

  return {
    itemCount: items.length,
    paidItemCount: paidItems.length,
    unpaidItemCount: Math.max(0, items.length - paidItems.length),
    lastPaidAt
  }
}

function formatMembershipRole(role){
  const normalizedRole = String(role || "").trim().toUpperCase()
  if(normalizedRole === "ADMIN"){
    return "Admin"
  }

  if(normalizedRole === "MANAGER"){
    return "Manager"
  }

  return "Viewer"
}

function getApprovalRolePriority(role){
  const normalizedRole = String(role || "").trim().toUpperCase()
  if(normalizedRole === "ADMIN"){
    return 0
  }

  if(normalizedRole === "MANAGER"){
    return 1
  }

  return 2
}

async function upsertCompanySetting(companyId, key, valueJson, userId){
  return CompanySetting.findOneAndUpdate(
    { companyId, key },
    {
      $set: {
        valueJson,
        updatedByUserId: userId
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  )
}

async function getCompanyWorkflowMembers(companyId){
  const memberships = await CompanyMembership.find({
    companyId,
    status: "active"
  }).lean()

  if(!memberships.length){
    return []
  }

  const users = await User.find({
    _id: { $in: memberships.map((membership) => membership.userId) },
    status: "active"
  }).lean()

  const userMap = new Map(users.map((user) => [String(user._id), user]))

  return memberships
    .map((membership) => {
      const user = userMap.get(String(membership.userId))
      if(!user){
        return null
      }

      return {
        membershipId: String(membership._id),
        userId: String(membership.userId),
        approverName: user.displayName,
        role: membership.role,
        email: user.email
      }
    })
    .filter(Boolean)
    .sort((left, right) => {
      const priorityDelta = getApprovalRolePriority(left.role) - getApprovalRolePriority(right.role)
      if(priorityDelta !== 0){
        return priorityDelta
      }

      return String(left.approverName || "").localeCompare(String(right.approverName || ""))
    })
}

function findExistingWorkflowApproval(existingApprovals = [], member, index){
  const memberUserId = String(member.userId || "")
  const memberName = String(member.approverName || "").trim().toLowerCase()
  const memberRole = String(member.role || "").trim().toUpperCase()

  return existingApprovals.find((approval, approvalIndex) => {
    const approvalUserId = String(approval?.approver_user_id || approval?.approverId || "")
    if(memberUserId && approvalUserId && approvalUserId === memberUserId){
      return true
    }

    const approvalName = String(approval?.approver_name || approval?.approverName || "").trim().toLowerCase()
    if(memberName && approvalName && approvalName === memberName){
      return true
    }

    const approvalRole = String(approval?.role || "").trim().toUpperCase()
    if(memberRole && approvalRole && approvalRole === memberRole){
      return true
    }

    return approvalIndex === index
  }) || null
}

async function buildWorkflowApprovals(companyId, workflowType, existingApprovals = []){
  const workflowConfig = PAYROLL_WORKFLOW_CONFIG[workflowType]
  const members = await getCompanyWorkflowMembers(companyId)
  let eligibleMembers = members.filter((member) => workflowConfig.preferredRoles.includes(String(member.role || "").trim().toUpperCase()))

  if(!eligibleMembers.length){
    eligibleMembers = members
  }

  return eligibleMembers.slice(0, workflowConfig.maxCount).map((member, index) => {
    const existingApproval = findExistingWorkflowApproval(existingApprovals, member, index)

    return {
      id: existingApproval?.id || `${workflowType}-approval-${member.userId}`,
      approver_user_id: member.userId,
      approver_name: member.approverName,
      role: formatMembershipRole(member.role),
      status: existingApproval?.status || "pending",
      approved_at: existingApproval?.approved_at || null,
      rejected_at: existingApproval?.rejected_at || null,
      rejection_reason: existingApproval?.rejection_reason || ""
    }
  })
}

function deriveWorkflowStatus(approvals = []){
  if(approvals.some((approval) => approval.status === "rejected")){
    return "rejected"
  }

  if(approvals.length && approvals.every((approval) => approval.status === "approved")){
    return "approved"
  }

  return "pending"
}

function resetWorkflowApprovals(approvals = []){
  return approvals.map((approval) => ({
    ...approval,
    status: "pending",
    approved_at: null,
    rejected_at: null,
    rejection_reason: ""
  }))
}

function getDefaultPaydayMonth(){
  const tomorrow = getTomorrowDate()
  return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}`
}

function normalizeCalendarSalaryType(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  if(normalizedValue === "daily"){
    return "Daily"
  }

  if(normalizedValue === "weekly"){
    return "Weekly"
  }

  return "Monthly"
}

function getTomorrowDate(){
  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

function formatMonthKey(date){
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function normalizeFuturePaydaySelection(paydayMonth, paydayDay){
  const tomorrow = getTomorrowDate()
  const tomorrowMonthKey = formatMonthKey(tomorrow)
  const safeMonthValue = String(paydayMonth || tomorrowMonthKey)
  const [rawYear, rawMonth] = safeMonthValue.split("-").map(Number)

  if(!rawYear || !rawMonth){
    return {
      paydayMonth: tomorrowMonthKey,
      paydayDay: String(tomorrow.getDate())
    }
  }

  let year = rawYear
  let month = rawMonth
  const requestedDate = new Date(year, month - 1, 1)

  if(requestedDate < new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1)){
    year = tomorrow.getFullYear()
    month = tomorrow.getMonth() + 1
  }

  const monthKey = `${year}-${String(month).padStart(2, "0")}`
  const maxDay = new Date(year, month, 0).getDate()
  const minimumDay = monthKey === tomorrowMonthKey ? tomorrow.getDate() : 1
  const requestedDay = Number(paydayDay || minimumDay)
  const normalizedDay = Math.min(Math.max(requestedDay, minimumDay), maxDay)

  return {
    paydayMonth: monthKey,
    paydayDay: String(normalizedDay)
  }
}

function computeNextPaydayIso(paydayMonth, paydayDay){
  const normalizedSelection = normalizeFuturePaydaySelection(paydayMonth, paydayDay)
  const [year, month] = normalizedSelection.paydayMonth.split("-").map(Number)
  const day = Number(normalizedSelection.paydayDay || 1)
  return new Date(Date.UTC(year, month - 1, day)).toISOString()
}

function normalizeStructureChange(change, userId){
  return {
    id: change?.id || `structure-change-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    kind: String(change?.kind || "").trim(),
    type: String(change?.type || "").trim(),
    amount: Number(change?.amount || 0),
    taxable: change?.taxable !== false,
    income_category: String(change?.income_category || "allowance").trim() || "allowance",
    salary_type: normalizeCalendarSalaryType(change?.salary_type || "Monthly").toLowerCase(),
    scope: String(change?.scope || "").trim(),
    scope_label: String(change?.scope_label || "").trim(),
    target_label: String(change?.target_label || "").trim(),
    target_employee_id: change?.target_employee_id || null,
    target_department_id: change?.target_department_id || null,
    target_role_title: change?.target_role_title || null,
    settlement_mode: getStructureChangeSettlementMode(change),
    settled_at: change?.settled_at || null,
    settled_run_id: change?.settled_run_id || null,
    settled_item_id: change?.settled_item_id || null,
    settled_by_user_id: change?.settled_by_user_id || null,
    loan_details: change?.loan_details || null,
    created_at: change?.created_at || new Date().toISOString(),
    requested_by_user_id: change?.requested_by_user_id || userId || null
  }
}

async function buildPayrollStructureState(companyId){
  const workflowSetting = await CompanySetting.findOne({
    companyId,
    key: PAYROLL_WORKFLOW_CONFIG.structure.settingKey
  }).lean()
  const storedValue = workflowSetting?.valueJson || {}
  const approvals = await buildWorkflowApprovals(companyId, "structure", storedValue.approvals || [])
  const changes = Array.isArray(storedValue.changes)
    ? storedValue.changes.map((change) => normalizeStructureChange(change, storedValue.requested_by_user_id || null))
    : []

  const normalizedApprovals = changes.length
    ? approvals
    : resetWorkflowApprovals(approvals)

  return {
    workflow_type: "structure",
    status: changes.length ? deriveWorkflowStatus(normalizedApprovals) : "pending",
    approvals: normalizedApprovals,
    changes,
    requested_by_user_id: storedValue.requested_by_user_id || null,
    updated_at: storedValue.updated_at || workflowSetting?.updatedAt?.toISOString() || null
  }
}

async function getApprovedPayrollStructureState(companyId){
  const state = await buildPayrollStructureState(companyId)

  if(state.status !== "approved"){
    return {
      ...state,
      changes: []
    }
  }

  return state
}

async function savePayrollStructureState(companyId, state, userId){
  const nextState = {
    workflow_type: "structure",
    status: state.status || deriveWorkflowStatus(state.approvals || []),
    approvals: state.approvals || [],
    changes: state.changes || [],
    requested_by_user_id: state.requested_by_user_id || userId || null,
    updated_at: new Date().toISOString()
  }

  await upsertCompanySetting(companyId, PAYROLL_WORKFLOW_CONFIG.structure.settingKey, nextState, userId)
  return nextState
}

function buildEmployeeLoanProfileFromStructureChange(employee, change){
  const currentLoan = employee?.financialProfile?.loan || {}
  const currentLoanIsSameSource = String(currentLoan.sourceChangeId || "") === String(change.id || "")
  const loanDetails = change.loan_details || {}
  const installmentAmount = Number(
    loanDetails.installment_amount ??
    loanDetails.installmentAmount ??
    change.amount ??
    0
  )
  const totalInstallments = Number(
    loanDetails.total_installments ??
    loanDetails.totalInstallments ??
    currentLoan.totalInstallments ??
    0
  )
  const installmentsPaid = currentLoanIsSameSource
    ? Number(currentLoan.installmentsPaid || 0)
    : Number(loanDetails.installments_paid ?? loanDetails.installmentsPaid ?? 0)
  const installmentsRemaining = currentLoanIsSameSource
    ? Number(currentLoan.installmentsRemaining || 0)
    : Math.max(0, Number(
      loanDetails.installments_remaining ??
      loanDetails.installmentsRemaining ??
      totalInstallments - installmentsPaid
    ))
  const principalAmount = currentLoanIsSameSource && Number(currentLoan.principalAmount || 0) > 0
    ? Number(currentLoan.principalAmount || 0)
    : roundCurrency(installmentAmount * (totalInstallments || 1))
  const balanceAmount = currentLoanIsSameSource
    ? Number(currentLoan.balanceAmount || 0)
    : Math.max(0, roundCurrency(principalAmount - (installmentsPaid * installmentAmount)))

  return {
    ...currentLoan,
    enabled: installmentsRemaining > 0 || balanceAmount > 0,
    sourceChangeId: String(change.id || ""),
    name: currentLoanIsSameSource && currentLoan.name
      ? currentLoan.name
      : (String(loanDetails.name || "").trim() || String(change.type || "Employee Loan").trim() || "Employee Loan"),
    principalAmount,
    balanceAmount,
    installmentAmount,
    installmentFrequency: String(
      loanDetails.installment_frequency ||
      loanDetails.installmentFrequency ||
      currentLoan.installmentFrequency ||
      "Monthly"
    ).trim() || "Monthly",
    totalInstallments,
    installmentsPaid,
    installmentsRemaining,
    nextDeductionDate: currentLoanIsSameSource && currentLoan.nextDeductionDate
      ? currentLoan.nextDeductionDate
      : (loanDetails.next_deduction_date || loanDetails.nextDeductionDate || currentLoan.nextDeductionDate || null)
  }
}

async function syncApprovedStructureLoansToEmployees(companyId, structureState){
  const loanChanges = (structureState?.changes || []).filter((change) =>
    isLoanStructureChange(change) &&
    !isStructureChangeSettled(change) &&
    change.target_employee_id
  )

  if(!loanChanges.length){
    return
  }

  const employeeIds = [...new Set(loanChanges.map((change) => String(change.target_employee_id)).filter(Boolean))]
  const employees = await Employee.find({
    _id: { $in: employeeIds },
    companyId,
    status: "active"
  })

  const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))
  const saveOperations = []

  loanChanges.forEach((change) => {
    const employee = employeeMap.get(String(change.target_employee_id || ""))
    if(!employee){
      return
    }

    employee.financialProfile = {
      ...(employee.financialProfile || {}),
      loan: buildEmployeeLoanProfileFromStructureChange(employee, change)
    }
    saveOperations.push(employee.save())
  })

  if(saveOperations.length){
    await Promise.all(saveOperations)
  }
}

async function updateStructureStateForSettledChanges(companyId, changeIds, payrollRun, payrollItem, userId){
  const normalizedIds = [...new Set((changeIds || []).map((id) => String(id || "").trim()).filter(Boolean))]
  if(!normalizedIds.length){
    return null
  }

  const currentState = await buildPayrollStructureState(companyId)
  let didUpdate = false

  const nextChanges = (currentState.changes || []).map((change) => {
    if(!normalizedIds.includes(String(change.id || "")) || isStructureChangeSettled(change)){
      return change
    }

    didUpdate = true
    return {
      ...change,
      settled_at: new Date().toISOString(),
      settled_run_id: String(payrollRun?._id || payrollRun?.id || ""),
      settled_item_id: String(payrollItem?._id || payrollItem?.id || ""),
      settled_by_user_id: userId ? String(userId) : null
    }
  })

  if(!didUpdate){
    return currentState
  }

  return savePayrollStructureState(companyId, {
    ...currentState,
    changes: nextChanges
  }, userId)
}

async function updateLoanProgressAfterPayrollPayment(companyId, employee, payrollItem, payrollRun, userId){
  const nextLoanState = buildUpdatedLoanProfileAfterPayment(employee?.financialProfile?.loan || {}, payrollItem, payrollRun)
  if(!employee || !nextLoanState){
    return null
  }

  employee.financialProfile = {
    ...(employee.financialProfile || {}),
    loan: nextLoanState.loanProfile
  }
  await employee.save()

  const sourceChangeId = String(nextLoanState.settledChangeId || "")
  if(!sourceChangeId){
    return null
  }

  const currentState = await buildPayrollStructureState(companyId)
  let didUpdate = false
  const nextChanges = (currentState.changes || []).map((change) => {
    if(String(change.id || "") !== sourceChangeId){
      return change
    }

    didUpdate = true
    const nextLoanDetails = {
      ...(change.loan_details || {}),
      installment_amount: Number(nextLoanState.loanProfile.installmentAmount || 0),
      total_installments: Number(nextLoanState.loanProfile.totalInstallments || 0),
      installments_paid: Number(nextLoanState.loanProfile.installmentsPaid || 0),
      installments_remaining: Number(nextLoanState.loanProfile.installmentsRemaining || 0),
      balance_amount: Number(nextLoanState.loanProfile.balanceAmount || 0),
      next_deduction_date: nextLoanState.loanProfile.nextDeductionDate || null
    }

    return nextLoanState.settled
      ? {
          ...change,
          loan_details: nextLoanDetails,
          settled_at: new Date().toISOString(),
          settled_run_id: String(payrollRun?._id || payrollRun?.id || ""),
          settled_item_id: String(payrollItem?._id || payrollItem?.id || ""),
          settled_by_user_id: userId ? String(userId) : null
        }
      : {
          ...change,
          loan_details: nextLoanDetails
        }
  })

  if(!didUpdate){
    return currentState
  }

  return savePayrollStructureState(companyId, {
    ...currentState,
    changes: nextChanges
  }, userId)
}

async function buildPayrollCalendarState(companyId){
  const [workflowSetting, baseCalendarSetting] = await Promise.all([
    CompanySetting.findOne({
      companyId,
      key: PAYROLL_WORKFLOW_CONFIG.calendar.settingKey
    }).lean(),
    CompanySetting.findOne({
      companyId,
      key: PAYROLL_CALENDAR_SETTING_KEY
    }).lean()
  ])

  const storedValue = workflowSetting?.valueJson || {}
  const baseCalendar = baseCalendarSetting?.valueJson || {}
  const approvals = await buildWorkflowApprovals(companyId, "calendar", storedValue.approvals || [])
  const salaryType = normalizeCalendarSalaryType(storedValue.salary_type || baseCalendar.salary_type || "monthly")

  const monthlySeed = storedValue.schedules?.monthly || baseCalendar.schedules?.monthly || {}
  const weeklySeed = storedValue.schedules?.weekly || baseCalendar.schedules?.weekly || {}
  const monthlySelection = normalizeFuturePaydaySelection(
    monthlySeed.payday_month || (salaryType === "Monthly" ? storedValue.payday_month : null) || baseCalendar.monthly_payday_month || getDefaultPaydayMonth(),
    monthlySeed.payday_day || (salaryType === "Monthly" ? storedValue.payday_day : null) || baseCalendar.monthly_payday_day || getTomorrowDate().getDate()
  )
  const weeklySelection = normalizeFuturePaydaySelection(
    weeklySeed.payday_month || (salaryType === "Weekly" ? storedValue.payday_month : null) || baseCalendar.weekly_payday_month || getDefaultPaydayMonth(),
    weeklySeed.payday_day || (salaryType === "Weekly" ? storedValue.payday_day : null) || baseCalendar.weekly_payday_day || getTomorrowDate().getDate()
  )
  const schedules = {
    monthly: {
      payday_day: monthlySelection.paydayDay,
      payday_month: monthlySelection.paydayMonth,
      next_payday: computeNextPaydayIso(monthlySelection.paydayMonth, monthlySelection.paydayDay)
    },
    weekly: {
      payday_day: weeklySelection.paydayDay,
      payday_month: weeklySelection.paydayMonth,
      next_payday: computeNextPaydayIso(weeklySelection.paydayMonth, weeklySelection.paydayDay)
    }
  }
  const selectedSchedule = salaryType === "Weekly" ? schedules.weekly : schedules.monthly

  return {
    workflow_type: "calendar",
    salary_type: salaryType,
    payday_day: selectedSchedule.payday_day,
    payday_month: selectedSchedule.payday_month,
    next_payday: selectedSchedule.next_payday,
    schedules,
    status: deriveWorkflowStatus(approvals),
    approvals,
    requested_by_user_id: storedValue.requested_by_user_id || null,
    updated_at: storedValue.updated_at || workflowSetting?.updatedAt?.toISOString() || null
  }
}

async function savePayrollCalendarState(companyId, state, userId){
  const selectedSalaryType = normalizeCalendarSalaryType(state.salary_type)
  const normalizedSelection = normalizeFuturePaydaySelection(state.payday_month, state.payday_day)
  const existingSchedules = state.schedules || {}
  const nextSchedules = {
    monthly: {
      payday_day: String(existingSchedules.monthly?.payday_day || getTomorrowDate().getDate()),
      payday_month: String(existingSchedules.monthly?.payday_month || getDefaultPaydayMonth()),
      next_payday: existingSchedules.monthly?.next_payday || null
    },
    weekly: {
      payday_day: String(existingSchedules.weekly?.payday_day || getTomorrowDate().getDate()),
      payday_month: String(existingSchedules.weekly?.payday_month || getDefaultPaydayMonth()),
      next_payday: existingSchedules.weekly?.next_payday || null
    }
  }
  const scheduleKey = selectedSalaryType.toLowerCase()
  nextSchedules[scheduleKey] = {
    payday_day: normalizedSelection.paydayDay,
    payday_month: normalizedSelection.paydayMonth,
    next_payday: computeNextPaydayIso(normalizedSelection.paydayMonth, normalizedSelection.paydayDay)
  }

  const nextState = {
    workflow_type: "calendar",
    salary_type: selectedSalaryType,
    payday_day: normalizedSelection.paydayDay,
    payday_month: normalizedSelection.paydayMonth,
    next_payday: computeNextPaydayIso(normalizedSelection.paydayMonth, normalizedSelection.paydayDay),
    schedules: nextSchedules,
    status: state.status || deriveWorkflowStatus(state.approvals || []),
    approvals: state.approvals || [],
    requested_by_user_id: state.requested_by_user_id || userId || null,
    updated_at: new Date().toISOString()
  }

    await Promise.all([
      upsertCompanySetting(companyId, PAYROLL_WORKFLOW_CONFIG.calendar.settingKey, nextState, userId),
      upsertCompanySetting(companyId, PAYROLL_CALENDAR_SETTING_KEY, {
        payday_day: Number(nextState.payday_day),
        payday_month: nextState.payday_month,
        salary_type: String(nextState.salary_type || "Monthly").toLowerCase(),
        monthly_payday_day: Number(nextSchedules.monthly.payday_day),
        monthly_payday_month: nextSchedules.monthly.payday_month,
        weekly_payday_day: Number(nextSchedules.weekly.payday_day),
        weekly_payday_month: nextSchedules.weekly.payday_month,
        schedules: nextSchedules,
        approval_chain: (nextState.approvals || []).map((approval) => String(approval.role || "").toUpperCase())
      }, userId)
  ])

  return nextState
}

function serializeWorkflowApproval(approval){
  return {
    id: approval.id,
    approver_id: approval.approver_user_id || approval.approverId || "",
    approver_name: approval.approver_name || approval.approverName || "",
    role: approval.role || "Member",
    status: approval.status || "pending",
    approved_at: approval.approved_at || approval.approvedAt || null,
    rejected_at: approval.rejected_at || approval.rejectedAt || null,
    rejection_reason: approval.rejection_reason || approval.rejectionReason || ""
  }
}

function serializePayrollStructureState(state){
  return {
    workflow_type: "structure",
    status: state.status || "pending",
    approvals: (state.approvals || []).map((approval) => serializeWorkflowApproval(approval)),
    changes: (state.changes || []).map((change) => ({
      id: change.id,
      kind: change.kind,
      type: change.type,
      amount: change.amount,
      taxable: change.taxable !== false,
      income_category: change.income_category || "allowance",
      salary_type: change.salary_type || null,
      scope: change.scope,
      scope_label: change.scope_label,
      target_label: change.target_label,
      target_employee_id: change.target_employee_id || null,
      target_department_id: change.target_department_id || null,
      target_role_title: change.target_role_title || null,
      settlement_mode: getStructureChangeSettlementMode(change),
      settled_at: change.settled_at || null,
      settled_run_id: change.settled_run_id || null,
      settled_item_id: change.settled_item_id || null,
      settled_by_user_id: change.settled_by_user_id || null,
      loan_details: change.loan_details || null,
      created_at: change.created_at || null,
      requested_by_user_id: change.requested_by_user_id || null
    })),
    updated_at: state.updated_at || null
  }
}

function serializePayrollCalendarState(state){
  return {
    workflow_type: "calendar",
    salary_type: state.salary_type,
    payday_day: state.payday_day,
    payday_month: state.payday_month,
    next_payday: state.next_payday,
    schedules: state.schedules || {},
    status: state.status || "pending",
    approvals: (state.approvals || []).map((approval) => serializeWorkflowApproval(approval)),
    updated_at: state.updated_at || null
  }
}

function buildPayrollRunAuditTarget(payrollRun){
  return {
    type: AUDIT_TARGETS.PAYROLL_RUN,
    id: String(payrollRun._id),
    label: `${payrollRun.period} ${payrollRun.salaryType}`
  }
}

async function updateWorkflowApprovalState(companyId, workflowType, approverId, nextStatus, reason){
  const currentState = workflowType === "structure"
    ? await buildPayrollStructureState(companyId)
    : await buildPayrollCalendarState(companyId)

  if(workflowType === "structure" && !(currentState.changes || []).length){
    const error = new Error("There are no payroll structure changes awaiting approval.")
    error.statusCode = 409
    error.code = "PAYROLL_STRUCTURE_EMPTY"
    throw error
  }

  const effectiveApproverId = String(approverId || "")
  const approvalIndex = currentState.approvals.findIndex((approval) => String(approval.approver_user_id || approval.approver_id || "") === effectiveApproverId)

  if(approvalIndex < 0){
    const error = new Error("Approver is not assigned to this workflow.")
    error.statusCode = 403
    error.code = "FORBIDDEN"
    throw error
  }

  const approval = currentState.approvals[approvalIndex]
  if(approval.status !== "pending"){
    return currentState
  }

  currentState.approvals[approvalIndex] = {
    ...approval,
    status: nextStatus,
    approved_at: nextStatus === "approved" ? new Date().toISOString() : null,
    rejected_at: nextStatus === "rejected" ? new Date().toISOString() : null,
    rejection_reason: nextStatus === "rejected" ? String(reason || "") : ""
  }
  currentState.status = deriveWorkflowStatus(currentState.approvals)

  return workflowType === "structure"
    ? savePayrollStructureState(companyId, currentState, effectiveApproverId)
    : savePayrollCalendarState(companyId, currentState, effectiveApproverId)
}

function handlePersistenceError(error){
  if(error?.code === 11000){
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field"
    const conflict = new Error(`Payroll ${duplicateField} must be unique within the company.`)
    conflict.statusCode = 409
    conflict.code = "PAYROLL_CONFLICT"
    return conflict
  }

  return error
}

async function listPayrollRuns(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const runs = await PayrollRun.find({
      companyId: req.params.companyId
    }).sort({ createdAt: -1 })

    const runIds = runs.map((run) => run._id)
    const departmentIds = runs.map((run) => run.departmentScopeId).filter(Boolean)

    const [itemCounts, departments] = await Promise.all([
      PayrollItem.aggregate([
        {
          $match: {
            payrollRunId: { $in: runIds }
          }
        },
        {
          $group: {
            _id: "$payrollRunId",
            count: { $sum: 1 },
            paid_count: {
              $sum: {
                $cond: [
                  { $eq: ["$signed", true] },
                  1,
                  0
                ]
              }
            },
            last_paid_at: { $max: "$paidAt" }
          }
        }
      ]),
      Department.find({
        _id: { $in: departmentIds },
        companyId: req.params.companyId
      })
    ])

    const countMap = new Map(itemCounts.map((entry) => [String(entry._id), entry]))
    const departmentMap = new Map(departments.map((department) => [String(department._id), department]))

    res.status(200).json({
      payroll_runs: runs.map((run) => serializePayrollRun(run, {
        item_count: Number(countMap.get(String(run._id))?.count || 0),
        paid_item_count: Number(countMap.get(String(run._id))?.paid_count || 0),
        unpaid_item_count: Math.max(
          0,
          Number(countMap.get(String(run._id))?.count || 0) - Number(countMap.get(String(run._id))?.paid_count || 0)
        ),
        last_paid_at: countMap.get(String(run._id))?.last_paid_at || null,
        department: run.departmentScopeId ? departmentMap.get(String(run.departmentScopeId)) || null : null
      }))
    })
  } catch (error){
    next(error)
  }
}

async function getPayrollStructure(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const payrollStructure = await buildPayrollStructureState(req.params.companyId)

    res.status(200).json({
      payroll_structure: serializePayrollStructureState(payrollStructure)
    })
  } catch (error){
    next(error)
  }
}

async function createPayrollStructureChange(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const payrollStructure = await buildPayrollStructureState(req.params.companyId)
    const approvals = resetWorkflowApprovals(await buildWorkflowApprovals(req.params.companyId, "structure"))
    const nextChange = normalizeStructureChange(req.body, String(req.currentUser._id))

    const nextState = await savePayrollStructureState(req.params.companyId, {
      ...payrollStructure,
      status: "pending",
      approvals,
      changes: [nextChange, ...(payrollStructure.changes || [])],
      requested_by_user_id: String(req.currentUser._id)
    }, req.currentUser._id)

    res.status(201).json({
      payroll_structure: serializePayrollStructureState(nextState)
    })
  } catch (error){
    next(error)
  }
}

async function deletePayrollStructureChange(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const payrollStructure = await buildPayrollStructureState(req.params.companyId)
    const nextChanges = (payrollStructure.changes || []).filter((change) => String(change.id) !== String(req.params.changeId))

    if(nextChanges.length === (payrollStructure.changes || []).length){
      return res.status(404).json({
        error: {
          code: "PAYROLL_STRUCTURE_CHANGE_NOT_FOUND",
          message: "Payroll structure change was not found."
        }
      })
    }

    const approvals = resetWorkflowApprovals(await buildWorkflowApprovals(req.params.companyId, "structure"))
    const nextState = await savePayrollStructureState(req.params.companyId, {
      ...payrollStructure,
      status: "pending",
      approvals,
      changes: nextChanges,
      requested_by_user_id: String(req.currentUser._id)
    }, req.currentUser._id)

    res.status(200).json({
      payroll_structure: serializePayrollStructureState(nextState)
    })
  } catch (error){
    next(error)
  }
}

async function approvePayrollStructure(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const beforeState = serializePayrollStructureState(await buildPayrollStructureState(req.params.companyId))
    const updatedState = await updateWorkflowApprovalState(
      req.params.companyId,
      "structure",
      req.body?.approver_id || req.currentUser._id,
      "approved"
    )
    await syncApprovedStructureLoansToEmployees(req.params.companyId, updatedState)
    const approvedPayrollStructure = serializePayrollStructureState(updatedState)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.PAYROLL_STRUCTURE_APPROVED,
      target: {
        type: AUDIT_TARGETS.PAYROLL_STRUCTURE,
        id: req.params.companyId,
        label: company.name
      },
      before: beforeState,
      after: approvedPayrollStructure
    })

    res.status(200).json({
      payroll_structure: approvedPayrollStructure
    })
  } catch (error){
    next(error)
  }
}

async function rejectPayrollStructure(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const beforeState = serializePayrollStructureState(await buildPayrollStructureState(req.params.companyId))
    const updatedState = await updateWorkflowApprovalState(
      req.params.companyId,
      "structure",
      req.body?.approver_id || req.currentUser._id,
      "rejected",
      req.body?.reason || ""
    )
    const rejectedPayrollStructure = serializePayrollStructureState(updatedState)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.PAYROLL_STRUCTURE_REJECTED,
      target: {
        type: AUDIT_TARGETS.PAYROLL_STRUCTURE,
        id: req.params.companyId,
        label: company.name
      },
      before: beforeState,
      after: rejectedPayrollStructure,
      metadata: {
        rejection_reason: req.body?.reason || ""
      }
    })

    res.status(200).json({
      payroll_structure: rejectedPayrollStructure
    })
  } catch (error){
    next(error)
  }
}

async function resetPayrollStructure(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const currentState = await buildPayrollStructureState(req.params.companyId)
    const approvals = resetWorkflowApprovals(await buildWorkflowApprovals(req.params.companyId, "structure"))
    const nextState = await savePayrollStructureState(req.params.companyId, {
      ...currentState,
      approvals,
      status: "pending"
    }, req.currentUser._id)

    res.status(200).json({
      payroll_structure: serializePayrollStructureState(nextState)
    })
  } catch (error){
    next(error)
  }
}

async function getPayrollCalendar(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const payrollCalendar = await buildPayrollCalendarState(req.params.companyId)

    res.status(200).json({
      payroll_calendar: serializePayrollCalendarState(payrollCalendar)
    })
  } catch (error){
    next(error)
  }
}

async function updatePayrollCalendar(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const currentState = await buildPayrollCalendarState(req.params.companyId)
    const beforePayrollCalendar = serializePayrollCalendarState(currentState)
    const approvals = resetWorkflowApprovals(await buildWorkflowApprovals(req.params.companyId, "calendar"))
    const nextState = await savePayrollCalendarState(req.params.companyId, {
      ...currentState,
      salary_type: req.body?.salary_type || currentState.salary_type,
      payday_day: req.body?.payday_day || currentState.payday_day,
      payday_month: req.body?.payday_month || currentState.payday_month,
      approvals,
      status: "pending",
      requested_by_user_id: String(req.currentUser._id)
    }, req.currentUser._id)
    const updatedPayrollCalendar = serializePayrollCalendarState(nextState)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.SETTINGS_UPDATED,
      target: {
        type: AUDIT_TARGETS.SETTINGS,
        id: req.params.companyId,
        label: `${company.name} payroll calendar`
      },
      before: beforePayrollCalendar,
      after: updatedPayrollCalendar,
      metadata: {
        setting_key: "payroll_calendar"
      }
    })

    res.status(200).json({
      payroll_calendar: updatedPayrollCalendar
    })
  } catch (error){
    next(error)
  }
}

async function approvePayrollCalendar(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const beforeState = serializePayrollCalendarState(await buildPayrollCalendarState(req.params.companyId))
    const updatedState = await updateWorkflowApprovalState(
      req.params.companyId,
      "calendar",
      req.body?.approver_id || req.currentUser._id,
      "approved"
    )
    const approvedPayrollCalendar = serializePayrollCalendarState(updatedState)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.PAYROLL_CALENDAR_APPROVED,
      target: {
        type: AUDIT_TARGETS.PAYROLL_CALENDAR,
        id: req.params.companyId,
        label: company.name
      },
      before: beforeState,
      after: approvedPayrollCalendar
    })

    res.status(200).json({
      payroll_calendar: approvedPayrollCalendar
    })
  } catch (error){
    next(error)
  }
}

async function rejectPayrollCalendar(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const beforeState = serializePayrollCalendarState(await buildPayrollCalendarState(req.params.companyId))
    const updatedState = await updateWorkflowApprovalState(
      req.params.companyId,
      "calendar",
      req.body?.approver_id || req.currentUser._id,
      "rejected",
      req.body?.reason || ""
    )
    const rejectedPayrollCalendar = serializePayrollCalendarState(updatedState)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.PAYROLL_CALENDAR_REJECTED,
      target: {
        type: AUDIT_TARGETS.PAYROLL_CALENDAR,
        id: req.params.companyId,
        label: company.name
      },
      before: beforeState,
      after: rejectedPayrollCalendar,
      metadata: {
        rejection_reason: req.body?.reason || ""
      }
    })

    res.status(200).json({
      payroll_calendar: rejectedPayrollCalendar
    })
  } catch (error){
    next(error)
  }
}

async function resetPayrollCalendar(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const currentState = await buildPayrollCalendarState(req.params.companyId)
    const approvals = resetWorkflowApprovals(await buildWorkflowApprovals(req.params.companyId, "calendar"))
    const nextState = await savePayrollCalendarState(req.params.companyId, {
      ...currentState,
      approvals,
      status: "pending"
    }, req.currentUser._id)

    res.status(200).json({
      payroll_calendar: serializePayrollCalendarState(nextState)
    })
  } catch (error){
    next(error)
  }
}

async function createPayrollRun(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    let department = null
    if(req.body.department_scope_id){
      department = await getActiveDepartment(req.params.companyId, req.body.department_scope_id)

      if(!department){
        return res.status(404).json({
          error: {
            code: "DEPARTMENT_NOT_FOUND",
            message: "Department was not found for this company."
          }
        })
      }

    }

    const payrollRun = await PayrollRun.create({
      companyId: req.params.companyId,
      departmentScopeId: req.body.department_scope_id || null,
      generatedByUserId: req.currentUser._id,
      period: req.body.period,
      salaryType: req.body.salary_type,
      currencyCode: req.body.currency_code || company.currencyCode,
      status: "draft"
    })

    res.status(201).json({
      payroll_run: serializePayrollRun(payrollRun, {
        item_count: 0,
        paid_item_count: 0,
        unpaid_item_count: 0,
        last_paid_at: null,
        department
      })
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function getPayrollRun(req, res, next){
  try{
    const payrollRun = await getPayrollRunForCompany(req.params.companyId, req.params.runId)

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    const [department, runItems] = await Promise.all([
      payrollRun.departmentScopeId
        ? getActiveDepartment(req.params.companyId, payrollRun.departmentScopeId)
        : Promise.resolve(null),
      PayrollItem.find({ payrollRunId: payrollRun._id }).select({ signed: 1, paidAt: 1 })
    ])
    const paymentSummary = calculatePayrollPaymentSummary(runItems)

    res.status(200).json({
      payroll_run: serializePayrollRun(payrollRun, {
        item_count: paymentSummary.itemCount,
        paid_item_count: paymentSummary.paidItemCount,
        unpaid_item_count: paymentSummary.unpaidItemCount,
        last_paid_at: paymentSummary.lastPaidAt,
        department
      })
    })
  } catch (error){
    next(error)
  }
}

async function generatePayrollRun(req, res, next){
  try{
    const payrollRun = await getPayrollRunForCompany(req.params.companyId, req.params.runId)

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    const department = payrollRun.departmentScopeId
      ? await getActiveDepartment(req.params.companyId, payrollRun.departmentScopeId)
      : null
    const paidItemCount = await PayrollItem.countDocuments({
      payrollRunId: payrollRun._id,
      signed: true
    })

    if(paidItemCount > 0){
      return res.status(409).json({
        error: {
          code: "PAYROLL_RUN_HAS_PAID_ITEMS",
          message: "Payroll runs with paid items cannot be regenerated."
        }
      })
    }

    const beforePayrollRun = serializePayrollRun(payrollRun, { department })
    const generationAction = payrollRun.status === "draft"
      ? AUDIT_ACTIONS.PAYROLL_GENERATED
      : AUDIT_ACTIONS.PAYROLL_REGENERATED
    const periodRange = getPeriodRange(payrollRun.period, payrollRun.salaryType)
    if(!periodRange){
      return res.status(400).json({
        error: {
          code: "INVALID_PAYROLL_PERIOD",
          message: "Payroll period format does not match the selected salary type."
        }
      })
    }

    const employees = await getRunEmployees(payrollRun)
    const [attendanceCounts, approvedStructureState, financialRuleContext, reservedStructureChangeKeys] = await Promise.all([
      getApprovedAttendanceCounts(payrollRun, employees),
      getApprovedPayrollStructureState(req.params.companyId),
      getActiveFinancialRulesForRun(payrollRun),
      getReservedStructureChangeKeys(req.params.companyId, payrollRun._id)
    ])

    await PayrollItem.deleteMany({ payrollRunId: payrollRun._id })

    const itemPayloads = employees.map((employee) => buildPayrollItemPayload(
      payrollRun,
      employee,
      attendanceCounts.get(String(employee._id)) || 0,
      approvedStructureState,
      financialRuleContext,
      reservedStructureChangeKeys
    ))

    const payrollItems = itemPayloads.length
      ? await PayrollItem.insertMany(itemPayloads)
      : []

    const totals = calculateRunTotals(payrollItems)
    payrollRun.totals = totals
    payrollRun.status = "pending_approval"
    payrollRun.generatedAt = new Date()
    payrollRun.approvedAt = null
    payrollRun.rejectedAt = null
    payrollRun.approval = {
      approverUserId: null,
      rejectionReason: ""
    }
    await payrollRun.save()

    const generatedPayrollRun = serializePayrollRun(payrollRun, {
      item_count: payrollItems.length,
      paid_item_count: 0,
      unpaid_item_count: payrollItems.length,
      last_paid_at: null,
      department
    })
    const hydratedPayrollItems = await hydratePayrollItems(req.params.companyId, payrollItems)

    await recordAuditEvent({
      req,
      action: generationAction,
      target: buildPayrollRunAuditTarget(payrollRun),
      before: beforePayrollRun,
      after: generatedPayrollRun,
      metadata: {
        item_count: payrollItems.length,
        employee_count: employees.length
      }
    })

    res.status(200).json({
      payroll_run: generatedPayrollRun,
      payroll_items: hydratedPayrollItems
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function approvePayrollRun(req, res, next){
  try{
    const payrollRun = await getPayrollRunForCompany(req.params.companyId, req.params.runId)

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    if(payrollRun.status === "approved"){
      return res.status(409).json({
        error: {
          code: "PAYROLL_RUN_ALREADY_APPROVED",
          message: "Payroll run has already been approved."
        }
      })
    }

    if(payrollRun.status === "draft"){
      return res.status(409).json({
        error: {
          code: "PAYROLL_RUN_NOT_GENERATED",
          message: "Payroll run must be generated before it can be approved."
        }
      })
    }

    const department = payrollRun.departmentScopeId
      ? await getActiveDepartment(req.params.companyId, payrollRun.departmentScopeId)
      : null
    const beforePayrollRun = serializePayrollRun(payrollRun, { department })
    payrollRun.status = "approved"
    payrollRun.approvedAt = new Date()
    payrollRun.rejectedAt = null
    payrollRun.approval = {
      approverUserId: req.currentUser._id,
      rejectionReason: ""
    }
    await payrollRun.save()

    await PayrollItem.updateMany(
      { payrollRunId: payrollRun._id },
      { $set: { approvalStatus: "approved" } }
    )

    const itemCount = await PayrollItem.countDocuments({ payrollRunId: payrollRun._id })
    const approvedPayrollRun = serializePayrollRun(payrollRun, {
      item_count: itemCount,
      department
    })

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.PAYROLL_APPROVED,
      target: buildPayrollRunAuditTarget(payrollRun),
      before: beforePayrollRun,
      after: approvedPayrollRun,
      metadata: {
        item_count: itemCount
      }
    })

    res.status(200).json({
      payroll_run: approvedPayrollRun
    })
  } catch (error){
    next(error)
  }
}

async function rejectPayrollRun(req, res, next){
  try{
    const payrollRun = await getPayrollRunForCompany(req.params.companyId, req.params.runId)

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    if(payrollRun.status === "rejected"){
      return res.status(409).json({
        error: {
          code: "PAYROLL_RUN_ALREADY_REJECTED",
          message: "Payroll run has already been rejected."
        }
      })
    }

    if(payrollRun.status === "draft"){
      return res.status(409).json({
        error: {
          code: "PAYROLL_RUN_NOT_GENERATED",
          message: "Payroll run must be generated before it can be rejected."
        }
      })
    }

    const department = payrollRun.departmentScopeId
      ? await getActiveDepartment(req.params.companyId, payrollRun.departmentScopeId)
      : null
    const beforePayrollRun = serializePayrollRun(payrollRun, { department })
    payrollRun.status = "rejected"
    payrollRun.approvedAt = null
    payrollRun.rejectedAt = new Date()
    payrollRun.approval = {
      approverUserId: req.currentUser._id,
      rejectionReason: req.body?.reason || ""
    }
    await payrollRun.save()

    await PayrollItem.updateMany(
      { payrollRunId: payrollRun._id },
      { $set: { approvalStatus: "hold" } }
    )

    const itemCount = await PayrollItem.countDocuments({ payrollRunId: payrollRun._id })
    const rejectedPayrollRun = serializePayrollRun(payrollRun, {
      item_count: itemCount,
      department
    })

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.PAYROLL_REJECTED,
      target: buildPayrollRunAuditTarget(payrollRun),
      before: beforePayrollRun,
      after: rejectedPayrollRun,
      metadata: {
        item_count: itemCount,
        rejection_reason: req.body?.reason || ""
      }
    })

    res.status(200).json({
      payroll_run: rejectedPayrollRun
    })
  } catch (error){
    next(error)
  }
}

async function listPayrollItems(req, res, next){
  try{
    const payrollRun = await getPayrollRunForCompany(req.params.companyId, req.params.runId)

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    const payrollItems = await PayrollItem.find({
      payrollRunId: payrollRun._id
    }).sort({ createdAt: 1 })

    res.status(200).json({
      payroll_items: await hydratePayrollItems(req.params.companyId, payrollItems)
    })
  } catch (error){
    next(error)
  }
}

async function updatePayrollItem(req, res, next){
  try{
    const payrollRun = await getPayrollRunForCompany(req.params.companyId, req.params.runId)

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    const payrollItem = await PayrollItem.findOne({
      _id: req.params.itemId,
      payrollRunId: payrollRun._id,
      companyId: req.params.companyId
    })

    if(!payrollItem){
      return res.status(404).json({
        error: {
          code: "PAYROLL_ITEM_NOT_FOUND",
          message: "Payroll item was not found."
        }
      })
    }

    const beforePayrollRun = serializePayrollRun(payrollRun)
    const wasPaid = Boolean(payrollItem.signed)

    if(Object.prototype.hasOwnProperty.call(req.body, "allowances_total")){
      payrollItem.allowancesTotal = req.body.allowances_total
    }
    if(Object.prototype.hasOwnProperty.call(req.body, "deductions_total")){
      payrollItem.deductionsTotal = req.body.deductions_total
    }
    if(Object.prototype.hasOwnProperty.call(req.body, "approval_status")){
      payrollItem.approvalStatus = req.body.approval_status
    }
    if(Object.prototype.hasOwnProperty.call(req.body, "signed")){
      payrollItem.signed = req.body.signed
    }
    if(Object.prototype.hasOwnProperty.call(req.body, "paid")){
      payrollItem.signed = Boolean(req.body.paid)
      payrollItem.paidAt = payrollItem.signed
        ? (req.body.paid_at ? new Date(req.body.paid_at) : new Date())
        : null
      payrollItem.paidByUserId = payrollItem.signed
        ? (req.currentUser?._id || payrollItem.paidByUserId || null)
        : null
    } else if(Object.prototype.hasOwnProperty.call(req.body, "signed")){
      payrollItem.paidAt = payrollItem.signed ? (payrollItem.paidAt || new Date()) : null
      payrollItem.paidByUserId = payrollItem.signed
        ? (payrollItem.paidByUserId || req.currentUser?._id || null)
        : null
    }

    payrollItem.netPay = Number((
      payrollItem.baseSalary +
      payrollItem.allowancesTotal -
      payrollItem.deductionsTotal
    ).toFixed(2))

    await payrollItem.save()

    const [employee, department] = await Promise.all([
      Employee.findOne({ _id: payrollItem.employeeId, companyId: req.params.companyId }),
      payrollItem.departmentId
        ? Department.findOne({ _id: payrollItem.departmentId, companyId: req.params.companyId })
        : Promise.resolve(null)
    ])

    if(!wasPaid && payrollItem.signed){
      const oneTimeSettledChangeIds = (approvedStructureChangeIds => approvedStructureChangeIds.filter(Boolean))(
        [
          ...collectStructureChangeIdsFromEntries(payrollItem.allowanceBreakdown || []),
          ...collectStructureChangeIdsFromEntries((payrollItem.deductionBreakdown || []).filter((entry) => String(entry.sourceType || "").trim().toLowerCase() !== "employee_loan"))
        ]
      )

      await updateStructureStateForSettledChanges(
        req.params.companyId,
        oneTimeSettledChangeIds,
        payrollRun,
        payrollItem,
        req.currentUser?._id || null
      )

      if(employee){
        await updateLoanProgressAfterPayrollPayment(
          req.params.companyId,
          employee,
          payrollItem,
          payrollRun,
          req.currentUser?._id || null
        )
      }
    }

    const runItems = await PayrollItem.find({ payrollRunId: payrollRun._id })
    payrollRun.totals = calculateRunTotals(runItems)
    const paymentSummary = calculatePayrollPaymentSummary(runItems)
    if(paymentSummary.itemCount > 0 && paymentSummary.unpaidItemCount === 0){
      payrollRun.status = "posted"
    } else if(payrollRun.status === "posted"){
      payrollRun.status = payrollRun.approvedAt ? "approved" : "pending_approval"
    }
    await payrollRun.save()

    res.status(200).json({
      payroll_item: serializePayrollItem(payrollItem, {
        employee,
        department
      }),
      payroll_run: serializePayrollRun(payrollRun, {
        item_count: runItems.length,
        paid_item_count: paymentSummary.paidItemCount,
        unpaid_item_count: paymentSummary.unpaidItemCount,
        last_paid_at: paymentSummary.lastPaidAt,
        department: payrollRun.departmentScopeId
          ? await getActiveDepartment(req.params.companyId, payrollRun.departmentScopeId)
          : null
      })
    })

    if(beforePayrollRun.status !== payrollRun.status && payrollRun.status === "posted"){
      await recordAuditEvent({
        req,
        action: AUDIT_ACTIONS.PAYROLL_POSTED,
        target: buildPayrollRunAuditTarget(payrollRun),
        before: beforePayrollRun,
        after: serializePayrollRun(payrollRun, {
          item_count: runItems.length,
          paid_item_count: paymentSummary.paidItemCount,
          unpaid_item_count: paymentSummary.unpaidItemCount,
          last_paid_at: paymentSummary.lastPaidAt,
          department: payrollRun.departmentScopeId
            ? await getActiveDepartment(req.params.companyId, payrollRun.departmentScopeId)
            : null
        }),
        metadata: {
          paid_item_count: paymentSummary.paidItemCount
        }
      })
    }
  } catch (error){
    next(handlePersistenceError(error))
  }
}

module.exports = {
  getPayrollStructure,
  createPayrollStructureChange,
  deletePayrollStructureChange,
  approvePayrollStructure,
  rejectPayrollStructure,
  resetPayrollStructure,
  getPayrollCalendar,
  updatePayrollCalendar,
  approvePayrollCalendar,
  rejectPayrollCalendar,
  resetPayrollCalendar,
  listPayrollRuns,
  createPayrollRun,
  getPayrollRun,
  generatePayrollRun,
  approvePayrollRun,
  rejectPayrollRun,
  listPayrollItems,
  updatePayrollItem,
  __test: {
    getStructureChangeSettlementMode,
    isStructureChangeSettled,
    calculateStructureAdjustmentsForEmployee,
    buildUpdatedLoanProfileAfterPayment
  }
}
