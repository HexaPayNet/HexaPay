const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { RECORD_STATUSES } = require("./constants")

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    default: "",
    trim: true
  },
  avatarUrl: {
    type: String,
    default: "",
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  tokenVersion: {
    type: Number,
    default: 0,
    min: 0,
    select: false
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.user,
    default: "active",
    index: true
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.index({ email: 1 }, { unique: true })

module.exports = models.User || model("User", userSchema)
