const { Company } = require("../utils/auth")
const Contract = require("../models/Contract")
const Employee = require("../models/Employee")

function serializeEmployeeSummary(employee){
  if(!employee){
    return null
  }

  return {
    id: String(employee._id),
    full_name: employee.fullName,
    role_title: employee.roleTitle,
    status: employee.status
  }
}

function serializeContract(contract, employee = null){
  if(!contract){
    return null
  }

  return {
    id: String(contract._id),
    company_id: String(contract.companyId),
    employee_id: contract.employeeId ? String(contract.employeeId?._id || contract.employeeId) : null,
    contract_number: contract.contractNumber,
    name: contract.name,
    role_title: contract.roleTitle,
    contract_type: contract.contractType,
    start_date: contract.startDate,
    end_date: contract.endDate,
    payment_amount: contract.paymentAmount,
    currency_code: contract.currencyCode,
    status: contract.status,
    notes: contract.notes,
    employee: employee ? serializeEmployeeSummary(employee) : undefined
  }
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getContractForCompany(companyId, contractId){
  return Contract.findOne({
    _id: contractId,
    companyId
  })
}

async function getValidEmployee(companyId, employeeId){
  if(!employeeId){
    return null
  }

  return Employee.findOne({
    _id: employeeId,
    companyId
  })
}

function applyContractUpdates(contract, body){
  const fieldMap = {
    employee_id: "employeeId",
    contract_number: "contractNumber",
    name: "name",
    role_title: "roleTitle",
    contract_type: "contractType",
    start_date: "startDate",
    end_date: "endDate",
    payment_amount: "paymentAmount",
    currency_code: "currencyCode",
    status: "status",
    notes: "notes"
  }

  Object.entries(fieldMap).forEach(([requestKey, modelKey]) => {
    if(Object.prototype.hasOwnProperty.call(body, requestKey)){
      const nextValue =
        (requestKey === "employee_id" || requestKey === "end_date") &&
        (body[requestKey] === "" || body[requestKey] === null)
          ? null
          : body[requestKey]

      contract[modelKey] = nextValue
    }
  })
}

function handlePersistenceError(error){
  if(error?.code === 11000){
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field"
    const conflict = new Error(`Contract ${duplicateField} must be unique within the company.`)
    conflict.statusCode = 409
    conflict.code = "CONTRACT_CONFLICT"
    return conflict
  }

  return error
}

async function listContracts(req, res, next){
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

    const contracts = await Contract.find({
      companyId: req.params.companyId
    }).sort({ createdAt: -1 })

    const employeeIds = contracts.map((contract) => contract.employeeId).filter(Boolean)
    const employees = await Employee.find({
      _id: { $in: employeeIds },
      companyId: req.params.companyId
    })
    const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]))

    res.status(200).json({
      contracts: contracts.map((contract) => serializeContract(
        contract,
        contract.employeeId ? employeeMap.get(String(contract.employeeId)) || null : null
      ))
    })
  } catch (error){
    next(error)
  }
}

async function createContract(req, res, next){
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

    let employee = null
    if(req.body.employee_id){
      employee = await getValidEmployee(req.params.companyId, req.body.employee_id)

      if(!employee){
        return res.status(404).json({
          error: {
            code: "EMPLOYEE_NOT_FOUND",
            message: "Employee was not found for this company."
          }
        })
      }
    }

    const contract = new Contract({
      companyId: req.params.companyId
    })

    applyContractUpdates(contract, req.body)

    if(!Object.prototype.hasOwnProperty.call(req.body, "currency_code")){
      contract.currencyCode = company.currencyCode
    }

    await contract.save()

    res.status(201).json({
      contract: serializeContract(contract, employee)
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function getContract(req, res, next){
  try{
    const contract = await getContractForCompany(req.params.companyId, req.params.contractId)

    if(!contract){
      return res.status(404).json({
        error: {
          code: "CONTRACT_NOT_FOUND",
          message: "Contract was not found."
        }
      })
    }

    const employee = contract.employeeId
      ? await getValidEmployee(req.params.companyId, contract.employeeId)
      : null

    res.status(200).json({
      contract: serializeContract(contract, employee)
    })
  } catch (error){
    next(error)
  }
}

async function updateContract(req, res, next){
  try{
    const contract = await getContractForCompany(req.params.companyId, req.params.contractId)

    if(!contract){
      return res.status(404).json({
        error: {
          code: "CONTRACT_NOT_FOUND",
          message: "Contract was not found."
        }
      })
    }

    let employee = null
    if(Object.prototype.hasOwnProperty.call(req.body, "employee_id")){
      if(req.body.employee_id){
        employee = await getValidEmployee(req.params.companyId, req.body.employee_id)

        if(!employee){
          return res.status(404).json({
            error: {
              code: "EMPLOYEE_NOT_FOUND",
              message: "Employee was not found for this company."
            }
          })
        }
      }
    } else if(contract.employeeId){
      employee = await getValidEmployee(req.params.companyId, contract.employeeId)
    }

    applyContractUpdates(contract, req.body)
    await contract.save()

    res.status(200).json({
      contract: serializeContract(contract, employee)
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function deleteContract(req, res, next){
  try{
    const contract = await getContractForCompany(req.params.companyId, req.params.contractId)

    if(!contract){
      return res.status(404).json({
        error: {
          code: "CONTRACT_NOT_FOUND",
          message: "Contract was not found."
        }
      })
    }

    const employee = contract.employeeId
      ? await getValidEmployee(req.params.companyId, contract.employeeId)
      : null

    const serializedContract = serializeContract(contract, employee)
    await contract.deleteOne()

    res.status(200).json({
      contract: serializedContract,
      deleted: true
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listContracts,
  createContract,
  getContract,
  updateContract,
  deleteContract
}
