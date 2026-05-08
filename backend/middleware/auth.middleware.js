const {
  CompanyMembership,
  User,
  extractBearerToken,
  normalizeMembershipRole,
  verifyToken
} = require("../utils/auth")

const COMPANY_ROLES = Object.freeze({
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  VIEWER: "VIEWER"
})

const COMPANY_ROLE_SETS = Object.freeze({
  ADMIN_ONLY: Object.freeze([COMPANY_ROLES.ADMIN]),
  OPERATIONAL: Object.freeze([COMPANY_ROLES.ADMIN, COMPANY_ROLES.MANAGER]),
  ALL: Object.freeze([COMPANY_ROLES.ADMIN, COMPANY_ROLES.MANAGER, COMPANY_ROLES.VIEWER])
})

function sendAuthFailure(res, message = "Authentication required"){
  return res.status(401).json({
    status: "fail",
    message
  })
}

function sendForbidden(res, message = "You do not have permission to perform this action"){
  return res.status(403).json({
    status: "fail",
    message
  })
}

async function requireAuth(req, res, next){
  try{
    const token = extractBearerToken(req)
    const decoded = verifyToken(token, "access")
    const user = await User.findById(decoded.sub).select("+tokenVersion")

    if(!user || user.status !== "active"){
      return sendAuthFailure(res)
    }

    if((user.tokenVersion || 0) !== Number(decoded.token_version || 0)){
      return sendAuthFailure(res, "Authentication required")
    }

    req.currentUser = user
    req.authContext = {
      authenticated: true,
      userId: String(user._id),
      membershipId: decoded.membership_id || null,
      activeCompanyId: decoded.active_company_id || null,
      role: decoded.role ? normalizeMembershipRole(decoded.role) : null,
      roles: decoded.role ? [normalizeMembershipRole(decoded.role)] : [],
      tokenType: decoded.type
    }

    next()
  } catch (error){
    return sendAuthFailure(res)
  }
}

async function requireCompanyMembership(req, res, next){
  try{
    const companyId = req.params.companyId
    if(!companyId){
      const error = new Error("companyId is required for company-scoped routes.")
      error.statusCode = 400
      error.code = "COMPANY_SCOPE_REQUIRED"
      throw error
    }

    const membership = await CompanyMembership.findOne({
      companyId,
      userId: req.authContext?.userId,
      status: "active"
    })

    if(!membership){
      return sendForbidden(res)
    }

    const normalizedRole = normalizeMembershipRole(membership.role)

    req.companyScope = {
      companyId,
      membershipRequired: true,
      membershipStatus: membership.status,
      membership,
      role: normalizedRole,
      scopeType: "company"
    }
    req.authContext = {
      ...(req.authContext || {}),
      activeCompanyId: companyId,
      membershipId: String(membership._id),
      role: normalizedRole,
      roles: [normalizedRole]
    }

    next()
  } catch (error){
    next(error)
  }
}

function normalizeAllowedRoles(allowedRoles){
  const roleList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  return roleList
    .map((role) => normalizeMembershipRole(role))
    .filter((role, index, roles) => roles.indexOf(role) === index)
}

function allowCompanyRoles(allowedRoles = COMPANY_ROLE_SETS.ALL){
  const normalizedAllowedRoles = normalizeAllowedRoles(allowedRoles)

  return (req, res, next) => {
    const membershipRole = normalizeMembershipRole(req.companyScope?.membership?.role || req.companyScope?.role)

    if(normalizedAllowedRoles.length && !normalizedAllowedRoles.includes(membershipRole)){
      return sendForbidden(res)
    }

    req.companyScope = {
      ...(req.companyScope || {}),
      role: membershipRole,
      allowedRoles: normalizedAllowedRoles,
      authorizationMode: "company_role"
    }

    next()
  }
}

module.exports = {
  COMPANY_ROLES,
  COMPANY_ROLE_SETS,
  allowCompanyRoles,
  requireAuth,
  requireCompanyMembership,
  requireCompanyRoles: allowCompanyRoles
}
