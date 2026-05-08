const { CONTRACT_TYPES, RECORD_STATUSES } = require("../models/constants")
const { parseIsoDate } = require("./_shared")

function validateObjectIdParam(paramName){
  return (req) => {
    const value = req.params?.[paramName]
    const objectIdPattern = /^[a-f\d]{24}$/i

    if(!value){
      return [{
        field: `params.${paramName}`,
        message: `${paramName} is required.`
      }]
    }

    return objectIdPattern.test(String(value))
      ? []
      : [{
          field: `params.${paramName}`,
          message: `${paramName} must be a valid ObjectId.`
        }]
  }
}

function validateOptionalEmployeeId(req){
  const value = req.body?.employee_id
  if(value === undefined || value === null || value === ""){
    return []
  }

  return /^[a-f\d]{24}$/i.test(String(value))
    ? []
    : [{
        field: "body.employee_id",
        message: "employee_id must be a valid ObjectId."
      }]
}

function validateRequiredString(field){
  return (req) => {
    const value = req.body?.[field]
    const normalizedValue = String(value || "").trim()
    if(!normalizedValue){
      return [{
        field: `body.${field}`,
        message: `${field} is required.`
      }]
    }

    const maxLengthByField = {
      contract_number: 60,
      name: 160,
      role_title: 120
    }
    const maxLength = maxLengthByField[field]

    return maxLength && normalizedValue.length > maxLength
      ? [{
          field: `body.${field}`,
          message: `${field} must be at most ${maxLength} characters long.`
        }]
      : []
  }
}

function validateOptionalNonEmptyStrings(fields){
  return (req) => fields.flatMap((field) => {
    const value = req.body?.[field]
    if(value === undefined || value === null){
      return []
    }

    const normalizedValue = String(value).trim()
    if(!normalizedValue){
      return [{
        field: `body.${field}`,
        message: `${field} cannot be empty.`
      }]
    }

    const maxLengthByField = {
      contract_number: 60,
      name: 160,
      role_title: 120,
      notes: 2000
    }
    const maxLength = maxLengthByField[field]

    return maxLength && normalizedValue.length > maxLength
      ? [{
          field: `body.${field}`,
          message: `${field} must be at most ${maxLength} characters long.`
        }]
      : []
  })
}

function validateRequiredContractType(req){
  const value = req.body?.contract_type

  if(!value){
    return [{
      field: "body.contract_type",
      message: "contract_type is required."
    }]
  }

  return CONTRACT_TYPES.includes(String(value))
    ? []
    : [{
        field: "body.contract_type",
        message: `contract_type must be one of: ${CONTRACT_TYPES.join(", ")}.`
      }]
}

function validateOptionalContractType(req){
  const value = req.body?.contract_type
  if(value === undefined){
    return []
  }

  return CONTRACT_TYPES.includes(String(value))
    ? []
    : [{
        field: "body.contract_type",
        message: `contract_type must be one of: ${CONTRACT_TYPES.join(", ")}.`
      }]
}

function validateRequiredDate(field){
  return (req) => {
    const value = req.body?.[field]
    if(!value){
      return [{
        field: `body.${field}`,
        message: `${field} is required.`
      }]
    }

    return parseIsoDate(value)
      ? []
      : [{
          field: `body.${field}`,
          message: `${field} must be a valid date in YYYY-MM-DD format.`
        }]
  }
}

function validateOptionalDate(field){
  return (req) => {
    const value = req.body?.[field]
    if(value === undefined || value === null || value === ""){
      return []
    }

    return parseIsoDate(value)
      ? []
      : [{
          field: `body.${field}`,
          message: `${field} must be a valid date in YYYY-MM-DD format.`
        }]
  }
}

function validateDateRange(req){
  const startDate = req.body?.start_date
  const endDate = req.body?.end_date

  if(!startDate || endDate === undefined || endDate === null || endDate === ""){
    return []
  }

  const start = parseIsoDate(startDate)
  const end = parseIsoDate(endDate)

  if(!start || !end){
    return []
  }

  return end.getTime() >= start.getTime()
    ? []
    : [{
        field: "body.end_date",
        message: "end_date must be on or after start_date."
      }]
}

