const fs = require("fs/promises")
const path = require("path")
const mongoose = require("mongoose")

const { Company } = require("../utils/auth")
const ExportJob = require("../models/ExportJob")
const Employee = require("../models/Employee")
const PayrollRun = require("../models/PayrollRun")
const PayrollItem = require("../models/PayrollItem")
const Department = require("../models/Department")
const Contract = require("../models/Contract")
const AttendanceLog = require("../models/AttendanceLog")
const LeaveRequest = require("../models/LeaveRequest")
const Holiday = require("../models/Holiday")
const CompanyMembership = require("../models/CompanyMembership")
const CompanySetting = require("../models/CompanySetting")
const FinancialRule = require("../models/FinancialRule")
const User = require("../models/User")
const { AUDIT_ACTIONS, AUDIT_TARGETS, recordAuditEvent } = require("../services/audit.service")
const { compareEmployeesByPayrollNumber } = require("../services/employee-number.service")
const {
  buildCompanyBackupPayload,
  createBackupWorkflowError,
  getBackupPayloadRecordCounts,
  normalizeBackupPayload,
  restoreCompanyFromBackup
} = require("../services/backup.service")

const EXPORT_STORAGE_ROOT = path.join(process.cwd(), "backend", "storage", "exports")

function slugifyFileSegment(value){
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "export"
}

function toCsvCell(value){
  return `"${String(value ?? "").replace(/"/g, "\"\"")}"`
}

function buildCsv(headers, rows){
  return [
    headers.map((header) => toCsvCell(header)).join(","),
    ...rows.map((row) => row.map((value) => toCsvCell(value)).join(","))
  ].join("\n")
}

function comparePayrollItemsByEmployeeNumber(leftItem, rightItem, employeeMap){
  const leftEmployee = employeeMap.get(String(leftItem?.employeeId || ""))
  const rightEmployee = employeeMap.get(String(rightItem?.employeeId || ""))
  return compareEmployeesByPayrollNumber(leftEmployee, rightEmployee)
}

function normalizePayrollDeductionToken(value){
  return String(value || "")
    .trim()
    .toLowerCase()
}

function getPayrollItemDeductionSummary(item){
  const summary = {
    paye: 0,
    nssf: 0,
    shif: 0,
    housingLevy: 0,
    advance: 0,
    otherDeductibles: 0
  }

  const entries = Array.isArray(item?.deductionBreakdown)
    ? item.deductionBreakdown
    : []

  entries.forEach((entry) => {
    const amount = Number(entry?.amount || 0)
    if(amount <= 0){
      return
    }

    const sourceType = normalizePayrollDeductionToken(entry?.sourceType)
    const label = normalizePayrollDeductionToken(entry?.label)

    if(sourceType === "statutory_paye" || label === "paye"){
      summary.paye += amount
      return
    }

    if(sourceType === "statutory_nssf" || label === "nssf"){
      summary.nssf += amount
      return
    }

    if(sourceType === "statutory_shif" || label === "shif"){
      summary.shif += amount
      return
    }

    if(sourceType === "statutory_housing_levy" || label === "housing levy" || label === "housing"){
      summary.housingLevy += amount
      return
    }

    if(sourceType === "employee_loan" || sourceType === "loan" || label.includes("advance") || label.includes("loan")){
      summary.advance += amount
      return
    }

    summary.otherDeductibles += amount
  })

  if(summary.advance <= 0 && Number(item?.loanDeductionsTotal || 0) > 0){
    summary.advance = Number(item.loanDeductionsTotal || 0)
  }

  return {
    ...summary,
    deductiblesTotal: summary.nssf + summary.shif + summary.housingLevy + summary.advance + summary.otherDeductibles
  }
}

async function ensureExportDirectory(companyId){
  const directory = path.join(EXPORT_STORAGE_ROOT, String(companyId))
  await fs.mkdir(directory, { recursive: true })
  return directory
}

