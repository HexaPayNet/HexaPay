const { Company } = require("../utils/auth")
const Holiday = require("../models/Holiday")

function serializeHoliday(holiday){
  if(!holiday){
    return null
  }

  return {
    id: String(holiday._id),
    company_id: String(holiday.companyId),
    scope: holiday.scope,
    name: holiday.name,
    date: holiday.date,
    country_code: holiday.countryCode || "",
    status: holiday.status
  }
}

function normalizeDateOnly(value){
  const date = new Date(value)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getHolidayForCompany(companyId, holidayId){
  return Holiday.findOne({
    _id: holidayId,
    companyId
  })
}

function applyHolidayUpdates(holiday, body){
  const fieldMap = {
    scope: "scope",
    name: "name",
    date: "date",
    country_code: "countryCode",
    status: "status"
  }

  Object.entries(fieldMap).forEach(([requestKey, modelKey]) => {
    if(Object.prototype.hasOwnProperty.call(body, requestKey)){
      const nextValue = requestKey === "date"
        ? normalizeDateOnly(body[requestKey])
        : body[requestKey]

      holiday[modelKey] = nextValue
    }
  })
}

function handlePersistenceError(error){
  if(error?.code === 11000){
    const conflict = new Error("Holiday already exists for this company on the selected date.")
    conflict.statusCode = 409
    conflict.code = "HOLIDAY_CONFLICT"
    return conflict
  }

  return error
}

async function listHolidays(req, res, next){
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

    const holidays = await Holiday.find({
      companyId: req.params.companyId
    }).sort({ date: 1, createdAt: 1 })

    res.status(200).json({
      holidays: holidays.map((holiday) => serializeHoliday(holiday))
    })
  } catch (error){
    next(error)
  }
}

async function createHoliday(req, res, next){
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

    const holiday = new Holiday({
      companyId: req.params.companyId
    })

    applyHolidayUpdates(holiday, req.body)

    if(!Object.prototype.hasOwnProperty.call(req.body, "country_code") && holiday.scope === "national"){
      holiday.countryCode = company.countryCode
    }

    await holiday.save()

    res.status(201).json({
      holiday: serializeHoliday(holiday)
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function getHoliday(req, res, next){
  try{
    const holiday = await getHolidayForCompany(req.params.companyId, req.params.holidayId)

    if(!holiday){
      return res.status(404).json({
        error: {
          code: "HOLIDAY_NOT_FOUND",
          message: "Holiday was not found."
        }
      })
    }

    res.status(200).json({
      holiday: serializeHoliday(holiday)
    })
  } catch (error){
    next(error)
  }
}

async function updateHoliday(req, res, next){
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

    const holiday = await getHolidayForCompany(req.params.companyId, req.params.holidayId)

    if(!holiday){
      return res.status(404).json({
        error: {
          code: "HOLIDAY_NOT_FOUND",
          message: "Holiday was not found."
        }
      })
    }

    applyHolidayUpdates(holiday, req.body)

    if(holiday.scope !== "national"){
      holiday.countryCode = ""
    } else if(!holiday.countryCode){
      holiday.countryCode = company.countryCode
    }

    await holiday.save()

    res.status(200).json({
      holiday: serializeHoliday(holiday)
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function deleteHoliday(req, res, next){
  try{
    const holiday = await getHolidayForCompany(req.params.companyId, req.params.holidayId)

    if(!holiday){
      return res.status(404).json({
        error: {
          code: "HOLIDAY_NOT_FOUND",
          message: "Holiday was not found."
        }
      })
    }

    holiday.status = "archived"
    await holiday.save()

    res.status(200).json({
      holiday: serializeHoliday(holiday),
      archived: true
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listHolidays,
  createHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday
}
