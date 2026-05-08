const test = require("node:test")
const assert = require("node:assert/strict")

const membershipValidators = require("../backend/validators/membership.validators")
const contractValidators = require("../backend/validators/contract.validators")
const holidayValidators = require("../backend/validators/holiday.validators")
const exportValidators = require("../backend/validators/export.validators")
const settingsValidators = require("../backend/validators/settings.validators")

function validate(schema, req){
  return schema.validate({
    params: req?.params || {},
    body: req?.body || {},
    query: req?.query || {}
  })
}

function errorFields(errors){
  return errors.map((error) => error.field)
}

test("membership creation allows invite-style payloads without password or display name", () => {
  const errors = validate(membershipValidators.createMembership, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      email: "invite@example.com"
    }
  })

  assert.deepEqual(errors, [])
})

test("membership creation still rejects weak passwords when one is provided", () => {
  const errors = validate(membershipValidators.createMembership, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      email: "invite@example.com",
      password: "weakpass"
    }
  })

  assert.ok(errors.some((error) => error.field === "body.password"))
})

test("contract validation rejects impossible ISO dates", () => {
  const errors = validate(contractValidators.createContract, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      contract_number: "CTR-001",
      name: "Main Contract",
      role_title: "Supervisor",
      contract_type: "permanent",
      start_date: "2026-02-30",
      payment_amount: 12000
    }
  })

  assert.ok(errors.some((error) => error.field === "body.start_date"))
})

test("holiday validation rejects impossible dates and company-only country codes", () => {
  const errors = validate(holidayValidators.createHoliday, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      scope: "company",
      name: "Founders Day",
      date: "2026-02-30",
      country_code: "KE"
    }
  })

  assert.ok(errors.some((error) => error.field === "body.date"))
  assert.ok(errors.some((error) => error.field === "body.country_code"))
})

test("attendance export filters reject conflicting or chronologically invalid date filters", () => {
  const errors = validate(exportValidators.exportAttendance, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      filters: {
        specific_date: "2026-04-10",
        from_date: "2026-04-12",
        to_date: "2026-04-11"
      }
    }
  })

  assert.ok(errors.some((error) => error.field === "body.filters.specific_date"))
  assert.ok(errors.some((error) => error.field === "body.filters.to_date"))
})

test("settings validation rejects invalid approval chain roles", () => {
  const errors = validate(settingsValidators.updateSettings, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      payroll_calendar: {
        approval_chain: ["ADMIN", "OWNER"]
      }
    }
  })

  assert.ok(errors.some((error) => error.field === "body.payroll_calendar.approval_chain.1"))
})

test("financial rule validation rejects read-only PAYE rules and invalid effective date ranges", () => {
  const errors = validate(settingsValidators.createFinancialRule, {
    params: {
      companyId: "507f1f77bcf86cd799439011"
    },
    body: {
      rule_type: "paye",
      name: "Legacy PAYE",
      value_type: "percentage",
      value: 30,
      scope: "company",
      effective_from: "2026-05-01",
      effective_to: "2026-04-01"
    }
  })

  assert.ok(errors.some((error) => error.field === "body.rule_type"))
  assert.ok(errors.some((error) => error.field === "body.effective_to"))
})

test("financial rule validation rejects overlong names and categories", () => {
  const errors = validate(settingsValidators.updateFinancialRule, {
    params: {
      companyId: "507f1f77bcf86cd799439011",
      ruleId: "507f1f77bcf86cd799439012"
    },
    body: {
      name: "x".repeat(161),
      income_category: "x".repeat(81)
    }
  })

  assert.deepEqual(
    errorFields(errors).sort(),
    ["body.name", "body.income_category"]
      .sort(),
  )
})
