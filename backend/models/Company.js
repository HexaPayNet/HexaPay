const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { RECORD_STATUSES } = require("./constants")

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    default: "",
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  currencyCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3
  },
  countryCode: {
    type: String,
    default: "KE",
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 2
  },
  timezone: {
    type: String,
    default: "Africa/Nairobi",
    trim: true
  },
  logoUrl: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.company,
    default: "active",
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
})

companySchema.index({ name: 1 })
companySchema.index({ email: 1 })

module.exports = models.Company || model("Company", companySchema)
