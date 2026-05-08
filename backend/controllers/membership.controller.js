const bcrypt = require("bcrypt")
const crypto = require("crypto")

const env = require("../config/env")
const {
  Company,
  CompanyMembership,
  User,
  normalizeMembershipRole,
  serializeCompany,
  serializeMembership,
  serializeUser
} = require("../utils/auth")

function buildMembershipResponse(membership, user, company){
  return {
    ...serializeMembership(membership, company),
    invited_by_user_id: membership.invitedByUserId ? String(membership.invitedByUserId) : null,
    user: user ? serializeUser(user) : undefined
  }
}

function deriveDisplayNameFromEmail(email){
  const localPart = String(email).trim().split("@")[0] || "New User"
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ") || "New User"
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function countActiveAdmins(companyId){
  return CompanyMembership.countDocuments({
    companyId,
    role: "ADMIN",
    status: "active"
  })
}

async function assertAdminSafety(companyId, membership, nextRole, nextStatus){
  const isCurrentActiveAdmin = membership.role === "ADMIN" && membership.status === "active"
  const willRemainActiveAdmin = nextRole === "ADMIN" && nextStatus === "active"

  if(!isCurrentActiveAdmin || willRemainActiveAdmin){
    return
  }

  const activeAdminCount = await countActiveAdmins(companyId)
  if(activeAdminCount <= 1){
    const error = new Error("At least one active admin membership must remain on the company.")
    error.statusCode = 409
    error.code = "LAST_ADMIN_REQUIRED"
    throw error
  }
}

async function loadMembershipUserMap(memberships){
  const userIds = memberships.map((membership) => membership.userId).filter(Boolean)
  const users = await User.find({
    _id: { $in: userIds }
  })

  return new Map(users.map((user) => [String(user._id), user]))
}

async function countRealCompanyUsers(companyId, companyEmail){
  const memberships = await CompanyMembership.find({
    companyId,
    status: { $ne: "removed" }
  }).select("userId")

  if(!memberships.length){
    return 0
  }

  const userIds = memberships.map((membership) => membership.userId).filter(Boolean)
  const users = await User.find({
    _id: { $in: userIds }
  }).select("email")

  const normalizedCompanyEmail = String(companyEmail || "").trim().toLowerCase()

  return users.filter((user) =>
    String(user.email || "").trim().toLowerCase() !== normalizedCompanyEmail
  ).length
}

async function listMemberships(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const memberships = await CompanyMembership.find({
      companyId: req.params.companyId,
      status: { $ne: "removed" }
    }).sort({ createdAt: 1 })

    const userMap = await loadMembershipUserMap(memberships)

    res.status(200).json({
      company: serializeCompany(company),
      memberships: memberships.map((membership) => buildMembershipResponse(
        membership,
        userMap.get(String(membership.userId)) || null,
        company
      ))
    })
  } catch (error){
    next(error)
  }
}

async function createMembership(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const email = String(req.body.email).trim().toLowerCase()
    const requestedDisplayName = String(req.body.display_name || "").trim()
    const requestedTitle = String(req.body.title || "").trim()
    const requestedPassword = String(req.body.password || "")
    const existingMembershipCount = await countRealCompanyUsers(req.params.companyId, company.email)
    const requestedRole = normalizeMembershipRole(req.body.role || "VIEWER")
    const role = existingMembershipCount < 3 ? "ADMIN" : requestedRole
    let user = await User.findOne({ email })

    if(user && user.status === "deleted"){
      return res.status(409).json({
        error: {
          code: "USER_NOT_AVAILABLE",
          message: "This user cannot be added to a company membership."
        }
      })
    }

    if(!user){
      const seedPassword = requestedPassword || crypto.randomBytes(32).toString("hex")
      const passwordHash = await bcrypt.hash(seedPassword, env.bcryptSaltRounds)

      user = await User.create({
        email,
        displayName: requestedDisplayName || deriveDisplayNameFromEmail(email),
        title: requestedTitle,
        passwordHash,
        status: requestedPassword ? "active" : "invited"
      })
    } else if(user.status === "invited"){
      user.displayName = requestedDisplayName || user.displayName || deriveDisplayNameFromEmail(email)
      user.title = requestedTitle || user.title || ""
      if(requestedPassword){
        user.passwordHash = await bcrypt.hash(requestedPassword, env.bcryptSaltRounds)
        user.status = "active"
      }
      await user.save()
    }

    let membership = await CompanyMembership.findOne({
      companyId: req.params.companyId,
      userId: user._id
    })

    if(membership && membership.status !== "removed"){
      return res.status(409).json({
        error: {
          code: "MEMBERSHIP_ALREADY_EXISTS",
          message: "This user already has a membership on the company."
        }
      })
    }

    const nextStatus = user.status === "active" ? "active" : "invited"
    const joinedAt = nextStatus === "active" ? new Date() : null

    if(membership){
      membership.role = role
      membership.status = nextStatus
      membership.invitedByUserId = req.currentUser._id
      membership.joinedAt = joinedAt
      await membership.save()
    } else {
      membership = await CompanyMembership.create({
        companyId: req.params.companyId,
        userId: user._id,
        invitedByUserId: req.currentUser._id,
        role,
        status: nextStatus,
        joinedAt
      })
    }

    res.status(201).json({
      membership: buildMembershipResponse(membership, user, company)
    })
  } catch (error){
    next(error)
  }
}

async function updateMembership(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const membership = await CompanyMembership.findOne({
      _id: req.params.membershipId,
      companyId: req.params.companyId
    })

    if(!membership){
      return res.status(404).json({
        error: {
          code: "MEMBERSHIP_NOT_FOUND",
          message: "Membership was not found."
        }
      })
    }

    const nextRole = Object.prototype.hasOwnProperty.call(req.body, "role")
      ? normalizeMembershipRole(req.body.role)
      : normalizeMembershipRole(membership.role)
    const nextStatus = Object.prototype.hasOwnProperty.call(req.body, "status")
      ? req.body.status
      : membership.status
    const user = await User.findById(membership.userId)

    if(!user){
      return res.status(404).json({
        error: {
          code: "USER_NOT_FOUND",
          message: "The user linked to this membership was not found."
        }
      })
    }

    if(nextStatus === "active" && user.status !== "active"){
      return res.status(409).json({
        error: {
          code: "USER_ACCOUNT_NOT_ACTIVE",
          message: "A membership can only be activated for an active user account."
        }
      })
    }

    await assertAdminSafety(req.params.companyId, membership, nextRole, nextStatus)

    membership.role = nextRole
    membership.status = nextStatus

    if(nextStatus === "active" && !membership.joinedAt){
      membership.joinedAt = new Date()
    }

    await membership.save()

    res.status(200).json({
      membership: buildMembershipResponse(membership, user, company)
    })
  } catch (error){
    next(error)
  }
}

async function deleteMembership(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const membership = await CompanyMembership.findOne({
      _id: req.params.membershipId,
      companyId: req.params.companyId
    })

    if(!membership){
      return res.status(404).json({
        error: {
          code: "MEMBERSHIP_NOT_FOUND",
          message: "Membership was not found."
        }
      })
    }

    await assertAdminSafety(req.params.companyId, membership, membership.role, "removed")

    membership.role = normalizeMembershipRole(membership.role)
    membership.status = "removed"
    await membership.save()

    const user = await User.findById(membership.userId)

    res.status(200).json({
      membership: buildMembershipResponse(membership, user, company)
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listMemberships,
  createMembership,
  updateMembership,
  deleteMembership
}
