function trimStringValue(value){
  return typeof value === "string"
    ? value.trim()
    : value
}

function normalizeValue(value){
  if(Array.isArray(value)){
    return value.map(normalizeValue)
  }

  if(value && typeof value === "object"){
    return Object.entries(value).reduce((normalized, [key, nestedValue]) => {
      normalized[key] = normalizeValue(nestedValue)
      return normalized
    }, {})
  }

  return trimStringValue(value)
}

function normalizeRequestPayload(req){
  req.body = normalizeValue(req.body || {})
  req.query = normalizeValue(req.query || {})
  req.params = normalizeValue(req.params || {})
}

function normalizeFieldPath(field){
  const normalizedField = String(field || "").trim()
  return normalizedField.replace(/^(body|params|query)\./, "")
}

function normalizeValidationError(error, index){
  if(!error || typeof error !== "object"){
    return {
      field: `request.${index}`,
      message: "Invalid request data."
    }
  }

  return {
    field: normalizeFieldPath(error.field || `request.${index}`),
    message: String(error.message || "Invalid request data.").trim()
  }
}

function deduplicateValidationErrors(errors){
  const seen = new Set()

  return errors.filter((error) => {
    const key = `${error.field}:${error.message}`
    if(seen.has(key)){
      return false
    }

    seen.add(key)
    return true
  })
}

function getValidatorFunctions(schema){
  if(Array.isArray(schema)){
    return schema.filter((validator) => typeof validator === "function")
  }

  if(typeof schema === "function"){
    return [schema]
  }

  if(schema && typeof schema.validate === "function"){
    return [schema.validate.bind(schema)]
  }

  if(schema && Array.isArray(schema.validate)){
    return schema.validate.filter((validator) => typeof validator === "function")
  }

  return []
}

function getSchemaName(schema){
  if(schema && typeof schema === "object" && typeof schema.name === "string" && schema.name.trim()){
    return schema.name.trim()
  }

  if(typeof schema === "function" && schema.name){
    return schema.name
  }

  return "unnamed-schema"
}

function runValidation(schema, req){
  const validators = getValidatorFunctions(schema)

  if(!validators.length){
    const error = new Error(`Validation schema "${getSchemaName(schema)}" is not configured correctly.`)
    error.statusCode = 500
    error.code = "VALIDATION_SCHEMA_INVALID"
    throw error
  }

  return validators.flatMap((validator) => {
    const result = validator(req)

    if(!result){
      return []
    }

    return Array.isArray(result)
      ? result
      : [result]
  })
}

function validateRequest(schema){
  return (req, res, next) => {
    req.validationContext = req.validationContext || []

    try{
      normalizeRequestPayload(req)

      const schemaName = getSchemaName(schema)
      const rawErrors = runValidation(schema, req)
      const errors = deduplicateValidationErrors(
        rawErrors.map((error, index) => normalizeValidationError(error, index))
      )

      req.validationContext.push({
        schema: schemaName,
        status: errors.length ? "failed" : "passed",
        errors
      })

      if(errors.length){
        return res.status(400).json({
          status: "fail",
          message: "Validation error",
          errors
        })
      }

      next()
    } catch (error){
      next(error)
    }
  }
}

module.exports = {
  validateRequest
}
