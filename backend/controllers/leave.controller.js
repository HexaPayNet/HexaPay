const { Company } = require("../utils/auth")
const LeaveRequest = require("../models/LeaveRequest")
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

function serializeLeaveRequest(leaveRequest, employee = null){
  if(!leaveRequest){
    return null
  }

  return {
    id: String(leaveRequest._id),
    company_id: String(leaveRequest.companyId),
    employee_id: String(leaveRequest.employeeId?._id || leaveRequest.employeeId),
    created_by_user_id: String(leaveRequest.createdByUserId),
    leave_type: leaveRequest.leaveType,
    from_date: leaveRequest.fromDate,
    to_date: leaveRequest.toDate,
    requested_date: leaveRequest.requestedDate,
    status: leaveRequest.status,
    reason: leaveRequest.reason,
    approval: {
      approver_user_id: leaveRequest.approval?.approverUserId ? String(leaveRequest.approval.approverUserId) : null,
      approved_at: leaveRequest.approval?.approvedAt || null,
      rejected_at: leaveRequest.approval?.rejectedAt || null,
      rejection_reason: leaveRequest.approval?.rejectionReason || ""
    },
    employee: employee ? serializeEmployeeSummary(employee) : undefined
  }
}

function normalizeDateOnly(value){
  const date = new Date(value)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
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

async function getLeaveRequestForCompany(companyId, requestId){
  return LeaveRequest.findOne({
    _id: requestId,
    companyId
  })
}

async function listLeaveRequests(req, res, next){
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

    const leaveRequests = await LeaveRequest.find({
      companyId: req.params.companyId
    }).sort({ requestedDate: -1, createdAt: -1 })

    const employeeIds = leaveRequests.map((request) => request.employeeId).filter(Boolean)
    const employees = await Employee.find({
      _id: { $in: employeeIds },
      companyId: req.params.companyId
    })
    const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))

    res.status(200).json({
      leave_requests: leaveRequests.map((leaveRequest) => serializeLeaveRequest(
        leaveRequest,
        employeeMap.get(String(leaveRequest.employeeId)) || null
      ))
    })
  } catch (error){
    next(error)
  }
}

async function createLeaveRequest(req, res, next){
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

    const leaveRequest = await LeaveRequest.create({
      companyId: req.params.companyId,
      employeeId: req.body.employee_id,
      createdByUserId: req.currentUser._id,
      leaveType: req.body.leave_type,
      fromDate: normalizeDateOnly(req.body.from_date),
      toDate: normalizeDateOnly(req.body.to_date),
      requestedDate: new Date(),
      status: "pending",
      reason: req.body.reason || ""
    })

    res.status(201).json({
      leave_request: serializeLeaveRequest(leaveRequest, employee)
    })
  } catch (error){
    next(error)
  }
}

async function getLeaveRequest(req, res, next){
  try{
    const leaveRequest = await getLeaveRequestForCompany(req.params.companyId, req.params.requestId)

    if(!leaveRequest){
      return res.status(404).json({
        error: {
          code: "LEAVE_REQUEST_NOT_FOUND",
          message: "Leave request was not found."
        }
      })
    }

    const employee = await getValidEmployee(req.params.companyId, leaveRequest.employeeId)

    res.status(200).json({
      leave_request: serializeLeaveRequest(leaveRequest, employee)
    })
  } catch (error){
    next(error)
  }
}

async function approveLeaveRequest(req, res, next){
  try{
    const leaveRequest = await getLeaveRequestForCompany(req.params.companyId, req.params.requestId)

    if(!leaveRequest){
      return res.status(404).json({
        error: {
          code: "LEAVE_REQUEST_NOT_FOUND",
          message: "Leave request was not found."
        }
      })
    }

    if(leaveRequest.status === "active"){
      return res.status(409).json({
        error: {
          code: "LEAVE_ALREADY_APPROVED",
          message: "Leave request has already been approved."
        }
      })
    }

    const employee = await getValidEmployee(req.params.companyId, leaveRequest.employeeId)
    const beforeLeaveRequest = serializeLeaveRequest(leaveRequest, employee)

    leaveRequest.status = "active"
    leaveRequest.approval = {
      approverUserId: req.currentUser._id,
      approvedAt: new Date(),
      rejectedAt: null,
      rejectionReason: ""
    }
    await leaveRequest.save()

    if(employee){
      employee.status = "on_leave"
      await employee.save()
    }

    const approvedLeaveRequest = serializeLeaveRequest(leaveRequest, employee)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.LEAVE_APPROVED,
      target: {
        type: AUDIT_TARGETS.LEAVE_REQUEST,
        id: String(leaveRequest._id),
        label: employee?.fullName || leaveRequest.leaveType
      },
      before: beforeLeaveRequest,
      after: approvedLeaveRequest
    })

    res.status(200).json({
      leave_request: approvedLeaveRequest
    })
  } catch (error){
    next(error)
  }
}

async function rejectLeaveRequest(req, res, next){
  try{
    const leaveRequest = await getLeaveRequestForCompany(req.params.companyId, req.params.requestId)

    if(!leaveRequest){
      return res.status(404).json({
        error: {
          code: "LEAVE_REQUEST_NOT_FOUND",
          message: "Leave request was not found."
        }
      })
    }

    if(leaveRequest.status === "rejected"){
      return res.status(409).json({
        error: {
          code: "LEAVE_ALREADY_REJECTED",
          message: "Leave request has already been rejected."
        }
      })
    }

    const employee = await getValidEmployee(req.params.companyId, leaveRequest.employeeId)
    const beforeLeaveRequest = serializeLeaveRequest(leaveRequest, employee)

    leaveRequest.status = "rejected"
    leaveRequest.approval = {
      approverUserId: req.currentUser._id,
      approvedAt: null,
      rejectedAt: new Date(),
      rejectionReason: req.body?.reason || ""
    }
    await leaveRequest.save()

    const rejectedLeaveRequest = serializeLeaveRequest(leaveRequest, employee)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.LEAVE_REJECTED,
      target: {
        type: AUDIT_TARGETS.LEAVE_REQUEST,
        id: String(leaveRequest._id),
        label: employee?.fullName || leaveRequest.leaveType
      },
      before: beforeLeaveRequest,
      after: rejectedLeaveRequest,
      metadata: {
        rejection_reason: req.body?.reason || ""
      }
    })

    res.status(200).json({
      leave_request: rejectedLeaveRequest
    })
  } catch (error){
    next(error)
  }
}

async function completeLeaveRequest(req, res, next){
  try{
    const leaveRequest = await getLeaveRequestForCompany(req.params.companyId, req.params.requestId)

    if(!leaveRequest){
      return res.status(404).json({
        error: {
          code: "LEAVE_REQUEST_NOT_FOUND",
          message: "Leave request was not found."
        }
      })
    }

    if(leaveRequest.status === "completed"){
      return res.status(409).json({
        error: {
          code: "LEAVE_ALREADY_COMPLETED",
          message: "Leave request has already been completed."
        }
      })
    }

    leaveRequest.status = "completed"
    await leaveRequest.save()

    const employee = await getValidEmployee(req.params.companyId, leaveRequest.employeeId)
    if(employee){
      employee.status = "active"
      await employee.save()
    }

    res.status(200).json({
      leave_request: serializeLeaveRequest(leaveRequest, employee)
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listLeaveRequests,
  createLeaveRequest,
  getLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  completeLeaveRequest
}