async function writeExportFile({ companyId, jobId, fileName, content }){
  const directory = await ensureExportDirectory(companyId)
  const storedFileName = `${jobId}-${fileName}`
  const filePath = path.join(directory, storedFileName)
  await fs.writeFile(filePath, content, "utf8")
  return { filePath, storedFileName }
}

function serializeMembershipForBackup(membership){
  return {
    id: String(membership._id),
    company_id: String(membership.companyId),
    user_id: String(membership.userId?._id || membership.userId),
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
    status: user.status,
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
    employment_date: employee.employmentDate,
    salary_amount: employee.salaryAmount,
    salary_currency: employee.salaryCurrency,
    status: employee.status,
    payroll_status: employee.payrollStatus,
    profile_image_url: employee.profileImageUrl,
    unpaid_balance: employee.unpaidBalance,
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
    approvals: log.approvals || [],
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
    approvals: request.approvals || [],
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
    approvals: run.approvals || [],
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
    allowances_total: item.allowancesTotal,
    deductions_total: item.deductionsTotal,
    net_pay: item.netPay,
    attendance_days: item.attendanceDays,
    approval_status: item.approvalStatus,
    signed: item.signed,
    allowance_breakdown: item.allowanceBreakdown || [],
    deduction_breakdown: item.deductionBreakdown || [],
    breakdown: item.breakdown || {},
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

function serializeExportJob(job){
  if(!job){
    return null
  }

  return {
    id: String(job._id),
    company_id: String(job.companyId),
    requested_by_user_id: String(job.requestedByUserId),
    type: job.type,
    status: job.status,
    file_url: job.fileUrl,
    download_url: job.fileUrl,
    file_name: job.fileName,
    mime_type: job.mimeType,
    filters: job.filtersJson || {},
    summary: job.summaryJson || {},
    related_resource_id: job.relatedResourceId ? String(job.relatedResourceId) : null,
    requested_at: job.requestedAt,
    completed_at: job.completedAt,
    expires_at: job.expiresAt
  }
}

async function auditExportCreation(req, action, targetType, exportJob, metadata = {}){
  return recordAuditEvent({
    req,
    action,
    target: {
      type: targetType,
      id: String(exportJob._id),
      label: exportJob.fileName || exportJob.type
    },
    after: serializeExportJob(exportJob),
    metadata: {
      export_type: exportJob.type,
      ...metadata
    }
  })
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function createCompletedExportJob({
  jobId = new mongoose.Types.ObjectId(),
  companyId,
  requestedByUserId,
  type,
  fileName,
  mimeType,
  fileContent,
  downloadPath,
  filtersJson = {},
  summaryJson = {},
  relatedResourceId = null
}){
  const { filePath } = await writeExportFile({
    companyId,
    jobId: String(jobId),
    fileName,
    content: fileContent
  })

  return ExportJob.create({
    _id: jobId,
    companyId,
    requestedByUserId,
    type,
    status: "completed",
    fileUrl: downloadPath,
    fileName,
    filePath,
    mimeType,
    filtersJson,
    summaryJson,
    relatedResourceId,
    completedAt: new Date()
  })
}

function buildBackupFileName(companyName, suffix = "backup"){
  const companySlug = slugifyFileSegment(companyName)
  return `${companySlug}-${suffix}-${new Date().toISOString().slice(0, 10)}.hexa`
}

async function createBackupExportJob({ companyId, requestedByUserId, companyName, fileName, fileContent, summaryJson, relatedResourceId = null }){
  const jobId = new mongoose.Types.ObjectId()

  return createCompletedExportJob({
    jobId,
    companyId,
    requestedByUserId,
    type: "backup_json",
    fileName,
    mimeType: "application/vnd.hexapay.backup+json",
    fileContent,
    downloadPath: `/companies/${companyId}/backups/${jobId}`,
    summaryJson,
    relatedResourceId
  })
}

async function readBackupPayloadFromJob({ companyId, backupJobId }){
  const backupJob = await ExportJob.findOne({
    _id: backupJobId,
    companyId,
    type: "backup_json"
  })

  if(!backupJob){
    throw createBackupWorkflowError("BACKUP_NOT_FOUND", "Backup was not found.", 404)
  }

  if(!backupJob.filePath){
    throw createBackupWorkflowError("BACKUP_FILE_NOT_FOUND", "The selected backup file is no longer available.", 404)
  }

  let fileContent
  try{
    fileContent = await fs.readFile(backupJob.filePath, "utf8")
  } catch (_error){
    throw createBackupWorkflowError("BACKUP_FILE_NOT_FOUND", "The selected backup file is no longer available.", 404)
  }

  try{
    return {
      backupJob,
      backupPayload: JSON.parse(fileContent)
    }
  } catch (_error){
    throw createBackupWorkflowError("BACKUP_FILE_INVALID", "The selected backup file could not be parsed.", 422)
  }
}

async function resolveBackupPayloadForRestore(req){
  if(req.body?.backup_job_id){
    const result = await readBackupPayloadFromJob({
      companyId: req.params.companyId,
      backupJobId: req.body.backup_job_id
    })

    return {
      source: {
        type: "backup_job",
        backup_job_id: String(result.backupJob._id)
      },
      backupPayload: result.backupPayload
    }
  }

  if(req.body?.backup_json){
    return {
      source: {
        type: "upload"
      },
      backupPayload: req.body.backup_json
    }
  }

  throw createBackupWorkflowError(
    "BACKUP_SOURCE_REQUIRED",
    "Provide either backup_job_id or backup_json to restore a backup.",
    400
  )
}

async function sendExportJobFile(res, exportJob, notFoundCode, notFoundMessage){
  if(!exportJob || !exportJob.filePath){
    return res.status(404).json({
      error: {
        code: notFoundCode,
        message: notFoundMessage
      }
    })
  }

  try{
    await fs.access(exportJob.filePath)
  } catch (_error){
    return res.status(404).json({
      error: {
        code: "EXPORT_FILE_NOT_FOUND",
        message: "The requested export file is no longer available."
      }
    })
  }

  res.setHeader("Content-Type", exportJob.mimeType || "application/octet-stream")
  res.setHeader("Content-Disposition", `attachment; filename="${exportJob.fileName || "export.dat"}"`)
  return res.sendFile(path.resolve(exportJob.filePath))
}

async function exportEmployees(req, res, next){
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

    const filters = req.body?.filters || {}
    const employeeQuery = {
      companyId: req.params.companyId
    }

    if(filters.department_id){
      employeeQuery.departmentId = filters.department_id
    }
    if(filters.status){
      employeeQuery.status = filters.status
    }

    const employees = (await Employee.find(employeeQuery).lean()).sort(compareEmployeesByPayrollNumber)
    const departmentIds = [...new Set(employees
      .map((employee) => employee.departmentId)
      .filter(Boolean)
      .map((departmentId) => String(departmentId)))]
    const departments = await Department.find({
      _id: { $in: departmentIds }
    }).lean()
    const departmentMap = new Map(departments.map((department) => [String(department._id), department.name]))
    const companySlug = slugifyFileSegment(company.name)
    const fileName = `${companySlug}-employees-${new Date().toISOString().slice(0, 10)}.csv`
    const csvContent = buildCsv(
      ["Name", "Department", "Role", "Employment Type", "Employment Date", "Salary Amount", "Salary Currency", "Status"],
      employees.map((employee) => [
        employee.fullName,
        departmentMap.get(String(employee.departmentId || "")) || "Unassigned",
        employee.roleTitle || "",
        employee.employmentType || "",
        employee.employmentDate || "",
        employee.salaryAmount || 0,
        employee.salaryCurrency || company.currencyCode || "KES",
        employee.status || ""
      ])
    )
    const employeeCount = employees.length
    const jobId = new mongoose.Types.ObjectId()

    const exportJob = await createCompletedExportJob({
      jobId,
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      type: "employees_csv",
      fileName,
      mimeType: "text/csv; charset=utf-8",
      fileContent: csvContent,
      downloadPath: `/companies/${req.params.companyId}/exports/${jobId}/download`,
      filtersJson: filters,
      summaryJson: {
        employee_count: employeeCount
      }
    })

    await auditExportCreation(req, AUDIT_ACTIONS.EXPORT_CREATED, AUDIT_TARGETS.EXPORT_JOB, exportJob, {
      summary: exportJob.summaryJson,
      filters: exportJob.filtersJson
    })

    res.status(201).json({
      export_job: serializeExportJob(exportJob)
    })
  } catch (error){
    next(error)
  }
}

async function exportDepartment(req, res, next){
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

    const department = await Department.findOne({
      _id: req.body?.department_id,
      companyId: req.params.companyId
    }).lean()

    if(!department){
      return res.status(404).json({
        error: {
          code: "DEPARTMENT_NOT_FOUND",
          message: "Department was not found."
        }
      })
    }

    const employees = await Employee.find({
      companyId: req.params.companyId,
      departmentId: department._id
    }).lean()

    const companySlug = slugifyFileSegment(company.name)
    const departmentSlug = slugifyFileSegment(department.name)
    const fileName = `${companySlug}-${departmentSlug}-department-${new Date().toISOString().slice(0, 10)}.csv`
    const csvContent = buildCsv(
      ["Department", "Salary Type", "Default Salary", "Notes", "Employee Name", "Role", "Employment Type", "Employment Date", "Salary Amount", "Status"],
      employees.length
        ? employees.map((employee) => [
            department.name,
            department.salaryType || "",
            department.defaultSalaryAmount || 0,
            department.notes || "",
            employee.fullName || "",
            employee.roleTitle || "",
            employee.employmentType || "",
            employee.employmentDate || "",
            employee.salaryAmount || 0,
            employee.status || ""
          ])
        : [[
            department.name,
            department.salaryType || "",
            department.defaultSalaryAmount || 0,
            department.notes || "",
            "",
            "",
            "",
            "",
            "",
            ""
          ]]
    )
    const jobId = new mongoose.Types.ObjectId()

    const exportJob = await createCompletedExportJob({
      jobId,
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      type: "departments_csv",
      fileName,
      mimeType: "text/csv; charset=utf-8",
      fileContent: csvContent,
      downloadPath: `/companies/${req.params.companyId}/exports/${jobId}/download`,
      summaryJson: {
        department_id: String(department._id),
        department_name: department.name,
        employee_count: employees.length
      },
      relatedResourceId: department._id
    })

    await auditExportCreation(req, AUDIT_ACTIONS.EXPORT_CREATED, AUDIT_TARGETS.EXPORT_JOB, exportJob, {
      summary: exportJob.summaryJson
    })

    res.status(201).json({
      export_job: serializeExportJob(exportJob)
    })
  } catch (error){
    next(error)
  }
}

async function exportAttendance(req, res, next){
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

    const filters = req.body?.filters || {}
    const attendanceQuery = {
      companyId: req.params.companyId
    }

    if(filters.specific_date){
      const specificStart = new Date(`${filters.specific_date}T00:00:00.000Z`)
      const specificEnd = new Date(`${filters.specific_date}T23:59:59.999Z`)
      attendanceQuery.date = {
        $gte: specificStart,
        $lte: specificEnd
      }
    } else if(filters.from_date || filters.to_date){
      attendanceQuery.date = {}
      if(filters.from_date){
        attendanceQuery.date.$gte = new Date(`${filters.from_date}T00:00:00.000Z`)
      }
      if(filters.to_date){
        attendanceQuery.date.$lte = new Date(`${filters.to_date}T23:59:59.999Z`)
      }
    } else if(filters.month){
      const [year, month] = String(filters.month).split("-").map(Number)
      const start = new Date(Date.UTC(year, month - 1, 1))
      const end = new Date(Date.UTC(year, month, 1))
      attendanceQuery.date = { $gte: start, $lt: end }
    }

    if(filters.approval_status){
      attendanceQuery.approvalStatus = filters.approval_status === "pending"
        ? "pending_approval"
        : filters.approval_status
    }

    const employees = await Employee.find({
      companyId: req.params.companyId,
      ...(filters.department_id ? { departmentId: filters.department_id } : {})
    }).lean()
    const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))
    const employeeIds = employees.map((employee) => employee._id)

    attendanceQuery.employeeId = employeeIds.length
      ? { $in: employeeIds }
      : { $in: [] }

    const attendanceLogs = await AttendanceLog.find(attendanceQuery).sort({ date: -1, createdAt: -1 }).lean()
    const departments = await Department.find({
      _id: { $in: employees.map((employee) => employee.departmentId).filter(Boolean) }
    }).lean()
    const departmentMap = new Map(departments.map((department) => [String(department._id), department.name]))

    const companySlug = slugifyFileSegment(company.name)
    const fileName = `${companySlug}-attendance-${new Date().toISOString().slice(0, 10)}.csv`
    const csvContent = buildCsv(
      ["Employee Name", "Department", "Role", "Date", "Check In", "Check Out", "Worked Hours", "Mode", "Approval Status"],
      attendanceLogs.map((log) => {
        const employee = employeeMap.get(String(log.employeeId))
        return [
          employee?.fullName || "",
          departmentMap.get(String(employee?.departmentId || "")) || "Unassigned",
          employee?.roleTitle || "",
          log.date ? new Date(log.date).toISOString().slice(0, 10) : "",
          log.checkIn || "",
          log.checkOut || "",
          log.workedHours || 0,
          log.mode || "",
          log.approvalStatus || ""
        ]
      })
    )
    const jobId = new mongoose.Types.ObjectId()

    const exportJob = await createCompletedExportJob({
      jobId,
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      type: "attendance_csv",
      fileName,
      mimeType: "text/csv; charset=utf-8",
      fileContent: csvContent,
      downloadPath: `/companies/${req.params.companyId}/exports/${jobId}/download`,
      filtersJson: filters,
      summaryJson: {
        attendance_count: attendanceLogs.length,
        department_id: filters.department_id || null
      }
    })

    await auditExportCreation(req, AUDIT_ACTIONS.EXPORT_CREATED, AUDIT_TARGETS.EXPORT_JOB, exportJob, {
      summary: exportJob.summaryJson,
      filters: exportJob.filtersJson
    })

    res.status(201).json({
      export_job: serializeExportJob(exportJob)
    })
  } catch (error){
    next(error)
  }
}

