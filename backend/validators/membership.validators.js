const { MEMBERSHIP_ROLES, RECORD_STATUSES } = require("../models/constants")

function isSupportedMembershipRole(value){
  const normalizedValue = String(value || "").trim().toUpperCase()
  return MEMBERSHIP_ROLES.includes(normalizedValue) || normalizedValue === "MEMBER"
}

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

function validateRequiredEmail(req){
  const value = req.body?.email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if(!value){
    return [{
      field: "body.email",
      message: "email is required."
    }]
  }

  return emailPattern.test(String(value).trim())
    ? []
    : [{
        field: "body.email",
        message: "email must be a valid email address."
      }]
}

function validateOptionalDisplayName(req){
  const value = req.body?.display_name
  if(value === undefined){
    return []
  }

  const normalizedValue = String(value).trim()
  if(!normalizedValue){
    return [{
      field: "body.display_name",
      message: "display_name cannot be empty."
    }]
  }

  return normalizedValue.length <= 120
    ? []
    : [{
        field: "body.display_name",
        message: "display_name must be at most 120 characters long."
      }]
}

function validateOptionalTitle(req){
  const value = req.body?.title
  if(value === undefined){
    return []
  }

  const normalizedValue = String(value).trim()
  if(!normalizedValue){
    return [{
      field: "body.title",
      message: "title cannot be empty."
    }]
  }

  return normalizedValue.length <= 120
    ? []
    : [{
        field: "body.title",
        message: "title must be at most 120 characters long."
      }]
}

function validateOptionalPassword(req){
  const value = String(req.body?.password || "")
  if(req.body?.password === undefined){
    return []
  }

  if(!value){
    return [{
      field: "body.password",
      message: "password cannot be empty."
    }]
  }

  if(value.length < 8){
    return [{
      field: "body.password",
      message: "password must be at least 8 characters long."
    }]
  }

  const hasUppercase = /[A-Z]/.test(value)
  const hasLowercase = /[a-z]/.test(value)
  const hasDigit = /\d/.test(value)
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value)

  return hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter
    ? []
    : [{
        field: "body.password",
        message: "password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
      }]
}

function validateRequiredRole(req){
  const value = req.body?.role

  if(!value){
    return [{
      field: "body.role",
      message: "role is required."
    }]
  }

  return isSupportedMembershipRole(value)
    ? []
    : [{
        field: "body.role",
        message: `role must be one of: ${MEMBERSHIP_ROLES.join(", ")}.`
      }]
}

function validateAllowedCreateFields(req){
  const allowedFields = new Set(["email", "role", "display_name", "title", "password"])
  const body = req.body || {}

  return Object.keys(body)
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.${field}`,
      message: `${field} is not allowed when creating a membership.`
    }))
}

function validateAllowedUpdateFields(req){
  const allowedFields = new Set(["role", "status"])
  const body = req.body || {}
  const providedFields = Object.keys(body)

  if(!providedFields.length){
    return [{
      field: "body",
      message: "At least one membership field must be provided."
    }]
  }

  return providedFields
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.${field}`,
      message: `${field} is not allowed to be updated.`
    }))
}

function validateOptionalRole(req){
  const value = req.body?.role
  if(value === undefined){
    return []
  }

  return isSupportedMembershipRole(value)
    ? []
    : [{
        field: "body.role",
        message: `role must be one of: ${MEMBERSHIP_ROLES.join(", ")}.`
      }]
}

function validateOptionalMembershipStatus(req){
  const value = req.body?.status
  if(value === undefined){
    return []
  }

  return RECORD_STATUSES.membership.includes(String(value))
    ? []
    : [{
        field: "body.status",
        message: `status must be one of: ${RECORD_STATUSES.membership.join(", ")}.`
      }]
}

function composeValidators(name, validators){
  return {
    name,
    validate(req){
      return validators.flatMap((validator) => validator(req))
    }
  }
}

module.exports = {
  listMemberships: composeValidators("memberships.listMemberships", [
    validateObjectIdParam("companyId")
  ]),
  createMembership: composeValidators("memberships.createMembership", [
    validateObjectIdParam("companyId"),
    validateAllowedCreateFields,
    validateRequiredEmail,
    validateOptionalDisplayName,
    validateOptionalTitle,
    validateOptionalPassword,
    validateOptionalRole
  ]),
  updateMembership: composeValidators("memberships.updateMembership", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("membershipId"),
    validateAllowedUpdateFields,
    validateOptionalRole,
    validateOptionalMembershipStatus
  ]),
  deleteMembership: composeValidators("memberships.deleteMembership", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("membershipId")
  ])
}