function validateRequiredNonNegativeNumber(field){
  return (req) => {
    const value = req.body?.[field]
    if(value === undefined || value === null || value === ""){
      return [{
        field: `body.${field}`,
        message: `${field} is required.`
      }]
    }

    const numericValue = Number(value)
    return Number.isFinite(numericValue) && numericValue >= 0
      ? []
      : [{
          field: `body.${field}`,
          message: `${field} must be a non-negative number.`
        }]
  }
}

function validateOptionalNonNegativeNumber(field){
  return (req) => {
    const value = req.body?.[field]
    if(value === undefined){
      return []
    }

    const numericValue = Number(value)
    return Number.isFinite(numericValue) && numericValue >= 0
      ? []
      : [{
          field: `body.${field}`,
          message: `${field} must be a non-negative number.`
        }]
  }
}

function validateOptionalCurrencyCode(req){
  const value = req.body?.currency_code
  if(value === undefined){
    return []
  }

  return /^[A-Za-z]{3}$/.test(String(value).trim())
    ? []
    : [{
        field: "body.currency_code",
        message: "currency_code must be a 3-letter currency code."
      }]
}

function validateOptionalStatus(req){
  const value = req.body?.status
  if(value === undefined){
    return []
  }

  return RECORD_STATUSES.contract.includes(String(value))
    ? []
    : [{
        field: "body.status",
        message: `status must be one of: ${RECORD_STATUSES.contract.join(", ")}.`
      }]
}

function validateAllowedFields(allowedFields, emptyMessage){
  return (req) => {
    const body = req.body || {}
    const providedFields = Object.keys(body)

    if(emptyMessage && !providedFields.length){
      return [{
        field: "body",
        message: emptyMessage
      }]
    }

    return providedFields
      .filter((field) => !allowedFields.has(field))
      .map((field) => ({
        field: `body.${field}`,
        message: `${field} is not allowed.`
      }))
  }
}

function composeValidators(name, validators){
  return {
    name,
    validate(req){
      return validators.flatMap((validator) => validator(req))
    }
  }
}

const allowedContractFields = new Set([
  "employee_id",
  "contract_number",
  "name",
  "role_title",
  "contract_type",
  "start_date",
  "end_date",
  "payment_amount",
  "currency_code",
  "status",
  "notes"
])

module.exports = {
  listContracts: composeValidators("contracts.listContracts", [
    validateObjectIdParam("companyId")
  ]),
  createContract: composeValidators("contracts.createContract", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(allowedContractFields),
    validateOptionalEmployeeId,
    validateRequiredString("contract_number"),
    validateRequiredString("name"),
    validateRequiredString("role_title"),
    validateRequiredContractType,
    validateRequiredDate("start_date"),
    validateOptionalDate("end_date"),
    validateDateRange,
    validateRequiredNonNegativeNumber("payment_amount"),
    validateOptionalCurrencyCode,
    validateOptionalStatus,
    validateOptionalNonEmptyStrings(["notes"])
  ]),
  getContract: composeValidators("contracts.getContract", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("contractId")
  ]),
  updateContract: composeValidators("contracts.updateContract", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("contractId"),
    validateAllowedFields(allowedContractFields, "At least one contract field must be provided."),
    validateOptionalEmployeeId,
    validateOptionalContractType,
    validateOptionalDate("start_date"),
    validateOptionalDate("end_date"),
    validateDateRange,
    validateOptionalNonNegativeNumber("payment_amount"),
    validateOptionalCurrencyCode,
    validateOptionalStatus,
    validateOptionalNonEmptyStrings([
      "contract_number",
      "name",
      "role_title",
      "notes"
    ])
  ]),
  deleteContract: composeValidators("contracts.deleteContract", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("contractId")
  ])
}
