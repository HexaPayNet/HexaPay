const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { RECORD_STATUSES } = require("./constants")

const payrollBreakdownEntrySchema = new Schema({
  sourceType: {
    type: String,
    default: "manual",
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  changeId: {
    type: String,
    default: ""
  },
  scope: {
    type: String,
    default: "",
    trim: true
  },
  targetLabel: {
    type: String,
    default: "",
    trim: true
  }
}, {
  _id: false
})

const payrollItemSchema = new Schema({
  payrollRunId: {
    type: Schema.Types.ObjectId,
    ref: "PayrollRun",
    required: true,
    index: true
  },
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
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    default: null,
    index: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  grossPay: {
    type: Number,
    default: 0,
    min: 0
  },
  taxablePay: {
    type: Number,
    default: 0,
    min: 0
  },
  payeTaxableBase: {
    type: Number,
    default: 0,
    min: 0
  },
  allowancesTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  deductionsTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  structureAllowancesTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  financialRuleAllowancesTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  structureDeductionsTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  statutoryDeductionsTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  financialRuleDeductionsTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  loanDeductionsTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  allowanceBreakdown: {
    type: [payrollBreakdownEntrySchema],
    default: []
  },
  deductionBreakdown: {
    type: [payrollBreakdownEntrySchema],
    default: []
  },
  netPay: {
    type: Number,
    required: true
  },
  attendanceDays: {
    type: Number,
    default: 0,
    min: 0
  },
  approvalStatus: {
    type: String,
    enum: RECORD_STATUSES.payrollItemApproval,
    default: "pending",
    index: true
  },
  signed: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date,
    default: null
  },
  paidByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

payrollItemSchema.index({ payrollRunId: 1, employeeId: 1 }, { unique: true })
payrollItemSchema.index({ companyId: 1, employeeId: 1 })

module.exports = models.PayrollItem || model("PayrollItem", payrollItemSchema)
