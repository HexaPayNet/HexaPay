const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { MEMBERSHIP_ROLES, RECORD_STATUSES } = require("./constants")

const companyMembershipSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  invitedByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  role: {
    type: String,
    enum: MEMBERSHIP_ROLES,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.membership,
    default: "invited",
    index: true
  },
  joinedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

companyMembershipSchema.index({ companyId: 1, userId: 1 }, { unique: true })

module.exports = models.CompanyMembership || model("CompanyMembership", companyMembershipSchema)
