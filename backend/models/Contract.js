const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { CONTRACT_TYPES, RECORD_STATUSES } = require("./constants")

const contractSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
    index: true
  },
  contractNumber: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  roleTitle: {
    type: String,
    required: true,
    trim: true
  },
  contractType: {
    type: String,
    enum: CONTRACT_TYPES,
    required: true,
    index: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
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
    enum: RECORD_STATUSES.contract,
    default: "draft",
    index: true
  },
  notes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true,
  versionKey: false
})

contractSchema.index({ companyId: 1, contractNumber: 1 }, { unique: true })
contractSchema.index({ companyId: 1, employeeId: 1, status: 1 })

module.exports = models.Contract || model("Contract", contractSchema)
