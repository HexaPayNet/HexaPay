const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { ATTENDANCE_MODES, RECORD_STATUSES } = require("./constants")

const attendanceLogSchema = new Schema({
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
  date: {
    type: Date,
    required: true,
    index: true
  },
  checkIn: {
    type: String,
    required: true,
    trim: true
  },
  checkOut: {
    type: String,
    default: null,
    trim: true
  },
  mode: {
    type: String,
    enum: ATTENDANCE_MODES,
    default: "manual"
  },
  workedHours: {
    type: Number,
    default: 0,
    min: 0
  },
  approvalStatus: {
    type: String,
    enum: RECORD_STATUSES.attendance,
    default: "pending_approval",
    index: true
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

attendanceLogSchema.index({ companyId: 1, employeeId: 1, date: 1 }, { unique: true })

module.exports = models.AttendanceLog || model("AttendanceLog", attendanceLogSchema)
