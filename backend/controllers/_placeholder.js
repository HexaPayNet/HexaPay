function sanitizeBody(body = {}){
  if(!body || typeof body !== "object"){
    return {}
  }

  const clone = { ...body }
  ;["password", "refresh_token", "refreshToken"].forEach((field) => {
    if(field in clone){
      clone[field] = "[REDACTED]"
    }
  })

  return clone
}

function createPlaceholderHandler(operationId){
  return (req, res) => {
    res.status(501).json({
      error: {
        code: "NOT_IMPLEMENTED",
        message: `${operationId} is not implemented yet.`
      },
      operationId,
      requestContext: {
        params: req.params,
        query: req.query,
        body: sanitizeBody(req.body),
        auth: req.authContext || null,
        companyScope: req.companyScope || null,
        validation: req.validationContext || []
      }
    })
  }
}

module.exports = {
  createPlaceholderHandler
}
