const mongoose = require("mongoose")

const { Schema, model, models } = mongoose

const companySettingSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  key: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  valueJson: {
    type: Schema.Types.Mixed,
    default: {}
  },
  updatedByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

companySettingSchema.index({ companyId: 1, key: 1 }, { unique: true })

module.exports = models.CompanySetting || model("CompanySetting", companySettingSchema)
