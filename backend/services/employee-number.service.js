const Employee = require("../models/Employee")

function escapeRegExp(value){
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function buildCompanyPayrollPrefix(companyName){
  const tokens = String(companyName || "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const prefix = tokens.map((token) => token.charAt(0).toUpperCase()).join("")
  return prefix || "EMP"
}

function formatEmployeePayrollNumber(prefix, sequence){
  const normalizedPrefix = String(prefix || "").trim().toUpperCase() || "EMP"
  const normalizedSequence = Number(sequence || 0)
  return `${normalizedPrefix}${String(Math.max(1, normalizedSequence)).padStart(5, "0")}`
}

function parseEmployeePayrollSequence(employeeNumber, prefix = ""){
  const normalizedEmployeeNumber = String(employeeNumber || "").trim().toUpperCase()
  const normalizedPrefix = String(prefix || "").trim().toUpperCase()

  if(!normalizedEmployeeNumber){
    return null
  }

  if(normalizedPrefix && !normalizedEmployeeNumber.startsWith(normalizedPrefix)){
    return null
  }

  const numericSegment = normalizedPrefix
    ? normalizedEmployeeNumber.slice(normalizedPrefix.length)
    : (normalizedEmployeeNumber.match(/(\d+)$/)?.[1] || "")

  if(!/^\d+$/.test(numericSegment)){
    return null
  }

  return Number(numericSegment)
}

async function generateNextEmployeePayrollNumber({ companyId, companyName }){
  const prefix = buildCompanyPayrollPrefix(companyName)
  const numberPattern = new RegExp(`^${escapeRegExp(prefix)}\\d+$`, "i")
  const employees = await Employee.find(
    {
      companyId,
      employeeNumber: numberPattern
    },
    {
      employeeNumber: 1
    }
  ).lean()

  const maxSequence = employees.reduce((highestSequence, employee) => {
    const sequence = parseEmployeePayrollSequence(employee?.employeeNumber, prefix)
    return sequence && sequence > highestSequence ? sequence : highestSequence
  }, 0)

  return formatEmployeePayrollNumber(prefix, maxSequence + 1)
}

function compareEmployeesByPayrollNumber(leftEmployee, rightEmployee){
  const leftNumber = String(leftEmployee?.employeeNumber || "").trim().toUpperCase()
  const rightNumber = String(rightEmployee?.employeeNumber || "").trim().toUpperCase()
  const leftSequence = parseEmployeePayrollSequence(leftNumber)
  const rightSequence = parseEmployeePayrollSequence(rightNumber)

  if(leftSequence !== null && rightSequence !== null){
    if(leftSequence !== rightSequence){
      return leftSequence - rightSequence
    }

    if(leftNumber !== rightNumber){
      return leftNumber.localeCompare(rightNumber)
    }
  } else if(leftSequence !== null){
    return -1
  } else if(rightSequence !== null){
    return 1
  }

  return String(leftEmployee?.fullName || "").localeCompare(String(rightEmployee?.fullName || ""))
}

module.exports = {
  buildCompanyPayrollPrefix,
  compareEmployeesByPayrollNumber,
  formatEmployeePayrollNumber,
  parseEmployeePayrollSequence,
  generateNextEmployeePayrollNumber
}
