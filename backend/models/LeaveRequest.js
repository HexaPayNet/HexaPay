const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { LEAVE_TYPES, RECORD_STATUSES } = require("./constants")

const leaveRequestSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    index: true
  },
  createdByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  leaveType: {
    type: String,
    enum: LEAVE_TYPES,
    required: true,
    index: true
  },
  fromDate: {
    type: Date,
    required: true,
    index: true
  },
  toDate: {
    type: Date,
    required: true
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.leave,
    default: "pending",
    index: true
  },
  reason: {
    type: String,
    default: ""
  },
  approval: {
    approverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    },
    rejectedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ""
    }
  }
}, {
  timestamps: true,
  versionKey: false
})

leaveRequestSchema.index({ companyId: 1, employeeId: 1, fromDate: 1, toDate: 1, leaveType: 1 })

module.exports = models.LeaveRequest || model("LeaveRequest", leaveRequestSchema)
