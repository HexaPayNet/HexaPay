const path = require("path")
const dotenv = require("dotenv")

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
})

function toTrimmedString(value, fallback = ""){
  const normalizedValue = typeof value === "string"
    ? value.trim()
    : ""

  return normalizedValue || fallback
}

function toNumber(value, fallback){
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue)
    ? parsedValue
    : fallback
}

function toBoolean(value, fallback = false){
  if(value === undefined || value === null || value === ""){
    return fallback
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase())
}

function toCorsOrigins(){
  const explicitOrigins = String(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

  if(explicitOrigins.length){
    return explicitOrigins
  }

  const legacyOrigin = toTrimmedString(process.env.CORS_ORIGIN)
  return legacyOrigin
    ? [legacyOrigin]
    : []
}

function isPlaceholderSecret(value){
  const normalizedValue = String(value || "").trim().toLowerCase()
  return !normalizedValue ||
    normalizedValue.includes("change-me") ||
    normalizedValue.includes("replace-this") ||
    normalizedValue === "secret" ||
    normalizedValue === "password"
}

const nodeEnv = toTrimmedString(process.env.NODE_ENV, "development").toLowerCase()
const isProduction = nodeEnv === "production"
const corsOrigins = toCorsOrigins()
const env = {
  nodeEnv,
  isProduction,
  port: toNumber(process.env.PORT, 4000),
  mongoUri: toTrimmedString(process.env.MONGO_URI, "mongodb://127.0.0.1:27017/hexapay"),
  apiPrefix: toTrimmedString(process.env.API_PREFIX, "/api/v1"),
  appName: toTrimmedString(process.env.APP_NAME, "HexaPay API"),
  corsOrigins,
  allowNullOrigin: toBoolean(process.env.CORS_ALLOW_NULL_ORIGIN, true),
  trustProxy: toBoolean(process.env.TRUST_PROXY, false),
  requestBodyLimit: `${Math.max(1, toNumber(process.env.REQUEST_BODY_LIMIT_MB, 1))}mb`,
  jwtSecret: toTrimmedString(process.env.JWT_SECRET, "change-me-in-production"),
  jwtIssuer: toTrimmedString(process.env.JWT_ISSUER, "hexapay-api"),
  jwtAccessExpiresIn: toTrimmedString(process.env.JWT_ACCESS_EXPIRES_IN, "15m"),
  jwtRefreshExpiresIn: toTrimmedString(process.env.JWT_REFRESH_EXPIRES_IN, "7d"),
  bcryptSaltRounds: Math.max(10, toNumber(process.env.BCRYPT_SALT_ROUNDS, 12))
}

function validateEnv(configuration){
  const errors = []

  if(configuration.port <= 0){
    errors.push("PORT must be a positive number.")
  }

  if(!configuration.mongoUri){
    errors.push("MONGO_URI is required.")
  }

  if(!configuration.apiPrefix.startsWith("/")){
    errors.push("API_PREFIX must start with '/'.")
  }

  if(configuration.isProduction){
    if(isPlaceholderSecret(configuration.jwtSecret) || configuration.jwtSecret.length < 24){
      errors.push("JWT_SECRET must be set to a strong non-placeholder value in production.")
    }

    if(!configuration.corsOrigins.length){
      errors.push("CORS_ORIGINS must include at least one explicit origin in production.")
    }

    if(configuration.corsOrigins.some((origin) => origin === "*")){
      errors.push("CORS_ORIGINS cannot contain '*' in production.")
    }

    if(process.env.CORS_ORIGIN && !process.env.CORS_ORIGINS){
      errors.push("Use CORS_ORIGINS instead of the legacy CORS_ORIGIN variable in production.")
    }

    if(configuration.mongoUri === "mongodb://127.0.0.1:27017/hexapay" && !process.env.MONGO_URI){
      errors.push("MONGO_URI must be set explicitly in production.")
    }
  }

  if(errors.length){
    const error = new Error(`Invalid HexaPay environment configuration:\n- ${errors.join("\n- ")}`)
    error.code = "ENV_CONFIG_INVALID"
    throw error
  }
}

function emitEnvWarnings(configuration){
  if(!configuration.isProduction && process.env.CORS_ORIGIN && !process.env.CORS_ORIGINS){
    console.warn("[env] CORS_ORIGIN is deprecated. Prefer CORS_ORIGINS for future environments.")
  }
}

validateEnv(env)
emitEnvWarnings(env)

module.exports = env
