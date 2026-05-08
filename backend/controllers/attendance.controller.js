const { Company } = require("../utils/auth")
const AttendanceLog = require("../models/AttendanceLog")
const Employee = require("../models/Employee")
const { AUDIT_ACTIONS, AUDIT_TARGETS, recordAuditEvent } = require("../services/audit.service")

function serializeEmployeeSummary(employee){
  if(!employee){
    return null
  }

  return {
    id: String(employee._id),
    full_name: employee.fullName,
    role_title: employee.roleTitle,
    status: employee.status
  }
}

function serializeAttendanceLog(log, employee = null){
  if(!log){
    return null
  }

  return {
    id: String(log._id),
    company_id: String(log.companyId),
    employee_id: String(log.employeeId?._id || log.employeeId),
    created_by_user_id: String(log.createdByUserId),
    date: log.date,
    check_in: log.checkIn,
    check_out: log.checkOut,
    mode: log.mode,
    worked_hours: log.workedHours,
    approval_status: log.approvalStatus,
    approval: {
      approver_user_id: log.approval?.approverUserId ? String(log.approval.approverUserId) : null,
      approved_at: log.approval?.approvedAt || null,
      rejected_at: log.approval?.rejectedAt || null,
      rejection_reason: log.approval?.rejectionReason || ""
    },
    employee: employee ? serializeEmployeeSummary(employee) : undefined
  }
}

function normalizeDateOnly(value){
  const date = new Date(value)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function parseTimeToMinutes(value){
  if(!value){
    return null
  }

  const [hours, minutes] = String(value).split(":").map((part) => Number(part))
  if(!Number.isInteger(hours) || !Number.isInteger(minutes)){
    return null
  }

  return (hours * 60) + minutes
}

function calculateWorkedHours(checkIn, checkOut){
  const checkInMinutes = parseTimeToMinutes(checkIn)
  const checkOutMinutes = parseTimeToMinutes(checkOut)

  if(checkInMinutes === null || checkOutMinutes === null || checkOutMinutes < checkInMinutes){
    return 0
  }

  return Number(((checkOutMinutes - checkInMinutes) / 60).toFixed(2))
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getValidEmployee(companyId, employeeId){
  if(!employeeId){
    return null
  }

  return Employee.findOne({
    _id: employeeId,
    companyId
  })
}

async function getAttendanceLogForCompany(companyId, logId){
  return AttendanceLog.findOne({
    _id: logId,
    companyId
  })
}

function handlePersistenceError(error){
  if(error?.code === 11000){
    const conflict = new Error("Attendance has already been recorded for this employee on this date.")
    conflict.statusCode = 409
    conflict.code = "ATTENDANCE_CONFLICT"
    return conflict
  }

  return error
}

async function listAttendanceLogs(req, res, next){
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

    const attendanceLogs = await AttendanceLog.find({
      companyId: req.params.companyId
    }).sort({ date: -1, createdAt: -1 })

    const employeeIds = attendanceLogs.map((log) => log.employeeId).filter(Boolean)
    const employees = await Employee.find({
      _id: { $in: employeeIds },
      companyId: req.params.companyId
    })
    const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))

    res.status(200).json({
      attendance_logs: attendanceLogs.map((log) => serializeAttendanceLog(
        log,
        employeeMap.get(String(log.employeeId)) || null
      ))
    })
  } catch (error){
    next(error)
  }
}

