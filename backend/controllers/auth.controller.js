const bcrypt = require("bcrypt")

const env = require("../config/env")
const { AUDIT_ACTIONS, AUDIT_TARGETS, recordAuditEvent } = require("../services/audit.service")
const {
  Company,
  CompanyMembership,
  User,
  buildAuthResponse,
  getActiveMembershipForUser,
  getAuthTokenPayload,
  getMembershipsForUser,
  serializeCompany,
  serializeMembership,
  serializeUser,
  signAccessToken,
  signRefreshToken,
  verifyToken
} = require("../utils/auth")

async function buildSessionResponse(user, activeMembershipRecord, activeCompanyRecord){
  const membershipPairs = await getMembershipsForUser(user._id)
  const authPayload = getAuthTokenPayload({
    user,
    membership: activeMembershipRecord
  })

  return buildAuthResponse({
    user,
    memberships: membershipPairs,
    activeMembership: activeMembershipRecord,
    activeCompany: activeCompanyRecord,
    accessToken: signAccessToken(authPayload),
    refreshToken: signRefreshToken(authPayload)
  })
}

async function getInvitedMembershipPairForUser(userId){
  const membership = await CompanyMembership.findOne({
    userId,
    status: "invited"
  }).sort({ createdAt: 1 })

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

async function register(req, res, next){
  try{
    const { email, password, display_name: displayName, company: companyPayload } = req.body

    const normalizedEmail = String(email).trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail }).select("+passwordHash +tokenVersion")
    if(existingUser){
      if(existingUser.status === "invited"){
        const invitedMembershipPair = await getInvitedMembershipPairForUser(existingUser._id)

        if(!invitedMembershipPair){
          return res.status(409).json({
            error: {
              code: "INVITED_ACCOUNT_NOT_READY",
              message: "This invited account is not ready for activation."
            }
          })
        }

        existingUser.displayName = displayName || existingUser.displayName
        existingUser.passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds)
        existingUser.status = "active"
        existingUser.tokenVersion = existingUser.tokenVersion || 0
        await existingUser.save()

        invitedMembershipPair.membership.status = "active"
        invitedMembershipPair.membership.joinedAt = invitedMembershipPair.membership.joinedAt || new Date()
        await invitedMembershipPair.membership.save()

        const responseBody = await buildSessionResponse(
          existingUser,
          invitedMembershipPair.membership,
          invitedMembershipPair.company
        )

        return res.status(200).json(responseBody)
      }

      return res.status(409).json({
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "A user with this email already exists."
        }
      })
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds)

    const company = await Company.create({
      name: companyPayload.name,
      industry: companyPayload.industry,
      email: normalizedEmail,
      currencyCode: companyPayload.currency_code,
      countryCode: companyPayload.country_code,
      timezone: companyPayload.timezone,
      logoUrl: companyPayload.logo_url || "",
      status: "active"
    })

    const user = await User.create({
      email: normalizedEmail,
      displayName,
      passwordHash,
      status: "active",
      tokenVersion: 0
    })

    const membership = await CompanyMembership.create({
      companyId: company._id,
      userId: user._id,
      invitedByUserId: user._id,
      role: "ADMIN",
      status: "active",
      joinedAt: new Date()
    })

    const responseBody = await buildSessionResponse(user, membership, company)
    res.status(201).json(responseBody)
  } catch (error){
    next(error)
  }
}

async function login(req, res, next){
  try{
    const { email, password, companyId } = req.body
    const normalizedEmail = String(email).trim().toLowerCase()

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+passwordHash +tokenVersion")

    if(!user){
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password."
        }
      })
    }

    if(user.status === "invited"){
      return res.status(403).json({
        error: {
          code: "ACCOUNT_INVITED_NOT_ACTIVATED",
          message: "This account has been invited but not activated yet. Complete sign up first to set your password."
        }
      })
    }

    if(user.status !== "active"){
      return res.status(403).json({
        error: {
          code: "ACCOUNT_NOT_ACTIVE",
          message: "This account is not active."
        }
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if(!passwordMatches){
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password."
        }
      })
    }

    const membershipPairs = await getMembershipsForUser(user._id)
    if(!membershipPairs.length){
      return res.status(403).json({
        error: {
          code: "NO_COMPANY_ACCESS",
          message: "This user does not belong to any active company."
        }
      })
    }

    const activeMembershipPair = companyId
      ? membershipPairs.find(({ company }) => String(company._id) === String(companyId))
      : membershipPairs[0]

    if(!activeMembershipPair){
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to the requested company."
        }
      })
    }

    user.lastLoginAt = new Date()
    await user.save()

    const responseBody = buildAuthResponse({
      user,
      memberships: membershipPairs,
      activeMembership: activeMembershipPair.membership,
      activeCompany: activeMembershipPair.company,
      accessToken: signAccessToken(getAuthTokenPayload({
        user,
        membership: activeMembershipPair.membership
      })),
      refreshToken: signRefreshToken(getAuthTokenPayload({
        user,
        membership: activeMembershipPair.membership
      }))
    })

    await recordAuditEvent({
      req,
      companyId: activeMembershipPair.company._id,
      actorUser: user,
      actorRole: activeMembershipPair.membership.role,
      action: AUDIT_ACTIONS.LOGIN,
      target: {
        type: AUDIT_TARGETS.SESSION,
        id: String(user._id),
        label: user.email
      },
      metadata: {
        active_company_id: String(activeMembershipPair.company._id),
        active_company_name: activeMembershipPair.company.name,
        membership_id: String(activeMembershipPair.membership._id)
      }
    })

    res.status(200).json(responseBody)
  } catch (error){
    next(error)
  }
}