async function exportContracts(req, res, next){
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

    const contracts = await Contract.find({
      companyId: req.params.companyId
    }).lean()

    const companySlug = slugifyFileSegment(company.name)
    const fileName = `${companySlug}-contracts-${new Date().toISOString().slice(0, 10)}.csv`
    const csvContent = buildCsv(
      ["Contract ID", "Contract Number", "Name", "Company", "Role", "Contract Type", "Contract Date", "Status", "Total Payment", "Payment Status"],
      contracts.map((contract) => [
        String(contract._id),
        contract.contractNumber || "",
        contract.name || "",
        contract.companyName || company.name || "",
        contract.roleTitle || "",
        contract.contractType || "",
        contract.contractDate || contract.startDate || "",
        contract.status || "",
        contract.totalPayment || contract.paymentAmount || 0,
        contract.paymentStatus || ""
      ])
    )
    const contractCount = contracts.length
    const jobId = new mongoose.Types.ObjectId()

    const exportJob = await createCompletedExportJob({
      jobId,
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      type: "contracts_csv",
      fileName,
      mimeType: "text/csv; charset=utf-8",
      fileContent: csvContent,
      downloadPath: `/companies/${req.params.companyId}/exports/${jobId}/download`,
      summaryJson: {
        contract_count: contractCount
      }
    })

    await auditExportCreation(req, AUDIT_ACTIONS.EXPORT_CREATED, AUDIT_TARGETS.EXPORT_JOB, exportJob, {
      summary: exportJob.summaryJson
    })

    res.status(201).json({
      export_job: serializeExportJob(exportJob)
    })
  } catch (error){
    next(error)
  }
}

