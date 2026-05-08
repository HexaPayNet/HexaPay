const bcrypt = require("bcrypt")
const crypto = require("crypto")
const mongoose = require("mongoose")

const env = require("../config/env")
const AttendanceLog = require("../models/AttendanceLog")
const CompanyMembership = require("../models/CompanyMembership")
const CompanySetting = require("../models/CompanySetting")
const Contract = require("../models/Contract")
const Department = require("../models/Department")
const Employee = require("../models/Employee")
const FinancialRule = require("../models/FinancialRule")
const Holiday = require("../models/Holiday")
const LeaveRequest = require("../models/LeaveRequest")
const PayrollItem = require("../models/PayrollItem")
const PayrollRun = require("../models/PayrollRun")
const User = require("../models/User")
const { normalizeMembershipRole } = require("../utils/auth")

function createBackupWorkflowError(code, message, statusCode = 400, details = undefined){
  const error = new Error(message)
  error.code = code
  error.statusCode = statusCode
  if(details !== undefined){
    error.details = details
  }
  return error
}

function isPlainObject(value){
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function toObjectId(value, fallback = null){
  if(!value){
    return fallback
  }

  return mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : fallback
}

function toDateOrNull(value){
  if(!value){
    return null
  }

  const parsedDate = value instanceof Date
    ? new Date(value.getTime())
    : new Date(value)

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate
}

function toNumber(value, fallback = 0){
  const normalizedValue = Number(value)
  return Number.isFinite(normalizedValue)
    ? normalizedValue
    : fallback
}

function toBoolean(value){
  return value === true
}

function toStringOrEmpty(value){
  return value === undefined || value === null
    ? ""
    : String(value).trim()
}

function normalizeArray(value){
  return Array.isArray(value)
    ? value
    : []
}

function normalizeApprovalRecord(value){
  if(!isPlainObject(value)){
    return null
  }

  return {
    approver_user_id: value.approver_user_id || value.approverUserId || value.user_id || value.userId || null,
    approved_at: value.approved_at || value.approvedAt || null,
    rejected_at: value.rejected_at || value.rejectedAt || null,
    rejection_reason: value.rejection_reason || value.rejectionReason || ""
  }
}

function serializeApprovalForBackup(approval){
  if(!approval || !isPlainObject(approval)){
    return null
  }

  const serializedApproval = {
    approver_user_id: approval.approverUserId ? String(approval.approverUserId) : null,
    approved_at: approval.approvedAt || null,
    rejected_at: approval.rejectedAt || null,
    rejection_reason: approval.rejectionReason || ""
  }

  return serializedApproval.approver_user_id ||
    serializedApproval.approved_at ||
    serializedApproval.rejected_at ||
    serializedApproval.rejection_reason
    ? serializedApproval
    : null
}

function serializeMembershipForBackup(membership){
  return {
    id: String(membership._id),
    company_id: String(membership.companyId),
    user_id: String(membership.userId),
    invited_by_user_id: membership.invitedByUserId ? String(membership.invitedByUserId) : null,
    role: membership.role,
    status: membership.status,
    joined_at: membership.joinedAt,
    created_at: membership.createdAt,
    updated_at: membership.updatedAt
  }
}

function serializeUserForBackup(user){
  return {
    id: String(user._id),
    email: user.email,
    display_name: user.displayName,
    title: user.title || "",
    avatar_url: user.avatarUrl || "",
    status: user.status,
    password_hash: user.passwordHash || "",
    token_version: Number(user.tokenVersion || 0),
    last_login_at: user.lastLoginAt || null,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  }
}

function serializeEmployeeForBackup(employee){
  return {
    id: String(employee._id),
    company_id: String(employee.companyId),
    department_id: employee.departmentId ? String(employee.departmentId) : null,
    employee_number: employee.employeeNumber,
    full_name: employee.fullName,
    identification_number: employee.identificationNumber,
    account_number: employee.accountNumber,
    account_details: employee.accountDetails,
    role_title: employee.roleTitle,
    employment_type: employee.employmentType,
    payment_type: employee.paymentType,
    payment_basis: employee.paymentBasis,
    employment_date: employee.employmentDate,
    salary_amount: employee.salaryAmount,
    salary_currency: employee.salaryCurrency,
    status: employee.status,
    payroll_status: employee.payrollStatus,
    profile_image_url: employee.profileImageUrl,
    financial_profile: employee.financialProfile || {},
    created_at: employee.createdAt,
    updated_at: employee.updatedAt
  }
}

function serializeDepartmentForBackup(department){
  return {
    id: String(department._id),
    company_id: String(department.companyId),
    name: department.name,
    salary_type: department.salaryType,
    default_salary_amount: department.defaultSalaryAmount,
    default_salary_currency: department.defaultSalaryCurrency,
    hod_employee_id: department.hodEmployeeId ? String(department.hodEmployeeId) : null,
    icon_key: department.iconKey,
    notes: department.notes,
    status: department.status,
    created_at: department.createdAt,
    updated_at: department.updatedAt
  }
}

function serializeContractForBackup(contract){
  return {
    id: String(contract._id),
    company_id: String(contract.companyId),
    employee_id: contract.employeeId ? String(contract.employeeId) : null,
    contract_number: contract.contractNumber,
    name: contract.name,
    role_title: contract.roleTitle,
    contract_type: contract.contractType,
    start_date: contract.startDate,
    end_date: contract.endDate,
    payment_amount: contract.paymentAmount,
    currency_code: contract.currencyCode,
    status: contract.status,
    notes: contract.notes,
    created_at: contract.createdAt,
    updated_at: contract.updatedAt
  }
}

function serializeAttendanceLogForBackup(log){
  return {
    id: String(log._id),
    company_id: String(log.companyId),
    employee_id: String(log.employeeId),
    date: log.date,
    check_in: log.checkIn,
    check_out: log.checkOut,
    mode: log.mode,
    worked_hours: log.workedHours,
    approval_status: log.approvalStatus,
    approval: serializeApprovalForBackup(log.approval),
    created_by_user_id: log.createdByUserId ? String(log.createdByUserId) : null,
    created_at: log.createdAt,
    updated_at: log.updatedAt
  }
}

function serializeLeaveRequestForBackup(request){
  return {
    id: String(request._id),
    company_id: String(request.companyId),
    employee_id: String(request.employeeId),
    leave_type: request.leaveType,
    from_date: request.fromDate,
    to_date: request.toDate,
    requested_date: request.requestedDate,
    status: request.status,
    reason: request.reason,
    approval: serializeApprovalForBackup(request.approval),
    created_by_user_id: request.createdByUserId ? String(request.createdByUserId) : null,
    created_at: request.createdAt,
    updated_at: request.updatedAt
  }
}

function serializeHolidayForBackup(holiday){
  return {
    id: String(holiday._id),
    company_id: holiday.companyId ? String(holiday.companyId) : null,
    scope: holiday.scope,
    name: holiday.name,
    date: holiday.date,
    country_code: holiday.countryCode,
    status: holiday.status,
    created_at: holiday.createdAt,
    updated_at: holiday.updatedAt
  }
}

function serializePayrollRunForBackup(run){
  return {
    id: String(run._id),
    company_id: String(run.companyId),
    period: run.period,
    salary_type: run.salaryType,
    department_scope_id: run.departmentScopeId ? String(run.departmentScopeId) : null,
    currency_code: run.currencyCode,
    status: run.status,
    totals: run.totals || {},
    approval: serializeApprovalForBackup(run.approval),
    generated_by_user_id: run.generatedByUserId ? String(run.generatedByUserId) : null,
    generated_at: run.generatedAt,
    approved_at: run.approvedAt,
    rejected_at: run.rejectedAt,
    created_at: run.createdAt,
    updated_at: run.updatedAt
  }
}

function serializePayrollItemForBackup(item){
  return {
    id: String(item._id),
    payroll_run_id: String(item.payrollRunId),
    company_id: String(item.companyId),
    employee_id: String(item.employeeId),
    department_id: item.departmentId ? String(item.departmentId) : null,
    base_salary: item.baseSalary,
    gross_pay: item.grossPay,
    taxable_pay: item.taxablePay,
    paye_taxable_base: item.payeTaxableBase,
    allowances_total: item.allowancesTotal,
    deductions_total: item.deductionsTotal,
    structure_allowances_total: item.structureAllowancesTotal,
    financial_rule_allowances_total: item.financialRuleAllowancesTotal,
    structure_deductions_total: item.structureDeductionsTotal,
    statutory_deductions_total: item.statutoryDeductionsTotal,
    financial_rule_deductions_total: item.financialRuleDeductionsTotal,
    loan_deductions_total: item.loanDeductionsTotal,
    net_pay: item.netPay,
    attendance_days: item.attendanceDays,
    approval_status: item.approvalStatus,
    signed: item.signed,
    paid_at: item.paidAt || null,
    paid_by_user_id: item.paidByUserId ? String(item.paidByUserId) : null,
    allowance_breakdown: item.allowanceBreakdown || [],
    deduction_breakdown: item.deductionBreakdown || [],
    created_at: item.createdAt,
    updated_at: item.updatedAt
  }
}

function serializeFinancialRuleForBackup(rule){
  return {
    id: String(rule._id),
    company_id: String(rule.companyId),
    rule_type: rule.ruleType,
    name: rule.name,
    value_type: rule.valueType,
    value: rule.value,
    taxable: rule.taxable !== false,
    income_category: rule.incomeCategory || "other_taxable_income",
    scope: rule.scope,
    target_type: rule.targetType,
    target_id: rule.targetId ? String(rule.targetId) : null,
    status: rule.status,
    effective_from: rule.effectiveFrom,
    effective_to: rule.effectiveTo,
    created_at: rule.createdAt,
    updated_at: rule.updatedAt
  }
}

function serializeCompanySettingForBackup(setting){
  return {
    id: String(setting._id),
    company_id: String(setting.companyId),
    key: setting.key,
    value_json: setting.valueJson || {},
    updated_by_user_id: setting.updatedByUserId ? String(setting.updatedByUserId) : null,
    created_at: setting.createdAt,
    updated_at: setting.updatedAt
  }
}

async function collectCompanyBackupSnapshot(companyId){
  const [
    memberships,
    employees,
    departments,
    contracts,
    attendanceLogs,
    leaveRequests,
    holidays,
    payrollRuns,
    payrollItems,
    financialRules,
    companySettings
  ] = await Promise.all([
    CompanyMembership.find({ companyId }).lean(),
    Employee.find({ companyId }).lean(),
    Department.find({ companyId }).lean(),
    Contract.find({ companyId }).lean(),
    AttendanceLog.find({ companyId }).lean(),
    LeaveRequest.find({ companyId }).lean(),
    Holiday.find({ companyId }).lean(),
    PayrollRun.find({ companyId }).lean(),
    PayrollItem.find({ companyId }).lean(),
    FinancialRule.find({ companyId }).lean(),
    CompanySetting.find({ companyId }).lean()
  ])

  const referencedUserIds = [...new Set(memberships
    .flatMap((membership) => [membership.userId, membership.invitedByUserId])
    .concat(attendanceLogs.map((log) => log.createdByUserId))
    .concat(attendanceLogs.map((log) => log.approval?.approverUserId))
    .concat(leaveRequests.map((request) => request.createdByUserId))
    .concat(leaveRequests.map((request) => request.approval?.approverUserId))
    .concat(payrollRuns.map((run) => run.generatedByUserId))
    .concat(payrollRuns.map((run) => run.approval?.approverUserId))
    .concat(payrollItems.map((item) => item.paidByUserId))
    .concat(companySettings.map((setting) => setting.updatedByUserId))
    .filter(Boolean)
    .map((userId) => String(userId)))]

  const users = referencedUserIds.length
    ? await User.find({
        _id: { $in: referencedUserIds }
      }).select("+passwordHash +tokenVersion").lean()
    : []

  return {
    users,
    memberships,
    employees,
    departments,
    contracts,
    attendanceLogs,
    leaveRequests,
    holidays,
    payrollRuns,
    payrollItems,
    financialRules,
    companySettings
  }
}

async function buildCompanyBackupPayload(company){
  const snapshot = await collectCompanyBackupSnapshot(company._id)

  return {
    meta: {
      exported_at: new Date().toISOString(),
      format: "hexa-json",
      version: 2
    },
    company: {
      id: String(company._id),
      name: company.name,
      industry: company.industry,
      email: company.email,
      currency_code: company.currencyCode,
      country_code: company.countryCode,
      timezone: company.timezone,
      logo_url: company.logoUrl,
      status: company.status,
      created_at: company.createdAt,
      updated_at: company.updatedAt
    },
    users: snapshot.users.map(serializeUserForBackup),
    memberships: snapshot.memberships.map(serializeMembershipForBackup),
    employees: snapshot.employees.map(serializeEmployeeForBackup),
    departments: snapshot.departments.map(serializeDepartmentForBackup),
    contracts: snapshot.contracts.map(serializeContractForBackup),
    attendance_logs: snapshot.attendanceLogs.map(serializeAttendanceLogForBackup),
    leave_requests: snapshot.leaveRequests.map(serializeLeaveRequestForBackup),
    holidays: snapshot.holidays.map(serializeHolidayForBackup),
    payroll_runs: snapshot.payrollRuns.map(serializePayrollRunForBackup),
    payroll_items: snapshot.payrollItems.map(serializePayrollItemForBackup),
    financial_rules: snapshot.financialRules.map(serializeFinancialRuleForBackup),
    company_settings: snapshot.companySettings.map(serializeCompanySettingForBackup)
  }
}

function getBackupPayloadRecordCounts(backupPayload){
  return {
    users: normalizeArray(backupPayload?.users).length,
    memberships: normalizeArray(backupPayload?.memberships).length,
    employees: normalizeArray(backupPayload?.employees).length,
    departments: normalizeArray(backupPayload?.departments).length,
    contracts: normalizeArray(backupPayload?.contracts).length,
    attendance_logs: normalizeArray(backupPayload?.attendance_logs).length,
    leave_requests: normalizeArray(backupPayload?.leave_requests).length,
    holidays: normalizeArray(backupPayload?.holidays).length,
    payroll_runs: normalizeArray(backupPayload?.payroll_runs).length,
    payroll_items: normalizeArray(backupPayload?.payroll_items).length,
    financial_rules: normalizeArray(backupPayload?.financial_rules).length,
    company_settings: normalizeArray(backupPayload?.company_settings).length
  }
}

function normalizeBackupPayload(rawPayload){
  if(!isPlainObject(rawPayload)){
    throw createBackupWorkflowError("BACKUP_INVALID", "Backup data must be a JSON object.", 422)
  }

  if(!isPlainObject(rawPayload.company)){
    throw createBackupWorkflowError("BACKUP_COMPANY_MISSING", "Backup data is missing the company profile.", 422)
  }

  const normalizedPayload = {
    meta: {
      exported_at: rawPayload.meta?.exported_at || rawPayload.meta?.exportedAt || null,
      format: rawPayload.meta?.format || "hexa-json",
      version: Number(rawPayload.meta?.version || 1)
    },
    company: {
      id: rawPayload.company.id || null,
      name: toStringOrEmpty(rawPayload.company.name),
      industry: toStringOrEmpty(rawPayload.company.industry),
      email: toStringOrEmpty(rawPayload.company.email).toLowerCase(),
      currency_code: toStringOrEmpty(rawPayload.company.currency_code || rawPayload.company.currencyCode || "KES").toUpperCase(),
      country_code: toStringOrEmpty(rawPayload.company.country_code || rawPayload.company.countryCode || "KE").toUpperCase(),
      timezone: toStringOrEmpty(rawPayload.company.timezone || "Africa/Nairobi"),
      logo_url: toStringOrEmpty(rawPayload.company.logo_url || rawPayload.company.logoUrl),
      status: toStringOrEmpty(rawPayload.company.status || "active") || "active",
      created_at: rawPayload.company.created_at || rawPayload.company.createdAt || null,
      updated_at: rawPayload.company.updated_at || rawPayload.company.updatedAt || null
    },
    users: normalizeArray(rawPayload.users).map((user) => ({
      id: user.id || null,
      email: toStringOrEmpty(user.email).toLowerCase(),
      display_name: toStringOrEmpty(user.display_name || user.displayName),
      title: toStringOrEmpty(user.title),
      avatar_url: toStringOrEmpty(user.avatar_url || user.avatarUrl),
      status: toStringOrEmpty(user.status || "active") || "active",
      password_hash: toStringOrEmpty(user.password_hash || user.passwordHash),
      token_version: toNumber(user.token_version ?? user.tokenVersion, 0),
      last_login_at: user.last_login_at || user.lastLoginAt || null,
      created_at: user.created_at || user.createdAt || null,
      updated_at: user.updated_at || user.updatedAt || null
    })),
    memberships: normalizeArray(rawPayload.memberships).map((membership) => ({
      id: membership.id || null,
      company_id: membership.company_id || membership.companyId || null,
      user_id: membership.user_id || membership.userId || null,
      invited_by_user_id: membership.invited_by_user_id || membership.invitedByUserId || null,
      role: normalizeMembershipRole(membership.role),
      status: toStringOrEmpty(membership.status || "active") || "active",
      joined_at: membership.joined_at || membership.joinedAt || null,
      created_at: membership.created_at || membership.createdAt || null,
      updated_at: membership.updated_at || membership.updatedAt || null
    })),
    departments: normalizeArray(rawPayload.departments).map((department) => ({
      id: department.id || null,
      name: toStringOrEmpty(department.name),
      salary_type: toStringOrEmpty(department.salary_type || department.salaryType || "monthly") || "monthly",
      default_salary_amount: toNumber(department.default_salary_amount ?? department.defaultSalaryAmount, 0),
      default_salary_currency: toStringOrEmpty(department.default_salary_currency || department.defaultSalaryCurrency || "KES").toUpperCase(),
      hod_employee_id: department.hod_employee_id || department.hodEmployeeId || null,
      icon_key: toStringOrEmpty(department.icon_key || department.iconKey || "fa-building"),
      notes: toStringOrEmpty(department.notes),
      status: toStringOrEmpty(department.status || "active") || "active",
      created_at: department.created_at || department.createdAt || null,
      updated_at: department.updated_at || department.updatedAt || null
    })),
    employees: normalizeArray(rawPayload.employees).map((employee) => ({
      id: employee.id || null,
      department_id: employee.department_id || employee.departmentId || null,
      employee_number: toStringOrEmpty(employee.employee_number || employee.employeeNumber),
      full_name: toStringOrEmpty(employee.full_name || employee.fullName),
      identification_number: toStringOrEmpty(employee.identification_number || employee.identificationNumber),
      account_number: toStringOrEmpty(employee.account_number || employee.accountNumber),
      account_details: toStringOrEmpty(employee.account_details || employee.accountDetails),
      role_title: toStringOrEmpty(employee.role_title || employee.roleTitle),
      employment_type: toStringOrEmpty(employee.employment_type || employee.employmentType || "full_time") || "full_time",
      payment_type: toStringOrEmpty(employee.payment_type || employee.paymentType || "monthly") || "monthly",
      payment_basis: toStringOrEmpty(
        employee.payment_basis ||
        employee.paymentBasis ||
        ((employee.payment_type || employee.paymentType) === "daily" ? "attendance_dependent" : "standard")
      ) || "standard",
      employment_date: employee.employment_date || employee.employmentDate || null,
      salary_amount: toNumber(employee.salary_amount ?? employee.salaryAmount, 0),
      salary_currency: toStringOrEmpty(employee.salary_currency || employee.salaryCurrency || "KES").toUpperCase(),
      status: toStringOrEmpty(employee.status || "active") || "active",
      payroll_status: toStringOrEmpty(employee.payroll_status || employee.payrollStatus || "pending") || "pending",
      profile_image_url: toStringOrEmpty(employee.profile_image_url || employee.profileImageUrl),
      financial_profile: isPlainObject(employee.financial_profile || employee.financialProfile)
        ? structuredClone(employee.financial_profile || employee.financialProfile)
        : {},
      created_at: employee.created_at || employee.createdAt || null,
      updated_at: employee.updated_at || employee.updatedAt || null
    })),
    contracts: normalizeArray(rawPayload.contracts).map((contract) => ({
      id: contract.id || null,
      employee_id: contract.employee_id || contract.employeeId || null,
      contract_number: toStringOrEmpty(contract.contract_number || contract.contractNumber),
      name: toStringOrEmpty(contract.name),
      role_title: toStringOrEmpty(contract.role_title || contract.roleTitle),
      contract_type: toStringOrEmpty(contract.contract_type || contract.contractType || "permanent") || "permanent",
      start_date: contract.start_date || contract.startDate || null,
      end_date: contract.end_date || contract.endDate || null,
      payment_amount: toNumber(contract.payment_amount ?? contract.paymentAmount, 0),
      currency_code: toStringOrEmpty(contract.currency_code || contract.currencyCode || "KES").toUpperCase(),
      status: toStringOrEmpty(contract.status || "draft") || "draft",
      notes: toStringOrEmpty(contract.notes),
      created_at: contract.created_at || contract.createdAt || null,
      updated_at: contract.updated_at || contract.updatedAt || null
    })),
    attendance_logs: normalizeArray(rawPayload.attendance_logs).map((log) => {
      const legacyApproval = normalizeArray(log.approvals).find((approval) => isPlainObject(approval)) || null
      return {
        id: log.id || null,
        employee_id: log.employee_id || log.employeeId || null,
        date: log.date || null,
        check_in: toStringOrEmpty(log.check_in || log.checkIn),
        check_out: toStringOrEmpty(log.check_out || log.checkOut) || null,
        mode: toStringOrEmpty(log.mode || "manual") || "manual",
        worked_hours: toNumber(log.worked_hours ?? log.workedHours, 0),
        approval_status: toStringOrEmpty(log.approval_status || log.approvalStatus || "pending_approval") || "pending_approval",
        approval: normalizeApprovalRecord(log.approval || legacyApproval),
        created_by_user_id: log.created_by_user_id || log.createdByUserId || null,
        created_at: log.created_at || log.createdAt || null,
        updated_at: log.updated_at || log.updatedAt || null
      }
    }),
    leave_requests: normalizeArray(rawPayload.leave_requests).map((request) => {
      const legacyApproval = normalizeArray(request.approvals).find((approval) => isPlainObject(approval)) || null
      return {
        id: request.id || null,
        employee_id: request.employee_id || request.employeeId || null,
        leave_type: toStringOrEmpty(request.leave_type || request.leaveType || "annual") || "annual",
        from_date: request.from_date || request.fromDate || null,
        to_date: request.to_date || request.toDate || null,
        requested_date: request.requested_date || request.requestedDate || null,
        status: toStringOrEmpty(request.status || "pending") || "pending",
        reason: toStringOrEmpty(request.reason),
        approval: normalizeApprovalRecord(request.approval || legacyApproval),
        created_by_user_id: request.created_by_user_id || request.createdByUserId || null,
        created_at: request.created_at || request.createdAt || null,
        updated_at: request.updated_at || request.updatedAt || null
      }
    }),
    holidays: normalizeArray(rawPayload.holidays).map((holiday) => ({
      id: holiday.id || null,
      scope: toStringOrEmpty(holiday.scope || "company") || "company",
      name: toStringOrEmpty(holiday.name),
      date: holiday.date || null,
      country_code: toStringOrEmpty(holiday.country_code || holiday.countryCode).toUpperCase(),
      status: toStringOrEmpty(holiday.status || "active") || "active",
      created_at: holiday.created_at || holiday.createdAt || null,
      updated_at: holiday.updated_at || holiday.updatedAt || null
    })),
    payroll_runs: normalizeArray(rawPayload.payroll_runs).map((run) => {
      const legacyApproval = normalizeArray(run.approvals).find((approval) => isPlainObject(approval)) || null
      return {
        id: run.id || null,
        period: toStringOrEmpty(run.period),
        salary_type: toStringOrEmpty(run.salary_type || run.salaryType || "monthly") || "monthly",
        department_scope_id: run.department_scope_id || run.departmentScopeId || null,
        currency_code: toStringOrEmpty(run.currency_code || run.currencyCode || "KES").toUpperCase(),
        status: toStringOrEmpty(run.status || "draft") || "draft",
        totals: isPlainObject(run.totals) ? structuredClone(run.totals) : {},
        approval: normalizeApprovalRecord(run.approval || legacyApproval),
        generated_by_user_id: run.generated_by_user_id || run.generatedByUserId || null,
        generated_at: run.generated_at || run.generatedAt || null,
        approved_at: run.approved_at || run.approvedAt || null,
        rejected_at: run.rejected_at || run.rejectedAt || null,
        created_at: run.created_at || run.createdAt || null,
        updated_at: run.updated_at || run.updatedAt || null
      }
    }),
    payroll_items: normalizeArray(rawPayload.payroll_items).map((item) => ({
      id: item.id || null,
      payroll_run_id: item.payroll_run_id || item.payrollRunId || null,
      employee_id: item.employee_id || item.employeeId || null,
      department_id: item.department_id || item.departmentId || null,
      base_salary: toNumber(item.base_salary ?? item.baseSalary, 0),
      gross_pay: toNumber(item.gross_pay ?? item.grossPay ?? item.base_salary ?? item.baseSalary, 0),
      taxable_pay: toNumber(item.taxable_pay ?? item.taxablePay ?? item.gross_pay ?? item.grossPay, 0),
      paye_taxable_base: toNumber(item.paye_taxable_base ?? item.payeTaxableBase ?? item.taxable_pay ?? item.taxablePay, 0),
      allowances_total: toNumber(item.allowances_total ?? item.allowancesTotal, 0),
      deductions_total: toNumber(item.deductions_total ?? item.deductionsTotal, 0),
      structure_allowances_total: toNumber(item.structure_allowances_total ?? item.structureAllowancesTotal, 0),
      financial_rule_allowances_total: toNumber(item.financial_rule_allowances_total ?? item.financialRuleAllowancesTotal, 0),
      structure_deductions_total: toNumber(item.structure_deductions_total ?? item.structureDeductionsTotal, 0),
      statutory_deductions_total: toNumber(item.statutory_deductions_total ?? item.statutoryDeductionsTotal, 0),
      financial_rule_deductions_total: toNumber(item.financial_rule_deductions_total ?? item.financialRuleDeductionsTotal, 0),
      loan_deductions_total: toNumber(item.loan_deductions_total ?? item.loanDeductionsTotal, 0),
      net_pay: toNumber(item.net_pay ?? item.netPay, 0),
      attendance_days: toNumber(item.attendance_days ?? item.attendanceDays, 0),
      approval_status: toStringOrEmpty(item.approval_status || item.approvalStatus || "pending") || "pending",
      signed: toBoolean(item.signed),
      paid_at: item.paid_at || item.paidAt || null,
      paid_by_user_id: item.paid_by_user_id || item.paidByUserId || null,
      allowance_breakdown: normalizeArray(item.allowance_breakdown || item.allowanceBreakdown),
      deduction_breakdown: normalizeArray(item.deduction_breakdown || item.deductionBreakdown),
      created_at: item.created_at || item.createdAt || null,
      updated_at: item.updated_at || item.updatedAt || null
    })),
    financial_rules: normalizeArray(rawPayload.financial_rules).map((rule) => ({
      id: rule.id || null,
      rule_type: toStringOrEmpty(rule.rule_type || rule.ruleType),
      name: toStringOrEmpty(rule.name),
      value_type: toStringOrEmpty(rule.value_type || rule.valueType),
      value: toNumber(rule.value, 0),
      taxable: rule.taxable !== false,
      income_category: toStringOrEmpty(rule.income_category || rule.incomeCategory || "other_taxable_income"),
      scope: toStringOrEmpty(rule.scope),
      target_type: toStringOrEmpty(rule.target_type || rule.targetType) || null,
      target_id: rule.target_id || rule.targetId || null,
      status: toStringOrEmpty(rule.status || "active") || "active",
      effective_from: rule.effective_from || rule.effectiveFrom || null,
      effective_to: rule.effective_to || rule.effectiveTo || null,
      created_at: rule.created_at || rule.createdAt || null,
      updated_at: rule.updated_at || rule.updatedAt || null
    })),
    company_settings: normalizeArray(rawPayload.company_settings).map((setting) => ({
      id: setting.id || null,
      key: toStringOrEmpty(setting.key),
      value_json: setting.value_json !== undefined || setting.valueJson !== undefined
        ? structuredClone(setting.value_json !== undefined ? setting.value_json : setting.valueJson)
        : {},
      updated_by_user_id: setting.updated_by_user_id || setting.updatedByUserId || null,
      created_at: setting.created_at || setting.createdAt || null,
      updated_at: setting.updated_at || setting.updatedAt || null
    }))
  }

  if(!normalizedPayload.company.name || !normalizedPayload.company.email){
    throw createBackupWorkflowError(
      "BACKUP_COMPANY_INVALID",
      "Backup company data must include a name and email address.",
      422
    )
  }

  const duplicateUserEmails = new Set()
  const seenUserEmails = new Set()
  normalizedPayload.users.forEach((user) => {
    if(!user.email){
      throw createBackupWorkflowError("BACKUP_USER_INVALID", "Every backup user must include an email address.", 422)
    }

    if(seenUserEmails.has(user.email)){
      duplicateUserEmails.add(user.email)
    }
    seenUserEmails.add(user.email)
  })

  if(duplicateUserEmails.size){
    throw createBackupWorkflowError(
      "BACKUP_USERS_DUPLICATE_EMAIL",
      `Backup users contain duplicate email addresses: ${[...duplicateUserEmails].join(", ")}.`,
      422
    )
  }

  return normalizedPayload
}

function createIdMap(records, label){
  const idMap = new Map()

  records.forEach((record) => {
    const backupId = String(record.id || "")
    if(!backupId){
      throw createBackupWorkflowError("BACKUP_ID_MISSING", `${label} records must include an id.`, 422)
    }

    if(idMap.has(backupId)){
      throw createBackupWorkflowError("BACKUP_ID_DUPLICATE", `${label} contains duplicate id ${backupId}.`, 422)
    }

    idMap.set(backupId, toObjectId(backupId, new mongoose.Types.ObjectId()))
  })

  return idMap
}

function requireReferenceId(idMap, recordLabel, referenceField, referencedId){
  const normalizedId = String(referencedId || "")
  if(!normalizedId || !idMap.has(normalizedId)){
    throw createBackupWorkflowError(
      "BACKUP_REFERENCE_INVALID",
      `${recordLabel} references an unknown ${referenceField}.`,
      422,
      {
        record: recordLabel,
        field: referenceField,
        reference_id: normalizedId || null
      }
    )
  }

  return idMap.get(normalizedId)
}

async function createRestoreUserMap({ backupPayload, companyId, currentUser }){
  const userMap = new Map()
  const warnings = []
  const backupUsers = backupPayload.users
  const backupEmails = backupUsers.map((user) => user.email)
  const existingUsers = backupEmails.length
    ? await User.find({
        email: { $in: backupEmails }
      }).select("+passwordHash +tokenVersion")
    : []
  const existingUsersByEmail = new Map(existingUsers.map((user) => [String(user.email).trim().toLowerCase(), user]))
  const usersWithOtherMemberships = new Set(
    (await CompanyMembership.find({
      userId: { $in: existingUsers.map((user) => user._id) },
      companyId: { $ne: companyId }
    }).lean()).map((membership) => String(membership.userId))
  )

  for(const backupUser of backupUsers){
    const existingUser = existingUsersByEmail.get(backupUser.email)
    if(existingUser){
      existingUser.displayName = backupUser.display_name || existingUser.displayName
      existingUser.title = backupUser.title
      existingUser.avatarUrl = backupUser.avatar_url
      existingUser.status = backupUser.status || existingUser.status

      if(backupUser.password_hash && !usersWithOtherMemberships.has(String(existingUser._id))){
        existingUser.passwordHash = backupUser.password_hash
        existingUser.tokenVersion = Number(backupUser.token_version || existingUser.tokenVersion || 0)
      } else if(backupUser.password_hash && usersWithOtherMemberships.has(String(existingUser._id))){
        warnings.push(`Preserved the current password for ${backupUser.email} because that user belongs to another company.`)
      }

      existingUser.lastLoginAt = toDateOrNull(backupUser.last_login_at)
      await existingUser.save()
      userMap.set(String(backupUser.id), existingUser._id)
      continue
    }

    let passwordHash = backupUser.password_hash
    let userStatus = backupUser.status || "active"
    if(!passwordHash){
      const seededPassword = crypto.randomBytes(24).toString("hex")
      passwordHash = await bcrypt.hash(seededPassword, env.bcryptSaltRounds)
      userStatus = "invited"
      warnings.push(`Created ${backupUser.email} without a reusable password because the backup did not include a password hash.`)
    }

    const createdUser = await User.create({
      email: backupUser.email,
      displayName: backupUser.display_name || backupUser.email,
      title: backupUser.title,
      avatarUrl: backupUser.avatar_url,
      passwordHash,
      tokenVersion: Number(backupUser.token_version || 0),
      status: userStatus,
      lastLoginAt: toDateOrNull(backupUser.last_login_at),
      createdAt: toDateOrNull(backupUser.created_at),
      updatedAt: toDateOrNull(backupUser.updated_at)
    })

    userMap.set(String(backupUser.id), createdUser._id)
  }

  if(currentUser?._id && ![...userMap.values()].some((value) => String(value) === String(currentUser._id))){
    userMap.set(`current-user:${String(currentUser._id)}`, currentUser._id)
  }

  return { userMap, warnings }
}

async function restoreCompanyFromBackup({ company, backupPayload, currentUser }){
  const normalizedBackup = normalizeBackupPayload(backupPayload)
  const warnings = []
  const departmentIdMap = createIdMap(normalizedBackup.departments, "departments")
  const employeeIdMap = createIdMap(normalizedBackup.employees, "employees")
  const contractIdMap = createIdMap(normalizedBackup.contracts, "contracts")
  const attendanceIdMap = createIdMap(normalizedBackup.attendance_logs, "attendance_logs")
  const leaveIdMap = createIdMap(normalizedBackup.leave_requests, "leave_requests")
  const holidayIdMap = createIdMap(normalizedBackup.holidays, "holidays")
  const payrollRunIdMap = createIdMap(normalizedBackup.payroll_runs, "payroll_runs")
  const payrollItemIdMap = createIdMap(normalizedBackup.payroll_items, "payroll_items")
  const financialRuleIdMap = createIdMap(normalizedBackup.financial_rules, "financial_rules")
  const companySettingIdMap = createIdMap(normalizedBackup.company_settings, "company_settings")
  const membershipIdMap = createIdMap(normalizedBackup.memberships, "memberships")

  normalizedBackup.memberships.forEach((membership) => {
    if(!normalizedBackup.users.some((user) => String(user.id) === String(membership.user_id))){
      throw createBackupWorkflowError("BACKUP_MEMBERSHIP_USER_MISSING", "A backup membership references a user that is not included in the backup.", 422)
    }
  })

  normalizedBackup.attendance_logs.forEach((log) => {
    requireReferenceId(employeeIdMap, "attendance_logs", "employee_id", log.employee_id)
  })
  normalizedBackup.leave_requests.forEach((request) => {
    requireReferenceId(employeeIdMap, "leave_requests", "employee_id", request.employee_id)
  })
  normalizedBackup.payroll_runs.forEach((run) => {
    if(run.department_scope_id){
      requireReferenceId(departmentIdMap, "payroll_runs", "department_scope_id", run.department_scope_id)
    }
  })
  normalizedBackup.payroll_items.forEach((item) => {
    requireReferenceId(employeeIdMap, "payroll_items", "employee_id", item.employee_id)
    requireReferenceId(payrollRunIdMap, "payroll_items", "payroll_run_id", item.payroll_run_id)
  })

  const { userMap, warnings: userWarnings } = await createRestoreUserMap({
    backupPayload: normalizedBackup,
    companyId: company._id,
    currentUser
  })
  warnings.push(...userWarnings)

  company.name = normalizedBackup.company.name
  company.industry = normalizedBackup.company.industry
  company.email = normalizedBackup.company.email
  company.currencyCode = normalizedBackup.company.currency_code || company.currencyCode
  company.countryCode = normalizedBackup.company.country_code || company.countryCode
  company.timezone = normalizedBackup.company.timezone || company.timezone
  company.logoUrl = normalizedBackup.company.logo_url
  company.status = "active"
  await company.save()

  await PayrollItem.deleteMany({ companyId: company._id })
  await PayrollRun.deleteMany({ companyId: company._id })
  await AttendanceLog.deleteMany({ companyId: company._id })
  await LeaveRequest.deleteMany({ companyId: company._id })
  await Contract.deleteMany({ companyId: company._id })
  await Employee.deleteMany({ companyId: company._id })
  await Department.deleteMany({ companyId: company._id })
  await Holiday.deleteMany({ companyId: company._id })
  await FinancialRule.deleteMany({ companyId: company._id })
  await CompanySetting.deleteMany({ companyId: company._id })
  await CompanyMembership.deleteMany({ companyId: company._id })

  if(normalizedBackup.departments.length){
    await Department.insertMany(normalizedBackup.departments.map((department) => ({
      _id: departmentIdMap.get(String(department.id)),
      companyId: company._id,
      name: department.name,
      salaryType: department.salary_type,
      defaultSalaryAmount: department.default_salary_amount,
      defaultSalaryCurrency: department.default_salary_currency,
      hodEmployeeId: department.hod_employee_id ? requireReferenceId(employeeIdMap, "departments", "hod_employee_id", department.hod_employee_id) : null,
      iconKey: department.icon_key,
      notes: department.notes,
      status: department.status,
      createdAt: toDateOrNull(department.created_at),
      updatedAt: toDateOrNull(department.updated_at)
    })))
  }

  if(normalizedBackup.employees.length){
    await Employee.insertMany(normalizedBackup.employees.map((employee) => ({
      _id: employeeIdMap.get(String(employee.id)),
      companyId: company._id,
      departmentId: employee.department_id ? requireReferenceId(departmentIdMap, "employees", "department_id", employee.department_id) : null,
      employeeNumber: employee.employee_number || undefined,
      fullName: employee.full_name,
      identificationNumber: employee.identification_number,
      accountNumber: employee.account_number,
      accountDetails: employee.account_details,
      roleTitle: employee.role_title,
      employmentType: employee.employment_type,
      paymentType: employee.payment_type,
      paymentBasis: employee.payment_type === "daily"
        ? "attendance_dependent"
        : employee.payment_basis,
      employmentDate: toDateOrNull(employee.employment_date) || new Date(),
      salaryAmount: employee.salary_amount,
      salaryCurrency: employee.salary_currency,
      status: employee.status,
      payrollStatus: employee.payroll_status,
      profileImageUrl: employee.profile_image_url,
      financialProfile: employee.financial_profile || {},
      createdAt: toDateOrNull(employee.created_at),
      updatedAt: toDateOrNull(employee.updated_at)
    })))
  }

  if(normalizedBackup.contracts.length){
    await Contract.insertMany(normalizedBackup.contracts.map((contract) => ({
      _id: contractIdMap.get(String(contract.id)),
      companyId: company._id,
      employeeId: contract.employee_id ? requireReferenceId(employeeIdMap, "contracts", "employee_id", contract.employee_id) : null,
      contractNumber: contract.contract_number,
      name: contract.name,
      roleTitle: contract.role_title,
      contractType: contract.contract_type,
      startDate: toDateOrNull(contract.start_date) || new Date(),
      endDate: toDateOrNull(contract.end_date),
      paymentAmount: contract.payment_amount,
      currencyCode: contract.currency_code,
      status: contract.status,
      notes: contract.notes,
      createdAt: toDateOrNull(contract.created_at),
      updatedAt: toDateOrNull(contract.updated_at)
    })))
  }

  if(normalizedBackup.attendance_logs.length){
    await AttendanceLog.insertMany(normalizedBackup.attendance_logs.map((log) => ({
      _id: attendanceIdMap.get(String(log.id)),
      companyId: company._id,
      employeeId: requireReferenceId(employeeIdMap, "attendance_logs", "employee_id", log.employee_id),
      createdByUserId: log.created_by_user_id
        ? userMap.get(String(log.created_by_user_id)) || currentUser._id
        : currentUser._id,
      date: toDateOrNull(log.date) || new Date(),
      checkIn: log.check_in,
      checkOut: log.check_out,
      mode: log.mode,
      workedHours: log.worked_hours,
      approvalStatus: log.approval_status,
      approval: log.approval ? {
        approverUserId: log.approval.approver_user_id
          ? userMap.get(String(log.approval.approver_user_id)) || null
          : null,
        approvedAt: toDateOrNull(log.approval.approved_at),
        rejectedAt: toDateOrNull(log.approval.rejected_at),
        rejectionReason: log.approval.rejection_reason || ""
      } : undefined,
      createdAt: toDateOrNull(log.created_at),
      updatedAt: toDateOrNull(log.updated_at)
    })))
  }

  if(normalizedBackup.leave_requests.length){
    await LeaveRequest.insertMany(normalizedBackup.leave_requests.map((request) => ({
      _id: leaveIdMap.get(String(request.id)),
      companyId: company._id,
      employeeId: requireReferenceId(employeeIdMap, "leave_requests", "employee_id", request.employee_id),
      createdByUserId: request.created_by_user_id
        ? userMap.get(String(request.created_by_user_id)) || currentUser._id
        : currentUser._id,
      leaveType: request.leave_type,
      fromDate: toDateOrNull(request.from_date) || new Date(),
      toDate: toDateOrNull(request.to_date) || new Date(),
      requestedDate: toDateOrNull(request.requested_date),
      status: request.status,
      reason: request.reason,
      approval: request.approval ? {
        approverUserId: request.approval.approver_user_id
          ? userMap.get(String(request.approval.approver_user_id)) || null
          : null,
        approvedAt: toDateOrNull(request.approval.approved_at),
        rejectedAt: toDateOrNull(request.approval.rejected_at),
        rejectionReason: request.approval.rejection_reason || ""
      } : undefined,
      createdAt: toDateOrNull(request.created_at),
      updatedAt: toDateOrNull(request.updated_at)
    })))
  }

  if(normalizedBackup.holidays.length){
    await Holiday.insertMany(normalizedBackup.holidays.map((holiday) => ({
      _id: holidayIdMap.get(String(holiday.id)),
      companyId: company._id,
      scope: holiday.scope,
      name: holiday.name,
      date: toDateOrNull(holiday.date) || new Date(),
      countryCode: holiday.country_code,
      status: holiday.status,
      createdAt: toDateOrNull(holiday.created_at),
      updatedAt: toDateOrNull(holiday.updated_at)
    })))
  }

  if(normalizedBackup.payroll_runs.length){
    await PayrollRun.insertMany(normalizedBackup.payroll_runs.map((run) => ({
      _id: payrollRunIdMap.get(String(run.id)),
      companyId: company._id,
      departmentScopeId: run.department_scope_id ? requireReferenceId(departmentIdMap, "payroll_runs", "department_scope_id", run.department_scope_id) : null,
      generatedByUserId: run.generated_by_user_id
        ? userMap.get(String(run.generated_by_user_id)) || currentUser._id
        : currentUser._id,
      period: run.period,
      salaryType: run.salary_type,
      currencyCode: run.currency_code,
      status: run.status,
      totals: {
        baseSalary: toNumber(run.totals?.baseSalary ?? run.totals?.base_salary, 0),
        allowances: toNumber(run.totals?.allowances, 0),
        deductions: toNumber(run.totals?.deductions, 0),
        netPay: toNumber(run.totals?.netPay ?? run.totals?.net_pay, 0)
      },
      generatedAt: toDateOrNull(run.generated_at),
      approval: run.approval ? {
        approverUserId: run.approval.approver_user_id
          ? userMap.get(String(run.approval.approver_user_id)) || null
          : null,
        rejectionReason: run.approval.rejection_reason || ""
      } : undefined,
      approvedAt: toDateOrNull(run.approved_at),
      rejectedAt: toDateOrNull(run.rejected_at),
      createdAt: toDateOrNull(run.created_at),
      updatedAt: toDateOrNull(run.updated_at)
    })))
  }

  if(normalizedBackup.payroll_items.length){
    await PayrollItem.insertMany(normalizedBackup.payroll_items.map((item) => ({
      _id: payrollItemIdMap.get(String(item.id)),
      payrollRunId: requireReferenceId(payrollRunIdMap, "payroll_items", "payroll_run_id", item.payroll_run_id),
      companyId: company._id,
      employeeId: requireReferenceId(employeeIdMap, "payroll_items", "employee_id", item.employee_id),
      departmentId: item.department_id ? requireReferenceId(departmentIdMap, "payroll_items", "department_id", item.department_id) : null,
      baseSalary: item.base_salary,
      grossPay: item.gross_pay,
      taxablePay: item.taxable_pay,
      payeTaxableBase: item.paye_taxable_base,
      allowancesTotal: item.allowances_total,
      deductionsTotal: item.deductions_total,
      structureAllowancesTotal: item.structure_allowances_total,
      financialRuleAllowancesTotal: item.financial_rule_allowances_total,
      structureDeductionsTotal: item.structure_deductions_total,
      statutoryDeductionsTotal: item.statutory_deductions_total,
      financialRuleDeductionsTotal: item.financial_rule_deductions_total,
      loanDeductionsTotal: item.loan_deductions_total,
      netPay: item.net_pay,
      attendanceDays: item.attendance_days,
      approvalStatus: item.approval_status,
      signed: item.signed,
      paidAt: toDateOrNull(item.paid_at),
      paidByUserId: item.paid_by_user_id
        ? userMap.get(String(item.paid_by_user_id)) || null
        : null,
      allowanceBreakdown: item.allowance_breakdown,
      deductionBreakdown: item.deduction_breakdown,
      createdAt: toDateOrNull(item.created_at),
      updatedAt: toDateOrNull(item.updated_at)
    })))
  }

  if(normalizedBackup.financial_rules.length){
    await FinancialRule.insertMany(normalizedBackup.financial_rules.map((rule) => ({
      _id: financialRuleIdMap.get(String(rule.id)),
      companyId: company._id,
      ruleType: rule.rule_type,
      name: rule.name,
      valueType: rule.value_type,
      value: rule.value,
      taxable: rule.taxable !== false,
      incomeCategory: rule.income_category,
      scope: rule.scope,
      targetType: rule.target_type || null,
      targetId: rule.target_id
        ? (
            rule.target_type === "department"
              ? requireReferenceId(departmentIdMap, "financial_rules", "target_id", rule.target_id)
              : rule.target_type === "employee"
                ? requireReferenceId(employeeIdMap, "financial_rules", "target_id", rule.target_id)
                : null
          )
        : null,
      status: rule.status,
      effectiveFrom: toDateOrNull(rule.effective_from),
      effectiveTo: toDateOrNull(rule.effective_to),
      createdAt: toDateOrNull(rule.created_at),
      updatedAt: toDateOrNull(rule.updated_at)
    })))
  }

  if(normalizedBackup.company_settings.length){
    await CompanySetting.insertMany(normalizedBackup.company_settings.map((setting) => ({
      _id: companySettingIdMap.get(String(setting.id)),
      companyId: company._id,
      key: setting.key,
      valueJson: setting.value_json,
      updatedByUserId: setting.updated_by_user_id
        ? userMap.get(String(setting.updated_by_user_id)) || currentUser._id
        : currentUser._id,
      createdAt: toDateOrNull(setting.created_at),
      updatedAt: toDateOrNull(setting.updated_at)
    })))
  }

  if(normalizedBackup.memberships.length){
    await CompanyMembership.insertMany(normalizedBackup.memberships.map((membership) => ({
      _id: membershipIdMap.get(String(membership.id)),
      companyId: company._id,
      userId: requireReferenceId(userMap, "memberships", "user_id", membership.user_id),
      invitedByUserId: membership.invited_by_user_id
        ? userMap.get(String(membership.invited_by_user_id)) || currentUser._id
        : null,
      role: membership.role,
      status: membership.status,
      joinedAt: toDateOrNull(membership.joined_at),
      createdAt: toDateOrNull(membership.created_at),
      updatedAt: toDateOrNull(membership.updated_at)
    })))
  }

  let preservedAdminAccess = false
  const currentMembership = await CompanyMembership.findOne({
    companyId: company._id,
    userId: currentUser._id
  })

  if(!currentMembership){
    await CompanyMembership.create({
      companyId: company._id,
      userId: currentUser._id,
      invitedByUserId: currentUser._id,
      role: "ADMIN",
      status: "active",
      joinedAt: new Date()
    })
    preservedAdminAccess = true
    warnings.push("Preserved admin access for the current operator because the restored backup did not include their active membership.")
  } else if(currentMembership.status !== "active" || currentMembership.role !== "ADMIN"){
    currentMembership.status = "active"
    currentMembership.role = "ADMIN"
    currentMembership.joinedAt = currentMembership.joinedAt || new Date()
    await currentMembership.save()
    preservedAdminAccess = true
    warnings.push("Upgraded the current operator back to an active admin after restore so the company remains manageable.")
  }

  return {
    meta: normalizedBackup.meta,
    company: {
      id: String(company._id),
      name: company.name
    },
    restoredCounts: getBackupPayloadRecordCounts(normalizedBackup),
    warnings,
    preservedAdminAccess
  }
}

module.exports = {
  buildCompanyBackupPayload,
  createBackupWorkflowError,
  getBackupPayloadRecordCounts,
  normalizeBackupPayload,
  restoreCompanyFromBackup
}
