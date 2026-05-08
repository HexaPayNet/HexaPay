const AuditLog = require("../models/AuditLog")

const AUDIT_ACTIONS = Object.freeze({
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  EMPLOYEE_CREATED: "EMPLOYEE_CREATED",
  EMPLOYEE_UPDATED: "EMPLOYEE_UPDATED",
  EMPLOYEE_DELETED: "EMPLOYEE_DELETED",
  PAYROLL_GENERATED: "PAYROLL_GENERATED",
  PAYROLL_REGENERATED: "PAYROLL_REGENERATED",
  PAYROLL_APPROVED: "PAYROLL_APPROVED",
  PAYROLL_POSTED: "PAYROLL_POSTED",
  PAYROLL_REJECTED: "PAYROLL_REJECTED",
  PAYROLL_STRUCTURE_APPROVED: "PAYROLL_STRUCTURE_APPROVED",
  PAYROLL_STRUCTURE_REJECTED: "PAYROLL_STRUCTURE_REJECTED",
  PAYROLL_CALENDAR_APPROVED: "PAYROLL_CALENDAR_APPROVED",
  PAYROLL_CALENDAR_REJECTED: "PAYROLL_CALENDAR_REJECTED",
  ATTENDANCE_APPROVED: "ATTENDANCE_APPROVED",
  ATTENDANCE_REJECTED: "ATTENDANCE_REJECTED",
  LEAVE_APPROVED: "LEAVE_APPROVED",
  LEAVE_REJECTED: "LEAVE_REJECTED",
  SETTINGS_UPDATED: "SETTINGS_UPDATED",
  FINANCIAL_RULE_CREATED: "FINANCIAL_RULE_CREATED",
  FINANCIAL_RULE_UPDATED: "FINANCIAL_RULE_UPDATED",
  FINANCIAL_RULE_ARCHIVED: "FINANCIAL_RULE_ARCHIVED",
  EXPORT_CREATED: "EXPORT_CREATED",
  BACKUP_CREATED: "BACKUP_CREATED",
  BACKUP_RESTORED: "BACKUP_RESTORED"
})

const AUDIT_TARGETS = Object.freeze({
  SESSION: "session",
  EMPLOYEE: "employee",
  PAYROLL_RUN: "payroll_run",
  PAYROLL_STRUCTURE: "payroll_structure",
  PAYROLL_CALENDAR: "payroll_calendar",
  ATTENDANCE_LOG: "attendance_log",
  LEAVE_REQUEST: "leave_request",
  SETTINGS: "settings",
  FINANCIAL_RULE: "financial_rule",
  EXPORT_JOB: "export_job",
  BACKUP: "backup"
})

const SENSITIVE_KEY_PATTERN = /(password|passwordhash|token|secret|authorization|refresh_token|access_token)/i

function isPlainObject(value){
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function toCleanString(value){
  return value === undefined || value === null
    ? ""
    : String(value).trim()
}

function toNullableString(value){
  const normalized = toCleanString(value)
  return normalized || null
}

function sanitizeForAudit(value, parentKey = ""){
  if(value === undefined){
    return undefined
  }

  if(value === null){
    return null
  }

  if(value instanceof Date){
    return value.toISOString()
  }

  if(Array.isArray(value)){
    return value.map((entry) => sanitizeForAudit(entry, parentKey))
  }

  if(Buffer.isBuffer(value)){
    return "[buffer]"
  }

  if(isPlainObject(value)){
    return Object.entries(value).reduce((result, [key, nestedValue]) => {
      if(SENSITIVE_KEY_PATTERN.test(key) || SENSITIVE_KEY_PATTERN.test(parentKey)){
        result[key] = "[redacted]"
        return result
      }

      const sanitizedValue = sanitizeForAudit(nestedValue, key)
      if(sanitizedValue !== undefined){
        result[key] = sanitizedValue
      }
      return result
    }, {})
  }

  return value
}

function buildActorSnapshot({ req, actorUser, actorRole } = {}){
  const user = actorUser || req?.currentUser || null

  return {
    userId: user?._id || null,
    displayName: toCleanString(user?.displayName),
    email: toCleanString(user?.email),
    role: toCleanString(actorRole || req?.companyScope?.role || req?.authContext?.role)
  }
}

function buildRequestContext(req){
  if(!req){
    return {
      route: "",
      method: "",
      ip: "",
      userAgent: ""
    }
  }

  const forwardedFor = req.headers?.["x-forwarded-for"]
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : String(forwardedFor || "").split(",")[0].trim() || req.ip || req.socket?.remoteAddress || ""

  return {
    route: toCleanString(req.originalUrl || req.baseUrl || req.path),
    method: toCleanString(req.method).toUpperCase(),
    ip: toCleanString(ip),
    userAgent: toCleanString(req.get ? req.get("user-agent") : req.headers?.["user-agent"])
  }
}

async function recordAuditEvent({
  req,
  companyId,
  actorUser,
  actorRole,
  action,
  target,
  before = null,
  after = null,
  metadata = null
}){
  if(!action || !target?.type){
    return null
  }

  try{
    return await AuditLog.create({
      companyId: companyId || req?.params?.companyId || req?.authContext?.activeCompanyId || null,
      actor: buildActorSnapshot({ req, actorUser, actorRole }),
      action,
      target: {
        type: target.type,
        id: toCleanString(target.id),
        label: toCleanString(target.label)
      },
      context: buildRequestContext(req),
      metadata: metadata ? sanitizeForAudit(metadata) : null,
      before: before ? sanitizeForAudit(before) : null,
      after: after ? sanitizeForAudit(after) : null
    })
  } catch (error){
    console.error(`[audit] Failed to record ${action}:`, error.message)
    return null
  }
}

module.exports = {
  AUDIT_ACTIONS,
  AUDIT_TARGETS,
  recordAuditEvent,
  sanitizeForAudit
}