async function createAttendanceLog(req, res, next){
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

    const employee = await getValidEmployee(req.params.companyId, req.body.employee_id)
    if(!employee){
      return res.status(404).json({
        error: {
          code: "EMPLOYEE_NOT_FOUND",
          message: "Employee was not found for this company."
        }
      })
    }

    const attendanceLog = new AttendanceLog({
      companyId: req.params.companyId,
      employeeId: req.body.employee_id,
      createdByUserId: req.currentUser._id,
      date: normalizeDateOnly(req.body.date),
      checkIn: req.body.check_in,
      checkOut: req.body.check_out || null,
      mode: req.body.mode || "manual",
      workedHours: calculateWorkedHours(req.body.check_in, req.body.check_out)
    })

    await attendanceLog.save()

    res.status(201).json({
      attendance_log: serializeAttendanceLog(attendanceLog, employee)
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function getAttendanceLog(req, res, next){
  try{
    const attendanceLog = await getAttendanceLogForCompany(req.params.companyId, req.params.logId)

    if(!attendanceLog){
      return res.status(404).json({
        error: {
          code: "ATTENDANCE_LOG_NOT_FOUND",
          message: "Attendance log was not found."
        }
      })
    }

    const employee = await getValidEmployee(req.params.companyId, attendanceLog.employeeId)

    res.status(200).json({
      attendance_log: serializeAttendanceLog(attendanceLog, employee)
    })
  } catch (error){
    next(error)
  }
}

async function approveAttendanceLog(req, res, next){
  try{
    const attendanceLog = await getAttendanceLogForCompany(req.params.companyId, req.params.logId)

    if(!attendanceLog){
      return res.status(404).json({
        error: {
          code: "ATTENDANCE_LOG_NOT_FOUND",
          message: "Attendance log was not found."
        }
      })
    }

    if(attendanceLog.approvalStatus === "approved"){
      return res.status(409).json({
        error: {
          code: "ATTENDANCE_ALREADY_APPROVED",
          message: "Attendance log has already been approved."
        }
      })
    }

    const employee = await getValidEmployee(req.params.companyId, attendanceLog.employeeId)
    const beforeAttendanceLog = serializeAttendanceLog(attendanceLog, employee)

    attendanceLog.approvalStatus = "approved"
    attendanceLog.approval = {
      approverUserId: req.currentUser._id,
      approvedAt: new Date(),
      rejectedAt: null,
      rejectionReason: ""
    }
    await attendanceLog.save()

    const approvedAttendanceLog = serializeAttendanceLog(attendanceLog, employee)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.ATTENDANCE_APPROVED,
      target: {
        type: AUDIT_TARGETS.ATTENDANCE_LOG,
        id: String(attendanceLog._id),
        label: employee?.fullName || String(attendanceLog.employeeId)
      },
      before: beforeAttendanceLog,
      after: approvedAttendanceLog
    })

    res.status(200).json({
      attendance_log: approvedAttendanceLog
    })
  } catch (error){
    next(error)
  }
}

async function rejectAttendanceLog(req, res, next){
  try{
    const attendanceLog = await getAttendanceLogForCompany(req.params.companyId, req.params.logId)

    if(!attendanceLog){
      return res.status(404).json({
        error: {
          code: "ATTENDANCE_LOG_NOT_FOUND",
          message: "Attendance log was not found."
        }
      })
    }

    if(attendanceLog.approvalStatus === "rejected"){
      return res.status(409).json({
        error: {
          code: "ATTENDANCE_ALREADY_REJECTED",
          message: "Attendance log has already been rejected."
        }
      })
    }

    const employee = await getValidEmployee(req.params.companyId, attendanceLog.employeeId)
    const beforeAttendanceLog = serializeAttendanceLog(attendanceLog, employee)

    attendanceLog.approvalStatus = "rejected"
    attendanceLog.approval = {
      approverUserId: req.currentUser._id,
      approvedAt: null,
      rejectedAt: new Date(),
      rejectionReason: req.body?.reason || ""
    }
    await attendanceLog.save()

    const rejectedAttendanceLog = serializeAttendanceLog(attendanceLog, employee)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.ATTENDANCE_REJECTED,
      target: {
        type: AUDIT_TARGETS.ATTENDANCE_LOG,
        id: String(attendanceLog._id),
        label: employee?.fullName || String(attendanceLog.employeeId)
      },
      before: beforeAttendanceLog,
      after: rejectedAttendanceLog,
      metadata: {
        rejection_reason: req.body?.reason || ""
      }
    })

    res.status(200).json({
      attendance_log: rejectedAttendanceLog
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listAttendanceLogs,
  createAttendanceLog,
  getAttendanceLog,
  approveAttendanceLog,
  rejectAttendanceLog
}
