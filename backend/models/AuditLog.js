const mongoose = require("mongoose")

const { Schema, model, models } = mongoose

const auditLogSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    default: null,
    index: true
  },
  actor: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    displayName: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: ""
    }
  },
  action: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    index: true
  },
  target: {
    type: {
      type: String,
      required: true,
      trim: true
    },
    id: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    }
  },
  context: {
    route: {
      type: String,
      default: ""
    },
    method: {
      type: String,
      default: ""
    },
    ip: {
      type: String,
      default: ""
    },
    userAgent: {
      type: String,
      default: ""
    }
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: null
  },
  before: {
    type: Schema.Types.Mixed,
    default: null
  },
  after: {
    type: Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

auditLogSchema.index({ companyId: 1, createdAt: -1 })
auditLogSchema.index({ "actor.userId": 1, createdAt: -1 })
auditLogSchema.index({ "target.type": 1, "target.id": 1, createdAt: -1 })

module.exports = models.AuditLog || model("AuditLog", auditLogSchema)
