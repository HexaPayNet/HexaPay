(function initHexaPayStatutory(root, factory){
  if(typeof module === "object" && module.exports){
    module.exports = factory(require("./paye"))
    return
  }

  root.HexaPayStatutory = factory(root.HexaPayPaye || null)
})(typeof globalThis !== "undefined" ? globalThis : this, (payeModule) => {
  const paye = payeModule || {}
  const fallbackPayeConfiguration = {
    payeBands: [
      { upTo: 24000, rate: 0.10 },
      { upTo: 32333, rate: 0.25 },
      { upTo: 500000, rate: 0.30 },
      { upTo: 800000, rate: 0.325 },
      { upTo: Infinity, rate: 0.35 }
    ],
    personalRelief: 2400
  }

  const DEFAULT_STATUTORY_CONFIGURATION = Object.freeze({
    paye: Object.freeze(paye.DEFAULT_PAYE_CONFIGURATION || fallbackPayeConfiguration),
    shif: Object.freeze({
      employeeRate: 0.0275,
      minimumContribution: 300
    }),
    nssf: Object.freeze({
      employeeRate: 0.06,
      lowerEarningsLimit: 8000,
      upperEarningsLimit: 108000
    }),
    housingLevy: Object.freeze({
      employeeRate: 0.015
    })
  })

  function roundCurrency(value){
    return Number(Number(value || 0).toFixed(2))
  }

  function isFiniteNonNegative(value){
    return Number.isFinite(value) && value >= 0
  }

  function clonePayeConfiguration(config){
    const normalizedConfig = paye.normalizePayeConfiguration
      ? paye.normalizePayeConfiguration(config)
      : fallbackPayeConfiguration

    return {
      payeBands: (normalizedConfig.payeBands || []).map((band) => ({
        upTo: band.upTo,
        rate: band.rate
      })),
      personalRelief: Number(normalizedConfig.personalRelief || 0)
    }
  }

  function normalizeStatutoryConfiguration(config = {}){
    const shifRate = Number(config?.shif?.employeeRate)
    const shifMinimum = Number(config?.shif?.minimumContribution)
    const nssfRate = Number(config?.nssf?.employeeRate)
    const nssfLowerLimit = Number(config?.nssf?.lowerEarningsLimit)
    const nssfUpperLimit = Number(config?.nssf?.upperEarningsLimit)
    const housingRate = Number(config?.housingLevy?.employeeRate)

    return {
      paye: clonePayeConfiguration(config?.paye || DEFAULT_STATUTORY_CONFIGURATION.paye),
      shif: {
        employeeRate: isFiniteNonNegative(shifRate) ? shifRate : DEFAULT_STATUTORY_CONFIGURATION.shif.employeeRate,
        minimumContribution: isFiniteNonNegative(shifMinimum) ? shifMinimum : DEFAULT_STATUTORY_CONFIGURATION.shif.minimumContribution
      },
      nssf: {
        employeeRate: isFiniteNonNegative(nssfRate) ? nssfRate : DEFAULT_STATUTORY_CONFIGURATION.nssf.employeeRate,
        lowerEarningsLimit: isFiniteNonNegative(nssfLowerLimit) ? nssfLowerLimit : DEFAULT_STATUTORY_CONFIGURATION.nssf.lowerEarningsLimit,
        upperEarningsLimit: isFiniteNonNegative(nssfUpperLimit) ? nssfUpperLimit : DEFAULT_STATUTORY_CONFIGURATION.nssf.upperEarningsLimit
      },
      housingLevy: {
        employeeRate: isFiniteNonNegative(housingRate) ? housingRate : DEFAULT_STATUTORY_CONFIGURATION.housingLevy.employeeRate
      }
    }
  }

  function normalizeIncomeItems(items = []){
    return (Array.isArray(items) ? items : [])
      .map((item, index) => ({
        id: item?.id || `income-item-${index + 1}`,
        label: String(item?.label || item?.name || `Income ${index + 1}`).trim(),
        amount: roundCurrency(Number(item?.amount || 0)),
        taxable: item?.taxable !== false,
        includedInGrossPay: item?.includedInGrossPay !== false,
        category: String(item?.category || "other_taxable_income").trim() || "other_taxable_income"
      }))
      .filter((item) => item.amount > 0)
  }

  function calculateGrossPay(incomeItems = []){
    return roundCurrency(
      normalizeIncomeItems(incomeItems)
        .filter((item) => item.includedInGrossPay !== false)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0)
    )
  }

  function calculateTaxablePay(incomeItems = []){
    return roundCurrency(
      normalizeIncomeItems(incomeItems)
        .filter((item) => item.taxable !== false)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0)
    )
  }

  function calculateSHIF(grossSalary, config = {}){
    const normalizedConfig = normalizeStatutoryConfiguration({ shif: config }).shif
    const grossAmount = Math.max(0, Number(grossSalary || 0))
    const computedAmount = grossAmount * normalizedConfig.employeeRate
    return roundCurrency(Math.max(normalizedConfig.minimumContribution, computedAmount))
  }

  function calculateNSSF(grossSalary, config = {}){
    const normalizedConfig = normalizeStatutoryConfiguration({ nssf: config }).nssf
    const grossAmount = Math.max(0, Number(grossSalary || 0))
    const cappedGross = Math.min(grossAmount, normalizedConfig.upperEarningsLimit)
    const tierOneBase = Math.min(cappedGross, normalizedConfig.lowerEarningsLimit)
    const tierTwoBase = Math.max(0, cappedGross - normalizedConfig.lowerEarningsLimit)

    return roundCurrency((tierOneBase * normalizedConfig.employeeRate) + (tierTwoBase * normalizedConfig.employeeRate))
  }

  function calculateHousingLevy(grossSalary, config = {}){
    const normalizedConfig = normalizeStatutoryConfiguration({ housingLevy: config }).housingLevy
    const grossAmount = Math.max(0, Number(grossSalary || 0))
    return roundCurrency(grossAmount * normalizedConfig.employeeRate)
  }

  function calculateStatutoryDeductions({
    grossSalary = 0,
    taxablePay = 0,
    customDeductions = 0,
    config = {},
    enabled = {}
  } = {}){
    const normalizedConfig = normalizeStatutoryConfiguration(config)
    const grossAmount = Math.max(0, Number(grossSalary || 0))
    const taxableAmount = Math.max(0, Number(taxablePay || 0))
    const normalizedCustomDeductions = roundCurrency(Number(customDeductions || 0))
    const shif = enabled.shif === false ? 0 : calculateSHIF(grossAmount, normalizedConfig.shif)
    const nssf = enabled.nssf === false ? 0 : calculateNSSF(grossAmount, normalizedConfig.nssf)
    const housingLevy = enabled.housingLevy === false ? 0 : calculateHousingLevy(grossAmount, normalizedConfig.housingLevy)
    const payeBase = Math.max(0, grossAmount - shif - nssf - housingLevy)
    const payeAmount = enabled.paye === false
      ? 0
      : roundCurrency((paye.calculatePAYE ? paye.calculatePAYE(payeBase, normalizedConfig.paye) : 0))
    const totalEmployeeDeductions = roundCurrency(payeAmount + shif + nssf + housingLevy + normalizedCustomDeductions)

    return {
      paye: payeAmount,
      shif,
      nssf,
      housingLevy,
      rawTaxablePay: taxableAmount,
      payeTaxableBase: payeBase,
      customDeductions: normalizedCustomDeductions,
      totalEmployeeDeductions
    }
  }

  function calculatePayrollPreview({
    incomeItems = [],
    grossSalary = null,
    customDeductions = 0,
    config = {},
    enabled = {}
  } = {}){
    const normalizedIncomeItems = normalizeIncomeItems(
      grossSalary === null || grossSalary === undefined
        ? incomeItems
        : [{
            label: "Gross Salary",
            amount: Number(grossSalary || 0),
            taxable: true,
            includedInGrossPay: true,
            category: "basic_salary"
          }]
    )

    const computedGrossSalary = grossSalary === null || grossSalary === undefined
      ? calculateGrossPay(normalizedIncomeItems)
      : roundCurrency(Number(grossSalary || 0))
    const rawTaxablePay = calculateTaxablePay(normalizedIncomeItems)
    const deductions = calculateStatutoryDeductions({
      grossSalary: computedGrossSalary,
      taxablePay: rawTaxablePay,
      customDeductions,
      config,
      enabled
    })

    return {
      grossSalary: computedGrossSalary,
      taxablePay: deductions.payeTaxableBase,
      rawTaxablePay,
      deductions,
      netPay: roundCurrency(computedGrossSalary - deductions.totalEmployeeDeductions),
      incomeItems: normalizedIncomeItems
    }
  }

  function validateGrossSalaryInput(value){
    const numericValue = Number(value)
    if(value === undefined || value === null || String(value).trim() === ""){
      return "Enter a gross salary to calculate statutory deductions."
    }

    if(!Number.isFinite(numericValue) || numericValue <= 0){
      return "Enter a valid gross salary greater than zero."
    }

    return ""
  }

  return {
    DEFAULT_STATUTORY_CONFIGURATION,
    normalizeStatutoryConfiguration,
    normalizeIncomeItems,
    calculateGrossPay,
    calculateTaxablePay,
    calculateSHIF,
    calculateNSSF,
    calculateHousingLevy,
    calculateStatutoryDeductions,
    calculatePayrollPreview,
    validateGrossSalaryInput
  }
})
