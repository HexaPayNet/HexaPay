const { Company } = require("../utils/auth")
const Employee = require("../models/Employee")
const Department = require("../models/Department")
const { AUDIT_ACTIONS, AUDIT_TARGETS, recordAuditEvent } = require("../services/audit.service")
const { compareEmployeesByPayrollNumber, generateNextEmployeePayrollNumber } = require("../services/employee-number.service")

function serializeDepartment(department){
  if(!department){
    return null
  }

  return {
    id: String(department._id),
    company_id: String(department.companyId),
    name: department.name,
    salary_type: department.salaryType,
    status: department.status
  }
}

function serializeEmployee(employee, department = null){
  if(!employee){
    return null
  }

  const loanProfile = employee.financialProfile?.loan || {}

  const paymentType = String(employee.paymentType || "monthly").trim().toLowerCase()
  const paymentBasis = String(
    employee.paymentBasis ||
    (paymentType === "daily" ? "attendance_dependent" : "standard")
  ).trim().toLowerCase()

  return {
    id: String(employee._id),
    company_id: String(employee.companyId),
    department_id: employee.departmentId ? String(employee.departmentId?._id || employee.departmentId) : null,
    employee_number: employee.employeeNumber,
    full_name: employee.fullName,
    identification_number: employee.identificationNumber,
    account_number: employee.accountNumber,
    account_details: employee.accountDetails,
    role_title: employee.roleTitle,
    employment_type: employee.employmentType,
    payment_type: paymentType,
    payment_basis: paymentBasis,
    employment_date: employee.employmentDate,
    salary_amount: employee.salaryAmount,
    salary_currency: employee.salaryCurrency,
    status: employee.status,
    payroll_status: employee.payrollStatus,
    profile_image_url: employee.profileImageUrl,
    financial_profile: {
      apply_tax_financials: Boolean(employee.financialProfile?.applyTaxFinancials),
      statutory: {
        paye: employee.financialProfile?.statutory?.paye !== false,
        shif: employee.financialProfile?.statutory?.shif !== false && employee.financialProfile?.statutory?.insurance !== false,
        nssf: employee.financialProfile?.statutory?.nssf !== false && employee.financialProfile?.statutory?.pension !== false,
        housing_levy: employee.financialProfile?.statutory?.housingLevy !== false
      },
      loan: {
        enabled: Boolean(loanProfile.enabled),
        name: loanProfile.name || "",
        principal_amount: Number(loanProfile.principalAmount || 0),
        balance_amount: Number(loanProfile.balanceAmount || 0),
        installment_amount: Number(loanProfile.installmentAmount || 0),
        installment_frequency: loanProfile.installmentFrequency || "Monthly",
        total_installments: Number(loanProfile.totalInstallments || 0),
        installments_paid: Number(loanProfile.installmentsPaid || 0),
        installments_remaining: Number(loanProfile.installmentsRemaining || 0),
        source_change_id: loanProfile.sourceChangeId || "",
        next_deduction_date: loanProfile.nextDeductionDate || null
      }
    },
    department: department ? serializeDepartment(department) : undefined
  }
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getActiveDepartmentForCompany(companyId, departmentId){
  if(!departmentId){
    return null
  }

  return Department.findOne({
    _id: departmentId,
    companyId,
    status: "active"
  })
}

function applyEmployeeUpdates(employee, body){
  const fieldMap = {
    department_id: "departmentId",
    employee_number: "employeeNumber",
    full_name: "fullName",
    identification_number: "identificationNumber",
    account_number: "accountNumber",
    account_details: "accountDetails",
    role_title: "roleTitle",
    employment_type: "employmentType",
    payment_type: "paymentType",
    payment_basis: "paymentBasis",
    employment_date: "employmentDate",
    salary_amount: "salaryAmount",
    salary_currency: "salaryCurrency",
    status: "status",
    payroll_status: "payrollStatus",
    profile_image_url: "profileImageUrl"
  }

  Object.entries(fieldMap).forEach(([requestKey, modelKey]) => {
    if(Object.prototype.hasOwnProperty.call(body, requestKey)){
      const nextValue = requestKey === "department_id" && (body[requestKey] === "" || body[requestKey] === null)
        ? null
        : requestKey === "employee_number" && (body[requestKey] === "" || body[requestKey] === null)
          ? undefined
        : body[requestKey]

      employee[modelKey] = nextValue
    }
  })

  if(Object.prototype.hasOwnProperty.call(body, "financial_profile")){
    const currentFinancialProfile = employee.financialProfile || {}
    const inputFinancialProfile = body.financial_profile || {}
    const currentStatutory = currentFinancialProfile.statutory || {}
    const inputStatutory = inputFinancialProfile.statutory || {}
    const currentLoan = currentFinancialProfile.loan || {}
    const inputLoan = inputFinancialProfile.loan || {}

    employee.financialProfile = {
      applyTaxFinancials: inputFinancialProfile.apply_tax_financials !== undefined
        ? Boolean(inputFinancialProfile.apply_tax_financials)
        : Boolean(currentFinancialProfile.applyTaxFinancials),
      statutory: {
        paye: inputStatutory.paye !== undefined ? Boolean(inputStatutory.paye) : currentStatutory.paye !== false,
        shif: inputStatutory.shif !== undefined
          ? Boolean(inputStatutory.shif)
          : inputStatutory.insurance !== undefined
            ? Boolean(inputStatutory.insurance)
            : currentStatutory.shif !== undefined
              ? Boolean(currentStatutory.shif)
              : currentStatutory.insurance !== false,
        nssf: inputStatutory.nssf !== undefined
          ? Boolean(inputStatutory.nssf)
          : inputStatutory.pension !== undefined
            ? Boolean(inputStatutory.pension)
            : currentStatutory.nssf !== undefined
              ? Boolean(currentStatutory.nssf)
              : currentStatutory.pension !== false,
        housingLevy: inputStatutory.housing_levy !== undefined
          ? Boolean(inputStatutory.housing_levy)
          : inputStatutory.housingLevy !== undefined
            ? Boolean(inputStatutory.housingLevy)
            : currentStatutory.housingLevy !== false,
        pension: inputStatutory.nssf !== undefined
          ? Boolean(inputStatutory.nssf)
          : inputStatutory.pension !== undefined
            ? Boolean(inputStatutory.pension)
            : currentStatutory.nssf !== undefined
              ? Boolean(currentStatutory.nssf)
              : currentStatutory.pension !== false,
        insurance: inputStatutory.shif !== undefined
          ? Boolean(inputStatutory.shif)
          : inputStatutory.insurance !== undefined
            ? Boolean(inputStatutory.insurance)
            : currentStatutory.shif !== undefined
              ? Boolean(currentStatutory.shif)
              : currentStatutory.insurance !== false
      },
      loan: {
        enabled: inputLoan.enabled !== undefined ? Boolean(inputLoan.enabled) : Boolean(currentLoan.enabled),
        name: inputLoan.name !== undefined ? String(inputLoan.name || "").trim() : (currentLoan.name || ""),
        principalAmount: inputLoan.principal_amount !== undefined ? Number(inputLoan.principal_amount || 0) : Number(currentLoan.principalAmount || 0),
        balanceAmount: inputLoan.balance_amount !== undefined ? Number(inputLoan.balance_amount || 0) : Number(currentLoan.balanceAmount || 0),
        installmentAmount: inputLoan.installment_amount !== undefined ? Number(inputLoan.installment_amount || 0) : Number(currentLoan.installmentAmount || 0),
        installmentFrequency: inputLoan.installment_frequency !== undefined ? String(inputLoan.installment_frequency || "Monthly") : (currentLoan.installmentFrequency || "Monthly"),
        totalInstallments: inputLoan.total_installments !== undefined ? Number(inputLoan.total_installments || 0) : Number(currentLoan.totalInstallments || 0),
        installmentsPaid: inputLoan.installments_paid !== undefined ? Number(inputLoan.installments_paid || 0) : Number(currentLoan.installmentsPaid || 0),
        installmentsRemaining: inputLoan.installments_remaining !== undefined
          ? Number(inputLoan.installments_remaining || 0)
          : Number(currentLoan.installmentsRemaining || 0),
        sourceChangeId: inputLoan.source_change_id !== undefined
          ? String(inputLoan.source_change_id || "").trim()
          : String(currentLoan.sourceChangeId || "").trim(),
        nextDeductionDate: inputLoan.next_deduction_date !== undefined
          ? (inputLoan.next_deduction_date || null)
          : (currentLoan.nextDeductionDate || null)
      }
    }
  }
}

function handlePersistenceError(error){
  if(error?.code === 11000){
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field"
    const conflict = new Error(`Employee ${duplicateField} must be unique within the company.`)
    conflict.statusCode = 409
    conflict.code = "EMPLOYEE_CONFLICT"
    return conflict
  }

  return error
}

async function listEmployees(req, res, next){
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

    const employees = await Employee.find({
      companyId: req.params.companyId
    })
    employees.sort(compareEmployeesByPayrollNumber)

    const departmentIds = employees.map((employee) => employee.departmentId).filter(Boolean)
    const departments = await Department.find({
      _id: { $in: departmentIds },
      companyId: req.params.companyId
    })
    const departmentMap = new Map(departments.map((department) => [String(department._id), department]))

    res.status(200).json({
      employees: employees.map((employee) => serializeEmployee(
        employee,
        employee.departmentId ? departmentMap.get(String(employee.departmentId)) || null : null
      ))
    })
  } catch (error){
    next(error)
  }
}

