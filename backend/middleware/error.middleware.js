function errorMiddleware(err, req, res, next){
  const statusCode = err.statusCode || 500

  if(res.headersSent){
    return next(err)
  }

  res.status(statusCode).json({
    error: {
      code: err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR"),
      message: err.message || "Something went wrong."
    }
  })
}

module.exports = errorMiddleware
