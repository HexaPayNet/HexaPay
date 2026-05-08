const mongoose = require("mongoose")

const { Schema, model, models } = mongoose
const { EMPLOYMENT_TYPES, PAYMENT_TYPES, PAYMENT_BASIS_TYPES, RECORD_STATUSES } = require("./constants")

const employeeLoanProfileSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: "",
    trim: true
  },
  principalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  installmentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  installmentFrequency: {
    type: String,
    enum: ["Weekly", "Monthly"],
    default: "Monthly"
  },
  totalInstallments: {
    type: Number,
    default: 0,
    min: 0
  },
  installmentsPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  installmentsRemaining: {
    type: Number,
    default: 0,
    min: 0
  },
  sourceChangeId: {
    type: String,
    default: "",
    trim: true
  },
  nextDeductionDate: {
    type: Date,
    default: null
  }
}, {
  _id: false
})

const employeeFinancialProfileSchema = new Schema({
  applyTaxFinancials: {
    type: Boolean,
    default: false
  },
  statutory: {
    paye: {
      type: Boolean,
      default: true
    },
    shif: {
      type: Boolean,
      default: true
    },
    nssf: {
      type: Boolean,
      default: true
    },
    housingLevy: {
      type: Boolean,
      default: true
    },
    pension: {
      type: Boolean,
      default: true
    },
    insurance: {
      type: Boolean,
      default: true
    }
  },
  loan: {
    type: employeeLoanProfileSchema,
    default: () => ({})
  }
}, {
  _id: false
})

const employeeSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    default: null,
    index: true
  },
  employeeNumber: {
    type: String,
    default: undefined,
    trim: true,
    set(value){
      const normalizedValue = String(value ?? "").trim()
      return normalizedValue || undefined
    }
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  identificationNumber: {
    type: String,
    default: "",
    trim: true
  },
  accountNumber: {
    type: String,
    default: "",
    trim: true
  },
  accountDetails: {
    type: String,
    default: "",
    trim: true
  },
  roleTitle: {
    type: String,
    required: true,
    trim: true
  },
  employmentType: {
    type: String,
    enum: EMPLOYMENT_TYPES,
    required: true,
    index: true
  },
  paymentType: {
    type: String,
    enum: PAYMENT_TYPES,
    default: "monthly",
    index: true
  },
  paymentBasis: {
    type: String,
    enum: PAYMENT_BASIS_TYPES,
    default: "standard"
  },
  employmentDate: {
    type: Date,
    required: true
  },
  salaryAmount: {
    type: Number,
    required: true,
    min: 0
  },
  salaryCurrency: {
    type: String,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3,
    default: "KES"
  },
  status: {
    type: String,
    enum: RECORD_STATUSES.employee,
    default: "active",
    index: true
  },
  payrollStatus: {
    type: String,
    enum: RECORD_STATUSES.payrollStatus,
    default: "pending",
    index: true
  },
  profileImageUrl: {
    type: String,
    default: ""
  },
  financialProfile: {
    type: employeeFinancialProfileSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  versionKey: false
})

employeeSchema.index(
  { companyId: 1, employeeNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      employeeNumber: {
        $exists: true,
        $gt: ""
      }
    }
  }
)
employeeSchema.index({ companyId: 1, fullName: 1 })
employeeSchema.index({ companyId: 1, departmentId: 1, status: 1 })

module.exports = models.Employee || model("Employee", employeeSchema)