async function createEmployee(req, res, next){
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

    let department = null
    if(req.body.department_id){
      department = await getActiveDepartmentForCompany(req.params.companyId, req.body.department_id)

      if(!department){
        return res.status(404).json({
          error: {
            code: "DEPARTMENT_NOT_FOUND",
            message: "Department was not found for this company."
          }
        })
      }
    }

    const hasRequestedEmployeeNumber = Boolean(String(req.body?.employee_number || "").trim())

    for(let attempt = 0; attempt < 3; attempt += 1){
      const employee = new Employee({
        companyId: req.params.companyId
      })

      applyEmployeeUpdates(employee, req.body)

      if(!employee.employeeNumber){
        employee.employeeNumber = await generateNextEmployeePayrollNumber({
          companyId: req.params.companyId,
          companyName: company.name
        })
      }

      if(!Object.prototype.hasOwnProperty.call(req.body, "salary_currency")){
        employee.salaryCurrency = company.currencyCode
      }

      try{
        await employee.save()

        const createdEmployee = serializeEmployee(employee, department)

        await recordAuditEvent({
          req,
          action: AUDIT_ACTIONS.EMPLOYEE_CREATED,
          target: {
            type: AUDIT_TARGETS.EMPLOYEE,
            id: String(employee._id),
            label: employee.fullName
          },
          after: createdEmployee
        })

        return res.status(201).json({
          employee: createdEmployee
        })
      } catch (error){
        if(
          !hasRequestedEmployeeNumber &&
          error?.code === 11000 &&
          Object.prototype.hasOwnProperty.call(error?.keyPattern || {}, "companyId") &&
          Object.prototype.hasOwnProperty.call(error?.keyPattern || {}, "employeeNumber") &&
          attempt < 2
        ){
          continue
        }

        throw error
      }
    }
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function getEmployee(req, res, next){
  try{
    const employee = await Employee.findOne({
      _id: req.params.employeeId,
      companyId: req.params.companyId
    })

    if(!employee){
      return res.status(404).json({
        error: {
          code: "EMPLOYEE_NOT_FOUND",
          message: "Employee was not found."
        }
      })
    }

    const department = employee.departmentId
      ? await Department.findOne({
          _id: employee.departmentId,
          companyId: req.params.companyId
        })
      : null

    res.status(200).json({
      employee: serializeEmployee(employee, department)
    })
  } catch (error){
    next(error)
  }
}

async function updateEmployee(req, res, next){
  try{
    const employee = await Employee.findOne({
      _id: req.params.employeeId,
      companyId: req.params.companyId
    })

    if(!employee){
      return res.status(404).json({
        error: {
          code: "EMPLOYEE_NOT_FOUND",
          message: "Employee was not found."
        }
      })
    }

    const previousDepartment = employee.departmentId
      ? await Department.findOne({
          _id: employee.departmentId,
          companyId: req.params.companyId
        })
      : null
    const beforeEmployee = serializeEmployee(employee, previousDepartment)

    let department = null
    if(Object.prototype.hasOwnProperty.call(req.body, "department_id")){
      if(req.body.department_id){
        department = await getActiveDepartmentForCompany(req.params.companyId, req.body.department_id)

        if(!department){
          return res.status(404).json({
            error: {
              code: "DEPARTMENT_NOT_FOUND",
              message: "Department was not found for this company."
            }
          })
        }
      }
    } else if(employee.departmentId){
      department = await Department.findOne({
        _id: employee.departmentId,
        companyId: req.params.companyId
      })
    }

    applyEmployeeUpdates(employee, req.body)
    await employee.save()

    const updatedEmployee = serializeEmployee(employee, department)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.EMPLOYEE_UPDATED,
      target: {
        type: AUDIT_TARGETS.EMPLOYEE,
        id: String(employee._id),
        label: employee.fullName
      },
      before: beforeEmployee,
      after: updatedEmployee
    })

    res.status(200).json({
      employee: updatedEmployee
    })
  } catch (error){
    next(handlePersistenceError(error))
  }
}

async function deleteEmployee(req, res, next){
  try{
    const employee = await Employee.findOneAndDelete({
      _id: req.params.employeeId,
      companyId: req.params.companyId
    })

    if(!employee){
      return res.status(404).json({
        error: {
          code: "EMPLOYEE_NOT_FOUND",
          message: "Employee was not found."
        }
      })
    }

    const department = employee.departmentId
      ? await Department.findOne({
          _id: employee.departmentId,
          companyId: req.params.companyId
        })
      : null
    const deletedEmployee = serializeEmployee(employee, department)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.EMPLOYEE_DELETED,
      target: {
        type: AUDIT_TARGETS.EMPLOYEE,
        id: String(employee._id),
        label: employee.fullName
      },
      before: deletedEmployee,
      after: {
        deleted: true
      }
    })

    res.status(200).json({
      employee: deletedEmployee,
      deleted: true
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
}
