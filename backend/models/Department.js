const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { DEPARTMENT_SALARY_TYPES, RECORD_STATUSES } = require("./constants")

const departmentSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  salaryType: {
    type: String,
    enum: DEPARTMENT_SALARY_TYPES,
    default: "monthly"
  },
  defaultSalaryAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  defaultSalaryCurrency: {
    type: String,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3,
    default: "KES"
  },
  hodEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    default: null
  },
  iconKey: {
    type: String,
    default: "fa-building",
    trim: true
  },
  notes: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.department,
    default: "active",
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
})

departmentSchema.index({ companyId: 1, name: 1 }, { unique: true })

module.exports = models.Department || model("Department", departmentSchema)
