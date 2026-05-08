const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { DEPARTMENT_SALARY_TYPES, RECORD_STATUSES } = require("./constants")

const payrollRunSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  departmentScopeId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    default: null,
    index: true
  },
  generatedByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  salaryType: {
    type: String,
    enum: DEPARTMENT_SALARY_TYPES,
    required: true
  },
  currencyCode: {
    type: String,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3,
    default: "KES"
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.payrollRun,
    default: "draft",
    index: true
  },
  totals: {
    baseSalary: {
      type: Number,
      default: 0,
      min: 0
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0
    },
    netPay: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  approval: {
    approverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rejectionReason: {
      type: String,
      default: ""
    }
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

payrollRunSchema.index(
  { companyId: 1, period: 1, salaryType: 1, departmentScopeId: 1 },
  { unique: true }
)

module.exports = models.PayrollRun || model("PayrollRun", payrollRunSchema)
