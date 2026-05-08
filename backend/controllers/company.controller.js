const { Company, serializeCompany } = require("../utils/auth")

async function getCompany(req, res, next){
  try{
    const company = await Company.findOne({
      _id: req.params.companyId,
      status: "active"
    })

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    res.status(200).json({
      company: serializeCompany(company)
    })
  } catch (error){
    next(error)
  }
}

async function updateCompany(req, res, next){
  try{
    const company = await Company.findOne({
      _id: req.params.companyId,
      status: "active"
    })

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const allowedUpdates = {
      name: "name",
      industry: "industry",
      email: "email",
      currency_code: "currencyCode",
      country_code: "countryCode",
      timezone: "timezone",
      logo_url: "logoUrl"
    }

    Object.entries(allowedUpdates).forEach(([requestKey, modelKey]) => {
      if(Object.prototype.hasOwnProperty.call(req.body, requestKey)){
        company[modelKey] = req.body[requestKey]
      }
    })

    await company.save()

    res.status(200).json({
      company: serializeCompany(company)
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  getCompany,
  updateCompany
}
