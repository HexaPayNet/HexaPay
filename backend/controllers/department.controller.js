const { Company } = require("../utils/auth")
const Department = require("../models/Department")
const Employee = require("../models/Employee")

function serializeDepartment(department, options = {}){
  if(!department){
    return null
  }

  const response = {
    id: String(department._id),
    company_id: String(department.companyId),
    name: department.name,
    salary_type: department.salaryType,
    default_salary_amount: department.defaultSalaryAmount,
    default_salary_currency: department.defaultSalaryCurrency,
    hod_employee_id: department.hodEmployeeId ? String(department.hodEmployeeId?._id || department.hodEmployeeId) : null,
    icon_key: department.iconKey,
    notes: department.notes,
    status: department.status
  }

  if(Object.prototype.hasOwnProperty.call(options, "employee_count")){
    response.employee_count = options.employee_count
  }

  if(Object.prototype.hasOwnProperty.call(options, "hod_employee") && options.hod_employee){
    response.hod_employee = {
      id: String(options.hod_employee._id),
      full_name: options.hod_employee.fullName,
      role_title: options.hod_employee.roleTitle,
      status: options.hod_employee.status
    }
  }

  return response
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getDepartmentForCompany(companyId, departmentId){
  return Department.findOne({
    _id: departmentId,
    companyId,
    status: "active"
  })
}

async function getValidHodEmployee(companyId, employeeId){
  if(!employeeId){
    return null
  }

  return Employee.findOne({
    _id: employeeId,
    companyId
  })
}

function applyDepartmentUpdates(department, body){
  const fieldMap = {
    name: "name",
    salary_type: "salaryType",
    default_salary_amount: "defaultSalaryAmount",
    default_salary_currency: "defaultSalaryCurrency",
    hod_employee_id: "hodEmployeeId",
    icon_key: "iconKey",
    notes: "notes",
    status: "status"
  }

  Object.entries(fieldMap).forEach(([requestKey, modelKey]) => {
    if(Object.prototype.hasOwnProperty.call(body, requestKey)){
      const nextValue = requestKey === "hod_employee_id" && (body[requestKey] === "" || body[requestKey] === null)
        ? null
        : body[requestKey]

      department[modelKey] = nextValue
    }
  })
}

function handlePersistenceError(error){
  if(error?.code === 11000){
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field"
    const conflict = new Error(`Department ${duplicateField} must be unique within the company.`)
    conflict.statusCode = 409
    conflict.code = "DEPARTMENT_CONFLICT"
    return conflict
  }

  return error
}

async function listDepartments(req, res, next){
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

      const departments = await Department.find({
        companyId: req.params.companyId,
        status: "active"
      }).sort({ createdAt: 1 })

    const departmentIds = departments.map((department) => department._id)
    const employeeCounts = await Employee.aggregate([
      {
        $match: {
          companyId: company._id,
          departmentId: { $in: departmentIds }
        }
      },
      {
        $group: {
          _id: "$departmentId",
          count: { $sum: 1 }
        }
      }
    ])
    const countMap = new Map(employeeCounts.map((entry) => [String(entry._id), entry.count]))

    const hodIds = departments.map((department) => department.hodEmployeeId).filter(Boolean)
    const hodEmployees = await Employee.find({
      _id: { $in: hodIds },
      companyId: req.params.companyId
    })
    const hodMap = new Map(hodEmployees.map((employee) => [String(employee._id), employee]))

    res.status(200).json({
      departments: departments.map((department) => serializeDepartment(department, {
        employee_count: countMap.get(String(department._id)) || 0,
        hod_employee: department.hodEmployeeId ? hodMap.get(String(department.hodEmployeeId)) || null : null
      }))
    })
  } catch (error){
    next(error)
  }
}

async function createDepartment(req, res, next){
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

    let hodEmployee = null
    if(req.body.hod_employee_id){
      hodEmployee = await getValidHodEmployee(req.params.companyId, req.body.hod_employee_id)

      if(!hodEmployee){
        return res.status(404).json({
          error: {
            code: "HOD_EMPLOYEE_NOT_FOUND",
            message: "Head of department employee was not found for this company."
          }
        })
      }
    }

    const department = new Department({
      companyId: req.params.companyId
    })

    applyDepartmentUpdates(department, req.body)

    if(!Object.prototype.hasOwnProperty.call(req.body, "default_salary_currency")){
      department.defaultSalaryCurrency = company.currencyCode
    }

    await department.save()

    res.status(201).json({
      department: serializeDepartment(department, {
        employee_count: 0,
        hod_employee: hodEmployee
      })
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function getDepartment(req, res, next){
  try{
    const department = await getDepartmentForCompany(req.params.companyId, req.params.departmentId)

    if(!department){
      return res.status(404).json({
        error: {
          code: "DEPARTMENT_NOT_FOUND",
          message: "Department was not found."
        }
      })
    }

    const employeeCount = await Employee.countDocuments({
      companyId: req.params.companyId,
      departmentId: department._id
    })

    const hodEmployee = department.hodEmployeeId
      ? await getValidHodEmployee(req.params.companyId, department.hodEmployeeId)
      : null

    res.status(200).json({
      department: serializeDepartment(department, {
        employee_count: employeeCount,
        hod_employee: hodEmployee
      })
    })
  } catch (error){
    next(error)
  }
}

async function updateDepartment(req, res, next){
  try{
    const department = await getDepartmentForCompany(req.params.companyId, req.params.departmentId)

    if(!department){
      return res.status(404).json({
        error: {
          code: "DEPARTMENT_NOT_FOUND",
          message: "Department was not found."
        }
      })
    }

    let hodEmployee = null
    if(Object.prototype.hasOwnProperty.call(req.body, "hod_employee_id")){
      if(req.body.hod_employee_id){
        hodEmployee = await getValidHodEmployee(req.params.companyId, req.body.hod_employee_id)

        if(!hodEmployee){
          return res.status(404).json({
            error: {
              code: "HOD_EMPLOYEE_NOT_FOUND",
              message: "Head of department employee was not found for this company."
            }
          })
        }
      }
    } else if(department.hodEmployeeId){
      hodEmployee = await getValidHodEmployee(req.params.companyId, department.hodEmployeeId)
    }

    applyDepartmentUpdates(department, req.body)
    await department.save()

    const employeeCount = await Employee.countDocuments({
      companyId: req.params.companyId,
      departmentId: department._id
    })

    res.status(200).json({
      department: serializeDepartment(department, {
        employee_count: employeeCount,
        hod_employee: hodEmployee
      })
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function deleteDepartment(req, res, next){
  try{
    const department = await getDepartmentForCompany(req.params.companyId, req.params.departmentId)

    if(!department){
      return res.status(404).json({
        error: {
          code: "DEPARTMENT_NOT_FOUND",
          message: "Department was not found."
        }
      })
    }

    const employeeCount = await Employee.countDocuments({
      companyId: req.params.companyId,
      departmentId: department._id
    })

    await Employee.updateMany(
      {
        companyId: req.params.companyId,
        departmentId: department._id
      },
      {
        $set: {
          departmentId: null
        }
      }
    )

    department.status = "archived"
    department.hodEmployeeId = null
    await department.save()

    res.status(200).json({
      department: serializeDepartment(department, {
        employee_count: employeeCount,
        hod_employee: null
      }),
      archived: true
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listDepartments,
  createDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment
}
