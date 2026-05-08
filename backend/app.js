const express = require("express")

const env = require("./config/env")
const apiRoutes = require("./routes")
const notFoundMiddleware = require("./middleware/notFound.middleware")
const errorMiddleware = require("./middleware/error.middleware")

// Environment setup
const isDevelopment = env.nodeEnv === "development"
const allowedCorsOrigins = new Set(env.corsOrigins)
const defaultAllowedHeaders = ["Content-Type", "Authorization"]
const allowedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]

function isNullOrigin(origin){
  return env.allowNullOrigin && (!origin || origin === "null")
}

function isDevelopmentLoopbackOrigin(origin){
  if(!isDevelopment || !origin){
    return false
  }

  try{
    const { hostname } = new URL(origin)
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  } catch (_error){
    return false
  }
}

// Allow configured origins everywhere, keep localhost easy in development,
// and support Electron/file-based renderers that may send no origin or "null".
function isAllowedOrigin(origin){
  if(isNullOrigin(origin)){
    return true
  }

  if(allowedCorsOrigins.has(origin)){
    return true
  }

  return isDevelopmentLoopbackOrigin(origin)
}

function applyCorsHeaders(req, res){
  const origin = req.headers.origin

  if(origin === "null"){
    res.setHeader("Access-Control-Allow-Origin", "null")
  } else if(origin && isAllowedOrigin(origin)){
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  const requestedHeaders = String(req.headers["access-control-request-headers"] || "")
    .split(",")
    .map((header) => header.trim())
    .filter(Boolean)
  const headersToAllow = requestedHeaders.length
    ? requestedHeaders.join(", ")
    : defaultAllowedHeaders.join(", ")

  res.setHeader("Access-Control-Allow-Headers", headersToAllow)
  res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(", "))
  res.setHeader("Vary", "Origin, Access-Control-Request-Headers")
}

// Middleware setup
const app = express()

app.disable("x-powered-by")
if(env.trustProxy){
  app.set("trust proxy", 1)
}

app.use((req, res, next) => {
  const origin = req.headers.origin

  if(!isAllowedOrigin(origin)){
    return res.status(403).json({
      error: {
        code: "CORS_ORIGIN_DENIED",
        message: "This origin is not allowed to access the HexaPay backend."
      }
    })
  }

  applyCorsHeaders(req, res)

  if(req.method === "OPTIONS"){
    return res.status(204).end()
  }

  next()
})

app.use(express.json({ limit: env.requestBodyLimit }))
app.use(express.urlencoded({ extended: true, limit: env.requestBodyLimit }))

app.get("/health", (req, res) => {
  res.status(200).json({
    name: env.appName,
    status: "ok",
    environment: env.nodeEnv
  })
})

app.use(env.apiPrefix, apiRoutes)
app.use(notFoundMiddleware)
app.use(errorMiddleware)

module.exports = app