async function logout(req, res, next){
  try{
    const currentRole = req.authContext?.role || ""
    req.currentUser.tokenVersion = (req.currentUser.tokenVersion || 0) + 1
    await req.currentUser.save()

    await recordAuditEvent({
      req,
      companyId: req.authContext?.activeCompanyId || null,
      actorRole: currentRole,
      action: AUDIT_ACTIONS.LOGOUT,
      target: {
        type: AUDIT_TARGETS.SESSION,
        id: String(req.currentUser._id),
        label: req.currentUser.email
      }
    })

    res.status(200).json({
      success: true
    })
  } catch (error){
    next(error)
  }
}

async function refresh(req, res, next){
  try{
    const refreshToken = req.body.refresh_token
    const decoded = verifyToken(refreshToken, "refresh")
    const user = await User.findById(decoded.sub).select("+tokenVersion")

    if(!user || user.status !== "active"){
      return res.status(401).json({
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Refresh token is invalid."
        }
      })
    }

    if((user.tokenVersion || 0) !== Number(decoded.token_version || 0)){
      return res.status(401).json({
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Refresh token is invalid."
        }
      })
    }

    const activeMembershipPair = await getActiveMembershipForUser(user._id, decoded.active_company_id)
    if(!activeMembershipPair){
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "The active company on this session is no longer available."
        }
      })
    }

    const responseBody = await buildSessionResponse(user, activeMembershipPair.membership, activeMembershipPair.company)
    res.status(200).json(responseBody)
  } catch (error){
    if(!error.statusCode){
      error.statusCode = 401
      error.code = "INVALID_REFRESH_TOKEN"
      error.message = "Refresh token is invalid."
    }

    next(error)
  }
}

async function getMe(req, res, next){
  try{
    const membershipPairs = await getMembershipsForUser(req.currentUser._id)
    const activeMembershipPair = req.authContext?.activeCompanyId
      ? membershipPairs.find(({ company }) => String(company._id) === String(req.authContext.activeCompanyId))
      : membershipPairs[0] || null

    res.status(200).json({
      user: serializeUser(req.currentUser),
      memberships: membershipPairs.map(({ membership, company }) => serializeMembership(membership, company)),
      active_company_id: activeMembershipPair ? String(activeMembershipPair.company._id) : null,
      active_company: activeMembershipPair ? serializeCompany(activeMembershipPair.company) : null,
      active_membership: activeMembershipPair
        ? serializeMembership(activeMembershipPair.membership, activeMembershipPair.company)
        : null
    })
  } catch (error){
    next(error)
  }
}

async function updateMe(req, res, next){
  try{
    const { display_name: displayName, avatar_url: avatarUrl } = req.body || {}

    if(displayName !== undefined){
      req.currentUser.displayName = String(displayName || "").trim()
    }

    if(avatarUrl !== undefined){
      req.currentUser.avatarUrl = String(avatarUrl || "").trim()
    }

    await req.currentUser.save()

    res.status(200).json({
      user: serializeUser(req.currentUser)
    })
  } catch (error){
    next(error)
  }
}

async function switchCompany(req, res, next){
  try{
    const { companyId } = req.body
    const activeMembershipPair = await getActiveMembershipForUser(req.currentUser._id, companyId)

    if(!activeMembershipPair){
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to the requested company."
        }
      })
    }

    const responseBody = await buildSessionResponse(
      req.currentUser,
      activeMembershipPair.membership,
      activeMembershipPair.company
    )

    res.status(200).json(responseBody)
  } catch (error){
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  getMe,
  updateMe,
  switchCompany
}
