const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { EXPORT_JOB_STATUSES, EXPORT_JOB_TYPES } = require("./constants")

const exportJobSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  requestedByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: EXPORT_JOB_TYPES,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: EXPORT_JOB_STATUSES,
    default: "queued",
    index: true
  },
  fileUrl: {
    type: String,
    default: ""
  },
  fileName: {
    type: String,
    default: ""
  },
  filePath: {
    type: String,
    default: ""
  },
  mimeType: {
    type: String,
    default: "application/octet-stream"
  },
  filtersJson: {
    type: Schema.Types.Mixed,
    default: {}
  },
  summaryJson: {
    type: Schema.Types.Mixed,
    default: {}
  },
  relatedResourceId: {
    type: Schema.Types.ObjectId,
    default: null
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

exportJobSchema.index({ companyId: 1, type: 1, requestedAt: -1 })

module.exports = models.ExportJob || model("ExportJob", exportJobSchema)
