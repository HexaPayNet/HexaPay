const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { HOLIDAY_SCOPES, RECORD_STATUSES } = require("./constants")

const holidaySchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  scope: {
    type: String,
    enum: HOLIDAY_SCOPES,
    default: "company",
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  countryCode: {
    type: String,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 2,
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

holidaySchema.index({ companyId: 1, scope: 1, name: 1, date: 1 }, { unique: true })

module.exports = models.Holiday || model("Holiday", holidaySchema)