async function exportPayroll(req, res, next){
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

    const payrollRunId = req.body?.payroll_run_id
    const payrollRun = await PayrollRun.findOne({
      _id: payrollRunId,
      companyId: req.params.companyId
    })

    if(!payrollRun){
      return res.status(404).json({
        error: {
          code: "PAYROLL_RUN_NOT_FOUND",
          message: "Payroll run was not found."
        }
      })
    }

    const items = await PayrollItem.find({
      payrollRunId: payrollRun._id
    }).lean()
    const employees = (await Employee.find({
      _id: { $in: items.map((item) => item.employeeId) }
    }).lean()).sort(compareEmployeesByPayrollNumber)
    const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))
    const sortedItems = [...items].sort((leftItem, rightItem) =>
      comparePayrollItemsByEmployeeNumber(leftItem, rightItem, employeeMap)
    )
    const companySlug = slugifyFileSegment(company.name)
    const periodSlug = slugifyFileSegment(payrollRun.period)
    const fileName = `${companySlug}-payroll-${periodSlug}.csv`
    const csvContent = buildCsv(
      [
        "Payroll Number",
        "Employee Name",
        "Role",
        "Salary Type",
        "Base Salary",
        "Gross Pay",
        "PAYE",
        "NSSF",
        "SHIF",
        "Housing Levy",
        "Advance",
        "Other Deductibles",
        "Deductibles Total",
        "Deductions Total",
        "Allowances Total",
        "Net Pay",
        "Attendance Days",
        "Approval Status",
        "Signed"
      ],
      sortedItems.map((item) => {
        const employee = employeeMap.get(String(item.employeeId))
        const deductionSummary = getPayrollItemDeductionSummary(item)

        return [
          employee?.employeeNumber || "",
          employee?.fullName || "",
          employee?.roleTitle || "",
          payrollRun.salaryType,
          item.baseSalary || 0,
          item.grossPay || item.baseSalary || 0,
          deductionSummary.paye,
          deductionSummary.nssf,
          deductionSummary.shif,
          deductionSummary.housingLevy,
          deductionSummary.advance,
          deductionSummary.otherDeductibles,
          deductionSummary.deductiblesTotal,
          item.deductionsTotal || 0,
          item.allowancesTotal || 0,
          item.netPay || 0,
          item.attendanceDays || 0,
          item.approvalStatus || "",
          item.signed ? "Yes" : "No"
        ]
      })
    )
    const itemCount = items.length
    const jobId = new mongoose.Types.ObjectId()

    const exportJob = await createCompletedExportJob({
      jobId,
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      type: "payroll_csv",
      fileName,
      mimeType: "text/csv; charset=utf-8",
      fileContent: csvContent,
      downloadPath: `/companies/${req.params.companyId}/exports/${jobId}/download`,
      filtersJson: {
        payroll_run_id: String(payrollRun._id)
      },
      summaryJson: {
        payroll_run_id: String(payrollRun._id),
        period: payrollRun.period,
        salary_type: payrollRun.salaryType,
        format: "csv",
        item_count: itemCount,
        totals: {
          base_salary: payrollRun.totals?.baseSalary || 0,
          allowances: payrollRun.totals?.allowances || 0,
          deductions: payrollRun.totals?.deductions || 0,
          net_pay: payrollRun.totals?.netPay || 0
        }
      },
      relatedResourceId: payrollRun._id
    })

    await auditExportCreation(req, AUDIT_ACTIONS.EXPORT_CREATED, AUDIT_TARGETS.EXPORT_JOB, exportJob, {
      summary: exportJob.summaryJson,
      filters: exportJob.filtersJson
    })

    res.status(201).json({
      export_job: serializeExportJob(exportJob)
    })
  } catch (error){
    next(error)
  }
}

