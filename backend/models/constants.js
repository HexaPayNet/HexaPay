const MEMBERSHIP_ROLES = ["ADMIN", "MANAGER", "VIEWER"]

const RECORD_STATUSES = {
  user: ["active", "invited", "suspended", "deleted"],
  company: ["active", "archived"],
  membership: ["invited", "active", "suspended", "removed"],
  department: ["active", "archived"],
  employee: ["active", "on_leave", "retired", "resigned", "terminated"],
  payrollStatus: ["pending", "hold", "inactive"],
  contract: ["draft", "active", "pending", "completed", "terminated", "resigned"],
  attendance: ["pending_approval", "approved", "rejected"],
  leave: ["pending", "active", "rejected", "cancelled", "completed"],
  payrollRun: ["draft", "pending_approval", "approved", "rejected", "posted"],
  payrollItemApproval: ["pending", "approved", "hold"]
}

const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract", "casual", "intern"]
const PAYMENT_TYPES = ["daily", "weekly", "monthly"]
const PAYMENT_BASIS_TYPES = ["standard", "attendance_dependent"]
const DEPARTMENT_SALARY_TYPES = ["daily", "weekly", "monthly"]
const CONTRACT_TYPES = ["internship", "temporary", "freelance", "permanent"]
const ATTENDANCE_MODES = ["manual", "biometric"]
const LEAVE_TYPES = ["annual", "sick", "maternity", "paternity", "compassionate", "unpaid"]
const HOLIDAY_SCOPES = ["company", "national"]
const EXPORT_JOB_TYPES = ["employees_csv", "departments_csv", "contracts_csv", "attendance_csv", "payroll_csv", "backup_json"]
const EXPORT_JOB_STATUSES = ["queued", "processing", "completed", "failed"]
const FINANCIAL_RULE_TYPES = ["paye", "pension", "insurance", "custom_deduction", "bonus", "incentive", "overtime_rate"]
const FINANCIAL_RULE_VALUE_TYPES = ["percentage", "flat_amount", "hourly_rate"]
const FINANCIAL_RULE_SCOPES = ["company", "department", "employee", "role"]
const FINANCIAL_RULE_TARGET_TYPES = ["department", "employee", "role"]

module.exports = {
  MEMBERSHIP_ROLES,
  RECORD_STATUSES,
  EMPLOYMENT_TYPES,
  PAYMENT_TYPES,
  PAYMENT_BASIS_TYPES,
  DEPARTMENT_SALARY_TYPES,
  CONTRACT_TYPES,
  ATTENDANCE_MODES,
  LEAVE_TYPES,
  HOLIDAY_SCOPES,
  EXPORT_JOB_TYPES,
  EXPORT_JOB_STATUSES,
  FINANCIAL_RULE_TYPES,
  FINANCIAL_RULE_VALUE_TYPES,
  FINANCIAL_RULE_SCOPES,
  FINANCIAL_RULE_TARGET_TYPES
}
