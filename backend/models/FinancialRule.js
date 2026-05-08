const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const {
  FINANCIAL_RULE_SCOPES,
  FINANCIAL_RULE_TARGET_TYPES,
  FINANCIAL_RULE_TYPES,
  FINANCIAL_RULE_VALUE_TYPES
} = require("./constants")

const financialRuleSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  ruleType: {
    type: String,
    enum: FINANCIAL_RULE_TYPES,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  valueType: {
    type: String,
    enum: FINANCIAL_RULE_VALUE_TYPES,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  taxable: {
    type: Boolean,
    default: true
  },
  incomeCategory: {
    type: String,
    default: "other_taxable_income",
    trim: true
  },
  scope: {
    type: String,
    enum: FINANCIAL_RULE_SCOPES,
    required: true,
    index: true
  },
  targetType: {
    type: String,
    enum: FINANCIAL_RULE_TARGET_TYPES,
    default: null
  },
  targetId: {
    type: Schema.Types.ObjectId,
    default: null
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    index: true
  },
  effectiveFrom: {
    type: Date,
    default: null
  },
  effectiveTo: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
})

financialRuleSchema.index({ companyId: 1, ruleType: 1, name: 1, scope: 1 })

module.exports = models.FinancialRule || model("FinancialRule", financialRuleSchema)