async function createBackup(req, res, next){
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
    const backupPayload = await buildCompanyBackupPayload(company)
    const fileContent = JSON.stringify(backupPayload, null, 2)
    const backupJob = await createBackupExportJob({
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      companyName: company.name,
      fileName: buildBackupFileName(company.name),
      fileContent,
      summaryJson: {
        company: {
          id: String(company._id),
          name: company.name
        },
        backup_meta: backupPayload.meta,
        record_counts: getBackupPayloadRecordCounts(backupPayload)
      },
      relatedResourceId: company._id
    })

    await auditExportCreation(req, AUDIT_ACTIONS.BACKUP_CREATED, AUDIT_TARGETS.BACKUP, backupJob, {
      summary: backupJob.summaryJson
    })

    res.status(201).json({
      backup: serializeExportJob(backupJob)
    })
  } catch (error){
    next(error)
  }
}

async function restoreBackup(req, res, next){
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

    const restoreInput = await resolveBackupPayloadForRestore(req)
    const normalizedBackupPayload = normalizeBackupPayload(restoreInput.backupPayload)
    const rollbackPayload = await buildCompanyBackupPayload(company)
    const rollbackJob = await createBackupExportJob({
      companyId: req.params.companyId,
      requestedByUserId: req.currentUser._id,
      companyName: company.name,
      fileName: buildBackupFileName(company.name, "pre-restore-backup"),
      fileContent: JSON.stringify(rollbackPayload, null, 2),
      summaryJson: {
        company: {
          id: String(company._id),
          name: company.name
        },
        backup_meta: rollbackPayload.meta,
        record_counts: getBackupPayloadRecordCounts(rollbackPayload),
        reason: "automatic pre-restore rollback snapshot"
      },
      relatedResourceId: company._id
    })

    const restoreResult = await restoreCompanyFromBackup({
      company,
      backupPayload: normalizedBackupPayload,
      currentUser: req.currentUser
    })

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.BACKUP_RESTORED,
      target: {
        type: AUDIT_TARGETS.BACKUP,
        id: String(rollbackJob._id),
        label: rollbackJob.fileName || "Backup restore"
      },
      after: {
        restored_company: restoreResult.company,
        restored_counts: restoreResult.restoredCounts,
        backup_meta: restoreResult.meta,
        rollback_backup_id: String(rollbackJob._id)
      },
      metadata: {
        source: restoreInput.source,
        warnings: restoreResult.warnings
      }
    })

    res.status(200).json({
      restore: {
        company: restoreResult.company,
        backup_meta: restoreResult.meta,
        restored_counts: restoreResult.restoredCounts,
        warnings: restoreResult.warnings,
        rollback_backup: serializeExportJob(rollbackJob),
        source: restoreInput.source
      }
    })
  } catch (error){
    next(error)
  }
}

async function getBackup(req, res, next){
  try{
    const backupJob = await ExportJob.findOne({
      _id: req.params.backupId,
      companyId: req.params.companyId,
      type: "backup_json"
    })

    if(!backupJob){
      return res.status(404).json({
        error: {
          code: "BACKUP_NOT_FOUND",
          message: "Backup was not found."
        }
      })
    }

    return sendExportJobFile(res, backupJob, "BACKUP_NOT_FOUND", "Backup was not found.")
  } catch (error){
    next(error)
  }
}

async function downloadExport(req, res, next){
  try{
    const exportJob = await ExportJob.findOne({
      _id: req.params.exportId,
      companyId: req.params.companyId,
      type: { $in: ["employees_csv", "departments_csv", "attendance_csv", "contracts_csv", "payroll_csv"] }
    })

    return sendExportJobFile(res, exportJob, "EXPORT_NOT_FOUND", "Export was not found.")
  } catch (error){
    next(error)
  }
}

module.exports = {
  exportEmployees,
  exportDepartment,
  exportAttendance,
  exportContracts,
  exportPayroll,
  createBackup,
  restoreBackup,
  getBackup,
  downloadExport
}
