const jwt = require("jsonwebtoken")

const env = require("../config/env")
const User = require("../models/User")
const Company = require("../models/Company")
const CompanyMembership = require("../models/CompanyMembership")

function normalizeMembershipRole(role){
  const normalizedRole = String(role || "").trim().toUpperCase()

  if(normalizedRole === "ADMIN"){
    return "ADMIN"
  }

  if(normalizedRole === "MANAGER"){
    return "MANAGER"
  }

  // Legacy MEMBER records are treated as VIEWER until they are explicitly reassigned.
  if(normalizedRole === "MEMBER" || normalizedRole === "VIEWER"){
    return "VIEWER"
  }

  return "VIEWER"
}

function serializeUser(user){
  if(!user){
    return null
  }

  return {
    id: String(user._id),
    email: user.email,
    display_name: user.displayName,
    title: user.title || "",
    avatar_url: user.avatarUrl || "",
    status: user.status
  }
}

function serializeCompany(company){
  if(!company){
    return null
  }

  return {
    id: String(company._id),
    name: company.name,
    industry: company.industry,
    email: company.email,
    currency_code: company.currencyCode,
    country_code: company.countryCode,
    timezone: company.timezone,
    logo_url: company.logoUrl,
    status: company.status
  }
}

function serializeMembership(membership, company = null){
  if(!membership){
    return null
  }

  return {
    id: String(membership._id),
    company_id: String(membership.companyId?._id || membership.companyId),
    user_id: String(membership.userId?._id || membership.userId),
    role: normalizeMembershipRole(membership.role),
    status: membership.status,
    joined_at: membership.joinedAt,
    company: company ? serializeCompany(company) : undefined
  }
}

function getAuthTokenPayload({ user, membership }){
  return {
    sub: String(user._id),
    membership_id: String(membership._id),
    active_company_id: String(membership.companyId?._id || membership.companyId),
    role: normalizeMembershipRole(membership.role),
    token_version: user.tokenVersion || 0
  }
}

function signAccessToken(payload){
  return jwt.sign(
    { ...payload, type: "access" },
    env.jwtSecret,
    {
      expiresIn: env.jwtAccessExpiresIn,
      issuer: env.jwtIssuer
    }
  )
}

function signRefreshToken(payload){
  return jwt.sign(
    { ...payload, type: "refresh" },
    env.jwtSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn,
      issuer: env.jwtIssuer
    }
  )
}

function verifyToken(token, expectedType){
  const decoded = jwt.verify(token, env.jwtSecret, {
    issuer: env.jwtIssuer
  })

  if(decoded.type !== expectedType){
    const error = new Error(`Invalid token type. Expected ${expectedType}.`)
    error.statusCode = 401
    error.code = "INVALID_TOKEN"
    throw error
  }

  return decoded
}

function extractBearerToken(req){
  const authorization = req.headers.authorization || ""
  const [scheme, token] = authorization.split(" ")

  if(scheme !== "Bearer" || !token){
    const error = new Error("Authorization token is required.")
    error.statusCode = 401
    error.code = "AUTH_REQUIRED"
    throw error
  }

  return token
}

async function getMembershipsForUser(userId){
  const memberships = await CompanyMembership.find({
    userId,
    status: "active"
  }).lean()

  const companyIds = memberships.map((membership) => membership.companyId)
  const companies = await Company.find({
    _id: { $in: companyIds },
    status: "active"
  }).lean()
  const companyMap = new Map(companies.map((company) => [String(company._id), company]))

  return memberships
    .filter((membership) => companyMap.has(String(membership.companyId)))
    .map((membership) => ({
      membership,
      company: companyMap.get(String(membership.companyId))
    }))
}

async function getActiveMembershipForUser(userId, companyId){
  const membership = await CompanyMembership.findOne({
    userId,
    companyId,
    status: "active"
  })

  if(!membership){
    return null
  }

  const company = await Company.findOne({
    _id: membership.companyId,
    status: "active"
  })

  if(!company){
    return null
  }

  return { membership, company }
}

function buildAuthResponse({ user, memberships, activeMembership, activeCompany, accessToken, refreshToken }){
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: env.jwtAccessExpiresIn,
    user: serializeUser(user),
    memberships: memberships.map(({ membership, company }) => serializeMembership(membership, company)),
    active_company_id: activeCompany ? String(activeCompany._id) : null,
    active_company: serializeCompany(activeCompany),
    active_membership: serializeMembership(activeMembership, activeCompany)
  }
}

module.exports = {
  User,
  Company,
  CompanyMembership,
  buildAuthResponse,
  extractBearerToken,
  getActiveMembershipForUser,
  getAuthTokenPayload,
  getMembershipsForUser,
  serializeCompany,
  serializeMembership,
  serializeUser,
  signAccessToken,
  signRefreshToken,
  verifyToken,
  normalizeMembershipRole
}
